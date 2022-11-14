const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const dotenv = require("dotenv");
const { setup } = require("./di-setup");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "config/config.env" });
setup();
const app = require("./app");

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

if (process.env.NODE_ENV === "test") {
  const DB = process.env.DATABASE_LOCAL;
  const mockgoose = new Mockgoose(mongoose);
  mockgoose.prepareStorage().then(() => {
    mongoose
      .connect(DB)
      .then(() => console.log("Fake DB connection for testing successful!"));
  });
} else {
  const DB = process.env.DATABASE_LOCAL;
  mongoose.connect(DB).then(() => console.log("DB connection successful!"));
}

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! internal server error 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
