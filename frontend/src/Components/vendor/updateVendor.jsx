import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  DollarSign,
  UserCheck
} from "lucide-react";

const UpdateVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    contactPerson: "",
    contactNumber: "",
    serviceType: [],
    email: "",
    address: "",
    contactName: "",
    paymentTerms: "",
    pricingDetails: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/vendors/${id}`)
      .then((res) => {
        const data = res.data;
        setVendorData({
          ...data,
          serviceType: Array.isArray(data.serviceType) ? data.serviceType : [],
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Error loading vendor data.");
      });
  }, [id]);

  const validateForm = () => {
    const validationErrors = {};
    if (!vendorData.vendorName.trim()) {
      validationErrors.vendorName = "Vendor name is required";
    } else if (!/^[A-Za-z\s]+$/.test(vendorData.vendorName)) {
      validationErrors.vendorName = "Vendor name must contain only letters and spaces";
    }

    if (!vendorData.contactPerson.trim()) {
      validationErrors.contactPerson = "Contact person is required";
    } else if (!/^[A-Za-z\s]+$/.test(vendorData.contactPerson)) {
      validationErrors.contactPerson = "Contact person must contain only letters and spaces";
    }

    if (!vendorData.contactName.trim()) {
      validationErrors.contactName = "Alternate contact is required";
    } else if (!/^[A-Za-z\s]+$/.test(vendorData.contactName)) {
      validationErrors.contactName = "Alternate contact must contain only letters and spaces";
    }

    if (!vendorData.contactNumber.trim()) {
      validationErrors.contactNumber = "Contact number is required";
    } else if (!/^\+\d{9,15}$/.test(vendorData.contactNumber)) {
      validationErrors.contactNumber = "Valid contact number required (start with '+' and 9–15 digits)";
    }

    if (!vendorData.serviceType.length) {
      validationErrors.serviceType = "Select at least one service";
    }

    if (!vendorData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^[\w.%+-]+@(gmail\.com|email\.com)$/.test(vendorData.email)) {
      validationErrors.email = "Email must be valid and end with @gmail.com or @email.com";
    }

    if (!vendorData.address.trim()) {
      validationErrors.address = "Business address is required";
    } else if (!/^No/i.test(vendorData.address)) {
      validationErrors.address = "Address must start with 'No'";
    }

    if (!vendorData.paymentTerms.trim()) {
      validationErrors.paymentTerms = "Payment terms are required";
    }

    if (!vendorData.pricingDetails.trim()) {
      validationErrors.pricingDetails = "Pricing details are required";
    } else if (!/^\d+$/.test(vendorData.pricingDetails)) {
      validationErrors.pricingDetails = "Pricing details must be an integer";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setVendorData((prevState) => ({
        ...prevState,
        serviceType: checked
          ? [...prevState.serviceType, value]
          : prevState.serviceType.filter((s) => s !== value),
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
      await axios.put(`http://localhost:5000/api/vendors/${id}`, vendorData);
      setMessage("✅ Vendor updated successfully!");
      navigate("/vendors");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update vendor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-8">
            <h2 className="text-center text-3xl font-bold text-white">Update Vendor</h2>
            <p className="mt-2 text-center text-yellow-100">Modify vendor details and services</p>
          </div>

          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
              <p className="text-sm font-medium text-green-800">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <InputField icon={<User />} label="Vendor Name" name="vendorName" value={vendorData.vendorName} onChange={handleChange} placeholder="Company name" error={errors.vendorName} />
              <InputField icon={<UserCheck />} label="Contact Person" name="contactPerson" value={vendorData.contactPerson} onChange={handleChange} placeholder="Main contact" error={errors.contactPerson} />
              <InputField icon={<UserCheck />} label="Alternate Contact" name="contactName" value={vendorData.contactName} onChange={handleChange} placeholder="Alternate contact" error={errors.contactName} />
              <InputField icon={<Phone />} label="Contact Number" name="contactNumber" value={vendorData.contactNumber} onChange={handleChange} placeholder="+123456789" error={errors.contactNumber} />
              <InputField icon={<Mail />} label="Email Address" name="email" value={vendorData.email} onChange={handleChange} placeholder="example@gmail.com" error={errors.email} />
              <InputField icon={<MapPin />} label="Address" name="address" value={vendorData.address} onChange={handleChange} placeholder="No 123, Street Name" colSpan error={errors.address} />

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Provided</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Delivery", "Repair", "Installation"].map((service) => (
                    <label key={service} className="flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        name="serviceType"
                        value={service}
                        checked={vendorData.serviceType.includes(service)}
                        onChange={handleChange}
                        className="h-5 w-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mr-2"
                      />
                      {service}
                    </label>
                  ))}
                </div>
                {errors.serviceType && <p className="text-red-600 text-sm mt-1">{errors.serviceType}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  value={vendorData.paymentTerms}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                {errors.paymentTerms && <p className="text-red-600 text-sm">{errors.paymentTerms}</p>}
              </div>

              <InputField icon={<DollarSign />} label="Pricing Details" name="pricingDetails" value={vendorData.pricingDetails} onChange={handleChange} placeholder="e.g., 15000" colSpan error={errors.pricingDetails} />
            </div>

            <div className="text-center">
              <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
                Update Vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, label, name, value, onChange, placeholder, error, colSpan = false }) => (
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
        placeholder={placeholder}
        className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
      />
    </div>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default UpdateVendor;
