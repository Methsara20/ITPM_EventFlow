import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { FiPrinter } from 'react-icons/fi';
import autoTable from "jspdf-autotable";
import { IoSearch, IoPrint } from "react-icons/io5";
import { User, Phone, Mail, MapPin, Package, CreditCard, DollarSign } from "lucide-react";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch vendor data
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vendors");
        const data = response.data || [];
        
        const normalized = data.map((vendor) => ({
          ...vendor,
          serviceType: Array.isArray(vendor.serviceType)
            ? vendor.serviceType
            : typeof vendor.serviceType === "string"
            ? vendor.serviceType.split(",").map(s => s.trim())
            : [],
        }));
        
        setVendors(normalized);
        setLoading(false);
      } catch (err) {
        setError("Failed to load vendors: " + err.message);
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await axios.delete(`http://localhost:5000/api/vendors/${id}`);
        setVendors((prev) => prev.filter((v) => v._id !== id));
      } catch (err) {
        alert("Error deleting vendor: " + err.message);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-vendor/${id}`);
  };

  const generateReport = () => {
    const filteredVendors = vendors.filter((vendor) =>
      vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredVendors.length === 0) {
      alert("No vendors found matching the search term.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Vendor Report", 14, 16);
    autoTable(doc, {
      head: [["Vendor Name", "Contact Person", "Contact Number", "Email", "Services", "Payment Terms", "Pricing", "Address"]],
      body: filteredVendors.map((vendor) => [
        vendor.vendorName,
        vendor.contactPerson,
        vendor.contactNumber,
        vendor.email,
        vendor.serviceType.join(", "),
        vendor.paymentTerms,
        vendor.pricingDetails,
        vendor.address,
      ]),
      startY: 20,
    });
    doc.save("vendor_report.pdf");
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between flex-wrap sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-white">Registered Vendors</h2>
          <p className="text-blue-100">Manage your vendor network efficiently</p>
        </div>
        <div className="mt-2 sm:mt-0 flex gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={generateReport}
            className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            <FiPrinter className="h-5 w-5" /> Generate Report
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading vendors...</p>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" /> Contact
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1" /> Services
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" /> Payment
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> Pricing
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {vendor.contactNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.contactPerson}</div>
                      {vendor.contactName && (
                        <div className="text-sm text-gray-500">Alt: {vendor.contactName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {vendor.serviceType.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.paymentTerms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.pricingDetails}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUpdate(vendor._id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vendor._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList;