import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Category from "./Category";
function DisplaySpecificProducts({admin, isValid, nameOfTheUser, email}){
    const {title}=useParams();
    const [products, setProducts]=useState([]);
    const [loading, setLoading]=useState(false);
    useEffect(()=>{
        console.log("The products are: ", products[0]);
    },[products]);
    useEffect(()=>{
        const fetchData=async()=>{
            setLoading(true);
            try{
                const response=await fetch(`http://localhost:3000/api/products/${title}`);
                if(!response.ok){
                    throw new Error(`HTTP ${response} : ${response.statusText}`);
                }
                const data=await response.json();
                setProducts(Array.isArray(data)? data : []);
            }
            catch(err){
                console.error("There is an error: ",err);
                setProducts([]);
            }
            finally{
                setLoading(false);
            }
        }
        fetchData();
    },[title]);
    return(
        <div>
        {loading && (<p
            style={{
                fontWeight:"bold",
                fontSize:"20px",
            }}
        >Loading {title}...</p>)}
        {!loading && (
        <div style={{
            backgroundColor:"lightyellow",
            minHeight:"745px",
        }}>
            <Header isValid={isValid} nameOfTheUser={nameOfTheUser} email={email}/>
            <div style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "50px",
                backgroundColor:"lightyellow",
            }}>
                <Link to="/addToCart"><button>Add Product</button></Link>
                {products.map((product)=>(
                    <Category title={product.Product_name} image={product.Image} name_of_the_category={title}/>
                ))}
            </div>
        </div>)
        }
        </div>
    );
}
export default DisplaySpecificProducts;