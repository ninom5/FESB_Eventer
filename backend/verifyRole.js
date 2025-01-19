const jwt = require("jsonwebtoken");

function verifyRole(allowedRoles) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err.message);
        return res.status(401).send("Invalid token");
      }

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).send("Access denied");
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = verifyRole;
