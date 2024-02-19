import type { NextApiRequest, NextApiResponse } from "next";

// CORS 문제를 해결하기 위해 /api/orderbook 엔드포인트를 만들어서
// 서버에서 데이터를 가져오도록 변경
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const reqBody = JSON.parse(req.body);
  const body = {
    is_bid: reqBody.is_bid,
    amount: reqBody.amount,
    pair: reqBody.pair.split("-")[0],
  }
  
  const response = await fetch("http://localhost:8000/route", {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  res.status(200).json(data);
}
