// This middleware checks if the user is authenticated using JWT (JSON Web Token).
// ✅ Authentication (Login Proof)
// When you log in, the server gives you a jwtToken.
// You keep this token and send it back with every request.
// This way, you don’t have to log in again and again — the token proves it’s you.

// ✅ Authorization (Permission Check)
// When you visit a protected page (like admin dashboard), the server checks your token to see if you have permission to access it.
// If yes → you’re allowed in
// If not → you’re blocked

// ✅ Stateless (No Need to Store on Server)
// Normally, websites store session data on their server to remember who’s logged in.
// But with jwtToken, no need to store anything on the server — the token itself contains all the important information (like your ID, role, and expiry time).

const jwt = require("jsonwebtoken");
const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    // Check if the authorization header is present
    // If not, return a 403 Forbidden status code with an error message
    return res
      .status(403) // 403 Forbidden status code indicates that the server understands the request but refuses to authorize it
      .json({ message: "Unauthorized, JWT token is require" });
  }
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded; // Decoded token contains user information
    // You can access user information in the next middleware or route handler
    next();
  } catch (err) {
    return res
      .status(401)  // 401 Unauthorized status code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource
      .json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};

module.exports = ensureAuthenticated;
