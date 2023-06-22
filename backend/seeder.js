import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./configDatabaseConnection/db.js";

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map(function (product) {
            return { ...product, user: adminUser}
        });
        await Product.insertMany(sampleProducts);
        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (e) {
        console.error(`${e}`.red.inverse);
        process.exit(1);
    }
}

const truncateData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data Truncated!'.red.inverse);
    } catch (e) {
        console.error(`${e}`.red.inverse);
        process.exit(1);
    }
}

if (process.argv[2] === 't') {
    truncateData();
} else {
    importData();
}