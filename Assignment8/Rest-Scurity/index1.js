import express from 'express'
import fs from 'fs'
import path from 'path'
const app = express();
const logFilePath = path.join(__dirname, "request.log");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;

        const log = `${new Date().toISOString()} | ${req.method} ${req.url} | Status: ${res.statusCode} | ${duration}ms\n`;

        fs.appendFile(logFilePath, log, (err) => {
            if (err) console.error("Log write error:", err);
        });
    });

    next();
};
app.use(requestLogger);
app.get("/", (req, res) => {
    res.send("Hello Logging System");
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});