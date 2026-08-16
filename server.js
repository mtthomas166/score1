const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({path:'./config.env'})
const server = require("http").createServer(app);
const {initSocket} = require('./Socket/socket')
initSocket(server);
const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db)
  .then(() => {
    console.log("database connected😎");
  })
  .catch(() => {
    console.log("database connection failed");
  });
process.on("uncaughtException", () => {
  process.exit(1);
});
process.on("unhandledRejection", () => {
  server.close(() => {
    process.exit(1);
  });
});
server.listen(5000, () => {
  console.log("server connected");
});
