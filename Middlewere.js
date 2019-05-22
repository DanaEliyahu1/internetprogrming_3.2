
const express = require("express");
const app = express();
app.use(express.json());



app.use("/private", (req, res,next)=> {
	const token = req.header("x-auth-token");
	// no token
	if (!token) res.status(401).send("Access denied. No token provided.");
	// verify token
	try {
		const decoded = jwt.verify(token, secret);
		req.decoded = decoded;
		next(); //move on to the actual function
	} catch (exception) {
		res.status(400).send("Invalid token.");
	}
});

app.post("/privateLogin", (req, res) => {
    payload = { id: req.body.username, name: req.body.username, admin: true };
    options = { expiresIn: "1d" };
    const token = jwt.sign(payload, secret, options);
    res.send(token);
});

module.exports.login=



