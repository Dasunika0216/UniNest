import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-[#fdfde3]">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            About UniNest
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              UniNest is dedicated to connecting university students with safe,
              affordable, and comfortable boarding accommodations. We understand
              the challenges students face when searching for suitable housing
              near their educational institutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  For Students
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Wide variety of boarding options</li>
                  <li>• Verified listings and hosts</li>
                  <li>• Easy search and filtering</li>
                  <li>• Secure booking process</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  For Hosts
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Simple listing process</li>
                  <li>• Reach thousands of students</li>
                  <li>• Manage bookings easily</li>
                  <li>• Reliable payment system</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Safety
                </h3>
                <p className="text-gray-600 text-sm">
                  We prioritize the safety and security of all our users through
                  verification processes.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Affordability
                </h3>
                <p className="text-gray-600 text-sm">
                  We believe quality accommodation should be accessible to all
                  students.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Community
                </h3>
                <p className="text-gray-600 text-sm">
                  Building connections between students and hosts to create a
                  supportive community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
