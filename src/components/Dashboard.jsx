import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import axios from 'axios';
import './Dashboard.css';
import StatsCard from './StatsCard';
import StreakDisplay from './StreakDisplay';
import ProgressChart from './ProgressChart';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';


axios.defaults.timeout = 15000; 

export default function Dashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (userProfile?.leetcodeUsername) {
      setLeetcodeUsername(userProfile.leetcodeUsername);
      fetchLeetCodeData(userProfile.leetcodeUsername);
    }
  }, [userProfile]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!leetcodeUsername.trim()) {
      setError('Please enter a LeetCode username');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          leetcodeUsername: leetcodeUsername.trim()
        });
      } catch (firestoreError) {
        console.error('Error updating Firestore:', firestoreError);
      }

      if (userProfile) {
        userProfile.leetcodeUsername = leetcodeUsername.trim();
      }

      await fetchLeetCodeData(leetcodeUsername.trim());
    } catch (err) {
      console.error('Error in handleUsernameSubmit:', err);
      setError(err.message || 'Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeetCodeData = async (username) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/leetcode/${username}`);
      const data = response.data;
      
      const transformedStats = {
        totalSolved: data.totalSolved || 0,
        easySolved: data.easySolved || 0,
        mediumSolved: data.mediumSolved || 0,
        hardSolved: data.hardSolved || 0,
        acceptanceRate: data.acceptanceRate || 0,
        recentSubmissions: data.recentSubmissions || []
      };
      
      setStats(transformedStats);
      
      if (transformedStats.recentSubmissions && transformedStats.recentSubmissions.length > 0) {
        calculateStreak(transformedStats.recentSubmissions);
      } else {
        setStreak(0);
      }
    } catch (err) {
      console.error('Error fetching LeetCode data:', err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Failed to fetch LeetCode data. Please check if the backend is running and the username is correct.';
      setError(errorMessage);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (submissions) => {
    if (!submissions || submissions.length === 0) {
      setStreak(0);
      return;
    }

    const dates = submissions
      .map(s => new Date(s.timestamp * 1000).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dates[0] === today || dates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    setStreak(currentStreak);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">LeetCode Tracker</h1>
          <div className="header-actions">
            <span className="user-name">{userProfile?.displayName || currentUser?.email}</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {!userProfile?.leetcodeUsername ? (
          <div className="username-setup">
            <div className="setup-card">
              <h2>Set Your LeetCode Username</h2>
              <p>Enter your LeetCode username to start tracking your progress</p>
              <form onSubmit={handleUsernameSubmit} className="username-form">
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  placeholder="Enter LeetCode username"
                  className="username-input"
                />
                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? 'Loading...' : 'Start Tracking'}
                </button>
              </form>
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        ) : (
          <>
            <div className="username-section">
              <div className="username-card">
                <span className="username-label">LeetCode Username:</span>
                <span className="username-value">{userProfile.leetcodeUsername}</span>
                <button 
                  onClick={() => fetchLeetCodeData(userProfile.leetcodeUsername)}
                  className="refresh-button"
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading && !stats && (
              <div className="loading">Loading your LeetCode stats...</div>
            )}

            {stats && (
              <>
                <div className="stats-grid">
                  <StatsCard
                    title="Total Solved"
                    value={stats.totalSolved || 0}
                    subtitle="Problems"
                  />
                  <StatsCard
                    title="Easy Solved"
                    value={stats.easySolved || 0}
                    subtitle="Easy problems"
                    color="#00b8a3"
                  />
                  <StatsCard
                    title="Medium Solved"
                    value={stats.mediumSolved || 0}
                    subtitle="Medium problems"
                    color="#ffc01e"
                  />
                  <StatsCard
                    title="Hard Solved"
                    value={stats.hardSolved || 0}
                    subtitle="Hard problems"
                    color="#ff375f"
                  />
                  <StreakDisplay streak={streak} />
                  <StatsCard
                    title="Acceptance Rate"
                    value={`${stats.acceptanceRate || 0}%`}
                    subtitle="Submission success"
                  />
                </div>

                <div className="charts-section">
                  <ProgressChart stats={stats} />
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

