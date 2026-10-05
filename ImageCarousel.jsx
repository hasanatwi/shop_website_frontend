import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
const norm = (v) => String(v ?? "").trim().toLowerCase();

function imageMatchesSelection(image, selected) {
  const props = image.smallProperty || [];

  // An image with no properties has no conditions, so it always matches
  if (props.length === 0) return true;

  // Build a lookup with lowercase property names -> lowercase chosen option
  const chosenByProp = {};
  Object.entries(selected || {}).forEach(([k, v]) => {
    chosenByProp[norm(k)] = norm(v);
  });

  // EVERY property saved on the image must be satisfied by the admin's selection
  return props.every((prop, i) => {
    const chosen = chosenByProp[norm(prop)];

    // Nothing chosen yet for this property -> the image doesn't qualify.
    // (Change to `return true` if you only want to hide on a contradicting choice.)
    if (!chosen) return false;

    // Old data may store a plain string instead of an array, so support both
    const raw = image.correspondingOption?.[i];
    const options = Array.isArray(raw) ? raw : raw ? [raw] : [];

    return options.some((o) => norm(o) === chosen);
  });
}

export default function ImageCarousel({ itemId, images, setImages, properties, selectedOptions, isAdmin, setSelected }) {
  console.log("The images:");
  console.log(images);
  console.log("The first element of images : ");
  console.log(images[0].url);
  const [index, setIndex] = useState(0);
  const [property, setProperty]= useState("");
  const [correspondingOption, setCorrespondingOption]=useState("");
  const [navigateThroughAllImages, setNavigateThroughAllImages]= useState(false);
  const [navigateThroughImagesSentence, setNavigateThroughImagesSentence]=useState("Click here to navigate through all the images");
  const [property2, setProperty2]=useState("");
  const [correspondingOptionToDelete, setCorrespondingOptionToDelete]= useState("");
  const [description, setDescription]=useState("");
  
   useEffect(() => {
  const fetchDescription = async () => {
    try {
      const res = await fetch(`http://localhost:3000/getItemDescription?component_id=${itemId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Failed to fetch description:", data.message);
        return;
      }

      setDescription(data.description);
    } catch (err) {
      console.log("Error fetching description:", err);
    }
  };

  fetchDescription();
}, []);

  const handleSaveDescription = async () => {
  try {
    const res = await fetch("http://localhost:3000/updateItemDescription", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        itemComponentID: itemId,
        description: description,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Failed to update description:", data.message);
      return;
    }

    console.log("Description saved successfully");
  } catch (err) {
    console.log("Error saving description:", err);
  }
};

  const handleDeleteOption = async () => {
    console.log("The handleDeleteOption function was entered");
  const prop = property2.trim();
  const option = correspondingOptionToDelete.trim();

  // A property name is always required
  if (!prop) return;

  const currentImage = images[index];

  // Copy the arrays (wrap old plain-string entries in arrays so old data still works)
  const smallProperty = [...(currentImage.smallProperty || [])];
  const options = (currentImage.correspondingOption || []).map((o) =>
    Array.isArray(o) ? [...o] : o ? [o] : []
  );

  // Find the property (case-insensitive)
  const propIndex = smallProperty.findIndex((p) => norm(p) === norm(prop));
  if (propIndex === -1) {
    console.log("This property doesn't exist on this image");
    return;
  }

  if (!option) {
    // CASE 1: property only -> remove the property and its whole options array
    smallProperty.splice(propIndex, 1);
    options.splice(propIndex, 1);
  } else {
    // CASE 2: property + option -> remove just that option
    const propOptions = options[propIndex] || [];
    const optionIndex = propOptions.findIndex((o) => norm(o) === norm(option));

    if (optionIndex === -1) {
      console.log("This option doesn't exist for this property");
      return;
    }

    propOptions.splice(optionIndex, 1);

    // It was the last option -> remove the property and its (now empty) array too
    if (propOptions.length === 0) {
      smallProperty.splice(propIndex, 1);
      options.splice(propIndex, 1);
    }
  }

  const updatedImage = {
    ...currentImage,
    smallProperty,
    correspondingOption: options,
  };

  try {
    const res = await fetch("http://localhost:3000/deleteItemImageOption", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        itemComponentID: itemId,
        imageIndex: index,
        smallProperty: prop,
        correspondingOption: option, // "" means delete the whole property
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Failed to delete option:", data.message);
      return;
    }
    console.log("The option was deleted successfully");
    // Only update local state after the DB update succeeds
    setImages((prevImages) => {
      const updated = [...prevImages];
      updated[index] = updatedImage;
      return updated;
    });

    setProperty2("");
    setCorrespondingOptionToDelete("");
  } catch (err) {
    console.log("Error deleting option:", err);
  }
};
  
  console.log("The properties i got from the item are: ");
  console.log(properties);
  console.log("The selectedOptions i got from the item are: ");
  console.log(selectedOptions);
  const selected = Object.fromEntries(
  properties.map((prop, i) => [prop.property, selectedOptions[i]])
);
  console.log("selected becomes: ");
  console.log(selected);
  useEffect(() => {
  setSelected(selected);
}, [properties, selectedOptions]);
  const visibleImages = (images || []).map((image) =>
  imageMatchesSelection(image, selected)
  );
  console.log("visibleImages becomes: ");
  console.log(visibleImages);

  const navMap = new Map();
  let prev = null;
  let firstIndexVisible = -1;

  useEffect(()=>{
    if(firstIndexVisible!==-1){
      setIndex(firstIndexVisible);
    }
  },[selectedOptions, images]);

  for (let i = 0; i < images.length; i++) {
    if (visibleImages[i]) {
      if (firstIndexVisible === -1) firstIndexVisible = i;

      // Previous is known, next is not known yet
      navMap.set(i, [prev, null]);

      // Now that we found the next visible image, fill in the previous one's "next"
      if (prev !== null) {
        navMap.set(prev, [navMap.get(prev)[0], i]);
      }

      prev = i;
    }
  }

//I want you to merge the below
//I want the first part to be applied if navigateThroughAllImages is false
//I want the second part to be applied if navigateThroughAllImages is true

  const goPrev = () => setIndex((i) => (navigateThroughAllImages ? (i === 0 ? images.length - 1 : i - 1) : (navMap.get(i)?.[0] ?? i)));
  const goNext = () => setIndex((i) => (navigateThroughAllImages ? (i === images.length - 1 ? 0 : i + 1) : (navMap.get(i)?.[1] ?? i)));

     const handleAddProperty = async () => {
  const prop = property.trim();
  const option = correspondingOption.trim();
  if (!prop || !option) return;

  const currentImage = images[index];

  // Copy the arrays. Wrapping old string entries in an array keeps old data working.
  const smallProperty = [...(currentImage.smallProperty || [])];
  const options = (currentImage.correspondingOption || []).map((o) =>
    Array.isArray(o) ? [...o] : [o]
  );

  // Does this property already exist? (case-insensitive)
  const propIndex = smallProperty.findIndex(
    (p) => p.toLowerCase() === prop.toLowerCase()
  );

  if (propIndex !== -1) {
    // Property exists: add the option to the same index (skip duplicates)
    const alreadyExists = options[propIndex].some(
      (o) => o.toLowerCase() === option.toLowerCase()
    );
    if (alreadyExists) {
      console.log("This option already exists for this property");
      return;
    }
    options[propIndex].push(option);
  } else {
    // New property: add it with its first option
    smallProperty.push(prop);
    options.push([option]);
  }

  const updatedImage = {
    ...currentImage,
    smallProperty,
    correspondingOption: options,
  };

  try {
    const res = await fetch("http://localhost:3000/updateItemImageProperty", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        itemComponentID: itemId,
        imageIndex: index,
        smallProperty: prop,
        correspondingOption: option,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Failed to update image properties:", data.message);
      return;
    }

    // Only update local state after the DB update succeeds
    setImages((prevImages) => {
      const updated = [...prevImages];
      updated[index] = updatedImage;
      return updated;
    });

    setProperty("");
    setCorrespondingOption("");
  } catch (err) {
    console.log("Error updating image properties:", err);
  }
};

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <p className="text-neutral-300 text-sm">No images to display</p>
      </div>
    );
  }

    const handleDeleteImage = async (deleteIndex) => {
    try {
      console.log("The handleDeleteImage is entered");
      const res = await fetch("http://localhost:3000/deleteItemImage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemComponentID: itemId, imageIndex: deleteIndex }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Failed to delete image:", data.message);
        return;
      }

      // Only update local state after the DB delete succeeds
      setImages((prevImages) => {
        const updated = prevImages.filter((_, i) => i !== deleteIndex);

        setIndex((prevIndex) => {
          if (updated.length === 0) return 0;
          if (deleteIndex < prevIndex) return prevIndex - 1;
          if (prevIndex >= updated.length) return updated.length - 1;
          return prevIndex;
        });

        return updated;
      });
    } catch (err) {
      console.log("Error deleting image:", err);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <p className="text-neutral-300 text-sm">No images to display</p>
      </div>
    );
  }
/*
  let prev;
  let firstIndexVisible=-1;
  for i in images{
     if(visibleImages[i]==="true"){
            if(firstIndexVisible===-1)
              firstIndexVisible=i;
            map.set(i,[prev,?]);
            if(prev!==null)
              map.set(prev,[?,i]);
            prev=i;
     }
}
     map.set(firstIndexVisible, prev, ?);
     map.set(prev, ?, firstIndexVisible);
*/

  // navMap: image index -> [previousVisibleIndex, nextVisibleIndex] (circular)
  

  // Close the circle: first visible's prev = last visible, last visible's next = first visible
  if (firstIndexVisible !== -1) {
    navMap.set(firstIndexVisible, [prev, navMap.get(firstIndexVisible)[1]]);
    navMap.set(prev, [navMap.get(prev)[0], firstIndexVisible]);
  }

  console.log("navMap becomes: ");
  console.log(navMap);
  
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      {/* CHANGED: max-w-xs -> w-48 (320px -> 192px) to shrink overall width further */}
      <div style={{
        border: "5px solid black",
        fontSize: "20px",
        fontWeight: "bold",
      }} className="w-48">
        {((firstIndexVisible!==-1 && !navigateThroughAllImages) || navigateThroughAllImages) && (
        <div className="relative rounded-lg overflow-hidden bg-neutral-900 aspect-[4/3]">
        {console.log("the url is: "+images[index].url)}
        <div style={{
          display:"flex",
        }}>
          
            <p>index: {index}--</p>
          {
            <img
              src={images[index].url}
              height={"400px"}
              width={"400px"}
              className="w-full h-full object-cover"
            />  
          }

          {/* Display the property/option pairs for this image */}
            <div className="mt-2 flex flex-col gap-1">
            {(images[index].smallProperty || []).map((prop, i) => {
              const raw = images[index].correspondingOption?.[i];
              const options = Array.isArray(raw) ? raw : raw ? [raw] : [];

              return (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                  <span className="px-2 py-0.5 rounded bg-neutral-800">{prop}</span>
                  <span className="text-neutral-500">:</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800">
                    [{options.join(", ")}]
                  </span>
                </div>
              );
            })}
            <textarea
                  maxLength={250}
                  style={{ marginTop: "auto", marginBottom: "40px", background: "none", border: "none", fontWeight: "bold", fontSize: "16px", height: "200px" }}
                  type="text"
                  placeholder="Type something..."
                  value={description}
                  readOnly={!isAdmin}
                  onChange={(e)=>{
                    setDescription(e.target.value);
                  }}
                  onBlur={handleSaveDescription}
              />
            <p>PRICE: </p>

          </div>
            </div>
          {/* CHANGED: button size w-10 h-10 -> w-7 h-7, icon size 22 -> 16, inset left-3/right-3 -> left-1.5/right-1.5 */}
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => handleDeleteImage(index)}
            aria-label="Delete this image"
            className="absolute top-1.5 right-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-red-600/80 hover:bg-red-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <Trash2 size={14} />
          </button>
        </div>
        )}          <button
            onClick={()=>{
              if(navigateThroughImagesSentence==="Click here to navigate through all the images"){
                setNavigateThroughImagesSentence("Click here to navigate through the images that satisify the selected options");
                setNavigateThroughAllImages(true);
              }
              else{
                setNavigateThroughImagesSentence("Click here to navigate through all the images");
                setNavigateThroughAllImages(false);
                if(firstIndexVisible!==-1)
                setIndex(firstIndexVisible);
              }
            }}
          >{navigateThroughImagesSentence}</button>
        {/* CHANGED: text-sm -> text-xs, mt-4 -> mt-3, to match the smaller frame */}
        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-neutral-300 text-xs">{images[index].caption}</p>
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-neutral-600 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>
        {isAdmin && (<div>
        <p>This image appears when the following properties and options are selected</p>
        <label>Property: <input value={property}
            onChange={(e)=>{
              setProperty(e.target.value);
            }}
        /></label>
        <label>Corresponding Option: <input value={correspondingOption}
            onChange={(e)=>{
              setCorrespondingOption(e.target.value);
            }}
        /></label>
        <button onClick={()=>{
            handleAddProperty();
        }}>Add them</button>

        <p>Delete a certain option: </p>
        <label>Property: <input value={property2}
            onChange={(e)=>{
              setProperty2(e.target.value);
            }}
        /></label>
        <label>Corresponding Option: <input value={correspondingOptionToDelete}
            onChange={(e)=>{
              setCorrespondingOptionToDelete(e.target.value);
            }}
        /></label>
        <button onClick={()=>{
            handleDeleteOption();
        }}>Delete the option</button>
       </div>)}
      </div>
    </div>
  );
}