import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNumber: { type: String, required: true },
  serviceType: { type: [String], required: true },
  email: { type: String, required: true, unique: true },
  paymentTerms: { type: String, required: true },
  pricingDetails: { type: String, required: true },
  address: { type: String, required: true },
  contactName: { type: String, required: true }
});

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
