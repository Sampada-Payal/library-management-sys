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

module.exports = router;
