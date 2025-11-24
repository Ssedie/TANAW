const Header = ({ onSidebarToggle }) => {
    return (
        <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-6 py-4">
                    <button onClick={onSidebarToggle}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                        </svg>
                    </button>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                         <svg 
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            width="20"
                            viewBox="0 -960 960 960"
                            fill="#6b7280"
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                        >
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                        </svg>
                         <input type="text" 
                            placeholder="Search..." 
                            className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
            
                    <button className="relative text-gray-600 hover:text-gray-900">
                        <svg 
    xmlns="http://www.w3.org/2000/svg" 
    height="24" 
    width="24" 
    viewBox="0 -960 960 960" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="30"
    strokeLinecap="round"
    strokeLinejoin="round"
>
    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
</svg>

                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white justify-center">7</span>
                        </button>
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">RJ</div>
                </div>

            </div>
        </header>
    );
};

export default Header;