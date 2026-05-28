'use client';

import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP } from 'react-icons/fa';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full bg-[#F5F4F9] relative   flex flex-col font-sans overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Get in Touch */}
          <div className="flex flex-col">
            <h3 className="text-[#000000] font-bold text-[17px] mb-6 opacity-90">Get in Touch</h3>
            <p className="text-[#000000] text-[15px] mb-6 leading-relaxed max-w-[280px] opacity-70">
              Don't miss any updates of our new templates and extensions !
            </p>
            <form className="flex flex-col space-y-4 max-w-[260px]">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-[10px] border border-gray-200 rounded text-[14px] text-[#3A3B54] outline-none focus:border-[#6A3EF6] focus:ring-1 focus:ring-[#6A3EF6] transition-colors bg-white shadow-sm"
                required
              />
              <button 
                type="submit" 
                className="bg-[#4E4CBD] text-white px-6 py-[10px] rounded text-[14px] font-medium w-fit hover:bg-[#5b36bd] transition-colors shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Download */}
          <div className="flex flex-col">
            <h3 className="text-[#000000] font-bold text-[17px] mb-6 opacity-90">Download</h3>
            <ul className="space-y-3.5">
              {['Home', 'About', 'Services', 'Contact', 'Projects'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#000000] text-[14.5px] hover:text-[#6A3EF6] transition-colors inline-block opacity-70">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col">
            <h3 className="text-[#000000] font-bold text-[17px] mb-6 opacity-90">Help</h3>
            <ul className="space-y-3.5">
              {['FAQ', 'Term & conditions', 'Reporting', 'Documentation', 'Support Policy', 'Privacy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#000000] text-[14.5px] hover:text-[#6A3EF6] transition-colors inline-block opacity-70">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Team Solutions */}
          <div className="flex flex-col">
            <h3 className="text-[#3A3B54] font-bold text-[17px] mb-6">Team Solutions</h3>
            <div className="flex items-center space-x-3.5">
              <a href="#" className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#8B8D9A] text-white hover:bg-[#6A3EF6] transition-colors">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#8B8D9A] text-white hover:bg-[#6A3EF6] transition-colors">
                <FaTwitter size={14} />
              </a>
              <a href="#" className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#8B8D9A] text-white hover:bg-[#6A3EF6] transition-colors">
                <FaLinkedinIn size={14} />
              </a>
              <a href="#" className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#8B8D9A] text-white hover:bg-[#6A3EF6] transition-colors">
                <FaPinterestP size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Graphic Illustration */}
      <div className="w-full relative flex flex-col pointer-events-none mt-2">
       
        
        {/* Copyright Details */}
        <div className="w-full bg-white relative z-10 2xl:-top-[20px] pointer-events-auto">
           <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 pb-6 pt-3 flex flex-col md:flex-row justify-between items-center text-[13px] text-[#000000] opacity-70">
              <p>© 2026 UI Audit. All rights reserved.</p>
              <p className="mt-2 md:mt-0 font-medium">Made with in <span className="text-[#5D6BCC]">UI Audit</span></p>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
