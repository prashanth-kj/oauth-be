
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Logout failed");
    req.session.destroy((err) => {
        if (err) return res.status(500).send("Failed to destroy session");
        res.clearCookie('connect.sid'); // Ensure session cookie is cleared
        res.status(200).send({ message: "Logout successful" });
    });
});

};

  

export const getCurrentUser = (req, res) => {
   
    // console.log(req.user); // Log the user object to check the session data
    if (!req.user) {
        return res.status(401).send({ message: "User not authenticated" });
    }
    res.send(req.user); // Send back the authenticated user's details
};

