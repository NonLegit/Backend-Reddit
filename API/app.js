require("express-async-errors");
const express = require("express");
const https = require("https");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const subredditRouter = require("./routes/subredditRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const cors = require("cors");
const { errorHandler } = require("./error_handling/errors");

const app = express();
app.enable("trust proxy");
app.use(mongoSanitize());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTDOMAIN, process.env.CROSSDOMAIN],
    allowedHeaders: "Content-Type,*",
    methods: "GET,PUT,POST,DELETE,OPTIONS,PATCH",
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
// Data sanitization against NoSQL query injection

// Serving static files
app.use(express.static(`${__dirname}/public`));

// app.use(function (req, res, next) {
//   // process.env.NODE_ENV != "development" &&
//   console.log(req.secure,req.headers.host+req.url);
//   if (!req.secure) {
//     console.log('should redirect');
//     console.log(req.secure,req.headers.host+req.url);
//     return res.redirect("https://" + req.headers.host + req.url);
//   }
//   console.log("should continue");
//   next();
// });
// 3) ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subreddits", subredditRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

app.use(errorHandler);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    errorMessage: "Invaild Request URL",
  });
});

module.exports = app;
