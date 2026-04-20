import express from 'express'
import jwt from 'jsonwebtoken'
const app = express();
app.use(express.json());
const SECRET_KEY = "secret123";
let userOTP = {
    userId: 1,
    otp: "123456"
};
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token required" });
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid Token" });
        }

        req.user = user;
        next();
    });
};
const verifyOTP = (req, res, next) => {
    const { otp } = req.body;
    if (otp !== userOTP.otp) {
        return res.status(401).json({
            error: "Invalid OTP"
        });
    }

    next();
};
app.post("/login", (req, res) => {
    const user = {
        id: 1,
        username: "admin"
    };

    const token = jwt.sign(user, SECRET_KEY, {
        expiresIn: "1h"
    });

    res.json({
        token,
        otp: "123456" 
    });
});
app.post(
    "/secure-data", verifyJWT, verifyOTP,
    (req, res) => {
        res.json({
            message: "Access Granted with MFA"
        });
    }
);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});