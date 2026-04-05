const pool = require('../config/db');

exports.addToWishlist = async (req, res) => {
    const user_id = req.user.id;
    const { product_id } = req.body;

    try {
        const check = await pool.query(`
            select * from wishlist where user_id = $1 and product_id = $2
            `, [user_id, product_id])

        if(check.rows.length > 0){
            await pool.query(`
                delete from wishlist where user_id = $1 and product_id = $2
                `, [user_id, product_id])
            return res.json({message:"Item removed from wishlist"})
        }

        await pool.query(`
            insert into Wishlist (user_id, product_id) values ($1, $2)
            `, [user_id, product_id])
        res.json({message:"Item added in wishlist"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.getWishlist = async (req, res) => {
    try {
        const user_id = req.user.id;
        const result = await pool.query(`
            select p.*, w.product_id from wishlist w join products p on w.product_id = p.id where w.user_id = $1
            `, [user_id])
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.removeWishlist = async (req, res) => {
    const user_id = req.user.id;
    const { product_id } = req.body;

    try {
        await pool.query(`
            delete from wishlist where user_id = $1 and product_id = $2
            `, [user_id, product_id])
        res.json({message:"Item removed from wishlist"})       
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}