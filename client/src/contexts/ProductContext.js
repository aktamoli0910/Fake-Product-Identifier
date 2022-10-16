import { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export const ProductContext = createContext();

export const ProductProvider = (props) => {
  const [products, setProducts] = useState([]);

  useEffect(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const user = jwtDecode(token);

    const res = await fetch("http://localhost:8000/api/product/get", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "POST",
    });

    const data = await res.json();

    const products = data.products;

    setProducts(products);
  }, []);

  return (
    <ProductContext.Provider value={[products, setProducts]}>
      {props.children}
    </ProductContext.Provider>
  );
};
