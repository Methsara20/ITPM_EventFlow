import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddBudget() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    evename: "",
    date: "",
    email: "",
    estbudget: "",
    venue: "",
    paymentdate: "",
    status: "Pending",
    actualcost: "",
    variance: "",
    notes: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchBudget = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:5001/api/budgets/${id}`);
          const budgetData = response.data;

          setInputs({
            evename: budgetData.evename || "",
            date: budgetData.date ? budgetData.date.substring(0, 10) : "",
            email: budgetData.email || "",
            estbudget: budgetData.estbudget || "",
            venue: budgetData.venue || "",
            paymentdate: budgetData.paymentdate ? budgetData.paymentdate.substring(0, 10) : "",
            status: budgetData.status || "Pending",
            actualcost: budgetData.actualcost || "",
            variance: budgetData.variance || "",
            notes: budgetData.notes || ""
          });
        } catch (error) {
          console.error("Error fetching budget:", error.response?.data || error.message);
          setErrorMessage("Failed to load budget data");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchBudget();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputs(prev => {
      const updatedInputs = { ...prev, [name]: value };

      const estimated = parseFloat(updatedInputs.estbudget) || 0;
      const actual = parseFloat(updatedInputs.actualcost) || 0;
      updatedInputs.variance = estimated - actual;

      return updatedInputs;
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!inputs.evename.trim()) errors.evename = "Event name is required";
    if (!inputs.date) errors.date = "Event date is required";
    if (!inputs.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = "Valid email is required";
    if (!inputs.estbudget || isNaN(inputs.estbudget)) errors.estbudget = "Valid number required";
    if (inputs.paymentdate && new Date(inputs.paymentdate) < new Date(inputs.date)) {
      errors.paymentdate = "Payment date must be after event date";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const budgetData = {
        ...inputs,
        estbudget: Number(inputs.estbudget),
        actualcost: inputs.actualcost ? Number(inputs.actualcost) : null,
        variance: inputs.variance ? Number(inputs.variance) : null
      };

      if (id) {
        await axios.put(`http://localhost:5001/api/budgets/${id}`, budgetData);
      } else {
        await axios.post("http://localhost:5001/api/budgets", budgetData);
      }

      navigate("/budget");
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Failed to save budget");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {id ? "Edit Budget Plan" : "Create New Budget Plan"}
        </h1>
        {errorMessage && (
          <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="evename"
              value={inputs.evename}
              onChange={handleInputChange}
              placeholder="Conference 2023"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                validationErrors.evename ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {validationErrors.evename && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.evename}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={inputs.date}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                validationErrors.date ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {validationErrors.date && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.date}
              </p>
            )}
          </div>

          {/* Contact & Budget */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleInputChange}
              placeholder="organizer@company.com"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                validationErrors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {validationErrors.email && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estimated Budget ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                name="estbudget"
                value={inputs.estbudget}
                onChange={handleInputChange}
                placeholder="5000"
                step="0.01"
                className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 ${
                  validationErrors.estbudget ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
            </div>
            {validationErrors.estbudget && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.estbudget}
              </p>
            )}
          </div>

          {/* Venue & Payment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              name="venue"
              value={inputs.venue}
              onChange={handleInputChange}
              placeholder="Convention Center"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Date
            </label>
            <input
              type="date"
              name="paymentdate"
              value={inputs.paymentdate}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 ${
                validationErrors.paymentdate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {validationErrors.paymentdate && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.paymentdate}
              </p>
            )}
            <p className="mt-1.5 text-xs text-gray-500">Must be after event date</p>
          </div>

          {/* Status & Actual Cost */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select 
              name="status" 
              value={inputs.status} 
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Actual Cost ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                name="actualcost"
                value={inputs.actualcost}
                onChange={handleInputChange}
                placeholder="4500"
                step="0.01"
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Variance & Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Variance ($)
            </label>
            <input
              type="number"
              name="variance"
              value={inputs.variance}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            />
            <p className="mt-1.5 text-xs text-gray-500">Calculated automatically (Estimated Budget - Actual Cost)</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={inputs.notes}
              onChange={handleInputChange}
              placeholder="Additional notes or comments..."
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting
              ? (id ? "Saving Changes..." : "Creating Budget...")
              : (id ? "Update Budget Plan" : "Create Budget Plan")}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBudget;