// importing
const express = require("express");

// IMPORTING JSON DATA
//const { users } = require("./data/users.json");
//const { books } = require("./data/books.json");

// IMPORTING ROUTES
const userRouter = require("D:\\FSWDT\\library-management-sys\\routes\\users.js");
//const booksRouter = require("./routes/books.js");

// initializing the server and setting up port number 5500
const app = express();

const PORT = 5500;

app.use(express.json());

app.get("/", (req , res) => {
    res.status(200).json({
        message: "Server is up and running.."
    })
})


//ROUTING
app.use("/users", userRouter);
//app.use("/books", booksRouter);

app.all("*", (req, res) => {
    res.status(500).json({
        message:"This route does not exist!"
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})