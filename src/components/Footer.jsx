import { Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="src/assets/logo.png" alt="Tanaw Logo" className="h-12 w-12 rounded-lg" />
              <h3 className="text-2xl font-bold text-white">Tanaw</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bringing transparency and accountability to Barangay Taboc through real-time budget and project updates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/home" className="text-gray-400 hover:text-[#FF6404] transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/projects" className="text-gray-400 hover:text-[#FF6404] transition-colors duration-200">
                  Projects
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-[#FF6404] transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="/documents" className="text-gray-400 hover:text-[#FF6404] transition-colors duration-200">
                  Documents
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#FF6404] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">Barangay Taboc, San Juan, La Union </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF6404] flex-shrink-0" />
                <a href="tel:+639123456789" className="text-sm text-gray-400 hover:text-[#FF6404] transition-colors duration-200">
                  +63 (912) 345-6789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#FF6404] flex-shrink-0" />
                <a href="mailto:info@tanaw.gov.ph" className="text-sm text-gray-400 hover:text-[#FF6404] transition-colors duration-200">
                  info@tanaw.gov.ph
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5C7D92] hover:bg-[#FF6404] p-3 rounded-full transition-colors duration-200 transform hover:scale-110"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5C7D92] hover:bg-[#FF6404] p-3 rounded-full transition-colors duration-200 transform hover:scale-110"
                title="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:info@tanaw.gov.ph"
                className="bg-[#5C7D92] hover:bg-[#FF6404] p-3 rounded-full transition-colors duration-200 transform hover:scale-110"
                title="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-8"></div>

        {/* Bottom Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Tanaw. All rights reserved. Barangay Taboc, Calasiao, Ilocos Sur.
          </p>
          <div className="flex gap-4 justify-center md:justify-end text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-[#FF6404] transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-[#FF6404] transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;