import React from "react";

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
      className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center group relative"
    >
      <img
        src={official.photo}
        alt={official.name}
        className="w-full h-40 object-cover mb-4 rounded-lg"
      />
      <h4 className="font-bold text-lg text-[#FF6404]">{official.name}</h4>
      <p className="text-gray-600 text-sm">{official.role}</p>
      <div className="absolute inset-0 bg-[#FF6404]/90 text-white p-4 rounded-2xl flex items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm">{official.bio}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-6 space-y-6 ">

      {/* Hero / Intro */}
<section className="w-full bg-[#475C68] py-8 px-8 rounded-2xl text-left shadow-md hover:shadow-2xl transition-shadow duration-300">
  <h1 className="text-5xl font-bold text-white mb-4">
    About Tanaw: Barangay Budget and Transparency App
  </h1>
  <p className="text-gray-200 text-lg">
    Tanaw is a digital platform designed to promote transparency, accountability, and accessibility in barangay governance. Specifically developed for Barangay Taboc, San Juan, La Union, the system provides citizens and barangay officials with a convenient way to view, manage, and track barangay budgets, projects, and documents.
  </p>
  <p className="text-gray-200 text-lg mt-4">
    Through Tanaw, citizens can now stay informed about how funds are allocated and utilized, while officials can efficiently organize and publish important barangay records—all in one secure, centralized system.
  </p>
</section>

{/* Mission & Vision */}
<section className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
  <div className="bg-gradient-to-b from-[#475C68] to-[#5C7D92] p-6 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Mission</h2>
    <p className="text-white text-lg pl-2">
      “A transparent, accountable, and digitally empowered barangay where citizens and officials work hand in hand for progress.”
    </p>
  </div>
  <div className="bg-gradient-to-b from-[#475C68] to-[#5C7D92] p-6 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Vision</h2>
    <p className="text-white text-lg pl-2">
      “To provide an accessible and reliable platform that enhances public awareness and promotes honesty in barangay budgeting and project implementation.”
    </p>
  </div>
</section>

{/* Purpose */}
<section className="w-full bg-gradient-to-b from-[#5C7D92] via-[#FFFFFF] to-[#D87300] p-8 rounded-2xl shadow-md mt-8 hover:shadow-2xl transition-shadow duration-300">
  <h2 className="text-3xl font-bold text-left mb-4">Purpose</h2>
  <p className="mb-4 text-lg text-left">
    <strong>Tanaw</strong> aims to digitize barangay record management and improve public transparency by providing a user-friendly web application where:
  </p>

  <ul className="list-disc list-inside text-left text-lg pl-4">
    <li className="mb-2">
      <strong>Officials</strong> can upload and manage budget proposals, projects, and documents.
    </li>
    <li className="mb-2">
      <strong>Citizens</strong> can access approved budgets, read project details, and give feedback.
    </li>
    <li className="mb-2">
      <strong>Admins</strong> can monitor user activity, approve accounts, and maintain data integrity.
    </li>
  </ul>
</section>



      {/* Officials Hierarchy */}
      <section>
        <h2 className="text-6xl font-black text-[#D87300] text-center shadow-sm-black mt-8 mb-12">
          Brgy. Taboc Officials
        </h2>

        {/* Captain at the top */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-xs sm:max-w-sm">
            {renderOfficialCard(officials.leaders[0])}
          </div>
        </div>

        {/* Secretary & Treasurer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center mb-12 max-w-4xl mx-auto">
          {officials.leaders.slice(1).map(renderOfficialCard)}
        </div>

        {/* Councilors */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-[#5C7D92] text-center mb-8">Councilors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {officials.councilors.map(renderOfficialCard)}
          </div>
        </div>

        {/* SK Officials */}
        <div>
          <h3 className="text-3xl font-bold text-[#5C7D92] text-center mb-8">SK Officials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {officials.sk.map(renderOfficialCard)}
          </div>
        </div>
      </section>


      {/* Developers */}
      <section>
        <h2 className="text-4xl font-bold text-[#5C7D92] text-center mb-12">
          Developers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center"
            >
              <img
                src={dev.photo}
                alt={dev.name}
                className="w-full h-40 object-cover mb-4 rounded-lg"
              />
              <h3 className="font-bold text-lg text-[#FF6404]">{dev.name}</h3>
              <p className="text-gray-600 text-sm">{dev.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
