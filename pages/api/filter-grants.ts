// grantgetr/pages/api/filter-grants.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { input, questions, includeWeb } = req.body;

  if (!input || !questions) {
    return res.status(400).json({ error: "Missing input or questions" });
  }

  // STEP 1: Simulate grant search using mock logic
  const grants = mockSearch(input, questions, includeWeb);

  // STEP 2: Calculate metadata
  const totalGrants = grants.length;
  const totalAmount = grants.reduce((sum, g) => sum + (g.amount || 0), 0);

  const avgAwardTime = [
    { range: "0-30 days", grants: 12 },
    { range: "31-60 days", grants: 16 },
    { range: "61+ days", grants: 10 },
  ];

  const likelihood = [
    { category: "High", value: 10 },
    { category: "Medium", value: 18 },
    { category: "Low", value: 10 },
  ];

  res.status(200).json({
    totalGrants,
    totalAmount,
    avgAwardTime,
    likelihood,
  });
}

// TEMPORARY MOCK: Simulate matched grants
function mockSearch(input: string, questions: string[], includeWeb: boolean) {
  return Array.from({ length: 38 }, (_, i) => ({
    title: `Mock Grant ${i + 1}`,
    amount: 10000 + (i * 500),
    source: includeWeb ? "Cerebro + Web" : "Cerebro",
  }));
}
