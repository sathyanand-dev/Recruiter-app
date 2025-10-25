import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateJob from './pages/CreateJob';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import PreviewPost from './pages/PreviewPost';
import PostSuccess from './pages/PostSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

export default function App(){
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />

          <Route path="/" element={<Navigate to="/jobs" />} />

          <Route path="/jobs" element={<ProtectedRoute><JobList/></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail/></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateJob/></ProtectedRoute>} />
          <Route path="/create/:id" element={<ProtectedRoute><CreateJob/></ProtectedRoute>} />
          <Route path="/preview/:id" element={<ProtectedRoute><PreviewPost/></ProtectedRoute>} />
          <Route path="/post-success/:id" element={<ProtectedRoute><PostSuccess/></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}
