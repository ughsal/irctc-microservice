import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { searchTrains } from "../services/search.service";

export const search = asyncHandler(async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q : "";
  const results = await searchTrains(query);

  res.status(200).json({
    query,
    results,
  });
});

