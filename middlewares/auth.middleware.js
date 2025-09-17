import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (sessionToken) {
    req.user = {
      userId: sessionToken.id,
      email: sessionToken.email,
    };
    if (typeof next === "function") return next();
    return true;
  }

  const auth = req.headers?.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.split(" ")[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      if (typeof next === "function") return next();
      return true;
    } catch (err) {
      console.log(err);

      return res.status(401).json({ message: "Invalid JWT Token" });
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
};

export default authMiddleware;
