import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    shippingAddresses: [
        {
            name: {
                type: String,
            },
            address: {
                type: String,
            },
            city: {
                type: String,
            },
            postalCode: {
                type: String,
            },
            state: {
                type: String,
            },
            country: {
                type: String,
            }
        }
    ]
},
{
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;