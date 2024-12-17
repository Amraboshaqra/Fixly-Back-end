const modelName = require("../models/servicesModel") 
const User = require("../models/userModel") //error
const Req = require("../models/reqModel")
const catchAsync = require('express-async-handler');
const appError = require("../utils/appError")
const multer = require("multer")
const cloudinary = require("../utils/cloud");
const { request } = require("express");

exports.createOne = catchAsync(async (req, res, next) => {
        req.body.user = req.user.id
        const category = await modelName.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                category
            }
        });

})

exports.deleteOne = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const doc = await modelName.findById(id);

    if (!doc) {
        return next(new appError(`Can't find Service with this id`, 404));
    }

    await doc.deleteOne();

    res.status(201).json({
        status: "success",
        message: "Deleted successfully"
    });
});

exports.deleteAll = catchAsync(async (req, res, next) => {

    await modelName.deleteMany()

    res.status(201).json({
        status: "Delete All Successfully",
    })
})

exports.getOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    let doc = await modelName.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Service on this id`, 404));
    }

    res.status(201).json({
        status: "success",
        data: {
             doc
        }
    })
})

exports.updateOne = catchAsync(async (req, res, next) => {

    const doc = await modelName.findByIdAndUpdate(req.params.id, req.body, { new: true }) //new is true => to return new doc after update

    if (!doc) {
        return next(new appError(`Can't find Service on this id`, 404));
    }

    // doc.save()

    res.status(201).json({
        status: "success",
        data: {
             doc
        }
    })
})

exports.getAll = catchAsync(async (req, res) => {


    const documents = await modelName.find();

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new appError('not an image ! please upload only images..', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadPhoto = upload.fields([
    { name: 'image', maxCount: 5 },
]);

const uploadToCloudinary = (buffer, filename, folderPath, options = {}) => {
    return new Promise((resolve, reject) => {
        options.folder = folderPath;
        options.public_id = filename;

        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
        uploadStream.end(buffer);
    });
};

exports.resizePhotoProject = catchAsync(async (req, res, next) => {
    if (!req.files) return next();

    const uploadFieldFile = async (fieldName, folderPath) => {
        if (req.files[fieldName]) {
            // تحقق إذا كان في ملف واحد فقط
            const file = req.files[fieldName][0]; // بما أن الملف الواحد سيكون في البداية عبارة عن array فيه عنصر واحد
            const fileName = `${file.originalname}`;
            
            try {
                const result = await uploadToCloudinary(file.buffer, fileName, folderPath);
                req.body[fieldName] = result.secure_url; // حفظ الرابط في الـ body
            } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
            }
        }
    };
    

    // معالجة رفع الملفات للحقول المختلفة
    await uploadFieldFile('image', 'fixly/Service');

    next();
});


exports.payService = catchAsync(async (req, res) => {

    const {serviceId}=req.params.id
    const service = await modelName.findById(serviceId);

    if(!service){
        return next(new appError(`Can't find service on this id`, 404));
    }
    const user = await User.findById(req.user.id)
    user.point += service.point
    user.services.push(service.id)
    user.save()

    req.body.service = serviceId
    req.body.user = req.user.id
    await Req.create(req.body)
    

    res
        .status(200)
        .json({ message:"paid Successfuly"});
});

exports.MyOrders = catchAsync(async (req, res) => {

    const {userid}=req.user.id
    const order = await Req.find({user:userid}).populate('service').populate('user');
    
    if(!order){
        return next(new appError(`Can't find orders for this user`, 404));
    }

    res
        .status(200)
        .json({ status:"Successful",data:order});
});
