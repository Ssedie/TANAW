const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: "🏡",text: "Home", link: "/" },
    { icon: "ℹ",text: "About", link: "/about" },
    { icon: "🙆",text: "Users", link: "/users" },
    { icon: "⚙",text: "Settings", link: "/settings" }
  ];

  return(
    <div className={`overflow-hidden bg-blue-900 text-white ${
    isOpen ? 'w-36' : 'w-0'
  }`} >
        <div><h2 className="text-2xl font-bold mb-6">Tanaw</h2></div>
      
        <nav>
            <ul className="space-y-3">
                {menuItems.map((item, index) => (
                <li
                    key={index}
                ><i className="">{item.icon}</i>
                    {item.text}
                </li>
                ))}
             </ul>
      </nav>
    </div>
  )
};

export default Sidebar;