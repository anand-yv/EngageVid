import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uplodaOnCloudinary } from "../utils/cloudinary.js";
import { response } from "express";


const genrateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await User.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };

    } catch (error) {
        return new ApiError(500, "Internal Server Error");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get details from frontend
    // validation - not empty
    // check if user already exists: username. email
    // check for images, check for avatar
    // upload them on cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh tokenfield from response
    // check for user creation
    // return res


    const { fullName, username, email, password } = req.body;
    // console.log("email : ", email);

    if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })


    if (existedUser) {
        throw new ApiError(409, "Username or Email already Exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required.");
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0];
    }

    const avatar = await uplodaOnCloudinary(avatarLocalPath);
    const coverImage = await uplodaOnCloudinary(coverImageLocalPath);



    if (!avatar) {
        throw new ApiError(400, "Avatar File is Required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully."))
})

const loginUser = asyncHandler(async (req, res) => {
    // Req body = username/login and password
    // check if username exist or not otherwise throw error
    // if username/email exist check password matches or not
    // generate access and refresh  token
    // send cookie

    const { username, email, password } = req.body;
    if (!username || !email) {
        return new ApiError(400, "Username or Email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        return new ApiError(403, "User doesnot exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return new ApiError(401, "Invalid User Credentials.");
    }

    const { accessToken, refreshToken } = await genrateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
        // Since cokkie can be modified by clien but if we make this two tru it can only be modified 
        // by server but it can be read by client.
    }


    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cokkie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    refreshToken,
                    accessToken
                },
                "User is logged in Successfully")
        )

});


const logoutUser = asyncHandler(async (req, res) => {

})

export { registerUser, loginUser, logoutUser };