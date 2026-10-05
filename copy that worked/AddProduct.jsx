import React, { useRef, useState } from "react";

function AddProduct() {
  const cameraInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleCameraClick = () => {
    cameraInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Add New Product
        </h2>

        {/* Camera Button */}
        <button
          className="cameraButton "
          onClick={handleCameraClick}
        >
          📸 Take Picture
        </button>

        {/* Hidden Camera Input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <p style={{ margin: "15px 0", textAlign: "center" }}>or</p>

        {/* Upload Image */}
        <label className="uploadButton">
          Upload Image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>

        {/* Image Preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Product Preview"
            className="imagePreview"
          />
        )}

        <input
          type="text"
          placeholder="Product Name"
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Price ($)"
          style={styles.input}
        />

        <select style={styles.input}>
          <option>Select Category</option>
          <option>Nuts</option>
          <option>Seeds</option>
          <option>Dried Fruits</option>
          <option>Spices</option>
        </select>

        <textarea
          placeholder="Product Description"
          rows="5"
          style={styles.textarea}
        ></textarea>

        <button style={styles.saveButton}>
          Save Product
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    backgroundColor: "#fff",
    width: "500px",
    maxWidth: "100%",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
  },

  input: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  textarea: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical",
    marginBottom: "20px",
  },

  saveButton: {
    padding: "12px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default AddProduct;