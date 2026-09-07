// TEMPORARY FILE - only for testing the schema in Point 1.
// Delete this file after the test. It is not part of the real app.

//const mongoose = require("mongoose");
require("dotenv").config();

//const User = require("./models/user.model");

async function runTest() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully\n");

    // TEST 1 - a bad user (no email). The schema should refuse it.
    console.log("TEST 1: trying to save a user with no email");
    try {
        await User.create({
            name: "Broken User",
            password: "secret12345"
        });
        console.log("Saved. (This is wrong - the schema did not work)\n");
    } catch (error) {
        console.log("Refused, as expected. Reason:", error.message, "\n");
    }

    // TEST 2 - a good user. The schema should accept it.
    console.log("TEST 2: saving a valid user");
    const user = await User.create({
        name: "  Muhammad  ",
        email: "  MUHAMMAD@Example.COM  ",
        password: "secret12345"
    });
    console.log("Saved. Here is the document MongoDB stored:");
    console.log(user, "\n");

    // Clean up so the database is empty again for Point 2.
    await User.deleteMany({});
    console.log("Test user deleted. Database is clean again.");

    await mongoose.connection.close();
}

runTest().catch((error) => {
    console.error("Something went wrong:", error.message);
});