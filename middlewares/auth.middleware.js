import jwt from 'jsonwebtoken';

const authMiddleware = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }
try{
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  return true
} catch (err) {
  res.status(403).json({ success: false, message: 'Unauthorized Access' });
  return false
  }
}

export default authMiddleware;
