// importing
const express = require("express");

// IMPORTING JSON DATA
const { books } = require("D:\\FSWDT\\library-management-sys\\data\\books.json");
const { users } = require("D:\\FSWDT\\library-management-sys\\data\\users.json");

// INITIALIZING THE ROUTER
const router = express.Router();

// DEFINING THE API
/*
 * Route: /books
 * Method: GET
 * Description : get all books
 * Access: public
 * Parameters: None
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data : books
    })
})

/*
 * Route: /books/:{id}
 * Method: GET
 * Description : Get book by id
 * Access: public
 * Parameters: id
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "BOOK NOT FOUND !"
        })
    }
    return res.status(200).json({
        success: true,
        data: book
    })
});

/*
 * Route: /books/issued
 * Method: GET
 * Description : Get issued book 
 * Access: public
 * Parameters: none
 */
// /issued/books => reason server is assuming 'issued' ad an id.. so issued/books is used.
router.get("/issued/books", (req, res) => {
    const issuedBooks = [];

    const usersWithIssuedBooks = users.filter((user) => user.issuedBook);

    usersWithIssuedBooks.forEach((user) => {
        const book = books.find((book) => book.id === user.issuedBook);
        book.issuedBy = user.name;
        book.issuedDate = user.issuedDate;
        book.returnDate = user.returnDate;

        issuedBooks.push(book);
    });

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No issued books yet"
        });
    }

    return res.status(200).json({
        success: true,
        data: issuedBooks
    });
});

/*
 * Route: /books/
 * Method: POST
 * Description : Add a New Book
 * Access: public
 * Parameters: None
    * {
    "data": {
        "id": "5",
        "name ": "IKIGAI",
        "author": "Héctor García and Francesc Miralles",
        "genre": "Self-help, Non-fiction",
        "price": "12.99",
        "publisher": "Penguin Books"
    }
    }
 */
router.post("/", (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({
            success: false,
            message: "No Data Provided"
        });
    }
    const book = books.find((each) => each.id === data.id);
    if (book) {
        return res.status(200).json({
            success: false,
            message: "Book with given id alreaady exist !"
        })
    }
    const allBooks = [...books, data]
    return res.status(200).json({
        success: true,
        data: allBooks
    });  
})

/*
 * Route: /book/:id
 * Method: PUT
 * Description : Update a book by its ID
 * Access: public
 * Parameters: id
 */
router.put("/books/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const book = books.find((each) => each.id.toString() === id);
    if(!book){
        return res.status(400).json({
            success: false,
            message :"Book not found with given id"
        })
    }
    const updatedData = books.map((each) => {
        if (each.id === id) {
            return { ...each, ...data }
        }
        return each;
        
    })
    return res.status(202).json({
        success: true,
        data : updatedData
    })
})





module.exports = router;