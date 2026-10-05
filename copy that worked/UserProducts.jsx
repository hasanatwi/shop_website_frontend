import React, { useEffect, useState } from "react";

function UserProducts({ admin, email, nameOfTheUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/userProducts?email=${email}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!data.success) {
          setError(data.error || "Failed to fetch products");
        } else {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [email]);

  const handleDelete = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/userProducts?email=${email}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data.success) {
        setProducts([]);
        setError(null);
        setLoading(false);
      }
    else {
      setError(data.error || "Failed to delete");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("Network error");
  }
};
  
  if (!email) return <p>Please log in to view your cart.</p>;
  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products.length) return <p>No products found for this email.</p>;

  const totalPriceAll = products
    .reduce((sum, p) => sum + Number(p.totalprice), 0)
    .toFixed(2);

  return (
    <div className="UserProductsDiv">
      <button onClick={handleDelete} className="deleteButton">
        Delete All Products
      </button>
      <h2>Products for {nameOfTheUser}</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Total Weight (kg)</th>
            <th>Total Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product}>
              <td>{p.product}</td>
              <td>{Number(p.totalweight).toFixed(2)}</td>
              <td>{Number(p.totalprice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total Price:
            </td>
            <td style={{ fontWeight: "bold" }}>{totalPriceAll} $</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default UserProducts;
