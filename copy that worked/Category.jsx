import React from "react";
import { Link } from "react-router-dom";
function Category(props){
    const matchesCategory= props.title.startsWith("Roasted") ||
    props.title.startsWith("Raw") ||
    props.title.startsWith("Dates") ||
    props.title.startsWith("Dried") ||
    props.title.startsWith("Candies") ||w
    props.title.startsWith("Chocolate") ||
    props.title.startsWith("Chinese") ||
    props.title.startsWith("Seeds");
    let path="/";
    const title=props.title || "";
    if(matchesCategory)
        path=`/displaySpecificProducts/${title}`;
    else if(!matchesCategory && title)
        path=`/item/${props.name_of_the_category}/${props.title}`;
    return(
    <div style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "white",
        fontSize:"30px",
        height:"300px",
        cursor: "pointer",
        }}>
        <Link to={path}
        style={{
            textDecoration: "none",
            color: "inherit",
        }}>
        <div>
        <img src={props.image} style={{
            width:"300px",
            height:"220px",
        }}/>
        </div>
        <div style={{
            marginTop:"15px",
        }}>
        {props.title}
        </div>
        </Link>
        </div>
    );
}
export default Category;