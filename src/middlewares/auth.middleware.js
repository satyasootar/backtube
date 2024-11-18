import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from '../utils/APIerrors.js';
import { User } from '../models/user.model.js'

export const verifyjwt = asyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiErrors(401, "Unauthorised request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select( "-password -refreshToken")
    
        if (!user){
            throw new ApiErrors(401,"Invalid access token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid access token")
    }
})