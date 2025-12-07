const Landing = () => {
  return (
    <div className="flex flex-col items-center w-full h-full bg-transparent">

      {/* Hero Section */}
      <section className="w-full bg-[#5C7D92] py-[60px] px-[36px] flex flex-col justify-center items-center text-center">
        <h1 className="text-[48px] font-bold text-white mb-4">
          Welcome to Tanaw
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-xl">
          Transparency made simple. Know your community. Stay informed.
        </p>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="h-[55px] w-[160px] text-[18px] bg-white text-black font-semibold rounded-[20px] hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="h-[55px] w-[160px] text-[18px] border border-white text-white font-semibold rounded-[20px] hover:bg-white hover:text-black transition-colors duration-200 flex items-center justify-center"
          >
            Register
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Landing;