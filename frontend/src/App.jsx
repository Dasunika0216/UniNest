import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SignUp from './components/sign-up.jsx';
import SignIn from './components/sign-in.jsx';
import Home from './pages/Home.jsx';
import HostProfile from './pages/HostProfile.jsx';
import FindBoarding from './pages/FindBoarding.jsx';
import ViewBoarding from './pages/ViewBoarding.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/host-profile" element={<HostProfile />} />
        <Route path="/find-boarding" element={<FindBoarding />} />
        <Route path="/view-boarding" element={<ViewBoarding />} />

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
      />
    </Router>
  );
};

export default App;