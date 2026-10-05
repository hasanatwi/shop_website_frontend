  import { Plus, Pencil } from "lucide-react";
    import { useNavigate } from "react-router-dom";
    import React, {useRef, useState, useEffect} from "react";
    import AddOptions from "./AddOptions";
    import AddElementPage from "./AddElementPage";
    import Component from "./Component";
    import ImageCarousel from "./ImageCarousel";
    import { showEmailError } from "./showEmailError.js";
    import { showPasswordError } from "./showPasswordError.js";
    
    export default function Page({page_id, name, innerGlobalZIndex, setInnerGlobalZIndex, setNameOfTheUser, nameOfTheUser, isAdmin, setIsAdmin}) {
      const containerRef = useRef(null);
      const [divHeight, setDivHeight] = useState(0);
      const [divWidth, setDivWidth] = useState(0);
      const [editClicked, setEditClicked] = useState(false);
      const [propertyName, setPropertyName]= useState("");
      const [propertyType, setPropertyType]= useState("text");
      const [unitOfMeasurement, setUnitOfMeasurement]=useState("");
      const [itemType, setItemType]=useState(""); 
      const [arrayItemTypes, setArrayItemTypes]=useState([]);
      const [typeWeAreDealingWith, setTypeWeAreDealingWith]=useState("");
      const [isProperty, setIsProperty]=useState(false);
      const [isOption, setIsOption]=useState(false);
      const [properties, setProperties]=useState([]);
      const [backgroundColorAddPropertyButton, setBackgroundColorAddPropertyButton]=useState("white");
      const [backgroundColorAddOptionButton, setBackgroundColorAddOptionButton]= useState("white");
      const [selectedOptions, setSelectedOptions] = useState([]);
      const [optionsToBeDeleted, setOptionsToBeDeleted] = useState([]);
      const [itemImagePreview, setItemImagePreview] = useState(null);
      const [itemImageFile, setItemImageFile] = useState(null);
      const [smallProperty, setSmallProperty]= useState("");
      const [correspondingOption, setCorrespondingOption]= useState("");
      const [signInEmail, setSignInEmail]= useState("");
      const [signInPassword, setSignInPassword]=useState("");
      const [doTheSignIn, setDoTheSignIn]=useState(false);
      const [doTheLogout, setDoTheLogout]= useState(false);
      const [doTheSignUp, setDoTheSignUp]= useState(false);
      const [signUpUsername, setSignUpUsername]= useState("");
      const [signUpEmail, setSignUpEmail]= useState("");
      const [signUpPassword, setSignUpPassword]=useState("");
      const [emailErrorMessage, setEmailErrorMessage]= useState("");
      const [passwordErrorMessage, setPasswordErrorMessage]= useState("");
      const [selected, setSelected]= useState([]);
      const [price, setPrice]= useState(0);
      useEffect(()=>{
        console.log("I am in page.jsx, The value of selected is: ");
        console.log(selected);
      },[selected]);
      useEffect(()=>{
        console.log("I am in page.jsx, The value of price is: ");
        console.log(price);
      },[price]);
      const handleAddPrice=async()=>{

      }

        useEffect(()=>{
          console.log("The emailErrorMessage becomes: "+emailErrorMessage);
        },[emailErrorMessage]);
        useEffect(()=>{
          console.log("The passwordErrorMessage becomes: "+passwordErrorMessage);
        },[passwordErrorMessage]);
        const handleSignUp = async () => {
          console.log("The handleSignUp was entered");
          console.log("The signUpUsername is: "+signUpUsername);
          console.log("The signUpEmail is: "+signUpEmail);
          console.log("The signUpPassword is: "+signUpPassword);
          if (!signUpUsername.trim() || !signUpEmail.trim() || !signUpPassword) {
            alert("Please fill in all the fields");
            return;
          }
          if(!showEmailError(signUpEmail, setEmailErrorMessage, setSignUpEmail) || !showPasswordError(signUpPassword, setSignUpPassword, setPasswordErrorMessage)){
            return;
          }
          try {
            const response = await fetch("https://shop-website-backend-irx9.onrender.com/signUp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include", // needed so the session cookie from req.login is saved
              body: JSON.stringify({
                username: signUpEmail.trim(),
                password: signUpPassword,
                nameOfTheUser: signUpUsername.trim(),
              }),
            });

            const data = await response.json();

            if (response.ok) {
              setNameOfTheUser(data.user.nameoftheuser);
              console.log("Sign up successful", data.user);
              navigate(-1);
            } else {
              alert(data.message);
            }
          } catch (err) {
            console.log("An error has occurred: ", err);
            alert("Could not reach the server");
          }
      };


      useEffect(()=>{
        if(doTheSignUp){
          console.log("Now we want to run handleSignUp()");
          handleSignUp();
          setDoTheSignUp(false);
        }
      }, [doTheSignUp]);

      const handleLogout = async () => {
      console.log("The const handleLogout was entered");
      try {
        const response = await fetch(`https://shop-website-backend-irx9.onrender.com/logout`, {
          method: "GET",
          credentials: "include", // required so the browser sends and clears the session cookie
        });
        const data = await response.json();
        if (response.ok) {
          if(isAdmin)
            setIsAdmin(false);
          console.log("The logout was successful");
          console.log("The page_id equals: "+page_id);
          setNameOfTheUser("The user is logged out"); // clear the user from state
          alert("The Logout was successful");
        } else {
          console.log("concerning the logout: The response was not ok:", data.message);
          alert("The logout failed");
        }
      } catch (err) {
        console.log("An error has occured: ", err);
      }
    };

      useEffect(()=>{
          if(doTheLogout){
            console.log("The if(doTheLogout) was entered because the doTheLogout is true");
            handleLogout();
            setDoTheLogout(false);
          }
      },[doTheLogout]);

      useEffect(()=>{
        console.log("when rendering the page the nameOfTheUser is: ");
        console.log(nameOfTheUser);
      },[]);

      useEffect(()=>{
        if(doTheSignIn){
          handleSignIn();
          setDoTheSignIn(false);
        }
      },[doTheSignIn]);

      useEffect(()=>{
        console.log("The value of signInEmail is: ");
        console.log(signInEmail);
      },[signInEmail]);

      useEffect(()=>{
        console.log("The value of signInPassword is: ");
        console.log(signInPassword);
      },[signInPassword]);
        {/*is there something wrong in this handleSignIn that is implemented afterwards?*/}
      const handleSignIn=async()=>{  
        console.log("The const handleSignIn was entered");
        console.log("The signInEmail is: ");
        console.log(signInEmail); 
        console.log("The signInPassword is: ");
        console.log(signInPassword); 
      try{
        console.log("This part is being entered inside the handleSignIn5");
        const response=await fetch(`https://shop-website-backend-irx9.onrender.com/login`,
          {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify({signInEmail, signInPassword}),
          }
        );
        const data= await response.json();
        if (response.ok) {
          console.log("The sign in was successful")
          console.log("The name of the user becomes: ");
          console.log(data.user.nameoftheuser);
          setNameOfTheUser(data.user.nameoftheuser);
          if(signInEmail==="hasanatwi00@gmail.com")
            setIsAdmin(true);
          navigate(-1);
        }
      else {
        console.log("concerning the sign in: The response was not ok:",data.message);
        alert("The sign in failed");
      }
          }
          catch(err){
            console.log("An error has occured: ",err);
      }
    }


      const itemImageInputRef = useRef(null);

      const getItemImages = async (itemComponentID) => {
    try {
      const response = await fetch(
        `https://shop-website-backend-irx9.onrender.com/getItemImages?component_id=${itemComponentID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Failed to get images:", data.message);
        return;
      }

      console.log("The fetched images are:");
      console.log(data.images);
      setImages(data.images);
    } catch (err) {
      console.log("There was an error getting the images:", err);
    }
  };


      const handleAddItemImageToList = async () => {
    if (!itemImageFile) {
      alert("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", itemImageFile);
      formData.append("itemComponentID", itemComponentID);

      const response = await fetch("https://shop-website-backend-irx9.onrender.com/addItemImage", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error uploading image:", data.message);
        alert("Failed to upload the image");
        return;
      }
      else{
        console.log("The image was stored in the storage");
      }

      setItemImagePreview(null);
      setItemImageFile(null);
      setSmallProperty("");
      setCorrespondingOption("");
      setImages(data.images);
      if (itemImageInputRef.current) itemImageInputRef.current.value = "";

      alert("The image was uploaded successfully");
    } catch (err) {
      console.log("There was an error uploading the image:", err);
      alert("There was an error uploading the image");
    }
  };

      const handleItemImageUploadClick = () => {
      itemImageInputRef.current.click();
      };

      const handleItemImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const imageURL = URL.createObjectURL(file);
          setItemImagePreview(imageURL);
          setItemImageFile(file);
        }
      };

      const [images, setImages]= useState([]);

      const handleDeleteProperty = async (propertyName, itemComponentID) => {
        
        try {
          const response = await fetch(`https://shop-website-backend-irx9.onrender.com/deleteProperty`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              itemComponentID,
              propertyName,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.log("Error deleting the property:", data.message);
            return;
          }

          console.log("Property deleted successfully:", data.properties);
          setProperties(data.properties); // updated itemType-level properties list
        } catch (err) {
          console.log("Error deleting property:", err);
        }
      };


      useEffect(() => {
        if (properties && properties.length > 0) {
          setOptionsToBeDeleted(
            properties.map((property) =>
              property.options && property.options.length > 0 ? property.options[0] : ""
            )
          );
        }
      }, [properties]);
      
      const handleOptionToDeleteChange = (index, newValue) => {
      setOptionsToBeDeleted((prev) => {
        const updated = [...prev];
        updated[index] = newValue;
        return updated;
      });
    };

    const handleDeleteOption = async (index, propertyName) => {
    const optToDelete = optionsToBeDeleted[index];
    if (!optToDelete) return;

    try {
      const response = await fetch(`https://shop-website-backend-irx9.onrender.com/deleteOption`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          itemComponentID,      // from your component's props/state
          propertyName,
          opt: optToDelete,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error deleting the option:", data.message);
        alert("Failed to delete the option");
        return;
      }
      else{
        alert("The option was deleted successfully");
      }
      console.log("Option deleted successfully:", data.properties);
      setProperties(data.properties); // refresh local state with the backend's returned properties
    } catch (err) {
      console.log("Error deleting option:", err);
    }
  };


      const addOptionLocally = (propertyName, newOption) => {
      setProperties(prev =>
        prev.map(property =>
          property.property === propertyName
            ? { ...property, options: [...property.options, newOption] }
            : property
        )
      );
    };

      

      useEffect(() => {
        setSelectedOptions(prev => properties.map((_, index) => prev[index] ?? ""));
      }, [properties]);

      const handleSelectChange = (index, value) => {
        setSelectedOptions(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
      };

      const [options, setOptions] = useState([]);
      useEffect(() => {
        setOptions(prev => properties.map((_, index) => prev[index] ?? ""));
      }, [properties]);

      const handleOptionChange = (index, value) => {
      setOptions(prev => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    };

      const params = new URLSearchParams(window.location.search);
      const itemComponentID = params.get("component_id");

      const addOptionToProperty = async (itemComponentID, propertyName, newOption, index) => {
        console.log("The addOptionToProperty was entered");

      try {
        const response = await fetch(
          'https://shop-website-backend-irx9.onrender.com/addOption',
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ itemComponentID, propertyName, newOption, index }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.log("Error adding the option: " + data.message);
          handleOptionChange(index, "");
          if(data.message.includes("already exists"))
            alert("The option already exists in the property");
          else
            alert("There was an error adding the option");
          return;
        }
        addOptionLocally(propertyName, newOption);

        handleOptionChange(index, "");
        console.log("The option was added successfully");
        console.log(data.properties);
        alert("The option was added successfully");
      } catch (err) {
        console.log("An error has occurred while adding the option: ", err);
      }
    };

      const getProperties = async (itemComponentID) => {
      try {
        const response = await fetch(
          `https://shop-website-backend-irx9.onrender.com/getProperties?component_id=${itemComponentID}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const data = await response.json();
          console.log("Failed to get properties:", data.message);
          return;
        }

        const data = await response.json();

        console.log("The properties are:");
        console.log(data.properties);
        setProperties(data.properties);

        return data.properties;

      } catch (err) {
        console.log("There was an error getting the properties:", err);
      }
    };
      useEffect(()=>{
        updateTypeWeAreDealingWith(itemComponentID);
        getProperties(itemComponentID);
        getItemImages(itemComponentID); 
      },[]);
      useEffect(()=>{
        console.log("the properties of the item becomes: ");
        console.log(properties);
      },[properties]);
      const fetchAndSetProperties = async (typeWeAreDealingWith, itemComponentID) => {
        console.log("We are starting the fetchAndSetProperties: ");
      try {
        const response = await fetch(
          `https://shop-website-backend-irx9.onrender.com/setProperties/${typeWeAreDealingWith}/${itemComponentID}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setProperties(data.properties);

      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

      const updateTypeWeAreDealingWith = async (itemComponentID) => {
    try {
      const response = await fetch(
        'https://shop-website-backend-irx9.onrender.com/updateTypeWeAreDealingWith',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ itemComponentID }),
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      console.log("Resolved type:", data.itemTypeName);
      setTypeWeAreDealingWith(data.itemTypeName);
      return data.itemTypeName; // or setState(...) here if this feeds a React state
    }
    catch (err) {
      console.log("There was an error", err);
    }
  };
      console.log("The itemComponentID is: "+itemComponentID);

      

      const setTypeID=async(typeName)=>{
        try{
          const response=await fetch(
            'https://shop-website-backend-irx9.onrender.com/setTypeID',
            {
              method: "POST",
              headers: {"Content-Type":"application/json"},
              credentials: "include",
              body: JSON.stringify({
              typeName: typeName,
              itemComponentID: `${itemComponentID}`   // if componentId is undefined → becomes "undefined"
            }),
            }
          )
        }
        catch(err){
          console.log("There was an error");
        }
      }

      useEffect(()=>{
        console.log("The arrayItemTypes array becomes: ");
        console.log(arrayItemTypes);
      },[arrayItemTypes]);

      useEffect(()=>{
        console.log("I am trying to get the item types");
      if(page_id===10){
        console.log("This very particular body was entered");
        const getItemTypes=async(e)=>{
        try{
          const response=await fetch(
            'https://shop-website-backend-irx9.onrender.com/getItemTypes',
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data=await response.json();
          if(response.ok){
            console.log("The array type names response was ok");
            setArrayItemTypes(data.itemTypeNames.map(item=>item.itemTypeName));
          }
          else{
            console.log("The response was not ok when trying to get the item types");
          }
        }
        catch(err){
            console.log("There was an error getting the item types: ",err);
        }
      }
      getItemTypes();
      }
      },[]);

      useEffect(()=>{

      }, []);

      const handleItemType= async(e)=>{
        console.log("The value of itemType is: "+itemType);
        e.preventDefault();
        console.log("handleItemType was entered");
        try{
          const response=await fetch(
            'https://shop-website-backend-irx9.onrender.com/addItemType',
            {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              credentials: "include",
              body: JSON.stringify({itemType: itemType}),
            }
          );
          const data=await response.json();
          if(response.ok){
            console.log("In handleItemType: The response was ok");
            alert("A new item type was added");
            setItemType("");
          }
          else{
            if(data.message.includes("already exists"))
            alert("This type already exists, enter another type");
            setItemType("");
          }
        }
        catch(err){
          console.log("An error has occured: " +err);
        }
      };

      const handleAddProperty= async(e)=>{
        console.log("The type we are dealing with: "+typeWeAreDealingWith);
          e.preventDefault();
          try{
              const response=await fetch(
                "https://shop-website-backend-irx9.onrender.com/addProperty",
                {
                  method: "POST",
                  headers: {"Content-Type":"application/json"},
                  credentials: "include",
                  body: JSON.stringify({propertyName: propertyName, propertyType: propertyType, typeWeAreDealingWith: typeWeAreDealingWith, unitOfMeasurement: unitOfMeasurement}),
                }
              );
              const data=await response.json();
              if(response.ok){
                console.log("The process in the server went successfully");
                setProperties(prev => [...prev, data.newProperty]);
                alert("The property was added successfully");
                setPropertyName("");
                setUnitOfMeasurement("");
              }
              else{
                console.log("The data.message is: ");
                console.log(data.message);
                console.log("The process in the server didn't go successfully");
                if(data.message.includes("existing properties"))
                  alert("The property already exists, add a new property");
                else
                  alert("The property wasn't added, an error occured");
                setPropertyName("");
                setUnitOfMeasurement("");
              }
          }
          catch(err){
            console.log("An error occured: "+err);
          }
      };

      

      useEffect(() => {
        if (containerRef.current) {
          setDivHeight(containerRef.current.offsetHeight);
          setDivWidth(containerRef.current.offsetWidth);
        }
      }, []);
      const cameraInputRef = useRef(null);
        const [imagePreview, setImagePreview] = useState(null);
        const fileInputRef = useRef(null);
        const handleCameraClick = () => {
          cameraInputRef.current.click();
        };
        
      const navigate= useNavigate();
      const [addButtonPressed, setAddButtonPressed]=useState(false);
      const [createComponentPage, setCreateComponentPage]=useState(false);
      const [type, setType]=useState("button");
      const [createPressed, setCreatePressed]=useState(false);
      const [components, setComponents]=useState([]);
      const [newPageName, setNewPageName]=useState("");
      const [backgroundColor, setBackgroundColor]=useState("");
      const [backgroundIsImage, setBackgroundIsImage]=useState(true);
      const [backgroundImage, setBackgroundImage]=useState("");
      const [appliedBackgroundImage, setAppliedBackgroundImage]=useState("");
      const [imageFile, setImageFile]= useState("");
      const handleBackgroundImage=async(e)=>{
            try{
            setAppliedBackgroundImage(backgroundImage);   
            const formData = new FormData();
            formData.append("backgroundImage", imageFile);
            formData.append("backgroundColor", "");
            formData.append("backgroundIsImage", true);
            formData.append("page_id", page_id);
            const response=await fetch(
              'https://shop-website-backend-irx9.onrender.com/updateBackgroundImage',
              {
                method: "POST",
                credentials: "include",
                body: formData,
              }
            );  
          }
          catch(err){
            console.log("There is an error: ",error);
          }
      };
        const handleImageChange = (event) => {
          const file = event.target.files[0];
      
          if (file) {
            const imageURL = URL.createObjectURL(file);
            console.log("before showing the preview, The imageURL is: ");
            console.log(imageURL);
            setImagePreview(imageURL);//here it's setting the image preview directly on the spot
            setBackgroundImage(imageURL);
            setImageFile(file);
          }
        };
      useEffect(()=>{
        console.log("The backgroundColor became: "+backgroundColor);
      },[backgroundColor]);

      useEffect(()=>{
        console.log("The newPageName became: "+newPageName);
      },[newPageName]);
      useEffect(()=>{
          console.log("The page_id is: "+page_id);
          console.log("The useEffect that's supposed to run when the page renders was entered");
          const getBackground=async()=>{
        try{
          console.log("The get background was entered");
          const response=await fetch(
            `https://shop-website-backend-irx9.onrender.com/getBackground?page_id=${page_id}`,
            {
              method: "GET",
              credentials:"include",
            }
          );
          const data=await response.json();
          if(response.ok){
            if(!data.background[0].backgroundIsImage){
              console.log("The gotten background color is: "+data.background[0].backgroundColor);
              setBackgroundColor(data.background[0].backgroundColor);
            }
            else{
              setAppliedBackgroundImage(data.background[0].backgroundImage);
            }
          }
          else{
            console.log("The background wasn't retrieved successfully");
          }
        }
      catch(err){
        console.log("There is an error: ",err);
      }
      }
      getBackground();
      },[]);
      
      const handleAddPage= async(e)=>{
          e.preventDefault();
          try{
            const response=await fetch(
              'https://shop-website-backend-irx9.onrender.com/addPage',
              {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({newPageName:newPageName}),
              }
            );
            if(response.ok){
              console.log("New page named: "+newPageName+" was added to the database");
              alert("A new page was created")
            }
          }
          catch(err){
            console.log("An error has appeared: "+err);
          }
      };
      const handleChangeColor=async(color)=>{
        try{
          console.log("The new color is: "+color);  
          const response=await fetch(
            'https://shop-website-backend-irx9.onrender.com/updateBackground',
            {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              credentials: "include",
              body: JSON.stringify({backgroundColor: color, backgroundImage: "", backgroundIsImage: false, page_id:page_id}),
            }
          );
          if(response.ok){
            console.log("The response was ok");
          }
          else{
            console.log("The response wasn't ok");
          }
        }
          catch(err){
            console.log("There was an error: ",err);
          }
        };

      console.log("The value of addButtonPressed is: "+addButtonPressed);
      
      useEffect(()=>{
          const getComponents=async()=>{
          try{
            const response=await fetch(
              'https://shop-website-backend-irx9.onrender.com/getComponents',
              {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                credentials: "include",
                body: JSON.stringify({page_id: page_id}),
              }
            );
            if(response.ok){
              console.log("The components were retrieved from the database successfully");
            }
            const data=await response.json();
            const components=data.components;
            setComponents(components);
            }
            catch(err){
              console.error("There was an error retrieving the data from the database");
            }
          }
            getComponents();
      },[]);
      
      return (
        <div ref={containerRef}>
        {page_id!==2 && (<Page page_id={2} name="header" innerGlobalZIndex={innerGlobalZIndex} setInnerGlobalZIndex={setInnerGlobalZIndex} nameOfTheUser={nameOfTheUser} setNameOfTheUser={setNameOfTheUser} isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>)}
        {!createComponentPage && <AddOptions setType={setType} addButtonPressed={addButtonPressed} setAddButtonPressed={setAddButtonPressed} setCreateComponentPage={setCreateComponentPage}/>}
        {createComponentPage && <AddElementPage page_name={name} page_id={page_id} setCreatePressed={setCreatePressed} type={type} setAddButtonPressed={setAddButtonPressed} setCreateComponentPage={setCreateComponentPage}/>}
          <div className={page_id === 2 ? "header" : `home-page ${addButtonPressed ? "blur" : createComponentPage ? "hidden" : ""}`}      
            style={{
            backgroundColor: (console.log("yo yo the backgroundColor is: " + backgroundColor), `${backgroundColor}`),//here I tried to put a color instead of this and still didn't work
            backgroundImage: appliedBackgroundImage ? `url(${appliedBackgroundImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              ...(page_id !== 2 && { marginTop: "200px" }),
            }}
          >
            
            {page_id === 10 && isAdmin && (
              <div className="propertiesOfItem" >
              <p>What type is the item that you are displaying now?</p>
              <select
              value={typeWeAreDealingWith}
              onChange={(e) => {
                const newValue = e.target.value;
                fetchAndSetProperties(e.target.value, itemComponentID);
                if (newValue === typeWeAreDealingWith) return; // no actual change

                const confirmChange = window.confirm(
                  "Changing this option will discard the data you've saved. Do you want to continue?"
                );

                if (confirmChange) {
                  setTypeWeAreDealingWith(newValue);
                  setTypeID(newValue);
                } else {
                  // Reset the select back to the current value
                  e.target.value = typeWeAreDealingWith;
                }
              }}
            >
              {arrayItemTypes.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
            <br/><br/>
            <div className="decidingWhatToDisplayInItem">
              <button 
                style={{
                  backgroundColor: `${backgroundColorAddPropertyButton}`,
                }}
                onClick={()=>{
                    if(isProperty===false){
                      setIsProperty(true); 
                      setIsOption(false);
                      setBackgroundColorAddPropertyButton("green");
                      setBackgroundColorAddOptionButton("white");  
                    }
                    else{
                      setIsProperty(false);
                      setBackgroundColorAddPropertyButton("white"); 
                    }
                }}
              >Add a property</button>
              <button
                style={{
                  backgroundColor: `${backgroundColorAddOptionButton}`,
                }}
                onClick={()=>{
                    if(!isOption){
                      setIsOption(true);
                      setIsProperty(false);
                      setBackgroundColorAddOptionButton("green"); 
                      setBackgroundColorAddPropertyButton("white"); 
                    }
                    else{
                      setIsOption(false);
                      setBackgroundColorAddOptionButton("white");
                    }
                }}>Add options for properties</button>
            </div>
            { (isProperty) &&(
            <form onSubmit={handleAddProperty}>
              
              <p>The type we are dealing with now is: {typeWeAreDealingWith}</p>
              <p>What properties do you want to add for this item?</p>
              <label>
                Add property:
                <input type="text"
                  value={propertyName}
                  onChange={(e)=>{
                    console.log("The property name that was just set is: "+e.target.value);
                    setPropertyName(e.target.value);
                  }}
                ></input>
              </label>
              <br/><br/>
              <label>
                Is this property a text or a number (e.g. Weight, color,...):
                <select
                  value={propertyType}
                  onChange={(e)=>{
                    console.log("The property type that was just set is: "+e.target.value);
                    setPropertyType(e.target.value);
                  }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
              </label>  
              <br/><br/>
              <label>
                Add a Unit of measurement:
                <input type="text"
                  value={unitOfMeasurement}
                  onChange={(e)=>{
                    console.log("The unit of measurement that was just set is: "+e.target.value);
                    setUnitOfMeasurement(e.target.value);
                  }}
                ></input>
              </label>
              <br/><br/>
              
              <br/><br/>
              <button type="submit">Submit Property</button>
            </form>
            )}
            
            {(isOption) && (<div>
            {properties.map((property, index) => (
              <div>
              <div key={index} style={{ marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
              }}>
                
                <p>Add an option for ➡️  </p>
                  {property.property}:

                  <input
                    value={options[index] || ""}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    type={property.datatype === "number" ? "number" : "text"}
                  />
                
                {property.unitOfMeasurement && (
                  <span> {property.unitOfMeasurement}</span>
                )}
                <button
                onClick={(e)=>{
                  addOptionToProperty(itemComponentID, property.property, options[index], index);
                }}
                style={{  
                  marginLeft:"10px",
                  height:"29px",
                  fontSize:"12px",
                }}>OK</button>
                </div> 
                <div style={{
                  display: "flex",
                  alignItems: "center",
                }}>
                <p>Delete an option for ➡️  </p>
                  {property.property}:
                <select
                    style={{ width: "50px" }}
                    value={optionsToBeDeleted[index] || ""}
                    onChange={(e) => handleOptionToDeleteChange(index, e.target.value)}
                  >
                {property.options.map((opt, optIndex) => (
                  <option key={optIndex} value={opt} style={{ fontSize: "18px" }}>
                    {opt}
                  </option>
                ))}
              </select>
              <button style={{  
                fontSize:"20px",
                backgroundColor:"rgb(212, 39, 39)",
                width:"50px",
                height:"35px",
                marginLeft:"10px",  
              }}
              onClick={()=>{
                handleDeleteOption(index, property.property);
              }}
              >🗑️</button>
                </div>
              </div>
            ))}
            </div>)}
          </div>
          )}
          {page_id === 10 && (
            <div style={{
              display: "flex",
              ...(!isAdmin && { flex: 1, justifyContent: "center" }),
              marginUp: "0 auto",
              marginBottom: "0 auto",
              marginRight: "0 auto",
            }}>
              {(images.length>0) && (<div><ImageCarousel images={images} setImages={setImages} itemId={itemComponentID} properties={properties} selectedOptions={selectedOptions} isAdmin={isAdmin} setSelected={setSelected}/></div>)}
              {(images.length===0) && (<h1>No images to display</h1>)}
              <div className="itemPropertiesDisplay">
              {properties.map((property, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                 {isAdmin && ( <button onClick={() => handleDeleteProperty(property.property, itemComponentID)}>🗑️</button>)}
                  <span style={{ minWidth: "100px", fontWeight: "bold" }}>
                    {property.property}:
                  </span>

                  <select
                    value={selectedOptions[index] || ""}
                    onChange={(e) => handleSelectChange(index, e.target.value)}
                  >
                    <option value="" disabled>
                      Select {property.property}
                    </option>
                    {property.options.map((opt, optIndex) => (
                      <option key={optIndex} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {property.unitOfMeasurement && (
                    <span style={{ color: "gray" }}>{property.unitOfMeasurement}</span>
                  )}
                </div>
              ))}
        {isAdmin && (<div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        <p>Set the price for these selected options</p> 
        <input type="number" value={price} onChange={(e)=>{
          setPrice(e.target.value);
        }}></input>
        <button onClick={handleAddPrice()}>Set the price</button>
        <p>Add an image to the list of images that you want to display when we are in this Item</p>
        <div className="addImageToItem">
          <button type="button">Take Picture</button>
          <button type="button" onClick={handleItemImageUploadClick}>
            Upload Image
          </button>
          <input
            ref={itemImageInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleItemImageChange}
          />
        </div>

        {itemImagePreview && (
          <div>
            <img
              src={itemImagePreview}
              alt="Item preview"
              className="imagePreview"
            />
            
            <div
              style={{
                display:"flex",
                gap:"10px",
              }}
            >
            <button
              type="button"
              onClick={() => {
                setItemImagePreview(null);
                setItemImageFile(null);
                setSmallProperty("");
                setCorrespondingOption("");
                if (itemImageInputRef.current) itemImageInputRef.current.value = "";
              }}
            >
              Remove Image
            </button>
            <button style={{
              backgroundColor:"lightblue",
            }}
            onClick={()=>{
              handleAddItemImageToList();
            }}
            >
              Add image to the list
            </button>
            </div>
          </div>
        )}
        </div>)}
          </div>
            </div>
          )}
          <div>
          {components.map((component) => {
            console.log("The specs are: ");
            console.log(component.specs);
              if (
                (
                  ((component.component_id !== 519 && component.component_id !== 502) ||
                nameOfTheUser === "The user is logged out" )
              && ((component.component_id !== 521 && component.component_id !== 522) ||
                nameOfTheUser !== "The user is logged out" )
              )
              )
            return (
              <Component //here i need you to edit if the component_id={503} margin right the most right of the screen by 15px
                page_id={page_id}
                component_id={component.component_id}
                specs={component.specs}
                buttonFunctionality={component.buttonFunctionality}
                pageToNavigateTo={component.pageToNavigateTo}
                divHeight={divHeight}
                divWidth={divWidth}
                editClicked={editClicked}
                isInnerComponent={false}
                innerGlobalZIndex={innerGlobalZIndex}
                setInnerGlobalZIndex={setInnerGlobalZIndex}
                setSignInEmail={setSignInEmail}
                setSignInPassword={setSignInPassword}
                setDoTheSignIn={setDoTheSignIn}  
                nameOfTheUser={nameOfTheUser}
                setDoTheLogout={setDoTheLogout}
                setDoTheSignUp={setDoTheSignUp}
                isTheLowest={component.isTheLowest}
                setSignUpUsername= {setSignUpUsername}
                setSignUpEmail= {setSignUpEmail}
                setSignUpPassword= {setSignUpPassword}
                emailErrorMessage= {emailErrorMessage}
                passwordErrorMessage= {passwordErrorMessage}
                setIsAdmin={setIsAdmin}
                isAdmin={isAdmin}
                />
            );
          })}
          </div>
            {isAdmin && (<div style={{
              backgroundColor: "white",
              padding: (page_id !== 2 ? "2rem" : "0.5rem"),
              width: "280px",
              height: ((page_id===2) ? "135px" : ""),
              margin: (page_id === 2 ? "0 auto" : "0 0 0 auto"),
              top: 0,
              left: 0,
              zIndex: 9999,
            }}>
          <div className="button-row">
            <button
              onClick={() => {setAddButtonPressed(true);
                }}
              className="btn btn-add"
            >
              <Plus size={18} />
              Add
            </button>

            <button
              onClick={() =>{
                console.log("The edit button was pressed");
                setEditClicked(!editClicked? true : false);
              }
              }
              className={`btn btn-edit${editClicked ? "-pressed" : ""}`}
            >
              <Pencil size={18} />
              Edit
            </button>
            </div>
            <div style={{
              textAlign: "center",
            }}>
              <form onSubmit={handleAddPage}>
                  {page_id!==2 && (<h4>Add a New Page</h4>)}
                  {page_id===2 && <br/>}
                  { page_id!==2 &&
                  (<input placeholder="name of the page" onChange={(e)=>{
                    setNewPageName(e.target.value);
                  }}></input>)}
                  { page_id===2 &&
                  (<input placeholder="Add a new page" onChange={(e)=>{
                    setNewPageName(e.target.value);
                  }}></input>)}
                  <button type="submit">OK</button>
              </form>
              <br/>
              {page_id===2 &&(
              <label>
                Choose Background Color:
                <input type="color"
                  onChange={(e)=>{
                    const color=e.target.value;
                    setBackgroundColor(e.target.value);
                    setBackgroundIsImage(false);
                    handleChangeColor(color);
                    setAppliedBackgroundImage("");
                  }}
                />
                </label>)}

              <br/><br/>
              {page_id !== 2 && (
                <>    
              <div style={{
                display:"flex",
                flexDirection: "column",
                gap:"20px",
                border: "2px solid black",
                padding: "2rem",
              }}>
                
                <label>
                Choose Background Color:
                <input type="color"
                  onChange={(e)=>{
                    console.log("I am in Page.jsx the chosen color is: "+e.target.value);
                    const color=e.target.value;
                    setBackgroundColor(e.target.value);
                    setBackgroundIsImage(false);
                    handleChangeColor(color);
                    setAppliedBackgroundImage("");
                  }}
                />
                </label>
                
                {/* Camera Button */}
                <button className="cameraButton"
                  onClick={handleCameraClick}
                >
                  📸 Take Picture
                </button>
                <label className="uploadButton">
                  Upload Image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="imagePreview"
                    />
                    <button onClick={()=>{
                      setImagePreview(null);
                      if(fileInputRef.current)
                        fileInputRef.current.value="";
                    }}>Remove Image</button>
                    <button
                    style={{
                      marginLeft:"10px",
                    }}
                    onClick={()=>{
                      handleBackgroundImage();
                    }}
                    >Set as Background Image</button>
                  </div>
              )}
              </div>
              </>)}
            </div>
            <div>
            </div>
              {page_id===1 && (
              <form onSubmit={handleItemType} className="handleItemTypeClass">
                <p>Now I need you to provide me with types of items you want to display</p>
                <label>
                  Enter the type of the item you want to add:
                  <input 
                    value={itemType}
                    onChange={(e)=>{
                      console.log("The value of e.target.value is: "+e.target.value);
                      setItemType(e.target.value);
                    }}
                  type="text"/>
                </label>
                <button type="submit">Add Item Type</button>
              </form>
            )}
          </div>)}

          </div>
        </div>
        </div>
      );
    }
