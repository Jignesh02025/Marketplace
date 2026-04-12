const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
    try {
        const userCount = await pool.query(`SELECT COUNT(*) FROM "Users"`);
        const productCount = await pool.query(`SELECT COUNT(*) FROM "Products"`);
        const enquiryCount = await pool.query(`SELECT COUNT(*) FROM "Enquiries"`);
        
        // Mock revenue and orders for now since those tables don't exist yet
        res.json({
            totalUsers: userCount.rows[0].count,
            totalProducts: productCount.rows[0].count,
            totalEnquiries: enquiryCount.rows[0].count,
            totalRevenue: "₹4,25,000",
            totalOrders: "156"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
