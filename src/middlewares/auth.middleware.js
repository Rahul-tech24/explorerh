import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');
   

   if (!token) {
       return next(new ApiError('Unauthorized', 401));
   }

   try {
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       const user = await User.findById(decodedToken?._id).select('-password -refreshToken');
       if (!user) {
           return next(new ApiError('Unauthorized', 401));
       }
       req.user = user;
       next();
   } catch (error) {
       return next(new ApiError('Unauthorized', 401));
   }
});

export default verifyJWT;
