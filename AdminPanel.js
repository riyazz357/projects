// AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Materials from './components/Materials';
import Questions from './components/Questions';
import Subjects from './components/Subjects';
import Navbar from './components/Navbar';

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      <div className="container mt-4">
        <Switch>
          <Route exact path="/login">
            <Login setIsAuthenticated={setIsAuthenticated} />
          </Route>
          <Route exact path="/">
            {isAuthenticated ? <Dashboard /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          </Route>
          <Route exact path="/materials">
            {isAuthenticated ? <Materials /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          </Route>
          <Route exact path="/questions">
            {isAuthenticated ? <Questions /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          </Route>
          <Route exact path="/subjects">
            {isAuthenticated ? <Subjects /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default AdminPanel;