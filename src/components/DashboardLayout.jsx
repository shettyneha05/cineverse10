import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Dashboard.css';

const DashboardLayout = ({ children }) => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className={`dashboard-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <h2>🎬 MovieHub</h2>
                    <button 
                        className="collapse-btn"
                        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        {isSidebarCollapsed ? '→' : '←'}
                    </button>
                </div>
                
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">Home</span>
                    </Link>
                    <Link to="/dashboard/favorites" className={`nav-item ${location.pathname === '/dashboard/favorites' ? 'active' : ''}`}>
                        <span className="nav-icon">❤️</span>
                        <span className="nav-text">Favorites</span>
                    </Link>
                    <Link to="/dashboard/profile" className={`nav-item ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}>
                        <span className="nav-icon">👤</span>
                        <span className="nav-text">Profile</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/dashboard/settings" className={`nav-item ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}>
                        <span className="nav-icon">⚙️</span>
                        <span className="nav-text">Settings</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Top Navigation */}
                <header className="dashboard-header">
                    <div className="header-search">
                        <input 
                            type="search" 
                            placeholder="Search movies..."
                            className="search-input"
                        />
                    </div>
                    <div className="header-actions">
                        <button className="notification-btn">
                            🔔
                        </button>
                        <div className="user-menu">
                            <img 
                                src="https://via.placeholder.com/32" 
                                alt="User avatar" 
                                className="user-avatar"
                            />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
