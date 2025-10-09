import asynchandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';


const registerUser = asynchandler(async (req, res) => {

    const { fullName, username, email, password } = req.body;
    console.log(fullName, username, email, password);

    if ( [fullName, username, email, password].some(field => field?.trim() === "") ) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existedUser) {
        throw new ApiError(409, 'User already exists');
    }
    
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar image is required');
    }
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(500, 'Failed to upload avatar image');
    }

    if (!coverImage) {
        throw new ApiError(500, 'Failed to upload cover image');
    }

    // Create a new user
    const user = await User.create({
        fullName,
        username,
        email,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || ''
       
    });
    if (!user) {
        throw new ApiError(500, 'Failed to create user');
    }

    res.status(201).json({ user: { id: user._id, fullName, username, email, avatar: avatar.secure_url, coverImage: coverImage?.secure_url || '' } });
});

export { registerUser };


    
