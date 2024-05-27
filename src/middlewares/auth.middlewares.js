import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        throw new ApiError(401, "Unauthoized Request");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        // return res.status(403).json(new ApiError(403, {}, "Invlaid Access Token"));
        throw new ApiError(401, "Invalid Access Token");
    }

    const user = User.findById(decodedToken?._id).select("-password -refreshToken");


    req.user = user;
    next();
})