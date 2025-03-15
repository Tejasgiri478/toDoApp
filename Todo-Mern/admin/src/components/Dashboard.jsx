import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import axios from 'axios';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    tasksByCategory: {},
    recentTasks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await axios.get('http://localhost:8000/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data for task categories
  const categoryChartData = {
    labels: Object.keys(stats.tasksByCategory).map(cat => {
      // Normalize category names to handle 'other' and 'others'
      if (cat.toLowerCase() === 'other' || cat.toLowerCase() === 'others') {
        return 'Other';
      }
      return cat.charAt(0).toUpperCase() + cat.slice(1);
    }),
    datasets: [
      {
        data: Object.values(stats.tasksByCategory),
        backgroundColor: Object.keys(stats.tasksByCategory).map((_, index) => {
          const colors = ['#4a6ee0', '#28a745', '#ffc107', '#6c757d', '#dc3545', '#17a2b8'];
          return colors[index % colors.length];
        }),
        borderWidth: 1,
      },
    ],
  };

  // Chart data for task completion
  const completionChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Tasks',
        data: [stats.completedTasks, stats.pendingTasks],
        backgroundColor: ['#28a745', '#ffc107'],
      },
    ],
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <PeopleIcon className="text-primary" fontSize="large" /> },
    { title: 'Total Tasks', value: stats.totalTasks, icon: <TaskIcon className="text-secondary" fontSize="large" /> },
    { title: 'Completed Tasks', value: stats.completedTasks, icon: <CheckCircleIcon className="text-success" fontSize="large" /> },
    { title: 'Pending Tasks', value: stats.pendingTasks, icon: <WarningIcon className="text-warning" fontSize="large" /> },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="mr-4">{card.icon}</div>
            <div>
              <h3 className="text-gray-500 text-sm">{card.title}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tasks by Category</h2>
          <div className="h-64">
            <Pie data={categoryChartData} id="category-chart" key="category-chart" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Task Completion</h2>
          <div className="h-64">
            <Bar 
              data={completionChartData} 
              id="completion-chart"
              key="completion-chart"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentTasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{task.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 