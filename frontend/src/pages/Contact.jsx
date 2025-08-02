import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="contact-title text-4xl font-bold text-navy mb-8 text-center">
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="contact-info-card bg-ash rounded-lg shadow-lg p-8 transform hover:scale-105 transition-all duration-300">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div
                  className="contact-item opacity-0 animate-fadeInUp"
                  style={{
                    animationDelay: "0.1s",
                    animationFillMode: "forwards",
                  }}
                >
                  <h3 className="text-lg font-medium text-navy mb-2">Email</h3>
                  <p className="text-navy/70 hover:text-navy transition-colors duration-200">
                    support@uninest.com
                  </p>
                </div>

                <div
                  className="contact-item opacity-0 animate-fadeInUp"
                  style={{
                    animationDelay: "0.2s",
                    animationFillMode: "forwards",
                  }}
                >
                  <h3 className="text-lg font-medium text-navy mb-2">Phone</h3>
                  <p className="text-navy/70 hover:text-navy transition-colors duration-200">
                    +94 11 234 5678
                  </p>
                </div>

                <div
                  className="contact-item opacity-0 animate-fadeInUp"
                  style={{
                    animationDelay: "0.3s",
                    animationFillMode: "forwards",
                  }}
                >
                  <h3 className="text-lg font-medium text-navy mb-2">
                    Address
                  </h3>
                  <p className="text-navy/70 hover:text-navy transition-colors duration-200">
                    University of Moratuwa
                    <br />
                    Bandaranayake Mawatha, Moratuwa 10400
                    <br />
                    Sri Lanka
                  </p>
                </div>

                <div
                  className="contact-item opacity-0 animate-fadeInUp"
                  style={{
                    animationDelay: "0.4s",
                    animationFillMode: "forwards",
                  }}
                >
                  <h3 className="text-lg font-medium text-navy mb-2">
                    Business Hours
                  </h3>
                  <p className="text-navy/70 hover:text-navy transition-colors duration-200">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 9:00 AM - 2:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-card bg-white rounded-lg shadow-lg p-8 border border-ash transform hover:scale-105 transition-all duration-300">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div
                  className="form-group opacity-0 animate-slideInRight"
                  style={{
                    animationDelay: "0.1s",
                    animationFillMode: "forwards",
                  }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-ash rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-navy transform focus:scale-105 transition-all duration-200"
                  />
                </div>

                <div
                  className="form-group opacity-0 animate-slideInRight"
                  style={{
                    animationDelay: "0.2s",
                    animationFillMode: "forwards",
                  }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-ash rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-navy transform focus:scale-105 transition-all duration-200"
                  />
                </div>

                <div
                  className="form-group opacity-0 animate-slideInRight"
                  style={{
                    animationDelay: "0.3s",
                    animationFillMode: "forwards",
                  }}
                >
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-ash rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-navy transform focus:scale-105 transition-all duration-200"
                  />
                </div>

                <div
                  className="form-group opacity-0 animate-slideInRight"
                  style={{
                    animationDelay: "0.4s",
                    animationFillMode: "forwards",
                  }}
                >
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-ash rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-navy transform focus:scale-105 transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button w-full bg-navy text-white font-medium py-2 px-4 rounded-md hover:bg-navy/90 transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 animate-slideInRight"
                  style={{
                    animationDelay: "0.5s",
                    animationFillMode: "forwards",
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        /* Simple fade in animation for title */
        .contact-title {
          animation: fadeInDown 0.8s ease-out;
        }

        /* Hover effects for cards */
        .contact-info-card:hover,
        .contact-form-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Custom animations */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Animation classes */
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .contact-info-card:hover,
          .contact-form-card:hover {
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
