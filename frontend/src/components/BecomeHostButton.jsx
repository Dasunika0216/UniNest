import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BecomeHostButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showSignOutPrompt, setShowSignOutPrompt] = useState(false);

  const handleAddBoarding = () => {
    if (token) {
      navigate('/host-profile');
    } else {
      navigate('/sign-in');
    }
  };

  const handleSignOut = () => {
    setShowSignOutPrompt(true);
  };

  const confirmSignOut = () => {
    localStorage.removeItem('token');
    toast.success('Signed out successfully!');
    setShowSignOutPrompt(false);
    navigate('/');
  };

  return (
    <div className="flex gap-3 items-center">
      <button
        className="bg-amber-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-amber-700 transition-colors duration-200"
        onClick={handleAddBoarding}
      >
        Add Boarding Place
      </button>
      {token && (
        <>
          <button
            className="bg-red-500 text-white font-semibold px-6 py-2 rounded shadow hover:bg-red-600 transition-colors duration-200"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          {showSignOutPrompt && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Sign Out?</h3>
                <p className="mb-4 text-gray-600">Are you sure you want to sign out?</p>
                <div className="flex justify-between gap-4 mt-4">
                  <button
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 font-bold"
                    onClick={confirmSignOut}
                  >
                    Yes
                  </button>
                  <button
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 font-bold"
                    onClick={() => setShowSignOutPrompt(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BecomeHostButton; 