import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Trash2, DollarSign, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('groceries');
  const [budgets, setBudgets] = useState({
    groceries: 500,
    utilities: 200,
    entertainment: 150,
    transportation: 300,
    other: 200
  });
  const categories = ['groceries', 'utilities', 'entertainment', 'transportation', 'other'];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const BASE_URL = "https://finance-tracker-final-5.onrender.com"; 
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/transactions`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate amount (should be positive)
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Amount must be a positive number.");
      return;
    }
  
    // Validate description (should not be empty)
    if (!description.trim()) {
      alert("Description cannot be empty.");
      return;
    }
  
    const newTransaction = { amount: parseFloat(amount), date, description, category };
  
    try {
      const response = await fetch(`${BASE_URL}/api/transactions`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      if (response.ok) {
        fetchTransactions();
        setAmount('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/transactions/${id}`, { method: 'DELETE' });

      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const categoryData = categories.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.category === cat).reduce((acc, t) => acc + t.amount, 0)
  }));

  const budgetComparisonData = categories.map(cat => ({
    name: cat,
    budget: budgets[cat],
    spent: transactions.filter(t => t.category === cat).reduce((acc, t) => acc + t.amount, 0)
  }));

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100">
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Finance Tracker</h1>
        
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Add New Transaction</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 p-4 mb-6 rounded-lg shadow bg-gray-50">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount ($)" className="p-2 border rounded" required />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded" required />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="p-2 border rounded" />
          <button type="submit" className="col-span-4 px-4 py-2 text-white bg-blue-500 rounded">Add Transaction</button>
        </form>

<h2 className="mt-6 text-xl font-semibold text-gray-800">Transaction List</h2>
<div className="overflow-x-auto bg-white rounded-lg shadow">
  <table className="w-full border-collapse">
    <thead className="bg-gray-200">
      <tr>
        <th className="px-4 py-2 text-left">Amount ($)</th>
        <th className="px-4 py-2 text-left">Date</th>
        <th className="px-4 py-2 text-left">Category</th>
        <th className="px-4 py-2 text-left">Description</th>
        <th className="px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((transaction) => (
        <tr key={transaction._id} className="border-t">
          <td className="px-4 py-2">{transaction.amount}</td>
          <td className="px-4 py-2">{transaction.date}</td>
          <td className="px-4 py-2 capitalize">{transaction.category}</td>
          <td className="px-4 py-2">{transaction.description}</td>
          <td className="px-4 py-2">
            <button
              onClick={() => handleDelete(transaction._id)}
              className="px-2 py-1 text-white bg-red-500 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
{/* 📊 ADD PIE CHART HERE */}
<h2 className="mt-6 text-xl font-semibold text-gray-800">Category Breakdown</h2>
<div className="flex justify-center">
  <ResponsiveContainer width="60%" height={300}>
    <PieChart>
      <Pie 
        data={categoryData} 
        dataKey="value" 
        nameKey="name" 
        cx="50%" 
        cy="50%" 
        outerRadius={80} 
        fill="#8884d8" 
        label
      >
        {categoryData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d84d8a'][index % 5]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Monthly Budgets</h2>
<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
  {categories.map(cat => {
    const spent = transactions
      .filter(t => t.category === cat)
      .reduce((acc, t) => acc + t.amount, 0);

    const budget = budgets[cat];
    const spentPercentage = Math.min((spent / budget) * 100, 100); // Limit max width to 100%

    return (
      <div key={cat} className="p-4 rounded-lg shadow bg-gray-50">
        <div className="flex justify-between font-semibold">
          <span className="capitalize">{cat}</span>
          <span>${budget}</span>
        </div>
        <div className="relative w-full h-2 mt-2 bg-gray-300 rounded-full">
          <div
            className={`h-2 rounded-full ${spent > budget ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${spentPercentage}%` }}
          ></div>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Spent: <span className={`${spent > budget ? 'text-red-500' : 'text-gray-600'}`}>
            ${spent.toFixed(2)}
          </span>
        </p>
      </div>
    );
  })}
</div>

        <h2 className="mt-6 text-xl font-semibold text-gray-800">Budget vs. Spending</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" />
            <Bar dataKey="spent" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
