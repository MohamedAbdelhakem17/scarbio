const mongoose = require("mongoose");

const databaseConnect = () => {
  mongoose.connect(process.env.DATABASE_URI).then((connection) => {
    // Database connected successfully
  });
};

module.exports = databaseConnect;
