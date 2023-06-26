import { NextApiRequest } from "next";

export async function parseBody(
    req: NextApiRequest,
) {
  return {
    fields: req.body
  }
};