function Header({onSidebarToggle}) {

    return (
        <div>
            <nav>
                <button onClick={onSidebarToggle}><svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 32 32">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h22M5 16h22M5 24h22" />
                </svg></button>
                <label htmlFor=""></label>
                <input type="text" placeholder="Search"/>
                
            </nav>
        </div>
    )
}

export default Header;