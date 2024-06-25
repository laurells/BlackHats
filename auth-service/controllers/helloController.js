// Example controller for the protected route
exports.sayHello = (req, res) => {
    // req.user contains the decoded JWT payload, if verified by middleware
    res.json({ message: `Hello, ${req.user.username}! You accessed a protected resource` });
  };
  