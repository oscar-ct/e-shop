import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './configDatabaseConnection/db.js'
import productRoutes from "./routes/productRoutes.js";
import {notFoundError, errorHandler} from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 8080;




// 1). Establish database connection to MongoDB from Mongoose
connectDB();
// 2). Initialize Express framework
const app = express();


app.get('/', function (request, response) {
    response.send("API is running!!!");
});

app.use('/api/products', productRoutes);
app.use(notFoundError);
app.use(errorHandler);

app.listen(port, function () {
    console.log("Server is active on port " + port);
});