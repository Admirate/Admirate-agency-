import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export type TokenPayload = {
  email: string;
  iat: number;
  exp: number;
};

export const signToken = (email: string): string => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};
