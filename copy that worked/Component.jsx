import { useState, useRef, useCallback, useEffect } from "react";

export default function Component({ page_id, specs, component_id }) {
const [position, setPosition] = useState({ x: specs.x, y: specs.y });
  const [size, setSize] = useState({ width: specs.width, height: specs.height }); // ADDED: state to track resizable size, initialized from specs
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const isResizing = useRef(false); // ADDED: tracks whether a resize drag is in progress
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 }); // ADDED: stores starting mouse position + size when resize begins
  const [newSpecs, setNewSpecs]=useState(specs);
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
    isDragging.current = true;
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
    if (isDragging.current) { // ADDED: wrapped original logic in this if-check (was previously an early "return" guard)
      const newX=e.clientX - offset.current.x;
      const newY=e.clientY - offset.current.y;
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
  }, []);

  const handleMouseUp = useCallback(() => {
    if(isDragging.current){
      isDragging.current = false;
      updateComponent();
    }
    if(isResizing.current){
      isResizing.current = false; 
      updateComponent();
    }
  }, [newSpecs]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  if(specs.type==="button"){
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
        backgroundColor: specs.backgroundColor,
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
        backgroundColor: specs.backgroundColor,
        color: specs.fontColor,
        fontSize: specs.fontSize,
        fontWeight: specs.fontWeight,
        borderRadius: specs.borderRadius,
        border: `${specs.borderWidth}px solid ${specs.borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {specs.label}
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
    }}
>
  <input //how to make it possible for the user to write inside it?
    onMouseDown={handleMouseDown}
    onChange={(e)=>handleChange("label",e.target.value)}
    className="btn btn-draggable"
    value={newSpecs.label}
    style={{
      width: "100%",
      height: "100%",
      cursor: "grab",
      backgroundColor: specs.backgroundColor,
      color: specs.fontColor,
      fontSize: specs.fontSize,
      fontWeight: specs.fontWeight,
      borderRadius: specs.borderRadius,
      border: `${specs.borderWidth}px solid ${specs.borderColor}`,
      textAlign: "center",
      boxSizing: "border-box",
      userSelect: "none",
    }}
  />
  <div
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
  />
</div>
  );
  }
  
}