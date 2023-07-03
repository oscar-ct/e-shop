import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from './configDatabaseConnection/db.js'
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import {notFoundError, errorHandler} from "./middleware/errorMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";

const port = process.env.PORT || 8080;


// 1). Establish database connection to MongoDB from Mongoose
connectDB();
// 2). Initialize Express framework
const app = express();

// **** Built-in express middleware ****
// Req body parser
app.use(express.json());
// Req urlencoded parser
app.use(express.urlencoded({extended: true}));

// 3rd party middleware
// Cookie parser
app.use(cookieParser());

app.get('/', function (request, response) {
    response.send("API is running!!!");
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Custom middleware
app.use(notFoundError);
app.use(errorHandler);

app.listen(port, function () {
    console.log("Server is active on port " + port);
});