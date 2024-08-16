const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const ConnectDB = async () => {
  try {
    const data = await mongoose.connect(process.env.MongoDB_URL);
    const message = `MongoDB connected with server ${data.connection.host}`;
    return message;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = ConnectDB;
