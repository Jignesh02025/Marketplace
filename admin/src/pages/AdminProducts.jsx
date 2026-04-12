import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import API from "../api/axios";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    X,
    Save,
    Image as ImageIcon
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const AdminProducts = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [categories, setCategories] = useState([]);
    const itemsPerPage = 50;

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        image_url: "",
        stock: 1,
        carats: "",
        color: "",
        clarity: "",
        shape: "",
        weight: ""
    });

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await API.get("/products", {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchTerm,
                    category: selectedCategory
                }
            });

            if (res.data.data) {
                setProducts(res.data.data);
                setTotalPages(res.data.totalPages || Math.ceil((res.data.total || 0) / itemsPerPage) || 1);
                setTotalProducts(res.data.total || res.data.data.length);
            } else {
                setProducts(res.data);
                setTotalPages(1);
                setTotalProducts(res.data.length);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await API.get("/products/categories");
            setCategories(res.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, selectedCategory]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchProducts();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (product = null) => {
        setShowNewCategory(false);
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name || "",
                price: product.price || "",
                category: product.category || "",
                description: product.description || "",
                image_url: product.image_url || "",
                stock: product.stock || 1,
                carats: product.carats || "",
                color: product.color || "",
                clarity: product.clarity || "",
                shape: product.shape || "",
                weight: product.weight || ""
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                price: "",
                category: "",
                description: "",
                image_url: "",
                stock: 1,
                carats: "",
                color: "",
                clarity: "",
                shape: "",
                weight: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setShowNewCategory(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        if (e.target.value === "NEW_CATEGORY") {
            setShowNewCategory(true);
            setFormData(prev => ({ ...prev, category: "" }));
        } else {
            setShowNewCategory(false);
            setFormData(prev => ({ ...prev, category: e.target.value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const loadingToast = toast.loading(editingProduct ? "Updating product..." : "Adding product...");

        const cleanedData = {
            name: formData.name,
            price: formData.price !== "" ? Number(formData.price) : 0,
            stock: formData.stock !== "" ? Number(formData.stock) : 0,
            carats: formData.carats !== "" && formData.carats != null ? parseFloat(formData.carats) : null,
            description: formData.description !== "" ? formData.description : null,
            image_url: formData.image_url !== "" ? formData.image_url : null,
            category: formData.category !== "" ? formData.category : null,
            color: formData.color !== "" ? formData.color : null,
            clarity: formData.clarity !== "" ? formData.clarity : null,
            shape: formData.shape !== "" ? formData.shape : null,
            weight: formData.weight !== "" ? formData.weight : null
        };

        console.log("Submitting cleanedData:", cleanedData);

        try {
            if (editingProduct) {
                await API.put(`/products/${editingProduct.id}/`, cleanedData);
                toast.success("Product updated successfully", { id: loadingToast });
            } else {
                await API.post("/products/", cleanedData);
                toast.success("Product added successfully", { id: loadingToast });
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving product:", error);
            const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to save product";
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const loadingToast = toast.loading("Deleting product...");
            try {
                await API.delete(`/products/${id}`);
                toast.success("Product deleted successfully", { id: loadingToast });
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product", { id: loadingToast });
            }
        }
    };

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="admin-card">
                <div className="card-header">
                    <div style={{ display: "flex", gap: "15px", flex: 1, alignItems: "center" }}>
                        <div style={{ position: "relative", flex: 1, maxWidth: "350px" }}>
                            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                style={{ padding: "10px 10px 10px 40px", width: "100%", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "0.9rem" }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Filter size={18} style={{ color: "#6b7280" }} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    padding: "10px 15px",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    fontSize: "0.9rem",
                                    backgroundColor: "#fff",
                                    color: "#374151"
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className="btn-add" onClick={() => handleOpenModal()}>
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>

                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "60px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                                            <div style={{ width: "30px", height: "30px", border: "3px solid #f3f4f6", borderTopColor: "#d4af37", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                                            <span>Loading products...</span>
                                        </div>
                                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "60px" }}>
                                        <div style={{ color: "#9ca3af" }}>
                                            <ImageIcon size={48} style={{ marginBottom: "10px", opacity: 0.5 }} />
                                            <p>No products found matched your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <img
                                                    src={product.image_url}
                                                    alt=""
                                                    className="product-img-sm"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3EGEM%3C/text%3E%3C/svg%3E";
                                                    }}
                                                />
                                                <span style={{ fontWeight: "600" }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-warning">{product.category || "General"}</span></td>
                                        <td style={{ fontWeight: "700" }}>₹{Number(product.price).toLocaleString("en-IN")}</td>
                                        <td>
                                            <span style={{ color: product.stock < 5 ? "#dc2626" : "inherit", fontWeight: "500" }}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button className="btn-icon btn-edit" title="Edit" onClick={() => handleOpenModal(product)}><Edit2 size={16} /></button>
                                                <button className="btn-icon btn-delete" title="Delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div style={{
                    padding: "20px 24px",
                    borderTop: "1px solid #f3f4f6",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f9fafb"
                }}>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        Showing{" "}
                        <span style={{ fontWeight: "600", color: "#111827" }}>{(currentPage - 1) * itemsPerPage + 1}</span>
                        {" "}to{" "}
                        <span style={{ fontWeight: "600", color: "#111827" }}>{Math.min(currentPage * itemsPerPage, totalProducts)}</span>
                        {" "}of{" "}
                        <span style={{ fontWeight: "600", color: "#111827" }}>{totalProducts}</span> products
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            className="btn-icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer", padding: "8px 15px" }}
                        >
                            Previous
                        </button>
                        <div style={{ display: "flex", alignItems: "center", padding: "0 15px", fontWeight: "600", color: "#d4af37" }}>
                            Page {currentPage} of {totalPages}
                        </div>
                        <button
                            className="btn-icon"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer", padding: "8px 15px" }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                            <button className="btn-icon" onClick={handleCloseModal}><X size={20} /></button>
                        </div>
                        <form className="admin-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. 18k Gold Diamond Necklace"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                {!showNewCategory ? (
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleCategoryChange}
                                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                        <option value="NEW_CATEGORY" style={{ fontWeight: "bold" }}>+ Add New Category</option>
                                    </select>
                                ) : (
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            placeholder="Type new category name..."
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => setShowNewCategory(false)}
                                            style={{ color: "#dc2626" }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="Paste product image link"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Carats</label>
                                    <input type="text" name="carats" value={formData.carats} onChange={handleInputChange} placeholder="e.g. 1.5" />
                                </div>
                                <div className="form-group">
                                    <label>Weight</label>
                                    <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 2.4g" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Color</label>
                                    <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. D / F-G" />
                                </div>
                                <div className="form-group">
                                    <label>Clarity</label>
                                    <input type="text" name="clarity" value={formData.clarity} onChange={handleInputChange} placeholder="e.g. VVS1" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Shape</label>
                                <input type="text" name="shape" value={formData.shape} onChange={handleInputChange} placeholder="e.g. Round Brilliant / Pear" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="Enter product details..."
                                ></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-icon" style={{ padding: "10px 20px" }} onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn-add" disabled={isSubmitting}>
                                    <Save size={18} />
                                    {isSubmitting ? "Saving..." : (editingProduct ? "Update Changes" : "Publish Product")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
