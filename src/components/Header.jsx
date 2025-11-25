import { useState } from 'react';

function Header({ onSidebarToggle }) {
    const [searchFocused, setSearchFocused] = useState(false);
    const [notificationBounce, setNotificationBounce] = useState(false);

    const handleNotificationClick = () => {
        setNotificationBounce(true);
        setTimeout(() => setNotificationBounce(false), 500);
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
                <button 
                    onClick={onSidebarToggle}
                    className="group p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
                    aria-label="Toggle sidebar"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 32 32" 
                        className="transition-transform duration-200 group-hover:scale-110"
                    >
                        <path 
                            fill="none" 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M5 8h22M5 16h22M5 24h22" 
                        />
                    </svg>
                </button>

                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 transition-all duration-300 ${
                        searchFocused 
                            ? 'border-blue-500 shadow-md bg-blue-50 w-64' 
                            : 'border-gray-200 hover:border-gray-300 w-48'
                    }`}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="20px" 
                            viewBox="0 -960 960 960" 
                            width="20px" 
                            fill="currentColor"
                            className={`transition-colors duration-200 ${searchFocused ? 'text-blue-500' : 'text-gray-600'}`}
                        >
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="flex-1 bg-transparent outline-none text-sm"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>

                    <button 
                        onClick={handleNotificationClick}
                        className={`relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 ${
                            notificationBounce ? 'animate-bounce' : ''
                        }`}
                        aria-label="Notifications"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="24px" 
                            viewBox="0 -960 960 960" 
                            width="24px" 
                            fill="currentColor"
                            className="transition-colors duration-200 hover:text-blue-600"
                        >
                            <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    <button 
                        className="group relative"
                        aria-label="User profile"
                    >
                        <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white p-2 w-10 h-10 flex items-center justify-center font-semibold text-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-110 group-active:scale-95">
                            KR
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;