import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import API from "../api/axios";
import {
    Users,
    Mail,
    Calendar,
    Search,
    UserCircle,
    Trash2
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await API.get("/auth/");
            setUsers(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id, name) => {
        console.log("id :", id)
        console.log("name :", name)
        if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
            try {
                await API.delete(`/auth/${id}`);
                toast.success("User removed successfully");
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
            }
        }
    };

    const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="admin-card">
                <div className="card-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ background: "#fffbeb", padding: "8px", borderRadius: "8px", color: "#d4af37" }}>
                            <Users size={20} />
                        </div>
                        <h2 style={{ fontSize: "1.1rem" }}>All Registered Users</h2>
                    </div>
                    <div style={{ position: "relative", width: "350px" }}>
                        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            style={{ padding: "10px 10px 10px 40px", width: "100%", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "0.9rem" }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Contact Details</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "60px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                                            <div style={{ width: "30px", height: "30px", border: "3px solid #f3f4f6", borderTopColor: "#d4af37", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                                            <span>Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{ background: "#f3f4f6", padding: "8px", borderRadius: "50%", color: "#6b7280" }}>
                                                    <UserCircle size={20} />
                                                </div>
                                                <span style={{ fontWeight: "600" }}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "0.875rem" }}>
                                                <Mail size={14} /> {user.email}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "0.875rem" }}>
                                                <Calendar size={14} /> {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-success">Active</span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon btn-delete"
                                                title="Delete User"
                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                style={{ color: "#dc2626" }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
