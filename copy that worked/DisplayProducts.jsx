import React from "react";
import { Link } from "react-router-dom";
import Products from "./products";
import Header from "./Header";
import Category from "./Category";
function createProduct(product){
  return (
  <Category image={product.image} title={product.title}/>
  );
}
function DisplayProducts({admin, isValid, nameOfTheUser, email}){
  return(
    <div>
        <Header isValid={isValid} nameOfTheUser={nameOfTheUser} email={email}/>
        <div className="displayProducts">
        <h1>Products</h1>
        <div className="displayProductsItems">
            {Products.map(createProduct)}
        </div>
        </div>
    </div>
  );
}
export default DisplayProducts;