import React from "react";
import { Target, Eye, Zap, User, Users } from "lucide-react";

const officials = {
  leaders: [
    { name: "Noland Atijera", role: "Barangay Captain", photo: "https://via.placeholder.com/200x150", bio: "Leads the barangay and oversees all projects and operations." },
    { name: "Maria Santos", role: "Barangay Secretary", photo: "https://via.placeholder.com/200x150", bio: "Manages official records, resolutions, and correspondence." },
    { name: "Pedro Reyes", role: "Barangay Treasurer", photo: "https://via.placeholder.com/200x150", bio: "Handles barangay funds, budgeting, and financial reports." },
  ],
  councilors: [
    { name: "Albert Catbagan", role: "Head of Infrastructure", photo: "https://via.placeholder.com/200x150", bio: "Responsible for planning and monitoring infrastructure projects in the barangay." },
    { name: "Rosita Nillo", role: "Head of Budget", photo: "https://via.placeholder.com/200x150", bio: "Oversees barangay budgets and ensures proper allocation of funds." },
    { name: "Gina Lucena", role: "Head of Health and Sanitation", photo: "https://via.placeholder.com/200x150", bio: "Manages health programs and sanitation initiatives in the community." },
    { name: "Ray-An Costales", role: "Head of Agriculture", photo: "https://via.placeholder.com/200x150", bio: "Leads agricultural programs and supports local farmers." },
    { name: "Whenzsi Gaerlan", role: "VAWC (Violence Against Women and Children)", photo: "https://via.placeholder.com/200x150", bio: "Handles cases and programs related to the protection of women and children." },
    { name: "Maria Ducusin", role: "Head of Education", photo: "https://via.placeholder.com/200x150", bio: "Oversees educational programs and promotes learning initiatives in the barangay." },
    { name: "Teody Laigue", role: "Head of Barangay Tanod", photo: "https://via.placeholder.com/200x150", bio: "Supervises community safety and the barangay tanod team." },
  ],
  sk: [
    { name: "Michael Tan", role: "SK Chairperson", photo: "https://via.placeholder.com/200x150", bio: "Represents the youth and implements youth programs." },
    { name: "Angela Reyes", role: "SK Secretary", photo: "https://via.placeholder.com/200x150", bio: "Manages SK records and official youth documentation." },
    { name: "Dennis Lopez", role: "SK Treasurer", photo: "https://via.placeholder.com/200x150", bio: "Handles SK funds and youth program budgets." },
    { name: "Patricia Ramos", role: "SK Kagawad", photo: "https://via.placeholder.com/200x150", bio: "Supports youth sports and educational activities." },
    { name: "John Cruz", role: "SK Kagawad", photo: "https://via.placeholder.com/200x150", bio: "Promotes youth participation in barangay programs." },
    { name: "Sarah Mendoza", role: "SK Kagawad", photo: "https://via.placeholder.com/200x150", bio: "Focuses on youth health and wellness initiatives." },
    { name: "Mark Santos", role: "SK Kagawad", photo: "https://via.placeholder.com/200x150", bio: "Leads youth livelihood and skills development programs." },
    { name: "Lisa Garcia", role: "SK Kagawad", photo: "https://via.placeholder.com/200x150", bio: "Coordinates youth cultural and arts activities." },
    { name: "Ryan Torres", role: "SK Kagawad", photo: "https://via.placeholder.com/200x150", bio: "Advocates for youth environmental projects." },
    { name: "Nina Reyes", role: "SK Kagawad", photo: "https://via.placeholder.com/200x150", bio: "Organizes youth community service initiatives." },
  ],
};

const developers = [
  { name: "Zedric Rulloda", role: "Backend Developer", photo: "https://via.placeholder.com/200x150" },
  { name: "Rhayven Jonas Alano", role: "Frontend Developer", photo: "https://via.placeholder.com/200x150" },
];

const About = () => {
  const renderOfficialCard = (official, isLarge = false) => (
    <div
      key={official.name}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative ${isLarge ? 'h-96' : 'h-80'}`}
    >
      <div className={`relative w-full ${isLarge ? 'h-56' : 'h-48'} overflow-hidden bg-gradient-to-br from-[#5C7D92] to-[#FF6404] flex items-center justify-center`}>
        <User size={isLarge ? 80 : 64} className="text-white/80" strokeWidth={1.5} />
      </div>
      
      <div className={`p-6 text-center flex flex-col justify-center ${isLarge ? 'h-40' : 'h-32'}`}>
        <h4 className={`font-bold ${isLarge ? 'text-2xl' : 'text-lg'} text-[#FF6404]`}>{official.name}</h4>
        <p className={`text-gray-600 ${isLarge ? 'text-base' : 'text-sm'}`}>{official.role}</p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#FF6404]/95 to-[#FF6404]/80 text-white p-4 rounded-2xl flex items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-medium">{official.bio}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Intro */}
      <section className="w-full bg-gradient-to-r from-[#5C7D92] to-[#FF6404] py-16 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            About Tanaw
          </h1>
          <p className="text-lg text-gray-100 mb-4 leading-relaxed">
            Tanaw is a digital platform designed to promote transparency, accountability, and accessibility in barangay governance. Specifically developed for Barangay Taboc, San Juan, La Union, the system provides citizens and barangay officials with a convenient way to view, manage, and track barangay budgets, projects, and documents.
          </p>
          <p className="text-lg text-gray-100 leading-relaxed">
            Through Tanaw, citizens can now stay informed about how funds are allocated and utilized, while officials can efficiently organize and publish important barangay records—all in one secure, centralized system.
          </p>
        </div>
      </section>

      {/* Mission & Vision & Purpose */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-l-4 border-[#5C7D92]">
            <div className="flex items-center gap-3 mb-4">
              <Target size={32} className="text-[#5C7D92]" />
              <h2 className="text-2xl font-bold text-[#5C7D92]">Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "A transparent, accountable, and digitally empowered barangay where citizens and officials work hand in hand for progress."
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-l-4 border-[#FF6404]">
            <div className="flex items-center gap-3 mb-4">
              <Eye size={32} className="text-[#FF6404]" />
              <h2 className="text-2xl font-bold text-[#FF6404]">Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "To provide an accessible and reliable platform that enhances public awareness and promotes honesty in barangay budgeting."
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-l-4 border-[#FF6404]">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={32} className="text-[#FF6404]" />
              <h2 className="text-2xl font-bold text-[#FF6404]">Purpose</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Digitize barangay record management and improve public transparency through a user-friendly web application for all.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-12 bg-gray-100 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-[#5C7D92] mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-[#FF6404] mb-2">For Officials</h4>
              <p className="text-gray-700 text-sm">
                Plan, organize, and monitor barangay projects and budgets. Streamline document management and ensure accountability in governance.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-[#FF6404] mb-2">For Citizens</h4>
              <p className="text-gray-700 text-sm">
                Stay informed about community projects, review approved budgets, and track barangay initiatives in real time. Access detailed reports on projects and funding allocation, submit feedback, and actively participate in decision-making processes. Receive notifications on new updates, events, and barangay activities to stay connected and engaged.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-[#FF6404] mb-2">For Admins</h4>
              <p className="text-gray-700 text-sm">
                Oversee system operations, manage user accounts, and maintain the security and accuracy of barangay data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Officials Hierarchy */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-[#5C7D92] mb-4">
          Barangay Taboc Officials
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Meet the dedicated leaders serving our community
        </p>

        {/* Barangay Captain - Highlighted */}
        <div className="mb-16">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {renderOfficialCard(officials.leaders[0], true)}
            </div>
          </div>
        </div>

        {/* Secretary & Treasurer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {officials.leaders.slice(1).map(official => renderOfficialCard(official))}
        </div>

        {/* Councilors */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-[#5C7D92] mb-2">Sangguniang Barangay</h3>
            <div className="w-24 h-1 bg-[#FF6404] mx-auto"></div>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
              {officials.councilors.map(official => renderOfficialCard(official))}
            </div>
          </div>
        </div>

        {/* SK Officials */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-[#5C7D92] mb-2">Sangguniang Kabataan</h3>
            <div className="w-24 h-1 bg-[#FF6404] mx-auto"></div>
          </div>
          
          {/* SK Chairman */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-xs">
              {renderOfficialCard(officials.sk[0])}
            </div>
          </div>

          {/* SK Secretary & Treasurer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
            {officials.sk.slice(1, 3).map(official => renderOfficialCard(official))}
          </div>

          {/* SK Kagawad */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {officials.sk.slice(3).map(official => renderOfficialCard(official))}
            </div>
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="max-w-5xl mx-auto px-6 py-16 bg-white">
        <h2 className="text-4xl font-bold text-[#5C7D92] text-center mb-4">
          Development Team
        </h2>
        <p className="text-center text-gray-600 mb-12">
          The minds behind Tanaw
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#5C7D92] to-[#FF6404] flex items-center justify-center">
                <Users size={64} className="text-white/80" strokeWidth={1.5} />
              </div>
              <div className="p-8 text-center">
                <h3 className="font-bold text-xl text-[#5C7D92] mb-2">{dev.name}</h3>
                <p className="text-[#FF6404] font-semibold">{dev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inspirational Quote */}
      <section className="w-full bg-gradient-to-r from-[#5C7D92] to-[#FF6404] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-6xl text-white/30 font-serif">"</span>
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8">
            Transparency is the foundation of trust, and trust is the foundation of progress.
          </blockquote>
          <p className="text-lg text-white/90 font-light">
            Together, we build a better community
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;