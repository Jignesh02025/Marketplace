const { poolPromise } = require('../config/db');

exports.addToCart = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        const pool = await poolPromise;

        // check if product already in cart
        const check = await pool.request()
            .input("user_id", user_id)
            .input("product_id", product_id)
            .query(`
                SELECT * FROM cart 
                WHERE user_id = @user_id AND product_id = @product_id
            `);

        // ✅ If exists → increase by 1
        if (check.recordset.length > 0) {
            await pool.request()
                .input("user_id", user_id)
                .input("product_id", product_id)
                .query(`
                    UPDATE cart 
                    SET quantity = quantity + 1 
                    WHERE user_id = @user_id AND product_id = @product_id
                `);

            return res.json({ message: "Cart quantity increased" });
        }

        // ✅ If not exists → insert with quantity = 1
        await pool.request()
            .input("user_id", user_id)
            .input("product_id", product_id)
            .query(`
                INSERT INTO cart (user_id, product_id, quantity)
                VALUES (@user_id, @product_id, 1)
            `);

        res.json({ message: "Item added to cart" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCart = async (req, res) => {
    const user_id = req.user.id;
    const pool = await poolPromise;
    const result = await pool.request()
        .input("user_id", user_id)
        .query(`
        select p.*, c.quantity from cart c 
        join Products p on c.product_id = p.id 
        where c.user_id = @user_id
    `);
    res.json(result.recordset);
}

exports.deleteCart = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    const pool = await poolPromise;

    await pool.request()
        .input("user_id", user_id)
        .input("product_id", product_id)
        .query(`
        delete from cart where user_id = @user_id and product_id = @product_id
    `)
    res.json({ message: "Item deleted from cart" })
}

exports.removeItem = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        const pool = await poolPromise;

        // check current quantity
        const result = await pool.request()
            .input("user_id", user_id)
            .input("product_id", product_id)
            .query(`
                SELECT quantity FROM cart 
                WHERE user_id = @user_id AND product_id = @product_id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const currentQty = result.recordset[0].quantity;

        // ✅ if quantity is 1 → delete item
        if (currentQty <= 1) {
            await pool.request()
                .input("user_id", user_id)
                .input("product_id", product_id)
                .query(`
                    DELETE FROM cart 
                    WHERE user_id = @user_id AND product_id = @product_id
                `);

            return res.json({ message: "Item removed from cart" });
        }

        // ✅ if quantity > 1 → decrease
        await pool.request()
            .input("user_id", user_id)
            .input("product_id", product_id)
            .query(`
                UPDATE cart 
                SET quantity = quantity - 1 
                WHERE user_id = @user_id AND product_id = @product_id
            `);

        res.json({ message: "Item quantity decreased" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};