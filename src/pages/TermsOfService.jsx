import { ChevronRight } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5C7D92] to-[#FF6404] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-gray-100">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing and using the Tanaw platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">2. Use License</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on Tanaw for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="space-y-2 text-gray-700 ml-4">
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>Modify or copy the materials</span>
            </li>
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>Use the materials for any commercial purpose or for any public display</span>
            </li>
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>Attempt to reverse engineer, decompile, or disassemble any software contained on the platform</span>
            </li>
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>Remove any copyright or other proprietary notations from the materials</span>
            </li>
            <li className="flex gap-3">
              <ChevronRight size={20} className="text-[#FF6404] flex-shrink-0" />
              <span>Transfer the materials to another person or "mirror" the materials on any other server</span>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">3. Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed">
            The materials on Tanaw's platform are provided on an 'as is' basis. Tanaw makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">4. Limitations</h2>
          <p className="text-gray-700 leading-relaxed">
            In no event shall Tanaw or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Tanaw's platform.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">5. Accuracy of Materials</h2>
          <p className="text-gray-700 leading-relaxed">
            The materials appearing on Tanaw's platform could include technical, typographical, or photographic errors. Tanaw does not warrant that any of the materials on its platform are accurate, complete, or current. Tanaw may make changes to the materials contained on its platform at any time without notice.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">6. Links</h2>
          <p className="text-gray-700 leading-relaxed">
            Tanaw has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Tanaw of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">7. Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            Tanaw may revise these terms of service for its platform at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">8. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of the Philippines, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#5C7D92] mb-4">9. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="p-4 bg-gray-50 rounded border-l-4 border-[#FF6404]">
            <p className="text-gray-700"><strong>Email:</strong> support@tanaw.gov.ph</p>
            <p className="text-gray-700"><strong>Address:</strong> Barangay Taboc, San Juan, La Union</p>
            <p className="text-gray-700"><strong>Phone:</strong> +63 (912) 345-6789</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;