const pool = require('../config/db');

exports.addToCart = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        // check if product already in cart
        const check = await pool.query(`
                SELECT * FROM "Cart" 
                WHERE user_id = $1 AND product_id = $2
            `, [user_id, product_id]);

        // ✅ If exists → increase by 1
        if (check.rows.length > 0) {
            await pool.query(`
                    UPDATE "Cart" 
                    SET quantity = quantity + 1 
                    WHERE user_id = $1 AND product_id = $2
                `, [user_id, product_id]);

            return res.json({ message: "Cart quantity increased" });
        }

        // ✅ If not exists → insert with quantity = 1
        await pool.query(`
                INSERT INTO "Cart" (user_id, product_id, quantity)
                VALUES ($1, $2, 1)
            `, [user_id, product_id]);

        res.json({ message: "Item added to cart" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const result = await pool.query(`
            select p.*, c.quantity from "Cart" c 
            join "Products" p on c.product_id = p.id 
            where c.user_id = $1
        `, [user_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteCart = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        await pool.query(`
            delete from "Cart" where user_id = $1 and product_id = $2
        `, [user_id, product_id]);
        res.json({ message: "Item deleted from cart" })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.removeItem = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        // check current quantity
        const result = await pool.query(`
                SELECT quantity FROM "Cart" 
                WHERE user_id = $1 AND product_id = $2
            `, [user_id, product_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const currentQty = result.rows[0].quantity;

        // ✅ if quantity is 1 → delete item
        if (currentQty <= 1) {
            await pool.query(`
                    DELETE FROM "Cart" 
                    WHERE user_id = $1 AND product_id = $2
                `, [user_id, product_id]);

            return res.json({ message: "Item removed from cart" });
        }

        // ✅ if quantity > 1 → decrease
        await pool.query(`
                UPDATE "Cart" 
                SET quantity = quantity - 1 
                WHERE user_id = $1 AND product_id = $2
            `, [user_id, product_id]);

        res.json({ message: "Item quantity decreased" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};