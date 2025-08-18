import { Request, Response } from "express";

export const testApi = (req: Request, res: Response) => {
  res.json({ message: "API is working fine" });
};
