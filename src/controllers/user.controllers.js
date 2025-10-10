import asynchandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';



const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError('Failed to generate tokens', 500);
    }
}

const registerUser = asynchandler(async (req, res) => {

    const { fullName, username, email, password } = req.body || {};
    console.log(fullName, username, email, password);

    if ([fullName, username, email, password].some(field => typeof field !== 'string' || field.trim() === "")) {
        throw new ApiError('All fields are required', 400);
    }

    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existedUser) {
        throw new ApiError('User already exists', 409);
    }
    
    console.log('files:', req.files);
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError('Avatar image is required', 400);
    }
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError('Failed to upload avatar image', 500);
    }

    if (!coverImage) {
        throw new ApiError('Failed to upload cover image', 500);
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
        throw new ApiError('Failed to create user', 500);
    }
    

    res.status(201).json({ user: { id: user._id, fullName, username, email, avatar: avatar.secure_url, coverImage: coverImage?.secure_url || '' } });
});

const loginUser = asynchandler(async (req, res) => {
    const { username, email, password } = req.body || {};

    if (!email && !username) {
        throw new ApiError('Email or username are required', 400);
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (!user) {
        throw new ApiError('user not found', 401);

    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ApiError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(
        new ApiResponse(200, 'Login successful',   
                { user: loggedInUser, accessToken, refreshToken }));
});

const logoutUser = asynchandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true,
        }

    )
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    };

    return res.status(200)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(
        new ApiResponse(200, 'Logout successful')
    );  


});

export { registerUser, loginUser, logoutUser };

