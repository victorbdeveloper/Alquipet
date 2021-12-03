const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DATABASE OnLine");
  } catch (error) {
    console.log(error);
    throw new Error("Database connection error");
  }
};

module.exports = {
  dbConnection,
};
