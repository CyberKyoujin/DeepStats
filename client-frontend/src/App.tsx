import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/theme'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OtpVerification from './pages/OtpVerification'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"       element={<Home />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<OtpVerification />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
