import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }
try{
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  if (typeof next === 'function') {
    next(); // if the middleware requires next, like when i tested the GET '/api/auth/profile'
    // that time the api was stalling, but now both express middleware and NextJS api routes work.
    // if there is no next, it will just return true.
  }
  return true;
} catch (err) {
  console.log("Auth Middleware Error:", err);
  res.status(403).json({ success: false, message: 'Unauthorized Access' });
}
}

export default authMiddleware;
