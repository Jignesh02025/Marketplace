const db = require('../config/db');

exports.addToWishlist = async (req, res) => {
    const user_id = req.user.id;
    const { product_id } = req.body;

    try {
        const pool = await db.poolPromise;
        
        const check = await pool.request()
        .input("user_id", user_id)
        .input("product_id", product_id)
        .query(`
            select * from wishlist where user_id = @user_id and product_id = @product_id
            `)

        if(check.recordset.length > 0){
            await pool.request()
            .input("user_id", user_id)
            .input("product_id", product_id)
            .query(`
                delete from wishlist where user_id = @user_id and product_id = @product_id
                `)
            return res.json({message:"Item remove from wishlist"})
        }

        await pool.request()
        .input("user_id", user_id)
        .input("product_id", product_id)
        .query(`
            insert into Wishlist (user_id, product_id) values (@user_id, @product_id)
            `)
        res.json({message:"Item added in whishlist"})
    } catch (error) {
        console.log(error)
    }
}

exports.getWishlist = async (req, res) => {
    const user_id = req.user.id;
    const pool = await db.poolPromise;
    const result = await pool.request()
    .input("user_id", user_id)
    .query(`
        select p.*, w.product_id from wishlist w join products p on w.product_id = p.id where w.user_id = @user_id
        `)
    res.json(result.recordset)
}

exports.removeWishlist = async (req, res) => {
    const user_id = req.user.id;
    const { product_id } = req.body;

    try {
        const pool = await db.poolPromise;
        await pool.request()
        .input("user_id",user_id)
        .input("product_id", product_id)
        .query(`
            delete from wishlist where user_id = @user_id and product_id = @product_id
            `)
            res.json({message:"Item remove from wishlist"})       
    } catch (error) {
        console.log(error)
    }
}