import asyncHandler from "../middleware/asyncHandler.js";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();


const encodeFileHandle = asyncHandler(async (req, res) => {
    const {handle} = req.body;
    let policyObj = {
        // expires December 31, 2024 !!!!!!!!
        expiry: 1735624800,
        handle: handle,
        call: ['remove'],
    }
    let policyString = JSON.stringify(policyObj);
    let policy = Buffer.from(policyString).toString('base64');
    let signature = crypto.createHmac('sha256', process.env.FILESTACK_SECERT).update(policy).digest('hex');
    res.status(201).json({
        handle: handle,
        policy,
        signature,
    });
});

const filestackToken = asyncHandler(async (req, res) => {
   res.send({token: process.env.FILESTACK_TOKEN})
});


export {encodeFileHandle, filestackToken};