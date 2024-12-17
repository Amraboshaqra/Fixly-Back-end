const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please write your name."],
        unique:true,
        required:true,
    },
    email:{
        type:String,
        required:[true,"please write your email address."],
        unique:true,
        validate:[validator.isEmail,"please write valid email address"]
    },
    phone:{
        type:String,
        required:[true,"please write your Phone number."],
        // unique:true,
        // validate: [
        //     {
        //         validator: function(value) {
        //             // Check if the phone number is exactly 11 characters long and contains only digits
        //             return /^\d{11}$/.test(value);
        //         },
        //         message: "Phone number must be exactly 11 number"
        //     },
        //     {
        //         validator: validator.isMobilePhone, // Optional: Additional check for valid mobile phone format
        //         message: "Please provide a valid phone number."
        //     }
        // ]
    },
    role:{
        type:String,
        enum:['worker','user'],
        default:'user',
    },
    photo:{
        type:String,
        select:false,
        default: "https://res.cloudinary.com/dhddxcwcr/image/upload/v1700416252/6558f05c2841e64561ce75d1_Cover.jpg",
    },
    password:{
        type:String,
        required:[true,"please write your password"],
        minlength:8,
        select:false,
    },
    
    point:{
        type:Number,
        default: 0,
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
}]
})

//userSchema.index({ name: 1 });

// rideSchema.virtual('review', {
//     ref: 'Review',
//     foreignField: 'user',
//     localField: '_id',
//   });

userSchema.pre('save', async function(next){
    if(!this.isModified('password'))return next();

    this.password =  await bcrypt.hash(this.password,12)

})

userSchema.methods.correctPassword =async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.generateToken = function(id){
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE_IN
    });
}

const User = mongoose.model("User",userSchema)

module.exports = User