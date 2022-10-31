const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const userRouter = require("./routes/userRoutes");

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Serving static files
//app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use("/api/v1/user", userRouter);

app.all("*", (req, res, next) => {
    res.status(200).send("success ");
});

module.exports = app;
