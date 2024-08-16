const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const ConnectDB = require("./config/db.connect");

/*App connect to data base */
const port = process.env.PORT || 8090;

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  process.exit(1);
});

const server = app.listen(port, async () => {
  try {
    const res = await ConnectDB();
    console.log(res);
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
  }
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhabled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
