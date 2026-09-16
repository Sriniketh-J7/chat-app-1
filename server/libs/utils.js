import jwt from "jsonwebtoken";

// Generate a JWT token with expiry
export function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
}
