import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    Store
} from "lucide-react";
import "../styles/Admin.css";

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: "/", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/products", icon: Package, label: "Products" },
        { path: "/orders", icon: ShoppingBag, label: "Orders" },
        { path: "/users", icon: Users, label: "Users" },
        { path: "/enquiries", icon: MessageSquare, label: "Enquiries" },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="admin-container">
            {/* Mobile Toggle */}
            <button
                className="btn-icon mobile-toggle"
                style={{ position: "fixed", top: "20px", left: "20px", zIndex: 1100, display: "none" }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <span style={{ fontSize: "1.5rem" }}>💎</span>
                    <h2>Admin Panel</h2>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <div style={{ marginTop: "auto", padding: "20px 24px" }}>
                        <a href="https://marketplace-sne5.vercel.app/" target="_blank" rel="noreferrer" className="nav-item" style={{ padding: 0 }}>
                            <Store size={20} />
                            <span>Go to Store</span>
                        </a>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-title">
                        <h1>{menuItems.find(m => m.path === location.pathname)?.label || "Admin"}</h1>
                    </div>

                    <div className="header-actions">
                        <button className="btn-icon">
                            <Bell size={20} />
                        </button>
                        <div style={{ height: "30px", width: "1px", background: "#e5e7eb", margin: "0 10px" }}></div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>Admin User</div>
                                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Super Admin</div>
                            </div>
                            <div style={{ background: "#fffbeb", padding: "8px", borderRadius: "50%", color: "#d4af37" }}>
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
