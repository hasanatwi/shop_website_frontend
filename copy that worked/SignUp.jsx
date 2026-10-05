import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showEmailError } from "./showEmailError.js";
import { showPasswordError } from "./showPasswordError.js";
import { Link } from "react-router-dom";
import Header from "./Header";

function SignUp({ isValid2, setIsValid2, setNameOfTheUser2, setEmail2 }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameOfTheUser, setNameOfTheUser] = useState("");
  const [nameOfTheUserError,setNameOfTheUserError]=useState("");

  const navigate=useNavigate();
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const validEmail=showEmailError(email, setEmailErrorMessage, setEmail);
      const validPassword=showPasswordError(password, setPassword, setPasswordErrorMessage);
      if(!validEmail || !validPassword)
        return;
      setIsValid2(true);
      const response=await fetch(`http://localhost:3000/signUp`,
        {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          credentials: "include",
          body: JSON.stringify({username: email, password, nameOfTheUser}),
        }
      );
      const data=await response.json();
      if (response.ok) {
setNameOfTheUser2(nameOfTheUser);
        navigate("/");
      } else {
if (data.message.includes("Email")) setEmailErrorMessage(data.message);
      }
    } 
    catch(err){
      console.log("Error ")
    }
  };

  return (
    <div>
      <form className="signUpForm" onSubmit={handleSubmit}>
        <h1 style={{ fontSize: "40px" }}>Sign Up</h1>
        <p className="signUpDescription">
          Sign up to see the designs that fuel <br />
          creativity, and book some of the best
          <br />
          spots!
        </p>

        <label className="labelNameOfTheUser">Enter your name: </label>
        {nameOfTheUserError && <p className="emailError">{nameOfTheUserError}</p>}
        <br />
        <input
          type="text"
          name="nameOfTheUser"
          class="bigInput"
          value={nameOfTheUser}
          onChange={(e) => setNameOfTheUser(e.target.value)}
        />
        
        <br />
        <br />

        <label className="labelEmail">Email:</label>
        <br />
        {emailErrorMessage && <p className="emailError">{emailErrorMessage}</p>}
        <input
          type="text"
          name="username"
          class="bigInput"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmail2(e.target.value);
          }}
        />
        <br />
        <br />

        <label className="labelPassword">Password:</label>
        <br />
        {passwordErrorMessage && (
          <p className="passwordError">{passwordErrorMessage}</p>
        )}
        <input
          type="text"
          name="password"
          class="bigInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />

        <button className="createAccount" type="submit">
          Create account
        </button>
        <br />
        <br />
        <div className="miniLogIn">
          <span style={{ marginRight: "8px" }}>Already have an account?</span>
          <Link to="/sign_in">
            <button>Log in</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
