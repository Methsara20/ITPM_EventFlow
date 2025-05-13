import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, Package, CreditCard, DollarSign, UserCheck } from "lucide-react";

const Vendor = () => {
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    address: "",
    serviceType: [],
    paymentTerms: "",
    pricingDetails: "",
    contactName: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const numberRegex = /^\+\d{9,15}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@(gmail\.com|email\.com)$/;
    const addressRegex = /^No/i;
    const pricingRegex = /^\d+$/;

    if (!nameRegex.test(vendorData.vendorName)) {
      setMessage("❌ Vendor Name should be a full string.");
      return false;
    }
    if (!nameRegex.test(vendorData.contactPerson)) {
      setMessage("❌ Contact Person should be a full string.");
      return false;
    }
    if (vendorData.contactName && !nameRegex.test(vendorData.contactName)) {
      setMessage("❌ Alternate Contact should be a string.");
      return false;
    }
    if (!numberRegex.test(vendorData.contactNumber)) {
      setMessage("❌ Contact Number must start with '+' and be 9-15 digits.");
      return false;
    }
    if (!emailRegex.test(vendorData.email)) {
      setMessage("❌ Email must end with '@gmail.com' or '@email.com'.");
      return false;
    }
    if (!addressRegex.test(vendorData.address)) {
      setMessage("❌ Business Address must start with 'No'.");
      return false;
    }
    if (!pricingRegex.test(vendorData.pricingDetails)) {
      setMessage("❌ Pricing Details must be an integer.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setVendorData((prevState) => ({
        ...prevState,
        serviceType: checked
          ? [...prevState.serviceType, value]
          : prevState.serviceType.filter((service) => service !== value),
      }));
    } else {
      setVendorData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5001/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ Vendor created successfully!');
        setVendorData({
          vendorName: "",
          contactPerson: "",
          contactNumber: "",
          email: "",
          address: "",
          serviceType: [],
          paymentTerms: "",
          pricingDetails: "",
          contactName: ""
        });
        navigate('/vendors');
      } else {
        throw new Error(result.error || '❌ Error creating vendor.');
      }
    } catch (error) {
      setMessage(error.message || '❌ Server error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
            <h2 className="text-center text-3xl font-bold text-white">Vendor Registration</h2>
            <p className="mt-2 text-center text-blue-100">Join our network of trusted service providers</p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <InputField
                icon={<User className="h-5 w-5 text-gray-400" />}
                label="Vendor Name"
                name="vendorName"
                placeholder="  Enter your company name"
                value={vendorData.vendorName}
                onChange={handleChange}
              />
              <InputField
                icon={<UserCheck className="h-5 w-5 text-gray-400" />}
                label="Contact Person"
                name="contactPerson"
                placeholder="  Primary contact name"
                value={vendorData.contactPerson}
                onChange={handleChange}
              />
              <InputField
                icon={<UserCheck className="h-5 w-5 text-gray-400" />}
                label="Alternate Contact"
                name="contactName"
                placeholder="  Secondary contact name"
                value={vendorData.contactName}
                onChange={handleChange}
              />
              <InputField
                icon={<Phone className="h-5 w-5 text-gray-400" />}
                label="Contact Number"
                name="contactNumber"
                placeholder="  +94771234567"
                value={vendorData.contactNumber}
                onChange={handleChange}
              />
              <InputField
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                label="Email Address"
                name="email"
                placeholder="  email@company.com"
                value={vendorData.email}
                onChange={handleChange}
              />
              <InputField
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                label="Business Address"
                name="address"
                placeholder="  Full address"
                value={vendorData.address}
                onChange={handleChange}
                colSpan
              />

              {/* Service Types */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">Services Provided</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
                  {["Delivery", "Repair", "Installation"].map((service) => (
                    <label key={service} className="flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        name="serviceType"
                        value={service}
                        checked={vendorData.serviceType.includes(service)}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Terms */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  value={vendorData.paymentTerms}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select payment terms</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on receipt">Due on receipt</option>
                  <option value="50% upfront, 50% on delivery">50% upfront, 50% on delivery</option>
                  <option value="Milestone-based">Milestone-based</option>
                  <option value="Monthly billing">Monthly billing</option>
                  <option value="Cash in advance (CIA)">Cash in advance (CIA)</option>
                  <option value="Cash on delivery (COD)">Cash on delivery (COD)</option>
                  <option value="End of Month (EOM)">End of Month (EOM)</option>
                </select>
              </div>

              <InputField
                icon={<DollarSign className="h-5 w-5 text-gray-400" />}
                label="Pricing Details"
                name="pricingDetails"
                placeholder="  Include brief pricing model"
                value={vendorData.pricingDetails}
                onChange={handleChange}
                colSpan
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
              >
                Register Vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, label, name, placeholder, value, onChange, colSpan = false }) => (
  <div className={colSpan ? "sm:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default Vendor;
