import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    const res = await API.get(`/products?page=${page}&limit=24`);
    setProducts(res.data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <>
      <div className="product-container">
        <h2>Products</h2>

        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p.id}>
              <img src={p.image_url} alt="" />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>{page}</span>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}