require('dotenv').config();
const mongoose = require("mongoose");
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1)
})

const app = require("./app"); // Import the app instance from app.js
const port = process.env.PORT || 3000;


// MongoDB connection
mongoose
    .connect(process.env.DB, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB connected Successfully");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
 

// process.on('unhandledRejection', err => {
//     console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => {
//         process.exit(1)
//     })
// })



