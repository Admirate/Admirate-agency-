import { SignJWT, jwtVerify } from "jose";

/**
 * Admin session tokens.
 *
 * Built on `jose` rather than `jsonwebtoken` because the middleware — which is
 * what actually gates /dashboard — runs on the Edge runtime, where Node's
 * `crypto` is unavailable. `jsonwebtoken` cannot run there, which is how the
 * middleware ended up merely base64-decoding the payload and trusting it.
 * `jose` runs on Web Crypto, so the same verify works in both places and there
 * is no reason for anything to skip the signature check.
 */

const alg = "HS256";

const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
};

export type TokenPayload = {
  email: string;
  iat: number;
  exp: number;
};

export const signToken = (email: string): Promise<string> =>
  new SignJWT({ email })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

/**
 * Returns the payload only for a token whose signature we produced and whose
 * `exp` is still in the future; `null` for anything else. `algorithms` is
 * pinned so a token that asks to be verified with a different (or no)
 * algorithm is rejected rather than honoured.
 *
 * A missing JWT_SECRET throws inside the try and so lands here as `null` —
 * a misconfigured deploy locks the dashboard rather than opening it.
 */
export const verifyToken = async (
  token: string
): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: [alg] });
    if (typeof payload.email !== "string") return null;
    return payload as TokenPayload;
  } catch {
    return null;
  }
};
