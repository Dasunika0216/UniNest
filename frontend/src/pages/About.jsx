import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-white to-ash">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-navy mb-8 text-center underline underline-offset-8 decoration-4 decoration-ash drop-shadow-lg transition-all duration-300">
            About UniNest
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-8 border-navy/80 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <h2 className="text-2xl font-semibold text-navy mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-navy rounded-full mr-2"></span>
              Our Mission
            </h2>
            <p className="text-ash mb-6 leading-relaxed text-lg">
              UniNest is dedicated to connecting university students with safe,
              affordable, and comfortable boarding accommodations. We understand
              the challenges students face when searching for suitable housing
              near their educational institutions.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-8 border-navy/80 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <h2 className="text-2xl font-semibold text-navy mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-navy rounded-full mr-2"></span>
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-ash/10 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-bold text-navy mb-2 underline underline-offset-4 decoration-ash">For Students</h3>
                <ul className="text-ash space-y-1 text-base list-disc list-inside">
                  <li>Wide variety of boarding options</li>
                  <li>Verified listings and hosts</li>
                  <li>Easy search and filtering</li>
                  <li>Secure booking process</li>
                </ul>
              </div>
              <div className="bg-ash/10 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-bold text-navy mb-2 underline underline-offset-4 decoration-ash">For Hosts</h3>
                <ul className="text-ash space-y-1 text-base list-disc list-inside">
                  <li>Simple listing process</li>
                  <li>Reach thousands of students</li>
                  <li>Manage bookings easily</li>
                  <li>Reliable payment system</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-navy/80 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <h2 className="text-2xl font-semibold text-navy mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-navy rounded-full mr-2"></span>
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center bg-ash/10 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-bold text-navy mb-2">Safety</h3>
                <p className="text-ash text-base">
                  We prioritize the safety and security of all our users through
                  verification processes.
                </p>
              </div>
              <div className="text-center bg-ash/10 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-bold text-navy mb-2">Affordability</h3>
                <p className="text-ash text-base">
                  We believe quality accommodation should be accessible to all
                  students.
                </p>
              </div>
              <div className="text-center bg-ash/10 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                <h3 className="text-lg font-bold text-navy mb-2">Community</h3>
                <p className="text-ash text-base">
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
