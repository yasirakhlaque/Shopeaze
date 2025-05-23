import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faUsers,
  faReceipt,
  faMoneyBillWave,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faFilter,
  faEllipsisV,
  faCreditCard,
  faChartBar,
  faBell,
  faExchangeAlt,
  faPlus,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import Profile from './Profile';
import axios from 'axios';

// Circular progress with label component
const CircularProgressWithLabel = ({ value, color, size = 70, thickness = 5 }) => {
  const circumference = 2 * Math.PI * ((size - thickness) / 2);
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="circular-progress-container">
      <svg className="circular-progress" width={size} height={size}>
        <circle
          className="circular-progress-background"
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          strokeWidth={thickness}
        />
        <circle
          className="circular-progress-value"
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ stroke: color }}
        />
      </svg>
      <div className="circular-progress-label">
        {`${Math.round(value)}%`}
      </div>
    </div>
  );
};

// Enhanced Stat Card component with onClick navigation
const StatCard = ({ title, value, change, icon, iconColor, onClick }) => {
  const isPositive = parseFloat(change) > 0;

  return (
    <div className="stat-card" onClick={onClick}>
      <div className="stat-card-header">
        <p className="stat-card-title">{title}</p>
        <div className="stat-card-icon" style={{ backgroundColor: `rgba(${hexToRgb(iconColor)}, 0.1)`, color: iconColor }}>
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>

      <h2 className="stat-card-value">{value}</h2>

      <div className="stat-card-footer">
        <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
          <FontAwesomeIcon icon={isPositive ? faChartLine : faArrowDown} />
          <span>{change.replace('-', '')}%</span>
        </div>
        <p className="stat-card-period">vs last month</p>
      </div>
    </div>
  );
};

// Revenue Card for data visualization
const RevenueCard = ({ salesData, selectedPeriod, onPeriodChange }) => {
  const months = salesData?.map(item => item.date) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const values = salesData?.map(item => item.amount) || [40, 65, 50, 80, 75, 90];
  const maxValue = Math.max(...values, 1); // Ensure non-zero division

  const totalRevenue = values.reduce((sum, amount) => sum + amount, 0);

  // Calculate growth if data is available
  const lastPeriodTotal = values.slice(0, values.length / 2).reduce((sum, amount) => sum + amount, 0);
  const currentPeriodTotal = values.slice(values.length / 2).reduce((sum, amount) => sum + amount, 0);
  const growth = lastPeriodTotal > 0 
    ? ((currentPeriodTotal - lastPeriodTotal) / lastPeriodTotal * 100).toFixed(1)
    : 0;
  const isPositive = parseFloat(growth) >= 0;

  const handlePeriodChange = (e) => {
    if (onPeriodChange) {
      onPeriodChange(e.target.value);
    }
  };

  return (
    <div className="revenue-card">
      <div className="revenue-card-header">
        <div>
          <h3 className="revenue-card-title">Revenue Trends</h3>
          <p className="revenue-card-subtitle">Revenue performance</p>
        </div>
        <div className="revenue-card-actions">
          <select 
            className="period-selector" 
            value={selectedPeriod}
            onChange={handlePeriodChange}
            aria-label="Select time period"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <h2 className="revenue-card-amount">₹{totalRevenue.toFixed(2)}</h2>

      <div className="revenue-card-change">
        <div className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
          <FontAwesomeIcon icon={isPositive ? faArrowUp : faArrowDown} />
          <span>{Math.abs(growth)}%</span>
        </div>
        <p className="change-period">vs previous period</p>
      </div>

      <div className="chart-container">
        {months.map((month, index) => (
          <div
            key={month}
            className={`chart-bar ${index === months.length - 1 ? 'active' : ''}`}
            style={{
              height: `${(values[index] / maxValue) * 100}%`,
            }}
            aria-label={`${month}: ₹${values[index].toFixed(2)}`}
          >
            <div className="chart-tooltip">{`₹${values[index].toFixed(2)}`}</div>
          </div>
        ))}
      </div>
      <div className="chart-labels">
        {months.map(month => (
          <div key={month} className="chart-label">{month}</div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Card
const QuickActionsCard = () => {
  const navigate = useNavigate();

  const actions = [
    { name: 'New Invoice', icon: faReceipt, color: '#896790', route: '/invoices' },
    { name: 'Add Product', icon: faShoppingCart, color: '#bfadcc', route: '/items' },
    { name: 'Record Payment', icon: faCreditCard, color: '#dfbbda', route: '/invoices' },
    { name: 'Sales Report', icon: faChartBar, color: '#f2bae4', route: '/sales' },
  ];

  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="quick-actions-card">
      <h3 className="quick-actions-title">Quick Actions</h3>

      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.name}
            className="action-button"
            style={{
              borderColor: `rgba(${hexToRgb(action.color)}, 0.3)`,
              color: action.color,
            }}
            onClick={() => handleActionClick(action.route)}
          >
            <FontAwesomeIcon icon={action.icon} />
            <span className="action-text">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Recent Activities Card
const ActivitiesCard = () => {
  const activities = [
    {
      label: 'New invoice created',
      value: 'Invoice #12345',
      time: '10 min ago',
      icon: faReceipt,
      color: '#896790'
    },
    {
      label: 'New customer added',
      value: 'Sarah Johnson',
      time: '1 hour ago',
      icon: faUsers,
      color: '#bfadcc'
    },
    {
      label: 'Payment received',
      value: '₹1,250.00',
      time: '3 hours ago',
      icon: faMoneyBillWave,
      color: '#dfbbda'
    }
  ];

  return (
    <div className="activities-card">
      <div className="activities-header">
        <h3 className="activities-title">Recent Activities</h3>
        <button className="icon-button">
          <FontAwesomeIcon icon={faBell} />
        </button>
      </div>

      <div className="activities-list">
        {activities.map((activity, index) => (
          <React.Fragment key={index}>
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: activity.color }}>
                <FontAwesomeIcon icon={activity.icon} />
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-label">{activity.label}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div className="activity-value">{activity.value}</div>
              </div>
            </div>
            {index < activities.length - 1 && <div className="activity-divider"></div>}
          </React.Fragment>
        ))}
      </div>

      <button className="view-all-button">
        View All Activities
      </button>
    </div>
  );
};


// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

const Home = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const navigate = useNavigate();

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount).replace('₹', '₹');
  };

  // Function to fetch dashboard stats
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      setStats([
        {
          title: 'Total Sales',
          value: formatCurrency(data.totalSales),
          change: data.salesGrowth.toString(),
          icon: faMoneyBillWave,
          iconColor: '#896790',
          route: '/sales'
        },
        {
          title: 'New Customers',
          value: data.newCustomers.toString(),
          change: data.customerGrowth.toString(),
          icon: faUsers,
          iconColor: '#bfadcc',
          route: '/customers'
        },
        {
          title: 'Total Orders',
          value: data.totalOrders.toString(),
          change: data.orderGrowth.toString(),
          icon: faShoppingCart,
          iconColor: '#dfbbda',
          route: '/invoices'
        },
        {
          title: 'Pending Invoices',
          value: data.pendingInvoices.toString(),
          change: data.pendingGrowth.toString(),
          icon: faReceipt,
          iconColor: '#f2bae4',
          route: '/invoices'
        },
      ]);

      // Fetch sales data for the revenue chart
      await fetchSalesData('monthly');
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // If we get an authentication error, redirect to login
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch sales data by period
  const fetchSalesData = async (period) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/sales/${period}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSalesData(response.data);
      setSelectedPeriod(period);
    } catch (error) {
      console.error(`Failed to fetch ${period} sales data:`, error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle period change for revenue chart
  useEffect(() => {
    if (!isLoading) {
      fetchSalesData(selectedPeriod);
    }
  }, [selectedPeriod]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Handle card click navigation
  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Merchant!</p>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="primary-button">
            <FontAwesomeIcon icon={faPlus} />
            Add New Sale
          </button>
          <Link to="/profile" className="profile-link">
            <button className="icon-button profile-button">
              <FontAwesomeIcon icon={faUser} />
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                iconColor={stat.iconColor}
                onClick={() => handleCardClick(stat.route)}
              />
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="grid-item large">
              <RevenueCard 
                salesData={salesData} 
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
            <div className="grid-item">
              <QuickActionsCard />
            </div>
            <div className="grid-item large">
              <ActivitiesCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;