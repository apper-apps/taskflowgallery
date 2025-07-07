import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import TodayView from '@/components/pages/TodayView'
import UpcomingView from '@/components/pages/UpcomingView'
import CategoriesView from '@/components/pages/CategoriesView'
import CompletedView from '@/components/pages/CompletedView'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/today" element={<TodayView />} />
          <Route path="/upcoming" element={<UpcomingView />} />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/completed" element={<CompletedView />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App