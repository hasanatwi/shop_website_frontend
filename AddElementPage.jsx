import { useState, useEffect , useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Page from "./Page";
function DisplayPages({setPageToNavigateTo, newSelectedPageName, editClicked}){
const [pages, setPages]=useState(null);
const [selectedPageName, setSelectedPageName]=useState(0);
const [didSelectPage, setDidSelectPage]=useState(false);
useEffect(() => {
  setSelectedPageName(newSelectedPageName);
}, [newSelectedPageName]);
  useEffect(()=>{
      const getPages= async()=>{
        try{
        const response=await fetch(
          'http://localhost:3000/getPages',
          {
            method: "GET",
            headers: {"Content-Type":"application/json"},
          }
        );
        if(response.ok){
        console.log("The data was retrieved successfully from the server");
        const result=await response.json();
        console.log("The pages that I got from the server is: ");
        console.log(result.data);
        setPages(result.data);
        }
        else{
          console.log("Failed to get the pages from the server");
        }
      }
      catch(err){
        console.log("There is an error: ",err);
      }
      };
      getPages();
      },[]);
  return(
  <div style={{
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    padding: "20px",
  }}>
    
    {pages && pages.map((page) => {
      console.log("didSelectPage is :", didSelectPage);
      console.log("editClicked is :", editClicked);
      console.log("page.name is :", page.name);
      console.log("selectedPageName is :", selectedPageName);
      return(
      <div>
      <div
        key={page.page_id}
        style={{
          width: "150px",
          height: "100px",
          border: (((didSelectPage || editClicked) && page.name===selectedPageName) ? "5px solid #3ed1c0" : `1px solid #ccc`),
          borderRadius: "6px",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "1500px",   // match the real full-size page width
            height: "1000px",  // match the real full-size page height
            transform: "scale(0.1)", // 150/1500 = 0.1
            transformOrigin: "top left",
          }}
          onClick={(e)=>{//why isn't this onClick working?
              console.log("The user clicked on the page and this is the page.name: "+page.name);
              setPageToNavigateTo(page.name);
              setSelectedPageName(page.name);
              setDidSelectPage(true);
            }}
        >
          <Page page_id={page.page_id} name={page.name} />
        </div>
      </div>
       <p style={{ margin: "4px 0 0", fontSize: "px", textAlign: "center" }}>
            {(page.name === "/") ? <span>HomeScreen</span> : page.name}
          </p>
      </div>)
})}
  </div>
);
}

export default function AddElementPage({page_name, page_id, setComponentSpecs, setCreatePressed, setAddButtonPressed, setCreateComponentPage, type}) {
  console.log("The value of type is: "+type);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [latestComponentID, setLatestComponentID]=useState(0);

  

  const getLatestComponentID = async () => {
    console.log("The getLatestComponentID was entered");
      try {
        const response = await fetch('http://localhost:3000/getLatestComponentID', {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to fetch latest component ID:", response.status);
          return latestComponentID;
        }

        const data = await response.json();


        let latestComponentID = data.latestComponentID;
        console.log("The latestComponentID retrieved from the database is: "+latestComponentID);
        setLatestComponentID(latestComponentID);
        return latestComponentID;
      } catch (err) {
        console.error("An error occurred while fetching latest component ID:", err);
      }
    };
    useEffect(()=>{
      getLatestComponentID();
    },[]); 
  const [buttonFunctionality, setButtonFunctionality]= useState("mishNavigate");
  const [pageToNavigateTo, setPageToNavigateTo]=useState("");
  const [newSelectedPageName, setNewSelectedPageName]=useState("");
  const [innerPageID, setInnerPageID]=useState(0);
  const [innerComponentID, setInnerComponentID]=useState(0);
  const [searchParams] = useSearchParams();
  const [pageID2, setPageID2]=useState(page_id);
  const [flag, setFlag]=useState("white");
  useEffect(()=>{
    console.log("the value of flag is: "+flag);
  },[]);
  useEffect(() => {
  const handlePopState = () => {
    window.location.reload();
  };
  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, []);

  const editClicked = searchParams.get("editClicked") === "true";
   console.log("editClicked:", editClicked);

   const divDisplayOptions = searchParams.get("divDisplayOptions") === "true";
   console.log("divDisplayOptions:", divDisplayOptions);

   let page_id2=0; 
   let pageToNavigateTo2="";
   const [componentID, setComponentID]=useState(0);
   useEffect(() => {
  if (divDisplayOptions) {
    const component_id = searchParams.get("component_id");
    console.log("The component_id that I got from the params is: "+component_id);
    setComponentID(component_id);
    console.log("The component_id of the division that I am working in is: "+componentID);
    const pageID3 = searchParams.get("page_id");
    setPageID2(pageID3);
    handleChange("width",200);
    handleChange("height",60);
    handleChange("backgroundColor","red");
    handleChange("label", "New Button");
    console.log("component_id:", component_id);
  }
}, [divDisplayOptions, searchParams]);
  useEffect(()=>{
    console.log("The new value of buttonFunctionality is: "+buttonFunctionality);
  },[buttonFunctionality]);
  
  useEffect(()=>{
    console.log("The new value of pageToNavigateTo is: "+pageToNavigateTo);
  },[pageToNavigateTo]);
  const [specs, setSpecs] = useState({
    x: 0,
    y: 300,
    zIndex:0,

    type: (!divDisplayOptions? type : "button"),
    label: (type === "button" ? "New Button" : type === "block" ? "New Text" : ""),
    labelBelow: "",
    
    fontSize: 16,
    fontSizeBelow: 16,
    fontColor: (type === "button" ? "#ffffff" : (type === "block" || type==="divToDisplayProducts") ? "black" : ""),
    fontColorBelow: "#ffffff",
    fontWeight: "normal",
    fontWeightBelow: "normal",

    backgroundColor: (type === "button" ? "#4f46e5" : (type === "block" || type==="divToDisplayProducts") ? "white" : type === "input" ? "white" : ""),
    backgroundColorBelow: "",
    backgroundImageUrl: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#000000",

    width: (type === "button" ? 120 : type === "block" ? 400 : type === "input" ? 200 : type==="divToDisplayProducts" ? 100 : 0),
    height: (type === "button" ? 40 : type === "block" ? 150 : type === "input" ? 150 : type==="divToDisplayProducts" ? 100 : 0),
  });
  const [innerSpecs, setInnerSpecs]=useState(specs);
  useEffect(()=>{
    if(editClicked){
      const newPage_id = searchParams.get("newPage_id");
      const newComponent_id = searchParams.get("newComponent_id");
      const newSpecsParam = searchParams.get("newSpecs");
      const newButtonFunctionality= searchParams.get("buttonFunctionality");
      const newPageToNavigateTo= searchParams.get("pageToNavigateTo");
      const newSpecs = newSpecsParam ? JSON.parse(newSpecsParam) : null;
      console.log("newPage_id:", newPage_id);
      console.log("newComponent_id:", newComponent_id);
      console.log("newSpecs:", newSpecs);
      console.log("newButtonFunctionality:", newButtonFunctionality);
      console.log("newPageToNavigateTo:", newPageToNavigateTo);

      if(newSpecs){
        setSpecs(newSpecs);
      }

      
      setInnerPageID(newPage_id);
      setInnerComponentID(newComponent_id);
      setButtonFunctionality(newButtonFunctionality);
      setPageToNavigateTo(newPageToNavigateTo);
      setNewSelectedPageName(newPageToNavigateTo);
      if(newSpecs.backgroundColor==="" && newSpecs.backgroundImageUrl==="")
        setFlag("green");
      
   }
},[searchParams]);
    useEffect(()=>{
      setInnerSpecs(specs);
    },[specs]);
const updateComponent=async(e)=>{
        setInnerSpecs(specs);
        console.log("The update component was entered");
        console.log("The newSpecs that I want to put are: ");
        console.log(innerSpecs);
        console.log("The innerPageID is: "); 
        console.log(innerPageID);
        console.log("The innerComponentID is: "); 
        console.log(innerComponentID);//this is the id of the component that I want to create its corresponding item
        console.log("The buttonFunctionality is: "); 
        console.log(buttonFunctionality);
        console.log("The pageToNavigateTo is: "); 
        console.log(pageToNavigateTo);
        try{
        const response=await fetch(
          'http://localhost:3000/updateComponent',
          {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify({newSpecs: innerSpecs, page_id: innerPageID, component_id: innerComponentID, buttonFunctionality: buttonFunctionality, pageToNavigateTo: pageToNavigateTo }),
          }
        );
      }
      catch(err){
        console.log("There is an error: ",err);
      }
      let itemExists=false;
      try{
        const response1=await fetch(
          `http://localhost:3000/checkComponentID?componentID=${componentID}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data1=await response1.json();
        if(response1.ok){
          if(data1.components>0){
            console.log("The item already exists in the database");
            itemExists=true;
          }
        }
      }
      catch(err){
        console.log("An error has occured: ",err);
      }
      if(!itemExists && buttonFunctionality==="navigateToItemPage"){
        console.log("We are about to store the item where it doesn't exist previously in the database");  
        try{
          const response2=await fetch(
            `http://localhost:3000/createItem`,
            {
              method: "POST",
              headers: {"Content-Type":"application/json"},
              credentials: "include",
              body: JSON.stringify({componentID: innerComponentID}),
            }
          );
          if(response2.ok){
            console.log("the Item was saved in the database successfully");
          }
          else{
            console.log("The Item wasn't saved in the database");
          }
        }
        catch(err){
          console.log("An error has occured");
        }
      }
      if(itemExists && buttonFunctionality!=="navigateToItemPage"){
          deleteItemByComponentId(innerComponentID);
      }
    }
  
  const handleChange = (field, value) => {
    setSpecs((prev) => ({ ...prev, [field]: value }));
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imageFile", file);

    try {
      const response = await fetch(
        'http://localhost:3000/updateImageURL',
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();

      if (response.ok) {
        const publicUrl = data.imageUrl.publicUrl;
        console.log("Uploaded image public URL:", publicUrl);
        handleChange("backgroundImageUrl", publicUrl);
        // Note: specs won't reflect the new value here yet — setSpecs is
        // async, so the state only updates on the next render. That's
        // expected, not a bug.
      } else {
        console.log("The response was not ok");
      }
    } catch (err) {
      console.log("An error has occured, ", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    console.log("Now we are starting to get the lateest component id");
    console.log("After running the getLatestComponentID the new value of latestComponentID is: "+latestComponentID);
    //let itemExists=false;
    console.log("The specs are: ");
    console.log(specs);
    console.log("The pageID2 is: "+pageID2);
    console.log("The buttonFunctionality is: "+buttonFunctionality);
    console.log("The pageToNavigateTo is: "+pageToNavigateTo);
    console.log("when submitting to store component The component_id is: "+componentID);
    e.preventDefault();
    try {
      console.log("The store component was entered");
      const response= await fetch(
        'http://localhost:3000/storeComponent',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ latestComponentID: latestComponentID,specs: specs, page_id: (!divDisplayOptions? pageID2: null), buttonFunctionality: buttonFunctionality, pageToNavigateTo: pageToNavigateTo, div_id:  componentID}),
        }
      );
    } catch (error) {
      console.error("There was an error entering the server", error);
    }
    
    if(buttonFunctionality==="navigateToItemPage"){
      console.log("We are starting the process that happens when the buttonFunctionality is navigateToItemPage");
      /*try{
        const response1=await fetch(
          `http://localhost:3000/checkComponentID?componentID=${componentID}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data1=await response1.json();
        if(response1.ok){
          if(data1.components>0){
            console.log("The item already exists in the database");
            itemExists=true;
          }
        }
      }
      catch(err){
        console.log("An error has occured: ",err);
      }*/
      /*if(!itemExists){*/
        console.log("We are about to store the item where it doesn't exist previously in the database");  
        console.log("Now we want to start the createItem process");
        console.log("JUST BEFORE  starting the createItem process, The value of the latestComponentID is: "+(latestComponentID+1));
        try{
          const response2=await fetch(
            `http://localhost:3000/createItem`,
            {
              method: "POST",
              headers: {"Content-Type":"application/json"},
              credentials: "include",
              body: JSON.stringify({componentID: (latestComponentID+1)}),
            }
          );
          if(response2.ok){
            console.log("the Item was saved in the database successfully");
          }
          else{
            console.log("The Item wasn't saved in the database");
          }
        }
        catch(err){
          console.log("An error has occured");
        }
     /* } */
    }
    
    if(divDisplayOptions)
      navigate(-1);
    else
    window.location.reload();

  };

  // Wrap in quotes so URLs with special characters (spaces, ?query, #, etc.)
  // don't break the CSS url() syntax — this is the actual fix.
  const bgImageValue = specs.backgroundImageUrl
    ? `url("${specs.backgroundImageUrl}")`
    : "none";
  
  return (
    <div className="add-element-page">
      {!editClicked && (<h1>Add New Element</h1>)}
      {editClicked && (<h1>Edit Element</h1>)}

      <form className="add-element-form" onSubmit={handleSubmit}>

        {/* --- Position --- */}
        {!divDisplayOptions  && (<fieldset>
          <legend>Position</legend>

          <label>
            x:
            <input
              value={specs.x}
              onChange={(e) => handleChange("x", Number(e.target.value))}
            />
          </label>

          <label>
            y:
            <input
              value={specs.y}
              onChange={(e) => handleChange("y", Number(e.target.value))}
            />
          </label>
        </fieldset>)}

        {/* --- Content --- */}
        <fieldset>
          <legend>Content</legend>

          <label>
            Type
            <select
              value={specs.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="button">Button</option>
              <option value="block">Block</option>
              <option value="input">Input</option>
              <option value="header">Header</option>
            </select>
          </label>

          <label>
            Label / Text
            <input
              type="text"
              value={specs.label}
              onChange={(e) => handleChange("label", e.target.value)}
            />
          </label>

          <label>
            Label that is located down
            <input
              type="text"
              value={specs.labelBelow}
              onChange={(e) => handleChange("labelBelow", e.target.value)}
            />
          </label>
        </fieldset>

        {/* --- Typography --- */}
        <fieldset>
          <legend>Typography</legend>

          <label>
            Font Size (px)
            <input
              type="number"
              min="8"
              max="72"
              value={specs.fontSize}
              onChange={(e) => handleChange("fontSize", Number(e.target.value))}
            />
          </label>

          <label>
            Font Size Label Below (px)
            <input
              type="number"
              min="8"
              max="72"
              value={specs.fontSizeBelow}
              onChange={(e) => handleChange("fontSizeBelow", Number(e.target.value))}
            />
          </label>

          <label>
            Font Color
            <input
              type="color"
              value={specs.fontColor}
              onChange={(e) => handleChange("fontColor", e.target.value)}
            />
          </label>

          <label>
            Font Color Label Below
            <input
              type="color"
              value={specs.fontColorBelow}
              onChange={(e) => handleChange("fontColorBelow", e.target.value)}
            />
          </label>

          <label>
            Font Weight
            <select
              value={specs.fontWeight}
              onChange={(e) => handleChange("fontWeight", e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </label>

          <label>
            Font Weight Below
            <select
              value={specs.fontWeightBelow}
              onChange={(e) => handleChange("fontWeightBelow", e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </label>
        </fieldset>

        {/* --- Appearance --- */}
        <fieldset>
          <legend>Appearance</legend>

          
          <button type="button"
            onClick={()=>{
              if(flag==="white"){
                console.log("Please try to understand, I entered the if statement");
                setFlag("green");
                handleChange("backgroundColor", "");
                handleChange("backgroundImageUrl", "");
              }
              else{
                console.log("Please try to understand, I entered the else statement");
                setFlag("white");
              }
            }}
            style={{
              backgroundColor: flag,
            }}
          >I don't need a background</button>
          
          <label>
            Select color to set as background
            <input
              type="color"
              value={specs.backgroundColor}
              onChange={(e) => {
                handleChange("backgroundColor", e.target.value);
                handleChange("backgroundImageUrl", "");
              }}
            />
          </label>
          <label>
            Select color to set as background for the label located down
            <input
              type="color"
              value={specs.backgroundColorBelow}
              onChange={(e) => {
                handleChange("backgroundColorBelow", e.target.value);
              }}
            />
          </label>

          <label className="uploadButton">
            Upload image to set as background
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>

          <label>
            Border Radius (px)
            <input
              type="number"
              min="0"
              value={specs.borderRadius}
              onChange={(e) => handleChange("borderRadius", Number(e.target.value))}
            />
          </label>

          <label>
            Border Width (px)
            <input
              type="number"
              min="0"
              value={specs.borderWidth}
              onChange={(e) => handleChange("borderWidth", Number(e.target.value))}
            />
          </label>

          <label>
            Border Color
            <input
              type="color"
              value={specs.borderColor}
              onChange={(e) => handleChange("borderColor", e.target.value)}
            />
          </label>
        </fieldset>

        {/* --- Size --- */}
        <fieldset>
          <legend>Size</legend>

          <label>
            Width (px)
            <input
              type="number"
              min="10"
              value={specs.width}
              onChange={(e) => handleChange("width", Number(e.target.value))}
            />
          </label>

          <label>
            Height (px)
            <input
              type="number"
              min="10"
              value={specs.height}
              onChange={(e) => handleChange("height", Number(e.target.value))}
            />
          </label>
        </fieldset>
        {console.log("I am so happy right now........ the value of specs.type is: "+specs.type)}
        {/* --- Functionality --- */}
        {(specs.type==="button") && (<fieldset>
          <legend>Functionality</legend>
          <label>
            What do you want this button to do?
            <select
              value={buttonFunctionality}
              onChange={(e) => setButtonFunctionality(e.target.value)}
            >
              <option value="navigate">Navigate</option>
              <option value="navigateToItemPage">Navigate to Item Page</option>
              <option value="mishNavigate">mishNavigate</option>
            </select>
          </label>
          
              
        </fieldset>)}
        {buttonFunctionality==="navigate" &&(
        <fieldset>
            <p style={{
              fontWeight: "bold",
            }}>Which page do you want this button to navigate to?</p>
          {!editClicked && (<DisplayPages setPageToNavigateTo={setPageToNavigateTo}/>)}
          {editClicked && (<DisplayPages setPageToNavigateTo={setPageToNavigateTo} newSelectedPageName={newSelectedPageName} editClicked={true}/>)}
        </fieldset>)
        } 
        {/* --- Live Preview --- */}
        <div className="preview-section">
          <p>Preview:</p>
          <div
            style={{
              width: specs.width,
              height: specs.height,
              backgroundColor: specs.backgroundColor,
              backgroundImage: bgImageValue,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: specs.fontColor,
              fontSize: specs.fontSize,
              fontWeight: specs.fontWeight,
              borderRadius: specs.borderRadius,
              border: `${specs.borderWidth}px solid ${specs.borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {specs.label}
          </div>
          <div style={{
            backgroundColor: specs.backgroundColorBelow,
            fontColor: specs.fontColorBelow,
            fontSize: specs.fontSizeBelow,
            fontWeight: specs.fontWeightBelow,
            width: specs.width,
            height: (specs.height/2),
            textAlign: "center",
            display: "flex",
            alignItems: "center",       // vertical centering
            justifyContent: "center", 
          }}>
          {specs.labelBelow}
          </div>
        </div>

        <div className="add-element-actions">
          {editClicked && (<button type="button"
          onClick={async ()=>{
            console.log("The page_name that I was in is: "+page_name);
            await updateComponent();
            navigate(-1);
          }}
          >Confirm Edit</button>)}
          {!editClicked && (<button  type="submit"
          >Create</button>)}
          {!divDisplayOptions &&
          (
            <div>
          {!editClicked && (<button type="button" onClick={() => {
            setAddButtonPressed(false);
            setCreateComponentPage(false);
          }}>
            Cancel
          </button>)}
          {editClicked && (<button type="button" onClick={() => {
            navigate(-1);
          }}>
            Cancel
          </button>)}
          </div>
          )
        }
        {
          divDisplayOptions && (<button type="button" onClick={() => {
            navigate(-1);
          }}>
            Cancel
          </button>)
        }
        </div>
      </form>
    </div>
  );
}