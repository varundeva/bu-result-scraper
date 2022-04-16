const mongoose = require("mongoose");

const Results = require("./Results");

mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connected to MongoDb");
  }
});

module.exports = { Results };
