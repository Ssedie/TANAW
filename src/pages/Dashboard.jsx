function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#475C68] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#FF6404]">
          <h3 className="text-gray-500 text-sm font-medium">Total Budget</h3>
          <p className="text-2xl font-bold text-[#475C68] mt-2">₱2,450,000</p>
          <p className="text-green-600 text-sm mt-1">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#5C7D92]">
          <h3 className="text-gray-500 text-sm font-medium">Active Projects</h3>
          <p className="text-2xl font-bold text-[#475C68] mt-2">12</p>
          <p className="text-blue-600 text-sm mt-1">3 pending review</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#FF6404]">
          <h3 className="text-gray-500 text-sm font-medium">Documents</h3>
          <p className="text-2xl font-bold text-[#475C68] mt-2">87</p>
          <p className="text-gray-600 text-sm mt-1">5 new this week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#5C7D92]">
          <h3 className="text-gray-500 text-sm font-medium">Officials</h3>
          <p className="text-2xl font-bold text-[#475C68] mt-2">24</p>
          <p className="text-gray-600 text-sm mt-1">All positions filled</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-[#475C68] mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {[
              { text: "New project proposal submitted", time: "2 hours ago" },
              { text: "Budget report approved", time: "5 hours ago" },
              { text: "Document uploaded by Admin", time: "1 day ago" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <span className="text-gray-700">{activity.text}</span>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-[#475C68] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-[#5C7D92] hover:bg-[#475C68] text-white py-3 px-4 rounded-lg transition">
              Add Project
            </button>
            <button className="bg-[#FF6404] hover:bg-[#e55803] text-white py-3 px-4 rounded-lg transition">
              Upload Document
            </button>
            <button className="bg-[#5C7D92] hover:bg-[#475C68] text-white py-3 px-4 rounded-lg transition">
              View Reports
            </button>
            <button className="bg-[#FF6404] hover:bg-[#e55803] text-white py-3 px-4 rounded-lg transition">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;