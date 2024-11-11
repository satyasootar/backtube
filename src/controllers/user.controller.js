import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from '../utils/APIerrors.js';
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { APIresponse } from '../utils/APIrespose.js'

export const registerUser = asyncHandler(async(req, res)=>{
    //get user details from frontend
    const { fullName, userName, email, password } = req.body;

    //validation — not empty

    if([fullName, userName, email, password].some((field)=> field?.trim == "")){
        throw new ApiErrors(400, "All fields are required")

    }
    //check if user already exists: username, email

    const existedUser = await User.findOne({
        $or:[{ userName },{ email }]
    })

    if(existedUser){
        throw new ApiErrors(409, "User with email or username already exist");
    }
 // Log files object

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiErrors(400, "avatar is required")
    }
    //upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if(!avatar){
        throw new ApiErrors(400, "Avatar is required")
    }

    //create user object — create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName:userName.toLowerCase()

    })

    //remove password and refresh token field from response
    const createdUser = await User.findOne(user._id).select( "-password -refreshToken" )

    //check for user creation
    if(!createdUser){
        throw new ApiErrors(500, "Something went wrong while registering the user")
    }
    //return res
    return res.status(201).json(
        new APIresponse(200, createdUser, "User registered sucessfully")
    )
}) 
 