import React, { useEffect, useState, Fragment } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
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

function KeyedByUrl({ children }) {
  const location = useLocation();
  return <Fragment key={location.pathname + location.search}>{children}</Fragment>;
}


function App(){
const [isValid, setIsValid]=useState(false);
const [nameOfTheUser, setNameOfTheUser]=useState("The user is logged out");
const [email, setEmail]=useState("");
const [admin, setAdmin]=useState(false);
const [addButtonPressed, setAddButtonPressed]=useState(false);
const [pages, setPages]=useState([]);
const [innerGlobalZIndex, setInnerGlobalZIndex]=useState(0);
const [isAdmin, setIsAdmin]= useState(false);

useEffect(()=>{
  console.log("The value of isAdmin is: "+isAdmin);
},[isAdmin]);

useEffect(()=>{
  console.log("The name of the user just changed, I am now in App.jsx: the name of the user is: "+nameOfTheUser);
},[nameOfTheUser]);

useEffect(()=>{
  console.log("The value of the innerGlobalZIndex is: "+innerGlobalZIndex);
  if(innerGlobalZIndex!==0)
    setGlobalZIndex();
},[innerGlobalZIndex]);
const getGlobalZIndex=async(e)=>{
      console.log("*************************************************");
      console.log("The getGlobalZIndex started");
    try{
      const response=await fetch(
        'http://localhost:3000/getGlobalZIndex',
        {
          method: "GET",
          credentials: "include",
        }
      );
      if(response.ok){
        console.log("The response was ok");
        const data=await response.json();
        console.log("*********************************************************************");
        console.log("first rendering the page The globalZIndex is: "+data.globalZIndex);
        setInnerGlobalZIndex(data.globalZIndex);
      }
      else{
        console.log("The response wasn't ok");
      }
    }
    catch(err){
      console.log("There is an error: ",err);
    }
  }

  const setGlobalZIndex=async()=>{
      console.log("The innerGlobalZIndex that I want to put in the DB is: "+innerGlobalZIndex);
    try{
      const response=await fetch(
        'http://localhost:3000/updateGlobalZIndex',
        {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          credentials: "include",
          body: JSON.stringify({newZIndex: (innerGlobalZIndex)}),
        }
      )
    }
    catch(err){
      console.log("There is an error: ",err);
    }
  }

useEffect(()=>{
  getGlobalZIndex();
},[]);

useEffect(()=>{
  pages.map((page)=>{
    console.log("name of the page:"+page.name);
  })
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
  console.log("The nameOfTheUser becomes: "+nameOfTheUser);
},[nameOfTheUser]);
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
        {pages.map((page) => (
        <Route
          key={page.page_id}
          path={page.page_id === 1 ? "/" : `/${page.name}`}
          element={
            <KeyedByUrl>
              <Page
                page_id={page.page_id}
                name={page.name}
                innerGlobalZIndex={innerGlobalZIndex}
                setInnerGlobalZIndex={setInnerGlobalZIndex}
                setNameOfTheUser={setNameOfTheUser}
                nameOfTheUser={nameOfTheUser}
                refreshPages={getPages}
                setIsAdmin={setIsAdmin}
                isAdmin={isAdmin}
              />
            </KeyedByUrl>
          }
        />
      ))}
      <Route
        path="/cart"
        element={ <UserProducts admin={admin} email={email} nameOfTheUser={nameOfTheUser}/>}
      />
      <Route
        path="/header"
        element={ <Page page_id={2} nameOfTheUser={nameOfTheUser} setNameOfTheUser={setNameOfTheUser} setIsAdmin={setIsAdmin} isAdmin={isAdmin}/>}//here I am sending the value of nameOfTheUser but it's not printing in the Page when page_id=2
      />
      <Route
      path="/Item"
      element={
        <KeyedByUrl>
          <Page
            page_id={10}
            name="Item"
            innerGlobalZIndex={innerGlobalZIndex}
            setInnerGlobalZIndex={setInnerGlobalZIndex}
            nameOfTheUser={nameOfTheUser}
            setIsAdmin={setIsAdmin}
            isAdmin={isAdmin}
          />
        </KeyedByUrl>
      }
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
        element={
          <KeyedByUrl>
            <AddElementPage />
          </KeyedByUrl>
        }
      />
    </Routes>
  </div>
</Router>
);
}
export default App;