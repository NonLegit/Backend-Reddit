const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const subredditRouter = require("./routes/subredditRoutes");

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
app.use(cookieParser());

// Serving static files
//app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subreddit", subredditRouter);

app.all("*", (req, res, next) => {
  res.status(200).send("success ");
});

module.exports = app;
