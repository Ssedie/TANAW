const Header = ({ onSidebarToggle }) => {
    return (
        <header className="h-8 bg-orange-500 flex row">
            <button onClick={onSidebarToggle}>Menu</button>
            <h1>Admin Dashboard</h1>
        </header>
    );
};

export default Header;