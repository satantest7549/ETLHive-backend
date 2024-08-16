const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const leadRoutes = require("./routes/leadRoutes");
const isUserAuthenticated = require("./middleware/auth/auth");
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello server is running fine.");
});

/* import all routes */
app.use("/user", userRoutes);
app.use(isUserAuthenticated);
app.use("/lead", leadRoutes);


module.exports = app;
