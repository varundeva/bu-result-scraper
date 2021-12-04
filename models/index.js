const mongoose = require("mongoose");

const User = require("./User");

mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connected to MongoDb");
  }
});

module.exports = { User };
