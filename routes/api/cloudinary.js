const express = require('express');
const router = express.Router();
const { cloudinary } = require("../../utils");
const { upload, authenticateWithJWT } = require("../../middlewares");

router.post('/upload', [ authenticateWithJWT, upload.single('image') ], async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.status(200).json({ data: result.url });
    } catch (error) {
        res.status(500).json({ error: "Error uploading file to Cloudinary" });
    }
});

module.exports = router;
