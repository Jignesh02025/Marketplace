import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import API from "../api/axios";
import { 
    Users, 
    Package, 
    ShoppingBag, 
    MessageSquare,
    DollarSign,
    Search,
    Mail,
    Phone,
    Clock
} from "lucide-react";

const AdminDashboard = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: "0",
        totalProducts: "0",
        totalEnquiries: "0",
        totalRevenue: "₹0",
        totalOrders: "0"
    });

    const stats = [
        { label: "Total Revenue", value: dashboardStats.totalRevenue, icon: DollarSign, trend: "+12%", color: "#d4af37" },
        { label: "Total Orders", value: dashboardStats.totalOrders, icon: ShoppingBag, trend: "+8%", color: "#3b82f6" },
        { label: "Total Products", value: dashboardStats.totalProducts, icon: Package, trend: "+3", color: "#10b981" },
        { label: "Total Users", value: dashboardStats.totalUsers, icon: Users, trend: "+15%", color: "#8b5cf6" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [enquiriesRes, statsRes] = await Promise.all([
                    API.get("/enquiries"),
                    API.get("/admin/stats")
                ]);
                setEnquiries(enquiriesRes.data);
                setDashboardStats(statsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AdminLayout>
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div className="stat-card" key={i}>
                        <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stat.label}</h3>
                            <p>{stat.value}</p>
                            <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "600" }}>{stat.trend} from last week</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "25px" }}>
                <div className="admin-card">
                    <div className="card-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ background: "#fffbeb", padding: "8px", borderRadius: "8px", color: "#d4af37" }}>
                                <MessageSquare size={20} />
                            </div>
                            <h2 style={{ fontSize: "1.1rem" }}>Customer Enquiries</h2>
                        </div>
                        <div style={{ position: "relative", width: "300px" }}>
                            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                            <input
                                type="text"
                                placeholder="Search enquiries..."
                                style={{ padding: "8px 12px 8px 35px", width: "100%", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "0.875rem" }}
                            />
                        </div>
                    </div>
                    
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Contact Info</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>
                                            <div style={{ width: "24px", height: "24px", border: "2px solid #f3f4f6", borderTopColor: "#d4af37", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
                                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                        </td>
                                    </tr>
                                ) : enquiries.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                                            No enquiries found.
                                        </td>
                                    </tr>
                                ) : (
                                    enquiries.map((enquiry) => (
                                        <tr key={enquiry.id}>
                                            <td style={{ fontWeight: "600" }}>{enquiry.name}</td>
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#6b7280" }}>
                                                        <Mail size={12} /> {enquiry.email}
                                                    </div>
                                                    {enquiry.phone && (
                                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#6b7280" }}>
                                                            <Phone size={12} /> {enquiry.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: "400px" }}>
                                                {enquiry.product_name && (
                                                    <div style={{ marginBottom: "6px" }}>
                                                        <span className="badge badge-warning" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                                                            Product: {enquiry.product_name}
                                                        </span>
                                                    </div>
                                                )}
                                                <p style={{ fontSize: "0.875rem", color: "#374151", margin: 0 }}>
                                                    {enquiry.message}
                                                </p>
                                            </td>
                                            <td>
                                                <span className="badge badge-warning">New</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
