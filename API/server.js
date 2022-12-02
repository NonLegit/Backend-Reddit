const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const dotenv = require("dotenv");
dotenv.config();
//const config = require("config");
const { setup } = require("./di-setup");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  //console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

//dotenv.config({ path: "config/config.env" });
setup();
const app = require("./app");

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

if (process.env.NODE_ENV === "test") {
  const DB = process.env.DATABASE;
  const mockgoose = new Mockgoose(mongoose);
  mockgoose.prepareStorage().then(() => {
    mongoose
      .connect(DB)
      .then(() => console.log("Fake DB connection for testing successful!"));
  });
} else if (process.env.NODE_ENV === "production") {
  //const DB = process.env.DATABASE;
  const DB = process.env.DATABASE;
  mongoose.connect(DB).then(() => {});
} else {
  const DB = process.env.DATABASE;
  mongoose.connect(DB).then(() => console.log("DB connection successful!"));
}

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! internal server error 💥 Shutting down...");
  //console.log(err.name, err.message);
  console.log(err.stack);

  server.close(() => {
    process.exit(1);
  });
});