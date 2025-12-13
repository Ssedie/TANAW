import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "View Approved Budgets",
      description:
        "Gain easy access to officially approved and signed Barangay Taboc budget proposals. This feature allows citizens to clearly see how community funds are planned, allocated, and distributed across various programs and initiatives.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.925 11.05L8.675 6.8L10.1 5.4l2.825 2.825l5.675-5.65l1.4 1.4l-7.075 7.075ZM14 22.5l-7-1.95V22H1V11h7.95l6.2 2.3q.825.3 1.337 1.05T17 16h2q1.25 0 2.125.825T22 19v1l-8 2.5ZM3 20h2v-7H3v7Z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Track Projects & Status",
      description:
        "Stay informed about all ongoing and completed projects within the barangay, including timelines, budget allocation, and real-time status updates.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2h.25q.325 0 .537.213T13 2.75v7.525q.45.275.725.713T14 12q0 .825-.588 1.413T12 14q-.825 0-1.413-.588T10 12q0-.575.275-1.025t.725-.7v-2.15q-1.3.35-2.15 1.413T8 12q0 1.65 1.175 2.825T12 16q1.65 0 2.825-1.175T16 12Z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Access Related Documents",
      description:
        "Explore proposals, implementation plans, financial reports, and completion summaries in one organized repository.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 22q-.825 0-1.412-.587T3 20V4q0-.825.588-1.412T5 2h8l6 6v2.5H12V4H5v16h6.025Z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Submit Feedback",
      description:
        "Share your comments and concerns under specific projects to help improve barangay initiatives.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15q.425 0 .713-.288T13 14q0-.425-.288-.713T12 13q-.425 0-.713.288T11 14q0 .425.288.713T12 15Zm-1-4h2V5h-2v6ZM2 22V4q0-.825.588-1.413T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.588 1.413T20 18H6l-4 4Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full bg-white">
      {/* HERO */}
      <section className="relative w-full py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5C7D92] via-[#6B8FA3] to-[#FF6404] animate-pulse" />
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Let the Transparency Start Here
            </h1>
            <p className="text-lg text-gray-100 mb-8">
              Tanaw brings barangay budgets and project updates directly to your community.
            </p>
            <button
              onClick={() => navigate("/about")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#5C7D92] font-semibold rounded-lg shadow hover:bg-gray-100"
            >
              Learn More <ArrowRight />
            </button>
          </div>

          <div
            className="hidden md:block h-[520px]"
            style={{
              backgroundImage: "url('src/assets/mascot.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#5C7D92] mb-12">
          What You Can Do Here?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl border hover:border-[#FF6404] transition"
            >
              <div className="h-32 flex items-center justify-center bg-gradient-to-br from-[#5C7D92]/10 to-[#FF6404]/10">
                <div className="text-[#5C7D92]">{feature.icon}</div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-[#5C7D92] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5C7D92] to-[#FF6404] py-16 text-center">
        <h3 className="text-4xl font-bold text-white mb-6">
          Ready to Explore Barangay Transparency?
        </h3>
        <button
          onClick={() => navigate("/projects")}
          className="px-10 py-4 bg-white text-[#5C7D92] font-semibold rounded-lg shadow hover:bg-gray-100"
        >
          Explore Projects
        </button>
      </section>
    </div>
  );
};

export default Home;
