import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../Components/Budget.css';

function BudgetDashboard() {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:5000/budgets');
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      const data = await response.json();
      setBudgets(data.budgets);
      setFilteredBudgets(data.budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Could not fetch budget data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = budgets.filter(budget =>
      (budget.evename?.toLowerCase() || '').includes(query) ||
      (budget.email?.toLowerCase() || '').includes(query)
    );
    setFilteredBudgets(filtered);
  }, [searchQuery, budgets]);

  const formatCurrency = (amount) => {
    return amount ? `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '';
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString('en-US') : '';
  };

  const isBefore17th = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const seventeenth = new Date(date.getFullYear(), date.getMonth(), 17);
    return date < seventeenth;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await fetch(`http://localhost:5000/budgets/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete budget');
        }
        setBudgets(prev => prev.filter(b => b._id !== id));
        setFilteredBudgets(prev => prev.filter(b => b._id !== id));
        alert('Budget deleted successfully.');
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Error deleting budget. Please try again.');
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-budget/${id}`);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Budget Report', 20, 10);

    filteredBudgets.forEach((budget, index) => {
      autoTable(doc, {
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 20,
        head: [['Field', 'Value']],
        body: [
          ['Event Name', budget.evename],
          ['Date', formatDate(budget.date)],
          ['Email', budget.email],
          ['Estimated Budget', formatCurrency(budget.estbudget)],
          ['Venue', budget.venue],
          ['Payment Date', formatDate(budget.paymentdate)],
          ['Status', budget.status],
          ['Actual Cost', formatCurrency(budget.actualcost)],
          ['Variance', formatCurrency(budget.variance)],
          ['Notes', budget.notes],
        ],
        theme: 'grid',
        styles: { cellPadding: 2 },
      });

      if (index < filteredBudgets.length - 1) {
        doc.addPage();
      }
    });

    doc.save('budget_report.pdf');
  };

  return (
    <div className="budget-dashboard">
      <div className="header-bar">
        <input
          type="text"
          placeholder="Search by event name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => navigate('/addbudget')} className="add-btn"> + Add Budget</button>
      </div>

      <h1>Budget Dashboard</h1>

      {loading && <p>Loading budget data...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Email</th>
              <th>Estimated Budget</th>
              <th>Venue</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Actual Cost</th>
              <th>Variance</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map((budget, index) => {
                const highlight = isBefore17th(budget.date) || isBefore17th(budget.paymentdate);
                return (
                  <tr key={index} className={highlight ? 'highlight-row' : ''}>
                    <td>{budget.evename}</td>
                    <td>{formatDate(budget.date)}</td>
                    <td>{budget.email}</td>
                    <td>{formatCurrency(budget.estbudget)}</td>
                    <td>{budget.venue}</td>
                    <td>{formatDate(budget.paymentdate)}</td>
                    <td>{budget.status}</td>
                    <td>{formatCurrency(budget.actualcost)}</td>
                    <td>{formatCurrency(budget.variance)}</td>
                    <td>{budget.notes}</td>
                    <td>
                      <button onClick={() => handleUpdate(budget._id)} className="edit-btn">Update</button>
                      <button onClick={() => handleDelete(budget._id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center' }}>
                  {searchQuery ? 'No budgets match your search query.' : 'No budgets found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button onClick={generatePDF} className="pdf-btn">Generate PDF</button>
    </div>
  );
}

export default BudgetDashboard;
