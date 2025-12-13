import { ChevronRight } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5C7D92] to-[#FF6404] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-100">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Tanaw ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">2. Information We Collect</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <p className="leading-relaxed">We may collect personal information such as your name, email address, phone number, address, and user ID when you register for an account or submit forms.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
              <p className="leading-relaxed">We automatically collect certain information about your device and how you interact with our platform, including IP address, browser type, pages visited, and time spent on pages.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Cookies and Tracking Technologies</h3>
              <p className="leading-relaxed">We use cookies and similar tracking technologies to enhance your experience and understand how you use our platform.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">3. How We Use Your Information</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>To create and manage your account</span>
            </li>
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>To provide and improve our services</span>
            </li>
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>To communicate with you about updates and changes</span>
            </li>
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>To analyze usage patterns and improve user experience</span>
            </li>
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>To comply with legal obligations</span>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">4. Data Security</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is completely secure.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">5. Third-Party Sharing</h2>
          <p className="text-gray-700 leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share information only with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You have the right to access, update, or delete your personal information at any time. You can contact us using the information provided at the end of this policy to exercise these rights.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">7. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="p-4 bg-gray-50 rounded border-l-4 border-[#FF6404]">
            <p className="text-gray-700"><strong>Email:</strong> privacy@tanaw.gov.ph</p>
            <p className="text-gray-700"><strong>Address:</strong> Barangay Taboc, Calasiao, Ilocos Sur</p>
            <p className="text-gray-700"><strong>Phone:</strong> +63 (912) 345-6789</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;