import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from '../utils/APIerrors.js';
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { APIresponse } from '../utils/APIrespose.js'

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = User.findById(userId);
        const accessToken = user.generateAccessTokens();
        const refreshToken = user.generateRefreshTokens();

        user.refereshToken = refereshToken
        await user.save({ validiteBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiErrors(500, "Something went wrong while generation access and refresh token");

    }
}


const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    const { fullName, userName, email, password } = req.body;

    //validation — not empty

    if ([fullName, userName, email, password].some((field) => field?.trim == "")) {
        throw new ApiErrors(400, "All fields are required")

    }
    //check if user already exists: username, email

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiErrors(409, "User with email or username already exist");
    }
    // Log files object

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiErrors(400, "avatar is required")
    }
    //upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if (!avatar) {
        throw new ApiErrors(400, "Avatar is required")
    }

    //create user object — create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()

    })

    //remove password and refresh token field from response
    const createdUser = await User.findOne(user._id).select("-password -refreshToken")

    //check for user creation
    if (!createdUser) {
        throw new ApiErrors(500, "Something went wrong while registering the user")
    }
    //return res
    return res.status(201).json(
        new APIresponse(200, createdUser, "User registered sucessfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // req body —> data
    const { email, userName, password } = req.body;
    // username or email
    if (!userName || !email) {
        throw new ApiErrors(400, "Username of password is required")
    }
    // find the user
    const user = User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiErrors(404, "User does not exist")
    }
    // password check
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiErrors(401, "Password incorrect")
    }
    //access and referesh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    // send cookie
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIresponse(200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in sucessfully")
        )

})

const logoutUser = asyncHandler(async(req, res)=>{
    User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken: undefined
        }
        },
            {
                new:true
            },

        
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", accessToken)
    .clearCookie("refreshToken", refreshToken)
    .json(new APIresponse(200, {}, "User Logged Out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}