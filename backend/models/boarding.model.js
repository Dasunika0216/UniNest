import mongoose from 'mongoose';

const boardingSchema = new mongoose.Schema({
  hostId: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },   // Latitude
  lng: { type: Number, required: true },   // Longitude
  gender: { 
    type: String, 
    required: true, 
    enum: ['Girls', 'Boys'],
    message: 'Gender must be either Girls or Boys'
  },
  cost: { type: Number, required: true },
  type: { type: String, required: true },
  availableCount: { type: Number, required: true },
  description: { type: String, required: true },
  facilities: [{ type: String }], // Changed to array of strings
  images: [{ type: String }] // Cloudinary image URLs
}, { minimize: false });

const boardingModel = mongoose.models.boarding || mongoose.model('boarding', boardingSchema);

export default boardingModel;
