import React from "react";
import AdminLayout from "../components/AdminLayout";
import { 
    Users, 
    Package, 
    ShoppingBag, 
    TrendingUp,
    Clock,
    DollarSign
} from "lucide-react";

const AdminDashboard = () => {
    const stats = [
        { label: "Total Revenue", value: "₹4,25,000", icon: DollarSign, trend: "+12%", color: "#d4af37" },
        { label: "Total Orders", value: "156", icon: ShoppingBag, trend: "+8%", color: "#3b82f6" },
        { label: "Total Products", value: "48", icon: Package, trend: "+3", color: "#10b981" },
        { label: "Total Users", value: "1,240", icon: Users, trend: "+15%", color: "#8b5cf6" },
    ];

    const recentOrders = [
        { id: "#ORD-7821", customer: "Anjali Mehta", date: "Oct 10, 2026", amount: "₹24,500", status: "Delivered" },
        { id: "#ORD-7820", customer: "Vikram Rathore", date: "Oct 09, 2026", amount: "₹18,200", status: "Processing" },
        { id: "#ORD-7819", customer: "Sanjay Gupta", date: "Oct 09, 2026", amount: "₹56,000", status: "Shipped" },
    ];

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

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "25px", marginTop: "10px" }}>
                <div className="admin-card">
                    <div className="card-header">
                        <h2 style={{ fontSize: "1.1rem" }}>Recent Activity</h2>
                        <button className="btn-icon"><TrendingUp size={18} /></button>
                    </div>
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: "600", color: "#d4af37" }}>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.date}</td>
                                        <td>{order.amount}</td>
                                        <td>
                                            <span className={`badge badge-${order.status === "Delivered" ? "success" : order.status === "Processing" ? "warning" : "success"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin-card" style={{ padding: "24px" }}>
                    <h2 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Store Performance</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div className="performance-item">
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Conversion Rate</span>
                                <span style={{ fontSize: "0.875rem", color: "#d4af37", fontWeight: "600" }}>3.2%</span>
                            </div>
                            <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "3px" }}>
                                <div style={{ width: "32%", height: "100%", background: "#d4af37", borderRadius: "3px" }}></div>
                            </div>
                        </div>
                        <div className="performance-item">
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Customer Satisfaction</span>
                                <span style={{ fontSize: "0.875rem", color: "#10b981", fontWeight: "600" }}>4.8/5</span>
                            </div>
                            <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "3px" }}>
                                <div style={{ width: "96%", height: "100%", background: "#10b981", borderRadius: "3px" }}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: "30px", padding: "20px", background: "#fffbeb", borderRadius: "12px", border: "1px dashed #d4af37" }}>
                        <p style={{ fontSize: "0.875rem", color: "#92400e", lineHeight: "1.5" }}>
                            <strong>Pro Tip:</strong> Launching a "Wedding Season" discount could boost sales by 25% this week!
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
