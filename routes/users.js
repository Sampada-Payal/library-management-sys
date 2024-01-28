// importing express
const express = require("express");

// IMPORTING JSON DATA
const { users } = require("D:\\FSWDT\\library-management-sys\\data\\users.json");


// INITIALIZING THE ROUTER
const router = express.Router();

// DEFINING THE API
/*
 * Route: /users
 * Method: GET
 * Description : get all users
 * Access: public
 * Parameters: None (eg.{id})
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    })
})

/*
 * Route: /users/:id
 * Method: GET
 * Description : get single user by id
 * Access: public
 * Parameters: {id}
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User Not Found !"
        })
    }
    return res.status(200).json({
        success: true,
        data: user
    })
})

/*
 * Route: /users/
 * Method: POST
 * Description : Create a New User
 * Access: public
 * Parameters: None
 */
router.post("/", (req, res) => {
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;
    const user = users.find((each) => each.id === id);
    if (user) {
        return res.status(404).json({
            success: false,
            message: "User already exist with the given id"
        })
    }
    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
    });
    return res.status(201).json({
        success: true,
        data: users
    })

})

/*
 * Route: /users/:id
 * Method: PUT
 * Description : Update User by Id
 * Access: public
 * Parameters: None
 *pass the content to be updated in body:
 * {
  "data" :{
      "name": "Ana"
    }
  }
 */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User Not Found !"
        })
    }
    const updatedUser = users.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data
            };
        }
        return each;
    })
    return res.status(200).json({
        success: true,
        data: updatedUser
    })

})

/*
 * Route: /users/:id
 * Method: DELETE
 * Description : Delete User by Id
 * Access: public
 * Parameters: id
 *pass the content to be Deleted in body:
 * {
  "data" :{
      "name": "Ana"
    }
  }
 */
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User Not Found !"
        })
    }
    const index = users.indexOf(user);
    users.splice(index, 1);

    return res.status(200).json({
        success: true,
        data: user
    })
})

/*
 * Route: /user/subscription-details/:id
 * Method: GET
 * Description : get all user subscription details.
 * Access: public
 * Parameters: id
 * 
 * // FINE CALCULATIONS
    >> If the user has an issued book and the issued book is to be retuned at 01/01/2024
    If he missed the date of reneval/return, then he needs to pay a penalty of Rs. 100/-

    >> If the user has an issued book and the issued book is to be retuned at 01/01/2024
    If he missed the date of reneval/return, and his subscription also expires,then he needs to pay a penalty of Rs. 200/- 
 */


// Define a route to get subscription details for a user by ID
router.get("/subscription-details/:id", (req, res) => {

    // Extract user ID from request parameters
    const { id } = req.params;

    // Look for the user with the given ID in the 'users' array
    const user = users.find((each) => each.id === id);

    // If user not found, return a 404 error response
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User does not exist with given id"
        });
    }

    // Function to get the number of days from a given date (or current date if not provided)
    const getDateInDays = (data = "") => {
        let date;
        if (data === "") {
            date = new Date();
        } else {
            date = new Date(data);
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24));
        return days;
    };

    // Function to adjust subscription expiration based on subscription type
    const subscriptionType = (data) => {
        if (user.subscriptionType === "Basic") {
            data = data + 90;
        } else if (user.subscriptionType === "Standard") {
            data = data + 180;
        } else if (user.subscriptionType === "Premium") {
            data = data + 365;
        }
        return data;
    };

    // Calculate dates and subscription details
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    // Construct the response data with user details and subscription information
    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForExpiration:
            subscriptionExpiration <= currentDate ? 0 : subscriptionExpiration - currentDate,
        fine:
            returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    };

    // Send the response with the constructed data
    return res.status(200).json({
        status: "success",
        data,
    });
});



module.exports = router;
