import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AddElementPage({page_id, setComponentSpecs, setCreatePressed, setAddButtonPressed, setCreateComponentPage, type}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [specs, setSpecs] = useState({
    x: 0,
    y: 0,

    type: type,
    label: (type === "button" ? "New Button" : type === "block" ? "New Text" : ""),

    fontSize: 16,
    fontColor: (type === "button" ? "#ffffff" : type === "block" ? "black" : ""),
    fontWeight: "normal",

    backgroundColor: (type === "button" ? "#4f46e5" : type === "block" ? "white" : type === "input" ? "white" : ""),
    backgroundImageUrl: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#000000",

    width: (type === "button" ? 120 : type === "block" ? 400 : type === "input" ? 200 : 0),
    height: (type === "button" ? 40 : type === "block" ? 150 : type === "input" ? 150 : 0),
  });

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
    e.preventDefault();
    try {
      await fetch(
        'http://localhost:3000/storeComponent',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ specs: specs, page_id: page_id }),
        }
      );
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  };

  // Wrap in quotes so URLs with special characters (spaces, ?query, #, etc.)
  // don't break the CSS url() syntax — this is the actual fix.
  const bgImageValue = specs.backgroundImageUrl
    ? `url("${specs.backgroundImageUrl}")`
    : "none";

  return (
    <div className="add-element-page">
      <h1>Add New Element</h1>

      <form className="add-element-form" onSubmit={handleSubmit}>

        {/* --- Position --- */}
        <fieldset>
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
        </fieldset>

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
            Font Color
            <input
              type="color"
              value={specs.fontColor}
              onChange={(e) => handleChange("fontColor", e.target.value)}
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
        </fieldset>

        {/* --- Appearance --- */}
        <fieldset>
          <legend>Appearance</legend>

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
        </div>

        <div className="add-element-actions">
          <button type="submit">Create</button>
          <button type="button" onClick={() => {
            setAddButtonPressed(false);
            setCreateComponentPage(false);
          }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}