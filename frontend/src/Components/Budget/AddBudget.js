import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './AddBudget.css';

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
          const response = await axios.get(`http://localhost:5000/budgets/${id}`);
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

      // Update variance if estimatedBudget or actualCost changes
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
    if (!inputs.estbudget || isNaN(inputs.estbudget)) errors.estbudget = "Valid number required for Estimated Budget";
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
        await axios.put(`http://localhost:5000/budgets/${id}`, budgetData, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        await axios.post("http://localhost:5000/budgets", budgetData, {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      navigate("/budget");
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Failed to save budget");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="budget-form-container">
      <div className="form-header">
        <h1>{id ? "Edit Budget" : "Add Budget"}</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>

      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            name="evename"
            value={inputs.evename}
            onChange={handleInputChange}
            placeholder="Enter Event Name"
          />
          {validationErrors.evename && <span className="error">{validationErrors.evename}</span>}
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            name="date"
            value={inputs.date}
            onChange={handleInputChange}
          />
          {validationErrors.date && <span className="error">{validationErrors.date}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleInputChange}
            placeholder="Enter Email"
          />
          {validationErrors.email && <span className="error">{validationErrors.email}</span>}
        </div>

        <div className="form-group">
          <label>Estimated Budget</label>
          <input
            type="number"
            name="estbudget"
            value={inputs.estbudget}
            onChange={handleInputChange}
            placeholder="Enter Estimated Budget"
          />
          {validationErrors.estbudget && <span className="error">{validationErrors.estbudget}</span>}
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input
            type="text"
            name="venue"
            value={inputs.venue}
            onChange={handleInputChange}
            placeholder="Enter Venue"
          />
        </div>

        <div className="form-group">
          <label>Payment Date</label>
          <input
            type="date"
            name="paymentdate"
            value={inputs.paymentdate}
            onChange={handleInputChange}
          />
          {validationErrors.paymentdate && <span className="error">{validationErrors.paymentdate}</span>}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={inputs.status} onChange={handleInputChange}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Actual Cost</label>
          <input
            type="number"
            name="actualcost"
            value={inputs.actualcost}
            onChange={handleInputChange}
            placeholder="Enter Actual Cost"
          />
        </div>

        <div className="form-group">
          <label>Variance</label>
          <input
            type="number"
            name="variance"
            value={inputs.variance}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <input
            type="text"
            name="notes"
            value={inputs.notes}
            onChange={handleInputChange}
            placeholder="Enter Notes"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? id ? "Updating..." : "Saving..."
              : id ? "Update Budget" : "Save Budget"}
          </button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddBudget;
