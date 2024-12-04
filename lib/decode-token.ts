import { NextRequest } from "next/server";
import { verifyAuth } from "@/utils/jwt";

export const decodeToken = async (req: NextRequest) => {
  const decoded = await verifyAuth(req);
  if (!decoded) {
    return false;
  }

  return decoded;
};
