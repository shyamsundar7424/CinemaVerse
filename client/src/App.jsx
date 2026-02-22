import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Categories from './pages/Categories';
import About from './pages/About';
import Help from './pages/Help';
import Background from './components/Background';

// Theme context
export const ThemeContext = createContext({ dark: true, toggle: () => { } });
export const useTheme = () => useContext(ThemeContext);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <Home />
          </motion.div>
        } />
        <Route path="/movie/:id" element={
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <MovieDetail />
          </motion.div>
        } />
        <Route path="/categories" element={
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <Categories />
          </motion.div>
        } />
        <Route path="/about" element={
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <About />
          </motion.div>
        } />
        <Route path="/help" element={
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <Help />
          </motion.div>
        } />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('cv-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.body.classList.toggle('light-mode', !dark);
    localStorage.setItem('cv-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = () => setDark(d => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <Router>
        <div className="relative min-h-screen">
          <Background />
          <Navbar />
          <main className="container mx-auto px-3 sm:px-4 py-4 md:py-8 relative z-10">
            <AnimatedRoutes />
          </main>
          <ToastContainer
            theme={dark ? 'dark' : 'light'}
            position="bottom-right"
            toastStyle={{ background: dark ? '#0d0d1f' : '#fff', border: '1px solid rgba(168,85,247,0.3)' }}
          />
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
