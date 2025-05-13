import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { FiPrinter } from 'react-icons/fi';
import autoTable from "jspdf-autotable";
import { IoSearch } from "react-icons/io5";
import { User, Phone, Mail, Package, CreditCard, DollarSign, MapPin } from "lucide-react";
import { Tooltip } from "@mui/material";

// Helper functions
const formatPhoneNumber = (number) => {
  if (!number) return '';
  const cleaned = ('' + number).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : number;
};

const formatAddress = (address) => {
  if (!address) return '';
  return address.replace(/(No\s*\d+),/i, '$1, ').replace(/,/g, ', ');
};

const formatCurrency = (amount) => {
  if (!amount) return '0.00';
  return Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const navigate = useNavigate();

  // Fetch vendor data
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/vendors");
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
        await axios.delete(`http://localhost:5001/api/vendors/${id}`);
        setVendors((prev) => prev.filter((v) => v._id !== id));
      } catch (err) {
        alert("Error deleting vendor: " + err.message);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-vendor/${id}`);
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    
    try {
      const filteredVendors = vendors.filter((vendor) =>
        vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm"
      });
      
      // Title and Metadata
      doc.setFontSize(20);
      doc.setTextColor(33, 150, 243);
      doc.setFont("helvetica", "bold");
      doc.text("Vendor Management Report", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);
      doc.text(`Total Vendors: ${filteredVendors.length}`, 14, 32);
      
      if (searchTerm) {
        doc.text(`Search Term: "${searchTerm}"`, 14, 37);
      }

      if (filteredVendors.length === 0) {
        doc.setFontSize(16);
        doc.setTextColor(255, 0, 0);
        doc.text("No vendors found matching the search criteria.", 14, 50);
        doc.save("vendor_report.pdf");
        return;
      }

      // Vendor Summary Statistics
      const serviceCounts = {};
      const paymentTermCounts = {};
      
      filteredVendors.forEach(vendor => {
        vendor.serviceType.forEach(service => {
          serviceCounts[service] = (serviceCounts[service] || 0) + 1;
        });
        paymentTermCounts[vendor.paymentTerms] = (paymentTermCounts[vendor.paymentTerms] || 0) + 1;
      });

      // Summary Table
      autoTable(doc, {
        startY: 45,
        head: [['Summary Statistics', 'Count']],
        body: [
          ['Total Vendors', filteredVendors.length],
          ['Delivery Services', serviceCounts['Delivery'] || 0],
          ['Repair Services', serviceCounts['Repair'] || 0],
          ['Installation Services', serviceCounts['Installation'] || 0],
          ['Most Common Payment Term', Object.keys(paymentTermCounts).reduce((a, b) => paymentTermCounts[a] > paymentTermCounts[b] ? a : b, 'N/A')]
        ],
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 2,
          halign: 'left'
        },
        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: {cellWidth: 50},
          1: {cellWidth: 20, halign: 'center'}
        },
        margin: {left: 14}
      });

      // Main Vendor Table
      autoTable(doc, {
        startY: 85,
        head: [
          [
            {content: 'Vendor Details', colSpan: 3, styles: {halign: 'center', fillColor: [33, 150, 243], textColor: 255}},
            {content: 'Contact Information', colSpan: 3, styles: {halign: 'center', fillColor: [33, 150, 243], textColor: 255}},
            {content: 'Business Details', colSpan: 3, styles: {halign: 'center', fillColor: [33, 150, 243], textColor: 255}}
          ],
          [
            'Name', 'Services', 'Address',
            'Contact Person', 'Phone', 'Email',
            'Payment Terms', 'Pricing', 'Registered On'
          ]
        ],
        body: filteredVendors.map((vendor) => [
          vendor.vendorName,
          vendor.serviceType.join(", "),
          formatAddress(vendor.address),
          vendor.contactPerson + (vendor.contactName ? `\n(Alt: ${vendor.contactName})` : ''),
          formatPhoneNumber(vendor.contactNumber),
          vendor.email,
          vendor.paymentTerms,
          formatCurrency(vendor.pricingDetails),
          new Date(vendor.createdAt || Date.now()).toLocaleDateString()
        ]),
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 1.5,
          halign: 'left',
          valign: 'middle',
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [70, 130, 180],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: {cellWidth: 25},
          1: {cellWidth: 20},
          2: {cellWidth: 30},
          3: {cellWidth: 20},
          4: {cellWidth: 15},
          5: {cellWidth: 25},
          6: {cellWidth: 20},
          7: {cellWidth: 15, halign: 'right'},
          8: {cellWidth: 15}
        },
        margin: {left: 14, right: 14},
        didDrawPage: function(data) {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
          
          // Watermark
          doc.setFontSize(60);
          doc.setTextColor(230, 230, 230);
          doc.setGState(new doc.GState({opacity: 0.1}));
          doc.text(
            'CONFIDENTIAL',
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height / 2,
            {angle: 45, align: 'center'}
          );
          doc.setGState(new doc.GState({opacity: 1}));
        }
      });

      doc.save(`vendor_report_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.address?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Tooltip title="Generate PDF report of all vendors" arrow>
            <button
              onClick={generateReport}
              disabled={generatingReport}
              className={`flex items-center gap-2 ${generatingReport ? 'bg-blue-400' : 'bg-white hover:bg-blue-50'} text-blue-600 font-semibold px-4 py-2 rounded-lg shadow transition min-w-[150px] justify-center`}
            >
              {generatingReport ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <FiPrinter className="h-5 w-5" /> Generate Report
                </>
              )}
            </button>
          </Tooltip>
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
                      <MapPin className="h-4 w-4 mr-1" /> Address
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
                            <Phone className="h-3 w-3 mr-1" /> {formatPhoneNumber(vendor.contactNumber)}
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
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {formatAddress(vendor.address)}
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
                      {formatCurrency(vendor.pricingDetails)}
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