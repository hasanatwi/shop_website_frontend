  import { useState, useRef, useCallback, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { useSearchParams } from "react-router-dom";

  export default function Component({ page_id, specs, component_id, buttonFunctionality, pageToNavigateTo, divHeight, divWidth, editClicked, isInnerComponent, innerGlobalZIndex, setInnerGlobalZIndex, setSignInEmail, setSignInPassword, setDoTheSignIn, nameOfTheUser, setDoTheLogout, isTheLowest, setSignUpUsername, setSignUpEmail, setSignUpPassword, setDoTheSignUp, emailErrorMessage, passwordErrorMessage, isAdmin, setIsAdmin }) {
  const [position, setPosition] = useState({ x: specs.x, y: specs.y });
    const [size, setSize] = useState({ width: specs.width, height: specs.height }); // ADDED: state to track resizable size, initialized from specs
    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const isResizing = useRef(false); // ADDED: tracks whether a resize drag is in progress
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 }); // ADDED: stores starting mouse position + size when resize begins
    const [newSpecs, setNewSpecs]=useState(specs);
    const [moveObject, setMoveObject]= useState(false);
    const [options, setOptions]=useState([]);
    const [lowestZIndex, setLowestZIndex]=useState(isTheLowest);//is there something wrong with isTheLowest here?
    const [lowestZIndexButtonLabel, setLowestZIndexButtonLabel]=useState(lowestZIndex ? "normal height" : "Set the lowest");
  
    useEffect(()=>{
      console.log("We are in the Component, the value of isAdmin is: "+isAdmin);
    },[]);

    const errorMessage =
    component_id === 540
    ? emailErrorMessage
    : component_id === 541 
    ? passwordErrorMessage : undefined;

    const updateIsTheLowest = async (value) => {
  try {
    const response = await fetch(
      'http://localhost:3000/updateIsTheLowest',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ component_id, isTheLowest: value }),
      }
    );
    if (response.ok) {
      console.log("isTheLowest was updated successfully");
      return true;
    } else {
      console.log("Failed to update isTheLowest");
      return false;
    }
  } catch (err) {
    console.log("There was an error: ", err);
    return false;
  }
};

    

    useEffect(()=>{
      console.log("When rendering the component the value of lowestZIndex is: "+lowestZIndex);
    },[]);

    

    useEffect(()=>{
      if(specs.type==="input")
        handleChange("label","");
    }, []);

    useEffect(()=>{
      console.log("The value of newSpecs is: ");
      console.log(newSpecs);
    },[newSpecs]);
    console.log(newSpecs.label);
    console.log("The value of moveObject is: "+moveObject);
    console.log("The value of buttonFunctionality is: "+buttonFunctionality);
    console.log("The value of pageToNavigateTo is: "+pageToNavigateTo);
    console.log("The value of divHeight is: "+divHeight);
    console.log("The value of divWidth is: "+divWidth);
    console.log("The value of editClicked is: "+editClicked);
    console.log("The value of isInnerComoonent is: "+isInnerComponent);
    console.log("The value of innerGlobalZIndex is: "+innerGlobalZIndex);

    const resizeHandleRef = useRef(null);
    const bgImageValue = specs.backgroundImageUrl
    ? `url("${specs.backgroundImageUrl}")`
    : "none";

    const navigate= useNavigate();

    const addCategoryToDivision=async(e)=>{
      try{
        const response=await fetch(
          'http://localhost:3000/addCategoryToDivision',
          {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify({})
          }
        )
      }
      catch(err){

      }
    };
    const handleDelete=async(e)=>{
      console.log("The handleDelete was entered");
      try{
        const response=await fetch(
          'http://localhost:3000/deleteComponent',
          {
            method: "DELETE",
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify({component_id}),
          }
        );
        if(response.ok){
          console.log("The component was deleted successfully");
        }
        else{
          console.log("Failed to delete the component");
        }
      }
      catch(err){
        console.log("There was an error: ",err);
      }
    };

    const updateComponent=async(e)=>{
        try
        {
          const response=await fetch(
          'http://localhost:3000/updateComponent',
          {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify({newSpecs: newSpecs, page_id: page_id, component_id}),
          }
        );
        if(response.ok){
          console.log("The response was ok");
        }
        else{
          console.log("The response is not ok");
        } 
      }
      catch(err){
          console.log("An error has occured", err);
      }
      }

    const handleChange = (field, value) => {
      setNewSpecs((prev) => ({ ...prev, [field]: value }));// a string naming which property to update (e.g. "fontSize", "label") and value: the new value to put there
    };
    const handleMouseDown = (e) => {
      console.log("The handleMouseDown was entered");
      const tempZ=innerGlobalZIndex;
      console.log("The new tempZ is: "+tempZ);
      handleChange("zIndex", (tempZ+1));
      setInnerGlobalZIndex(tempZ+1);
      if(isAdmin)
      isDragging.current = true;
      console.log("The isDragging.current was set to true");
      updateComponent();
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y, 
      };
    };

    const handleResizeMouseDown = (e) => {
      e.stopPropagation(); // ADDED: prevents this from also triggering handleMouseDown (move-drag)
      isResizing.current = true;
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      };
    };

    const handleMouseMove = useCallback((e) => {
    if (isDragging.current) {
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;
      setMoveObject(true);  
      if(page_id!==2){
      // Clamp so the object's top-left corner can't go past the top or left edge
      newX = Math.max(0, newX);
      newY = Math.max(160, newY);

     
      }
      else{
        if(newX<0)
          newX=0;
        if(newY<0)
          newY=0;
      }
      setPosition({
        x: newX,
        y: newY,
      });
      handleChange("x", newX);
      handleChange("y", newY);
    }
    if (isResizing.current) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        setSize({
          width: Math.max(20, resizeStart.current.width + deltaX),
          height: Math.max(20, resizeStart.current.height + deltaY),
        });
        handleChange("height", Math.max(20, resizeStart.current.height + deltaY));
        handleChange("width", Math.max(20, resizeStart.current.width + deltaX));
        
      }
  }, [divHeight, divWidth, size.width, size.height]);

    const handleMouseUp = useCallback(() => {
        setTimeout(() => {
          setMoveObject(false);
        }, 2000);
      if(isDragging.current){
        isDragging.current = false;
        updateComponent();
      }
      if(isResizing.current){
        isResizing.current = false; 
        updateComponent();
      }
    }, [newSpecs]);
    const getInnerComponents = async () => {
      console.log("The function getInnerComponents was entered");
    try {
      const response = await fetch(
        `http://localhost:3000/getInnerComponents?component_id=${component_id}`,
        { method: "GET" }
      );
      if(response.ok){
        console.log("I am in getInnerComponents, The response was ok");
      }
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("The data that I got is: ");
      console.log(data);
      setOptions(data); 
    } catch (err) {
      console.error("Failed to fetch inner components:", err);
    }
  };
  useEffect(() => {
    if (specs.type === "divToDisplayProducts") {
      console.log("specs.type===divToDisplayProducts");
      getInnerComponents();
    }
  }, [component_id, specs.type]);
    useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [handleMouseMove, handleMouseUp]);
    if(isInnerComponent){
      console.log("I am displaying a very important inner product, the specs:   ");
      console.log(specs);
      if(specs.type==="button")
      {
      return (
      <div
        style={{
          display:"flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
      <button
        className="btn btn-draggable"
        style={{
          position: "relative",
          width: specs.width,
          height: specs.height,
          ...(!specs.backgroundImageUrl && { backgroundColor: specs.backgroundColor }),
          ...(specs.backgroundImageUrl && {
            backgroundImage: bgImageValue,//how to make this image fill the whole button not just part of it?
            backgroundSize: "cover", 
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }),
          color: specs.fontColor,
          fontSize: specs.fontSize,
          fontWeight: specs.fontWeight,
          borderRadius: specs.borderRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `${specs.borderWidth}px solid ${specs.borderColor}`,
        }}
        onClick={()=>{
          console.log("The value of editClicked is: "+editClicked);
          if(editClicked){
            console.log("Editing should start now");
            navigate(`/addElementPage?editClicked=true&newSpecs=${encodeURIComponent(JSON.stringify(specs))}&newPage_id=${page_id}&newComponent_id=${component_id}&buttonFunctionality=${buttonFunctionality}&pageToNavigateTo=${pageToNavigateTo}`);
            
          }
          else{
          if(!moveObject && buttonFunctionality==="navigate"){
            console.log("********************** The value of buttonFunctionality is: "+buttonFunctionality);
            setTimeout(() => {
              console.log("The page now should navigate to "+pageToNavigateTo);
              navigate(`/${pageToNavigateTo}`);
            }, 1000);
          }
          else if(!moveObject && buttonFunctionality==="navigateToItemPage"){
            console.log("********************** The value of buttonFunctionality is: "+buttonFunctionality);
            setTimeout(() => {
              console.log("The page now should navigate to "+pageToNavigateTo);
              navigate(`/Item?component_id=${component_id}`);
            }, 1000);
          }
        }
        }}
        >
        {specs.label}
        
        
       { isAdmin && (<div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "fit-content",
            height: "fit-content",
            background: "red",
            borderRadius: "50%",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this component?"
            );

            if (confirmed) {
              handleDelete();
            }
          }}
        >🗑️
        </div>)}
      </button>
      <div
        style={{
          width: (specs.width),
          height: specs.height/3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:specs.backgroundColorBelow,
          fontColor: specs.fontColorBelow,
          fontSize: specs.fontSizeBelow,
          fontWeight: specs.fontWeightBelow,
        }}
      >{specs.labelBelow}</div>
      </div>
    );
  }
  if(specs.type==="block")
      {
      return (
      <div
        style={{
          display:"flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
      <div
        className="btn btn-draggable"
        style={{
          position: "relative",
          width: specs.width,
          height: specs.height,
          ...(!specs.backgroundImageUrl && { backgroundColor: specs.backgroundColor }),
          ...(specs.backgroundImageUrl && {
            backgroundImage: bgImageValue,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }),
          color: specs.fontColor,
          fontSize: specs.fontSize,
          fontWeight: specs.fontWeight,
          borderRadius: specs.borderRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `${specs.borderWidth}px solid ${specs.borderColor}`,
        }}
        onClick={()=>{
          if(editClicked){
            navigate(`/addElementPage?editClicked=true&newSpecs=${encodeURIComponent(JSON.stringify(specs))}&newPage_id=${page_id}&newComponent_id=${component_id}&buttonFunctionality=${buttonFunctionality}&pageToNavigateTo=${pageToNavigateTo}`);
           
          }
          else{
          if(!moveObject){
            setTimeout(() => {
              console.log("The page now should navigate to "+pageToNavigateTo);
              navigate(`/${pageToNavigateTo}`);
            }, 1000);
          }
        }
        }}
        >
        {specs.label}
        
        
       {isAdmin && (<div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "fit-content",
            height: "fit-content",
            background: "red",
            borderRadius: "50%",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this component?"
            );

            if (confirmed) {
              handleDelete();
            }
          }}
        >🗑️
        </div>)}
      </div>
      <div
        style={{
          width: (specs.width),
          height: specs.height/2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:specs.backgroundColorBelow,
        }}
      >{specs.labelBelow}</div>
      </div>
    );
  }
    }

    else{
    if(specs.type==="button"){
    return (
      <div>
      <button
        onMouseDown={handleMouseDown}
        className="btn btn-draggable"
        style={{
          
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: "grab",
          width: size.width,
          height: size.height,
          ...(!specs.backgroundImageUrl && { backgroundColor: specs.backgroundColor }),
          ...(specs.backgroundImageUrl && {
            backgroundImage: bgImageValue,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }),
          color: specs.fontColor,
          fontSize: specs.fontSize,
          fontWeight: specs.fontWeight,
          borderRadius: specs.borderRadius,
          zIndex: newSpecs.zIndex,
          border: `${specs.borderWidth}px solid ${specs.borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e)=>{
          if(component_id===517)
            setDoTheSignIn(true);
          if(component_id===522){
            console.log("The setDoTheLogout(true) was applied");
            setDoTheLogout(true);
          }
          if(component_id===539){
              console.log("We are applying the setDoTheSignUp to true");
              setDoTheSignUp(true);
          }
          console.log("This button was pressed honestly");//here when I am displaying this as an inner component(when displaying options) this sentence is not being printed
          if (resizeHandleRef.current && resizeHandleRef.current.contains(e.target)) {
            return;
          }
          console.log("The value of moveObject is: "+moveObject);
          if(editClicked){
            navigate(`/addElementPage?editClicked=true&newSpecs=${encodeURIComponent(JSON.stringify(specs))}&newPage_id=${page_id}&newComponent_id=${component_id}&buttonFunctionality=${buttonFunctionality}&pageToNavigateTo=${pageToNavigateTo}`);
            
          }
          else{
          if(!moveObject && buttonFunctionality==="navigate"){
            setTimeout(() => {
              console.log("The page now should navigate to "+pageToNavigateTo);
              navigate(`/${pageToNavigateTo}`);
            }, 1000);
          }
          else if(!moveObject && buttonFunctionality==="navigateToItemPage"){
            console.log("********************** The value of buttonFunctionality is: "+buttonFunctionality);
            setTimeout(() => {
              console.log("The page now should navigate to "+pageToNavigateTo);
              navigate(`/Item?component_id=${component_id}`);
            }, 1000);
          }
        }
        }}
      >
        {specs.label}
        {isAdmin && (<div
          ref={resizeHandleRef}
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 12,
            height: 12,
            cursor: "nwse-resize",
            background: "rgba(0,0,0,0.3)",
          }}
        />)}

        {(component_id!==502 && component_id!==503 && component_id!==504 && component_id!==505 && component_id!==519 && component_id!==522 && component_id!==517 && component_id!==539 && isAdmin) && (<button
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "fit-content",
            height: "fit-content",
            background: "red",
            borderRadius: "50%",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this component?"
            );

            if (confirmed) {
              handleDelete();
            }
          }}
        >🗑️
        </button>)}
      </button>
      </div>
    );
    }
    if(specs.type==="divToDisplayProducts"){
      console.log("Hey I am talking to you, the backgroundImageUrl is: "+specs.backgroundImageUrl);
    return (
      <div>
      <div
        onMouseDown={handleMouseDown}
        className="btn btn-draggable"
        style={{
          position: "absolute",
          left: position.x, 
          top: position.y,
          cursor: "grab",
          width: size.width,
          height: size.height,
          ...(!specs.backgroundImageUrl && { backgroundColor: specs.backgroundColor }),
          ...(specs.backgroundImageUrl && {
            backgroundImage: bgImageValue,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }),
          color: specs.fontColor,
          fontSize: specs.fontSize,
          fontWeight: specs.fontWeight,
          zIndex: newSpecs.zIndex,
          borderRadius: specs.borderRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e)=>{
          if (resizeHandleRef.current && resizeHandleRef.current.contains(e.target)) {
            return;
          }
          console.log("The value of moveObject is: "+moveObject);
          if(editClicked){
            navigate(`/addElementPage?editClicked=true&newSpecs=${encodeURIComponent(JSON.stringify(specs))}&newPage_id=${page_id}&newComponent_id=${component_id}&buttonFunctionality=${buttonFunctionality}&pageToNavigateTo=${pageToNavigateTo}`);
            
          }
          else{
          if(!moveObject){
            setTimeout(() => {
              console.log("The page now should navigate to "+pageToNavigateTo);
              navigate(`/${pageToNavigateTo}`);
              
            }, 1000);
          }
        }
        }}
      >
        {specs.label}

          {specs.type === "divToDisplayProducts" && (
    <div
      style={{
          width: specs.width,
          height: specs.height,
          color: specs.fontColor,
          fontSize: specs.fontSize,
          fontWeight: specs.fontWeight,
          borderRadius: specs.borderRadius,
          border: `${specs.borderWidth}px solid ${specs.borderColor}`,
          display:"flex",
          gap: "50px",
          flexWrap: "wrap",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {options.map((option) => (
      <div
          key={option.component_id}
        onClick={(event) => {
          event.stopPropagation(); // stops clicks on this inner component from bubbling to the outer divToDisplayProducts container
          console.log("This option was clicked");
        }}
        onMouseDown={(event) => {
          event.stopPropagation(); // same for mousedown, so it doesn't trigger the outer drag logic
    }}
      >
        <Component
          key={option.component_id}
          page_id={option.page_id}
          specs={option.specs} /*here I am sending the specs that contain labelDown, why when printing the specs.labelDown it's not appearing?*/
          component_id={option.component_id}
          buttonFunctionality={option.buttonFunctionality}
          pageToNavigateTo={option.pageToNavigateTo}
          editClicked={editClicked}
          isInnerComponent={true}
          isAdmin={isAdmin}
        />
      </div>
      ))}
      {isAdmin && (<button
      style={{
        backgroundColor:"blue",
        width:"100px",
        height:"50px",
      }}
        onClick={(e) => {
          e.stopPropagation();
          navigate(
            `/addElementPage?divDisplayOptions=true&component_id=${component_id}&page_id=${page_id}`
          );
        }}
      >
        Add Category
      </button>)}
    </div>
  )}
      {isAdmin && (
        <>
        <div
          ref={resizeHandleRef}
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 12,
            height: 12,
            cursor: "nwse-resize",
            background: "rgba(0,0,0,0.3)",
          }}
        />
        <button
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "fit-content",
            height: "fit-content",
            background: "red",
            borderRadius: "50%",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this component?"
            );

            if (confirmed) {
              handleDelete();
            }
          }}
        >🗑️
        </button>
        </>
        )}
      </div>
      </div>
    );
    }
    else if(specs.type==="block"){
    return (
      <div
        onMouseDown={handleMouseDown}
        className="btn btn-draggable"
        style={{
          
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: "grab",
          width: size.width,
          height: size.height,
          ...(!specs.backgroundImageUrl && { backgroundColor: specs.backgroundColor }),
          ...(specs.backgroundImageUrl && {
            backgroundImage: bgImageValue,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }),
          color: specs.fontColor,
          fontSize: specs.fontSize,
          zIndex: lowestZIndex ? 1: newSpecs.zIndex,
          fontWeight: specs.fontWeight,
          borderRadius: specs.borderRadius,
          border: `${specs.borderWidth}px solid ${specs.borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e)=>{
          if (resizeHandleRef.current && resizeHandleRef.current.contains(e.target)) {
            return;
          }
          console.log("The value of moveObject is: "+moveObject);
          if(editClicked){
            navigate(`/addElementPage?editClicked=true&newSpecs=${encodeURIComponent(JSON.stringify(specs))}&newPage_id=${page_id}&newComponent_id=${component_id}&buttonFunctionality=${buttonFunctionality}&pageToNavigateTo=${pageToNavigateTo}`);
            }
        }}
        >
        {Number(component_id) === 521 ? nameOfTheUser : Number(component_id) === 540 ? errorMessage : Number(component_id) === 541 ? errorMessage : specs.label}
        
        {isAdmin && (
        <>
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 12,
            height: 12,
            cursor: "nwse-resize",
            background: "rgba(0,0,0,0.3)",
          }}
        />
        <button
            style={{
            position: "absolute",
            right: 0,
            top: "50%",
            width: "fit-content",
            height: "fit-content",
            background: "lightblue",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e)=>{
            e.stopPropagation();

            const confirmed = window.confirm(
              lowestZIndex
                ? "Are you sure you want to return this component's visual dominance to normal?"
                : "Are you sure you want to set this component as the lowest?"
            );

            if (!confirmed) return;
            if(lowestZIndex===false){
              console.log("the lowestZIndex is false initially and now we want to put it true");
              updateIsTheLowest(true);
              setLowestZIndex(true);
              setLowestZIndexButtonLabel("normal height");
            }
            else{
              console.log("the lowestZIndex is true initially and now we want to put it false");
              updateIsTheLowest(false);
              setLowestZIndex(false);
              setLowestZIndexButtonLabel("Set the lowest");
            }
          }}
        >
          {lowestZIndexButtonLabel}
        </button>
        </>
        )}
        {component_id!==521 && isAdmin && (<div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "fit-content",
            height: "fit-content",
            background: "red",
            borderRadius: "50%",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this component?"
            );

            if (confirmed) {
              handleDelete();
            }
          }}
        >🗑️
        </div>)}
      </div>
      
    );
    }
    
    else if(specs.type==="input"){
      
    return (
      <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: newSpecs.zIndex,
      }}
  >
    <input 
      onMouseDown={handleMouseDown}
      onChange={(e) => {
        const value = e.target.value;
        handleChange("label", value);
        if (component_id === 516) {
          setSignInPassword(value);
        }
        if (component_id===514){
          setSignInEmail(value);
        }
        if (component_id===526){
          setSignUpUsername(value);
        }
        if (component_id===537){
          setSignUpEmail(value);
        }

        if (component_id===538){
          setSignUpPassword(value);
        }

      }}
      placeholder={component_id === 516 ? "Password" : component_id === 514 ? "Email" : component_id === 538 ? "Password" : component_id === 537 ? "Email" : component_id === 526 ? "Name of the User" : ""}
      className="btn btn-draggable"
      value={newSpecs.label}
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        ...(!specs.backgroundImageUrl && { backgroundColor: specs.backgroundColor }),
          ...(specs.backgroundImageUrl && {
            backgroundImage: bgImageValue,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }),
        color: specs.fontColor,
        fontSize: specs.fontSize,
        fontWeight: specs.fontWeight,
        borderRadius: specs.borderRadius,
        border: `${specs.borderWidth}px solid ${specs.borderColor}`,
        textAlign: "center",
        boxSizing: "border-box",
        userSelect: "none",
      }}
      onClick={(e)=>{
          if (resizeHandleRef.current && resizeHandleRef.current.contains(e.target)) {
            return;
          }
          console.log("The value of moveObject is: "+moveObject);
          if(editClicked){
            navigate(`/addElementPage?editClicked=true&newSpecs=${encodeURIComponent(JSON.stringify(specs))}&newPage_id=${page_id}&newComponent_id=${component_id}&buttonFunctionality=${buttonFunctionality}&pageToNavigateTo=${pageToNavigateTo}`);
            
          }
        }}
    />
    {isAdmin && (<div
      onMouseDown={(e) => {
        e.stopPropagation();
        handleResizeMouseDown(e);
      }}
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 12,
        height: 12,
        cursor: "nwse-resize",
        background: "rgba(0,0,0,0.3)",
      }}
    />)}
        {(component_id!==514 && component_id!==516 && component_id!==524 && component_id!==526 && component_id!==531 && isAdmin) && (<div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "fit-content",
            height: "fit-content",
            background: "red",
            borderRadius: "50%",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this component?"
            );

            if (confirmed) {
              handleDelete();
            }
          }}
        >🗑️
        </div>)}
  </div>
    );
    }
  }
  }