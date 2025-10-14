import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import TestPage from './pages/TestPage'
import HospitalManagement from './pages/HospitalManagement'
import BedBooking from './pages/BedBooking'
import ChatBot from './pages/ChatBot'
import Alerts from './pages/Alerts'
import MedicineBooking from './pages/MedicineBooking'
import Analytics from './pages/Analytics'
import Layout from './components/Layout'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/hospitals" element={
              <ProtectedRoute>
                <Layout>
                  <HospitalManagement />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/bed-booking" element={
              <ProtectedRoute>
                <Layout>
                  <BedBooking />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <Layout>
                  <ChatBot />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute>
                <Layout>
                  <Alerts />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/medicine" element={
              <ProtectedRoute>
                <Layout>
                  <MedicineBooking />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            } />
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
