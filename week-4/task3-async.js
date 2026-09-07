// Using JSONPlaceholder public API
const BASE_URL = "https://jsonplaceholder.typicode.com";

// Get one user's details along with their posts
async function getUserDetails(userId) {
  try {
    // fetch the user first
    let userResponse = await fetch(`${BASE_URL}/users/${userId}`);

    if (!userResponse.ok) {
      throw new Error(`User with id ${userId} not found`);
    }

    let user = await userResponse.json();

    // now fetch posts belonging to this user
    let postsResponse = await fetch(`${BASE_URL}/posts?userId=${userId}`);

    if (!postsResponse.ok) {
      throw new Error(`could not fetch posts for user ${userId}`);
    }

    let posts = await postsResponse.json();

    // combine user and posts into one object
    let combinedResult = {
      user: user,
      posts: posts
    };

    return combinedResult;
  } catch (error) {
    // return a meaningful error instead of crashing
    return {
      error: true,
      message: error.message,
      userId: userId
    };
  }
}

// Get details of multiple users at the same time using Promise.all
async function getMultipleUsers(ids) {
  try {
    // create an array of promises, one for each user
    let promises = ids.map(function (id) {
      return getUserDetails(id);
    });

    // wait for all of them to finish
    let results = await Promise.all(promises);

    return results;
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong while loading multiple users"
    };
  }
}

// ---- Testing everything below ----

// test with a valid user id
getUserDetails(1).then(function (result) {
  console.log("Single user (valid id):");
  console.log(result);
});

// test with an invalid user id (should not crash, should return error info)
getUserDetails(9999).then(function (result) {
  console.log("\nSingle user (invalid id):");
  console.log(result);
});

// test multiple users at once
getMultipleUsers([1, 2, 3]).then(function (results) {
  console.log("\nMultiple users:");
  console.log(results);
});
