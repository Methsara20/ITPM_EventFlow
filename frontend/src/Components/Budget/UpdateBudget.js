import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateBudget.css'; // Add custom CSS for styling

function UpdateBudget() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    eventName: '',
    date: '',
    email: '',
    estimatedBudget: '',
    venue: '',
    paymentDate: '',
    status: 'Pending',
    actualCost: '',
    variance: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/budgets/${id}`);
        setInputs(response.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError('Failed to load budget data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudget();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      const updatedInputs = { ...prev, [name]: value };

      const estimated = parseFloat(updatedInputs.estimatedBudget) || 0;
      const actual = parseFloat(updatedInputs.actualCost) || 0;
      updatedInputs.variance = estimated - actual;

      return updatedInputs;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const updateData = {
        ...inputs,
        estimatedBudget: Number(inputs.estimatedBudget),
        actualCost: inputs.actualCost ? Number(inputs.actualCost) : null,
        variance: inputs.variance ? Number(inputs.variance) : null
      };

      await axios.put(`http://localhost:5000/budgets/${id}`, updateData, {
        headers: { 'Content-Type': 'application/json' }
      });

      navigate('/budget');
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update budget');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1>Update Budget</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="budget-form">
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="eventName"
              value={inputs.eventName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Date</label>
            <input
              type="date"
              name="date"
              value={inputs.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Estimated Budget</label>
            <input
              type="number"
              name="estimatedBudget"
              value={inputs.estimatedBudget}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Venue</label>
            <input
              type="text"
              name="venue"
              value={inputs.venue}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={inputs.paymentDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={inputs.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Actual Cost</label>
            <input
              type="number"
              name="actualCost"
              value={inputs.actualCost}
              onChange={handleChange}
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
            <textarea
              name="notes"
              value={inputs.notes}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button type="submit">Update Budget</button>
            <button type="button" onClick={() => navigate('/budget')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateBudget;
