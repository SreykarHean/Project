import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ResetPassword from './pages/auth/ResetPassword'
import ForgotPassword from './pages/auth/ForgotPassword'

// Buyer
import BuyerHome from './pages/buyer/Home'
import BuyerListingDetail from './pages/buyer/ListingDetail'
import SavedListings from './pages/buyer/SavedListings'
import Compare from './pages/buyer/Compare'
import BuyerAppointments from './pages/buyer/Appointments'
import BuyerMessages from './pages/buyer/Messages'
import Notifications from './pages/buyer/Notifications'
import BuyerProfile from './pages/buyer/Profile'

// Agent
import AgentDashboard from './pages/agent/Dashboard'
import ManageListings from './pages/agent/ManageListings'
import CreateListing from './pages/agent/CreateListing'
import EditListing from './pages/agent/EditListing'
import AgentListingDetail from './pages/agent/ListingDetail'
import AgentAppointments from './pages/agent/Appointments'
import AgentMessages from './pages/agent/Messages'
import AgentNotifications from './pages/agent/Notifications'
import AgentProfile from './pages/agent/Profile'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import AdminManageListings from './pages/admin/ManageListings'
import ManageReports from './pages/admin/ManageReports'

// Shared
import NotFound from './pages/NotFound'
import Layout from './components/layout/Layout'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Buyer */}
        <Route path="/buyer" element={<ProtectedRoute allowedRoles={['buyer']}><Layout /></ProtectedRoute>}>
          <Route index element={<BuyerHome />} />
          <Route path="listings/:id" element={<BuyerListingDetail />} />
          <Route path="saved" element={<SavedListings />} />
          <Route path="compare" element={<Compare />} />
          <Route path="appointments" element={<BuyerAppointments />} />
          <Route path="messages" element={<BuyerMessages />} />
          <Route path="messages/:agent_id" element={<BuyerMessages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<BuyerProfile />} />
        </Route>

        {/* Agent */}
        <Route path="/agent" element={<ProtectedRoute allowedRoles={['agent']}><Layout /></ProtectedRoute>}>
          <Route index element={<AgentDashboard />} />
          <Route path="listings" element={<ManageListings />} />
          <Route path="listings/create" element={<CreateListing />} />
          <Route path="listings/edit/:id" element={<EditListing />} />
          <Route path="listings/:id" element={<AgentListingDetail />} />
          <Route path="appointments" element={<AgentAppointments />} />
          <Route path="messages" element={<AgentMessages />} />
          <Route path="messages/:buyer_id" element={<AgentMessages />} />
          <Route path="notifications" element={<AgentNotifications />} />
          <Route path="profile" element={<AgentProfile />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="listings" element={<AdminManageListings />} />
          <Route path="reports" element={<ManageReports />} />
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App