const Home = () => {
  return (
    <div className="flex flex-col items-center w-full h-full bg-transparent">
      {/* Hero Section */}
      <section className="w-full bg-[#5C7D92] py-[42px] px-[36px] flex flex-col justify-center">
        <div className="text-left">
          <h1 className="text-[42px] font-bold text-white mb-4">
            Let the Transparency Start Here
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-6">
            Tanaw brings barangay budgets and project updates directly to your
            community. Real-time transparency, real impact, real accountability.
          </p>
          <button className="h-[55px] w-[211px] text-[20px] bg-white text-black font-semibold rounded-[20px] hover:bg-gray-200 transition-colors duration-200">
            Learn More
          </button>
        </div>
      </section>

      <div className="mt-[58px] w-full max-w-6xl px-4">
        <h1 className="font-bold text-[51px] text-center mb-[24px] mt-[16px]">
          What You Can Do Here?
        </h1>

        {/* 4 Feature Boxes */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">

          {/* Box 1 */}
          <div className="group w-[268px] h-[447px] bg-gradient-to-b from-[#5C7D92] to-[#D87300]
            rounded-xl p-6 cursor-pointer relative flex flex-col items-center justify-center overflow-hidden
            transition-shadow duration-500 hover:shadow-[0_5px_15px_rgba(0,0,0,0.53)]">

            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24"
              className="mb-4 text-white transition-opacity duration-500 group-hover:opacity-0">
              <path fill="#fff" d="M12.925 11.05L8.675 6.8L10.1 5.4l2.825 2.825l5.675-5.65l1.4 1.4l-7.075 7.075ZM14 22.5l-7-1.95V22H1V11h7.95l6.2 2.3q.825.3 1.337 1.05T17 16h2q1.25 0 2.125.825T22 19v1l-8 2.5ZM3 20h2v-7H3v7Z"/>
            </svg>

            <h2 className="absolute bottom-24 group-hover:top-6 text-[21px] font-bold text-white text-center
              transition-all duration-500">
              View Approved Budgets
            </h2>

            <p className="absolute top-28 px-4 text-white text-[13px] text-justify opacity-0
              transition-opacity duration-500 group-hover:opacity-100">
              Gain easy access to officially approved and signed Barangay Taboc budget proposals. This feature allows citizens to clearly see how community funds are planned, allocated, and distributed across various programs and initiatives. By viewing detailed breakdowns of income, expenses, and fund utilization, residents can better understand how their barangay’s financial decisions support local development and day-to-day operations.
            </p>
          </div>

          {/* Box 2 */}
          <div className="group w-[268px] h-[447px] bg-gradient-to-b from-[#5C7D92] to-[#D87300]
            rounded-xl p-6 cursor-pointer relative flex flex-col items-center justify-center overflow-hidden
            transition-shadow duration-500 hover:shadow-[0_5px_15px_rgba(0,0,0,0.53)]">

            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24"
              className="mb-4 text-white transition-opacity duration-500 group-hover:opacity-0">
              <path fill="#fff" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2h.25q.325 0 .537.213T13 2.75v7.525q.45.275.725.713T14 12q0 .825-.588 1.413T12 14q-.825 0-1.413-.588T10 12q0-.575.275-1.025t.725-.7v-2.15q-1.3.35-2.15 1.413T8 12q0 1.65 1.175 2.825T12 16q1.65 0 2.825-1.175T16 12q0-.575-.163-1.137T15.35 9.8q-.225-.35-.187-.688t.287-.587q.3-.3.763-.3t.737.4q.55.8.8 1.663T18 12q0 2.5-1.75 4.25T12 18q-2.5 0-4.25-1.75T6 12q0-2.25 1.425-3.913T11 6.075V4.05q-2.975.375-4.988 2.625T4 12q0 3.35 2.325 5.675T12 20q3.35 0 5.675-2.325T20 12q0-1.475-.425-2.65t-1.2-2.175q-.275-.35-.263-.75t.313-.7q.3-.3.713-.3t.662.325q1.05 1.275 1.625 2.825T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/>
            </svg>

            <h2 className="absolute bottom-24 group-hover:top-6 text-[21px] font-bold text-white text-center
              transition-all duration-500 delay-75">
              Track Projects & Status
            </h2>

            <p className="absolute top-28 px-4 text-white text-[13px] text-justify opacity-0
              transition-opacity duration-500 delay-75 group-hover:opacity-100">
              Stay informed about all ongoing and completed projects within the barangay. This section provides comprehensive project details, including descriptions, timelines, budget allocation, and real-time status updates. Whether you’re checking if a road improvement is underway or reviewing the progress of a community program, this feature ensures that every resident is aware of how approved funds are being transformed into visible results.
            </p>
          </div>

          {/* Box 3 */}
          <div className="group w-[268px] h-[447px] bg-gradient-to-b from-[#5C7D92] to-[#D87300]
            rounded-xl p-6 cursor-pointer relative flex flex-col items-center justify-center overflow-hidden
            transition-shadow duration-500 hover:shadow-[0_5px_15px_rgba(0,0,0,0.53)]">

            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24"
              className="mb-4 text-white transition-opacity duration-500 group-hover:opacity-0">
              <path fill="#fff" d="M5 4v6.025V10v10zv5zm0 18q-.825 0-1.412-.587T3 20V4q0-.825.588-1.412T5 2h8l6 6v2.5q-.475-.2-.975-.312T17 10.025V9h-5V4H5v16h6.025q.4.6.9 1.113t1.1.887zm11.5-3q1.05 0 1.775-.725T19 16.5t-.725-1.775T16.5 14t-1.775.725T14 16.5t.725 1.775T16.5 19m5.1 4l-2.7-2.7q-.525.35-1.137.525T16.5 21q-1.875 0-3.187-1.312T12 16.5t1.313-3.187T16.5 12t3.188 1.313T21 16.5q0 .65-.175 1.263T20.3 18.9l2.7 2.7z"/>
            </svg>

            <h2 className="absolute bottom-24 group-hover:top-6 text-[21px] font-bold text-white text-center
              transition-all duration-500 delay-150">
              Access Related Documents
            </h2>

            <p className="absolute top-28 px-4 text-white text-[13px] text-justify opacity-0
              transition-opacity duration-500 delay-150 group-hover:opacity-100">
              Explore a centralized collection of documents linked to each budget and project. From project proposals and implementation plans to financial reports and completion summaries, this feature gives both citizens and officials an organized and accessible repository of essential records. With documents presented clearly and securely, transparency becomes easier and more meaningful for everyone.
            </p>
          </div>

          {/* Box 4 */}
          <div className="group w-[268px] h-[447px] bg-gradient-to-b from-[#5C7D92] to-[#D87300]
            rounded-xl p-6 cursor-pointer relative flex flex-col items-center justify-center overflow-hidden
            transition-shadow duration-500 hover:shadow-[0_5px_15px_rgba(0,0,0,0.53)]">

            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24"
              className="mb-4 text-white transition-opacity duration-500 group-hover:opacity-0">
              <path fill="#fff" d="M12 15q.425 0 .713-.288T13 14q0-.425-.288-.713T12 13q-.425 0-.713.288T11 14q0 .425.288.713T12 15Zm-1-4h2V5h-2v6ZM2 22V4q0-.825.588-1.413T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.588 1.413T20 18H6l-4 4Zm3.15-6H20V4H4v13.125L5.15 16ZM4 16V4v12Z"/>
            </svg>

            <h2 className="absolute bottom-24 group-hover:top-6 text-[21px] font-bold text-white text-center
              transition-all duration-500 delay-200">
              Submit Feedback
            </h2>

            <p className="absolute top-28 px-4 text-white text-[13px] text-justify opacity-0
              transition-opacity duration-500 delay-200 group-hover:opacity-100">
              Participate in barangay governance by sharing your comments, insights, and concerns within the specific project. This feature allows citizens to provide feedback that helps officials make informed decisions, address community needs, and improve project execution. By collecting feedback directly under each project, Tanaw ensures that community voices are heard where they matter most—right at the heart of every initiative.
            </p>
          </div>

        </section>
      </div>
    </div>
  );
};

export default Home;
