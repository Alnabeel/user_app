import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './Dashboard'; // Create a basic Dashboard component
import Login from './Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard/:employeeId" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
