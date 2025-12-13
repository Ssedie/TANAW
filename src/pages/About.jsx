import React from "react";
import { Target, Eye, Zap } from "lucide-react";

const officials = {
  leaders: [
    { name: "Juan Dela Cruz", role: "Barangay Captain", photo: "https://via.placeholder.com/200x150", bio: "Leads the barangay and oversees all projects and operations." },
    { name: "Maria Santos", role: "Barangay Secretary", photo: "https://via.placeholder.com/200x150", bio: "Manages official records, resolutions, and correspondence." },
    { name: "Pedro Reyes", role: "Barangay Treasurer", photo: "https://via.placeholder.com/200x150", bio: "Handles barangay funds, budgeting, and financial reports." },
  ],
  councilors: [
    { name: "Ana Lopez", role: "Councilor", photo: "https://via.placeholder.com/200x150", bio: "Supports community projects and local legislation." },
    { name: "Carlos Ramos", role: "Councilor", photo: "https://via.placeholder.com/200x150", bio: "Responsible for health and sanitation programs." },
    { name: "Liza Mendoza", role: "Councilor", photo: "https://via.placeholder.com/200x150", bio: "Focuses on education and youth programs." },
    { name: "Rafael Cruz", role: "Councilor", photo: "https://via.placeholder.com/200x150", bio: "Works on infrastructure and public safety." },
    { name: "Gloria Santos", role: "Councilor", photo: "https://via.placeholder.com/200x150", bio: "Oversees livelihood and community development projects." },
  ],
  sk: [
    { name: "Michael Tan", role: "SK Chairperson", photo: "https://via.placeholder.com/200x150", bio: "Represents the youth and implements youth programs." },
    { name: "Angela Reyes", role: "SK Councilor", photo: "https://via.placeholder.com/200x150", bio: "Supports youth development initiatives." },
    { name: "Dennis Lopez", role: "SK Councilor", photo: "https://via.placeholder.com/200x150", bio: "Focuses on youth sports and educational activities." },
    { name: "Patricia Ramos", role: "SK Councilor", photo: "https://via.placeholder.com/200x150", bio: "Encourages youth participation in barangay governance." },
  ],
};

const developers = [
  { name: "Rhayven Alano", role: "Frontend Developer", photo: "https://via.placeholder.com/200x150" },
  { name: "Zedric Rulloda", role: "Backend Developer", photo: "https://via.placeholder.com/200x150" },
];

const About = () => {
  const renderOfficialCard = (official) => (
    <div
      key={official.name}
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col items-center group relative h-full"
    >
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={official.photo}
          alt={official.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 text-center flex-1 flex flex-col justify-center w-full">
        <h4 className="font-bold text-lg text-[#FF6404]">{official.name}</h4>
        <p className="text-gray-600 text-sm">{official.role}</p>
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
            Tanaw is a digital platform designed to promote transparency, accountability, and accessibility in barangay governance. Specifically developed for Barangay Taboc, Calasiao, Ilocos Sur, the system provides citizens and barangay officials with a convenient way to view, manage, and track barangay budgets, projects, and documents.
          </p>
          <p className="text-lg text-gray-100 leading-relaxed">
            Through Tanaw, citizens can now stay informed about how funds are allocated and utilized, while officials can efficiently organize and publish important barangay records—all in one secure, centralized system.
          </p>
        </div>
      </section>

      {/* Mission & Vision & Purpose */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-l-4 border-[#5C7D92]">
            <div className="flex items-center gap-3 mb-4">
              <Target size={32} className="text-[#5C7D92]" />
              <h2 className="text-2xl font-bold text-[#5C7D92]">Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "A transparent, accountable, and digitally empowered barangay where citizens and officials work hand in hand for progress."
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-l-4 border-[#FF6404]">
            <div className="flex items-center gap-3 mb-4">
              <Eye size={32} className="text-[#FF6404]" />
              <h2 className="text-2xl font-bold text-[#FF6404]">Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "To provide an accessible and reliable platform that enhances public awareness and promotes honesty in barangay budgeting."
            </p>
          </div>

          {/* Purpose */}
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
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-bold text-[#FF6404] mb-2">For Officials</h4>
              <p className="text-gray-700 text-sm">Upload and manage budget proposals, projects, and documents efficiently.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-bold text-[#FF6404] mb-2">For Citizens</h4>
              <p className="text-gray-700 text-sm">Access approved budgets, read project details, and provide valuable feedback.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-bold text-[#FF6404] mb-2">For Admins</h4>
              <p className="text-gray-700 text-sm">Monitor activity, approve accounts, and maintain data integrity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Officials Hierarchy */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-5xl font-bold text-center text-[#5C7D92] mb-12">
          Barangay Taboc Officials
        </h2>

        {/* Barangay Captain */}
        <div className="flex justify-center mb-16">
          <div className="w-full max-w-xs">
            {renderOfficialCard(officials.leaders[0])}
          </div>
        </div>

        {/* Secretary & Treasurer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
          {officials.leaders.slice(1).map(renderOfficialCard)}
        </div>

        {/* Councilors */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-[#5C7D92] text-center mb-8">Sangguniang Barangay Councilors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {officials.councilors.map(renderOfficialCard)}
          </div>
        </div>

        {/* SK Officials */}
        <div>
          <h3 className="text-3xl font-bold text-[#5C7D92] text-center mb-8">SK Officials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {officials.sk.map(renderOfficialCard)}
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-[#5C7D92] text-center mb-12">
          Development Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={dev.photo}
                  alt={dev.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-lg text-[#FF6404]">{dev.name}</h3>
                <p className="text-gray-600 text-sm">{dev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;