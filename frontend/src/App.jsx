import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/User/Register'
import Login from './pages/User/Login'
import "react-toastify/dist/ReactToastify.css"; // Import default styles
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'sonner';
import VerifyOtp from './pages/User/VerifyOtp'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter >
     <ToastContainer
        position="top-right" // or use other options like "top-center", "bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick //new
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}  // Ensure the toast is above other content
      />

      <Toaster position="top-right" richColors={true} />
    <Routes>


      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verifyotp" element={<VerifyOtp />} />



    </Routes>
    
    
    
    </BrowserRouter>
  )
}

export default App
