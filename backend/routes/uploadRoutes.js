const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

require('dotenv').config();


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {

    try {

        if(!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Function to handle the stream upload  to Cloudinary
        const streamUpload = (fileBuffer) =>{
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        return resolve(result);
                    }else{

                        reject(error);
                    }
                });
                // use streamifier to convert the buffer to a readable stream
                streamifier.createReadStream(fileBuffer).pipe(stream);
            }); 
        }

        //  call the streamUpload function with the file buffer
        const result = await streamUpload(req.file.buffer);

        // Respond with the uploaded image URL
        res.status(200).json({
            imageUrl: result.secure_url
        });
        
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Server error' });
        
    }

})

module.exports = router;