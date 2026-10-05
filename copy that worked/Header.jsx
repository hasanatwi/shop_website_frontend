import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
function EditColorBackground(){
  return(
    <div className="headerButtonsEdit">
            <button>color</button>
            <button>background</button>
    </div>
  );
}
function Header({ isValid, nameOfTheUser, setIsValid, setNameOfTheUser, email}){
  const location= useLocation();
  useEffect(()=>{
      if(location.hash){
        const element=document.querySelector(location.hash);
        if(element){
          element.scrollIntoView({behavior: "smooth"});
        }
      }
  },[location]);
  return(
    <div className="Header">
        <Link to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
        <div className="logoEdit">
          <p>GOLDEN NUTS</p>
          <button>change color</button>
          <button>change background</button>
        </div>
        </Link>
        <div className="buttonsInsideHeader">
          <div className="placeThemVertical">
          <Link to="/"><button>HOME</button></Link>
          <EditColorBackground />
          </div>
          <div className="placeThemVertical">
          <Link to="/#about"><button>ABOUT US</button></Link>
          <EditColorBackground />
          </div>
          <div className="placeThemVertical">
          <Link to="/cart"><button>CART</button></Link>
          <EditColorBackground /> 
          </div>
          <div className="placeThemVertical">
          <Link to="/#contactUs"><button>CONTACT</button></Link>
          <EditColorBackground />
          </div>
          { !isValid && (
          <div className="signInUp">
          <div className="placeThemVertical">
          <Link to="/sign_up"><button>SIGN UP</button></Link>
          <EditColorBackground />
          </div>
          <div className="placeThemVertical">
          <Link to="/sign_in"><button>SIGN IN</button></Link>
          <EditColorBackground />
          </div>
          <button id="editButton">Edit 🖊</button>
          </div>)
          }
          { isValid &&(
            <div style={{
              backgroundColor: "#d6b85a",
              height:"50px",
              width:"200px",
              display:"flex",
              alignItems:"center",
              justifyContent: "center",
              flexDirection: "column",
            }}>
              <div style={{
                display:"flex",
                gap: "0px",
              }}>
              {(email==="hasanatwi00@gmail.com") &&(
                <div>
                <p
                style={{
                  color:"black",
                  fontSize:"13px",
                  fontWeight: "bold",
                  margin: "0px",
                }}>{nameOfTheUser}</p>
                
                <p style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color:"black",
                  margin: "0px",
                }}
                >|(Admin Account)</p>
               </div>
              )}
              {(email!=="hasanatwi00@gmail.com") &&(
                <div>
                <p
                style={{
                  color:"black",
                  fontSize:"16px",
                  fontWeight: "bold",
                  margin: "0px",
                }}>{nameOfTheUser}</p>

               </div>
              )}
              </div>
              <button style={{
                backgroundColor:"#62360b",
              }}
                onClick={async()=>{
                  const response= await fetch(
                      'http://localhost:3000/logout',
                      {
                        method: "GET",
                        credentials: "include",
                      }//here how to check if the logout was successful and set some variables to false again   
                  );
                  if(response.ok){
                    setIsValid(false);
                    setNameOfTheUser("");
                  }
                }}
              >Log out</button>
            </div>
          )}
        </div>
    </div>
  );
}
export default Header;