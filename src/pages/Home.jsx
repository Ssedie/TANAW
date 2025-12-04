const Home = () => {
  return (
    <div className="flex flex-col items-center w-full h-full bg-transparent">
      {/* Hero Section */}
      <section className="w-full bg-[#5C7D92] py-[42px] px-[36px]  flex flex-col justify-center">
        <div className="text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
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

      <div>
        <h1>What You Can Do Here?</h1>
        {/* 4 Feature Boxes */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4">
          {/* Box 1 */}
          <div className="w-[268.12px] h-[447px] bg-gradient-to-b from-[#5C7D92] to-[#D87300] rounded-xl p-6 cursor-pointer text-center transition-shadow hover:shadow-[0_5px_15px_rgba(0,0,0,0.53)] shadow-[0_5px_15px_rgba(0,0,0,0.53)]">
            <h2 className="text-xl font-semibold text-white mb-2">Dashboard</h2>
            <p className="text-gray-200">
              View key metrics and overview of your account.
            </p>
          </div>

          {/* Box 2 */}
          <div className="w-[268.12px] h-[447px] bg-gradient-to-b from-[#5C7D92] to-[#D87300] rounded-xl p-6 cursor-pointer text-center transition-shadow hover:shadow-[0_5px_15px_rgba(0,0,0,0.53)] shadow-[0_5px_15px_rgba(0,0,0,0.53)]">
            <h2 className="text-xl font-semibold text-white mb-2">Projects</h2>
            <p className="text-gray-200">
              Check all projects and their statuses.
            </p>
          </div>

          {/* Box 3 */}
          <div className="w-[268.12px] h-[447px] bg-gradient-to-b from-[#5C7D92] to-[#D87300] rounded-xl p-6 cursor-pointer text-center transition-shadow hover:shadow-[0_5px_15px_rgba(0,0,0,0.53)] shadow-[0_5px_15px_rgba(0,0,0,0.53)]">
            <h2 className="text-xl font-semibold text-white mb-2">Budget</h2>
            <p className="text-gray-200">
              Track your budget allocations and expenses.
            </p>
          </div>

          {/* Box 4 */}
          <div className="w-[268.12px] h-[447px] bg-gradient-to-b from-[#5C7D92] to-[#D87300] rounded-xl p-6 cursor-pointer text-center transition-shadow hover:shadow-[0_5px_15px_rgba(0,0,0,0.53)] shadow-[0_5px_15px_rgba(0,0,0,0.53)]">
            <h2 className="text-xl font-semibold text-white mb-2">Documents</h2>
            <p className="text-gray-200">
              Manage all your important files and documents.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
