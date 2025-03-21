import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold">JobSync</h2>
          <p className="mt-2 text-gray-400">
            Connecting top freelancers with the best job opportunities. Grow your career with JobSync.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li><Link to="/jobs" className="hover:text-white">Find Jobs</Link></li>
            <li><Link to="/post-job" className="hover:text-white">Post a Job</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold">Support</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li><Link to="/help-center" className="hover:text-white">Help Center</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="mt-2 text-gray-400">Email: support@jobsync.com</p>
          <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-white"><FaFacebookF size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaLinkedinIn size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 text-center text-gray-500 text-sm py-4">
        © {new Date().getFullYear()} JobSync. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
