  import { Plus, Pencil } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import React, {useRef, useState, useEffect} from "react";
  import AddOptions from "./AddOptions";
  import AddElementPage from "./AddElementPage";
  import Component from "./Component";
  export default function Page({page_id, name}) {
    const cameraInputRef = useRef(null);
      const [imagePreview, setImagePreview] = useState(null);
      const fileInputRef = useRef(null);
      const handleCameraClick = () => {
        cameraInputRef.current.click();
      };
      
    console.log("The page_id is: "+page_id);
    console.log("The name is: "+name);
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
          console.log("This try block was entered");
          setAppliedBackgroundImage(backgroundImage);   
          const formData = new FormData();
          formData.append("backgroundImage", imageFile);
          formData.append("backgroundColor", "");
          formData.append("backgroundIsImage", true);
          formData.append("page_id", page_id);
          const response=await fetch(
            'http://localhost:3000/updateBackgroundImage',
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
        console.log("The useEffect that's supposed to run when the page renders was entered");
        const getBackground=async()=>{
      try{
        console.log("The get background was entered");
        const response=await fetch(
          `http://localhost:3000/getBackground?page_id=${page_id}`,
          {
            method: "GET",
            credentials:"include",
          }
        );
        const data=await response.json();
        if(response.ok){
          console.log("The background was retrieved successfully");
          console.log("when rendering the page, The data is: ");
          console.log(data);
          console.log("The data.background.backgroundIsImage is:");
          console.log(data.background[0].backgroundIsImage);
          if(!data.background[0].backgroundIsImage){
            console.log("The backgroundIsImage was false so we are setting the background as a color");
            console.log("The background color is: ");
            console.log(data.background[0].backgroundColor);
            setBackgroundColor(data.background[0].backgroundColor);
          }
          else{
            console.log("The backgroundIsImage was true so we are setting the background as image");
            console.log("this is before trying to set the background image, What I am getting from the database: "+data.background[0].backgroundImage);
            setAppliedBackgroundImage(data.background[0].backgroundImage);//I am having a problem here
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
            'http://localhost:3000/addPage',
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
        console.log("The handleChangeColor was entered");
        const response=await fetch(
          'http://localhost:3000/updateBackground',
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
        console.log("I am trying to get components");
        const getComponents=async()=>{
        try{
          console.log("Now we are declaring the response");
          const response=await fetch(
            'http://localhost:3000/getComponents',
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
      <div>
      {!createComponentPage && <AddOptions setType={setType} addButtonPressed={addButtonPressed} setAddButtonPressed={setAddButtonPressed} setCreateComponentPage={setCreateComponentPage}/>}
      {createComponentPage && <AddElementPage page_id={page_id} setCreatePressed={setCreatePressed} type={type} setAddButtonPressed={setAddButtonPressed} setCreateComponentPage={setCreateComponentPage}/>}
      <div className={`home-page ${addButtonPressed? "blur" : createComponentPage? "hidden" : ""}`}
        style={{
          backgroundColor: `${backgroundColor}`,
          backgroundImage: appliedBackgroundImage ? `url(${appliedBackgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div>
        {components.map((component) => {
          return (
            <Component
              page_id={page_id}
              component_id={component.component_id}
              specs={component.specs}
            />
          );
        })}
        </div>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
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
            onClick={() => console.log("Edit clicked")}
            className="btn btn-edit"
          >
            <Pencil size={18} />
            Edit
          </button>
          </div>
          <div style={{
            textAlign: "center",
          }}>
            <form onSubmit={handleAddPage}>
                <h4>Add a New Page</h4>
                <input placeholder="name of the page" onChange={(e)=>{
                  setNewPageName(e.target.value);
                }}></input>
                <button type="submit">OK</button>
            </form>
            <br/><br/>
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
          </div>
        </div>
      </div>
      </div>
    );
  }
