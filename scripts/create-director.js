require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const createDirector = async () => {
  // Connect to the database
  await connectDB();

  try {
    // 1. Check if any user already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.error(
        "\x1b[31m%s\x1b[0m", // Red color
        "Error: A user already exists in the database. Aborting script.",
      );
      console.log(
        "If you need to re-run the setup, please clear the users collection in your database first.",
      );
      return;
    }

    // 2. Get user details from command line arguments
    const [, , username, email, password] = process.argv;

    if (!username || !email || !password) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        "Usage: node scripts/create-director.js <username> <email> <password>",
      );
      return;
    }

    if (password.length < 6) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        "Error: Password must be at least 6 characters long.",
      );
      return;
    }

    console.log("Attempting to create Director user...");

    // 3. Create the Director user
    const director = await User.create({
      username,
      email,
      password,
      role: "Director",
    });

    console.log("\x1b[32m%s\x1b[0m", "✅ Director user created successfully!"); // Green color
    console.log(`   Username: ${director.username}`);
    console.log(`   Email:    ${director.email}`);
    console.log(`   Role:     ${director.role}`);
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "An error occurred:", error.message);
  } finally {
    // 4. Disconnect from the database
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

createDirector();
