import asyncHandler from "../middleware/asyncHandler.js";
import crypto from "crypto";


const encodeFileHandle = asyncHandler(async (req, res) => {
    const {id} = req.body;
    let policyObj = {
        expiry: 1704002400,
        handle: id,
        call: ['remove'],
    }
    let policyString = JSON.stringify(policyObj);
    let policy = Buffer.from(policyString).toString('base64');
    let signature = crypto.createHmac('sha256', process.env.FILESTACK_SECERT).update(policy).digest('hex');
    res.status(201).json({
        handle: id,
        policy,
        signature,
    });
});

const filestackToken = asyncHandler(async (req, res) => {
   res.send({token: process.env.FILESTACK_TOKEN})
});


export {encodeFileHandle, filestackToken};