import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Header from "./Header";
import Page from "./Page";
import UserProducts from "./UserProducts";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import DisplayProducts from "./DisplayProducts";
import DisplaySpecificProducts from "./displaySpecificProducts";
import Item from "./Item";
import AddProduct from "./AddProduct";
import AddOptions from "./AddOptions";
import AddElementPage from "./AddElementPage";
function App(){
const [isValid, setIsValid]=useState(false);
const [nameOfTheUser, setNameOfTheUser]=useState("");
const [email, setEmail]=useState("");
const [admin, setAdmin]=useState(false);
const [addButtonPressed, setAddButtonPressed]=useState(false);
const [pages, setPages]=useState([]);
useEffect(()=>{
console.log(pages);
},[pages]);
const getPages=async()=>{
  try{
const response=await fetch(
    'http://localhost:3000/getPages',
    {
      method: "GET",
      headers: {"Content-Type":"application/json"},
      credentials: "include",
    },
  );
    if(response.ok){
}
    if(!response.ok){
}
    const result=await response.json();
    setPages(result.data);
  }
  catch(err){ 
    console.error("catch error:",err);
  }

}
useEffect(()=>{
  getPages();
},[]);
useEffect(()=>{
  if(email==="hasanatwi00@gmail.com")
    setAdmin(true);
  else
    setAdmin(false);
},[email]);
return (
<Router>
  <div>
    <Routes>
      <Route
        path="/addToCart"
        element={ <AddProduct />}
      />
        {pages.map((page)=>(
            <Route
              path={page.page_id===1? "/" : `/${page.page_id}`}
              element= { <Page page_id={page.page_id} name={page.name}/> }
            />
        ))}
      <Route
        path="/cart"
        element={ <UserProducts admin={admin} email={email} nameOfTheUser={nameOfTheUser}/>}
      />
      <Route
        path="/sign_up"
        element= { <SignUp isValid2={isValid} setIsValid2={setIsValid} setNameOfTheUser2={setNameOfTheUser} setEmail2={setEmail}/>}
      />
      <Route
        path="/sign_in"
        element= { <SignIn isValid2={isValid} setIsValid2={setIsValid} setNameOfTheUser2={setNameOfTheUser} setEmail2={setEmail}/>}
      />
      <Route
        path="/shop"
        element={ <DisplayProducts admin={admin} isValid={isValid} nameOfTheUser={nameOfTheUser} email={email}/>}
      />
      <Route
        path="/displaySpecificProducts/:title"
        element={ <DisplaySpecificProducts admin={admin} isValid={isValid} nameOfTheUser={nameOfTheUser} email={email}  />}
      />
      <Route
        path="/item/:name_of_the_category/:title"
        element={ <Item admin={admin} isValid={isValid} nameOfTheUser={nameOfTheUser} email={email}/>}
      />
      <Route  
        path="/addOptions"
        element= { <AddOptions addButtonPressed={addButtonPressed} setAddButtonPressed={setAddButtonPressed}/>}
      />
      <Route
        path="/addElementPage"
        element= { <AddElementPage/> }
      />
    </Routes>
  </div>
</Router>
);
}
export default App;