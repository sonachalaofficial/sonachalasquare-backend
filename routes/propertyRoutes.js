
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sonachala-properties', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
const upload = multer({ storage });


// ✅ CREATE Property (Upload multiple images to Cloudinary)
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path); // Cloudinary URLs
    const newProperty = new Property({
      title: req.body.title,
      location: {
        area: req.body.area,
        city: req.body.city,
      },
      propertyType: req.body.propertyType,
      status: req.body.status,
      price: req.body.price,
      sizeSqFt: req.body.sizeSqFt,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      floor: req.body.floor,
      facing: req.body.facing,
      availabilityDate: req.body.availabilityDate,
      imageUrls,
    });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error('❌ Create Error:', err);
    res.status(500).json({ message: err.message || 'Failed to create property' });
  }
});


// ✅ UPDATE Property (replace old images with new Cloudinary uploads)
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      location: {
        area: req.body.area,
        city: req.body.city,
      },
      price: req.body.price,
      status: req.body.status,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
    };

    if (req.files && req.files.length > 0) {
      updateData.imageUrls = req.files.map(file => file.path);
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Property not found' });
    res.json(updated);
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: err.message || 'Failed to update property' });
  }
});


// ✅ GET all properties
router.get('/', async (req, res) => {
  try {
    const data = await Property.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET single property
router.get('/:id', async (req, res) => {
  try {
    const item = await Property.findById(req.params.id);
    item ? res.json(item) : res.status(404).json({ message: 'Not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ DELETE property
router.delete('/:id', async (req, res) => {
  try {
    const del = await Property.findByIdAndDelete(req.params.id);
    del ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
