// grantgetr/pages/api/generate-questions.ts

import { OpenAI } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Stored securely in .env.local
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { input, model = "gpt-4" } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Missing input in request body" });
  }

  const prompt = `Given this business type: '${input}', generate 5 follow-up questions to determine grant eligibility.`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices?.[0]?.message?.content || "";

    // Extract questions from numbered list
    const questions = content
      .split(/\n+/)
      .map((q) => q.replace(/^[0-9.\\-]+\\s*/, '').trim())
      .filter(Boolean);

    res.status(200).json({ questions });
  } catch (error) {
    console.error(\"OpenAI error:\", error);
    res.status(500).json({ error: \"OpenAI request failed\", detail: error });
  }
}
