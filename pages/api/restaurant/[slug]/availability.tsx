import { NextApiRequest, NextApiResponse } from "next";
import { times } from "@/data";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };
  if (!day || !time || !partySize) {
    return res.status(400).json({
      errorMessage: "Invalid date provided",
    });
  }

  const searchTimes = times.find((t) => {
    return t.time === time;
  })?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  return res.json({ searchTimes });
}
