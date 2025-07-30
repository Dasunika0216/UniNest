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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast.success("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-navy mb-8 text-center">
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-ash rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-navy mb-2">
                    Email
                  </h3>
                  <p className="text-navy/70">support@uninest.com</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-navy mb-2">
                    Phone
                  </h3>
                  <p className="text-navy/70">+94 11 234 5678</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-navy mb-2">
                    Address
                  </h3>
                  <p className="text-navy/70">
                    123 University Lane
                    <br />
                    Colombo 00700
                    <br />
                    Sri Lanka
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-navy mb-2">
                    Business Hours
                  </h3>
                  <p className="text-navy/70">
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
            <div className="bg-white rounded-lg shadow-lg p-8 border border-ash">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
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
                    className="w-full px-3 py-2 border border-ash rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-navy"
                  />
                </div>

                <div>
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
                    className="w-full px-3 py-2 border border-ash rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-navy"
                  />
                </div>

                <div>
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
                    className="w-full px-3 py-2 border border-ash rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-navy"
                  />
                </div>

                <div>
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
                    className="w-full px-3 py-2 border border-ash rounded-md focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-navy"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-navy text-white font-medium py-2 px-4 rounded-md hover:bg-navy/90 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
