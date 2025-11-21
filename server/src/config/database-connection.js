const mongoose = require("mongoose");

const databaseConnect = () => {
  mongoose.connect(process.env.DATABASE_URI).then((connection) => {
    console.log(
      `Database Connected Successfully: ${connection.connection.host}`
    );
  });
};

module.exports = databaseConnect;
