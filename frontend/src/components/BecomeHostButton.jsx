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
        className="bg-navy text-white font-semibold px-6 py-2 rounded border-4 border-white shadow-lg mx-2 hover:bg-white hover:text-navy hover:border-navy transition-colors duration-200 border-navy transition"
        onClick={handleAddBoarding}
      >
        Add Boarding Place
      </button>
      {token && (
        <>
          <button
            className="bg-navy text-white font-semibold px-6 py-2 rounded shadow border-2 border-ash hover:bg-white hover:text-navy hover:border-navy transition-colors duration-200"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          {showSignOutPrompt && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center border border-ash">
                <h3 className="text-lg font-semibold mb-2 text-navy">Sign Out?</h3>
                <p className="mb-4 text-ash">Are you sure you want to sign out?</p>
                <div className="flex justify-between gap-4 mt-4">
                  <button
                    className="flex-1 bg-navy text-white py-2 rounded border-2 border-navy hover:bg-white hover:text-navy hover:border-navy font-bold transition-colors duration-200"
                    onClick={confirmSignOut}
                  >
                    Yes
                  </button>
                  <button
                    className="flex-1 bg-ash text-navy py-2 rounded border-2 border-ash hover:bg-white hover:text-navy hover:border-navy font-bold transition-colors duration-200"
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