const User = require('../models/userModel');
const catchAsync = require('express-async-handler');
const appError = require('../utils/appError')
const { promisify } = require('util')
const jwt = require('jsonwebtoken');



const createSendToken = (res, result, statusCode) => {

    const token = result.generateToken(result._id)

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure : true,
       // sameSite: 'lax'
    }

    //if(process.env.NODE_ENV=="production") 
    //cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions)

    result.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            result
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const result = await User.create(req.body)

    createSendToken(res, result, 200)
})

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password) {
        return next(new appError('please enter a valid email or password', 400))
    }
    const result = await User.findOne({ email }).select('+password')

    if (!result || !(await result.correctPassword(password, result.password))) {
        return next(new appError('Incorrect Email or Password', 401))
    }

    createSendToken(res, result, 200)
})


exports.logout = catchAsync(async (req, res) => {

    res.clearCookie('jwt');
    // res.cookie('jwt', 'loggedout', {
    //     expires: new Date(Date.now() - 1 * 1000),
    //     httpOnly: true
    // });
    res.status(200).json({ status: 'success' });
})


exports.protect = catchAsync(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new appError('you are not logged in! please log in to get access'), 401)
    }
    // console.log(token)
    const accessToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //console.log(accessToken.id)
    const freshUser = await User.findById(accessToken.id)

    if (!freshUser) {
        return next(new appError("this user to this token not longer exists"), 401);
    }

    req.user = freshUser
    res.locals.user = freshUser;

    next()
})



exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError("you  do not have permission to perform this action", 403));
        }
        next()
    }
}
