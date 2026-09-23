"use client"
import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaFacebook, 
  FaYoutube, 
  FaLinkedin,
  FaPaperPlane
} from 'react-icons/fa';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <section className="py-12 bg-[#0b0f17] text-gray-100 mb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Contact <span className="text-blue-500">Our School</span>
          </h2>
          <p className="mt-2 text-gray-400 text-sm md:text-base">
            Have questions about admission, academics, or school activities? We’re here to help.
          </p>
        </div>

        {/* Main Grid Card Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Contact Info + Integrated Small Map */}
          <div className="lg:col-span-5 bg-[#111827] p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-800 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-400">Contact Information</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">School Address</p>
                    <p className="font-semibold text-gray-200">
                     Mesra, Mechhra, Sirajganj Sadar, Sirajganj, Bangladesh
                         </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
                    <FaPhoneAlt className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone Number</p>
                    <p className="font-semibold text-gray-200">+880 1700-000000</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
                    <FaEnvelope className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email Address</p>
                    <p className="font-semibold text-gray-200">info@schooldomain.edu.bd</p>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="pt-2 flex items-center space-x-3">
                <span className="text-xs text-gray-400">Follow us:</span>
                <a href="#fb" className="p-2 rounded-lg bg-gray-800/80 text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition"><FaFacebook /></a>
                <a href="#yt" className="p-2 rounded-lg bg-gray-800/80 text-gray-300 hover:text-red-400 hover:bg-gray-800 transition"><FaYoutube /></a>
                <a href="#li" className="p-2 rounded-lg bg-gray-800/80 text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition"><FaLinkedin /></a>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="mt-6 rounded-xl overflow-hidden border border-gray-800 h-36 relative">
         <iframe
         title="Mesra High School Location"
       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3627.8056350587867!2d89.7237460748182!3d24.59590315579385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fd95c782925e95%3A0x7ca075383787e4c9!2sMesra%20High%20School%2C%20Sirajganj!5e0!3m2!1sen!2sbd!4v1790186591660!5m2!1sen!2sbd"
       width="100%"
       height="100%"
       style={{
      border: 0,
      filter: "invert(90%) hue-rotate(180deg) brightness(85%)",
    }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="strict-origin-when-cross-origin"
  ></iframe>
</div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-7 bg-[#111827] p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-1 text-white">Send Us a Message</h3>
            <p className="text-xs text-gray-400 mb-6">
              Fill out the form below and our team will get back to you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-sm px-4 py-2.5 bg-[#1f2937] border border-gray-700/70 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="example@mail.com" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-sm px-4 py-2.5 bg-[#1f2937] border border-gray-700/70 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Admission Query / Inquiry" 
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full text-sm px-4 py-2.5 bg-[#1f2937] border border-gray-700/70 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Your Message</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  placeholder="Write your message here..." 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full text-sm px-4 py-2.5 bg-[#1f2937] border border-gray-700/70 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" 
                  required 
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/20 mt-2"
                disabled={loading}
              >
                {!loading && <FaPaperPlane className="text-xs" />}
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Catchy Note */}
        <p className="mt-8 text-center text-xs font-medium text-gray-500 italic">
          "We’d love to hear from you!"
        </p>

      </div>
    </section>
  );
};

export default ContactSection;