    import { Square, MapPin, Heading } from "lucide-react";
    import React, {useState} from "react";
    import { useNavigate } from "react-router-dom";
    export default function AddOptions({setType, addButtonPressed, setAddButtonPressed, setCreateComponentPage}) {
      const navigate=useNavigate();
      return (
        <div className={`add-options-page ${!addButtonPressed? "hidden" : ""}`}>
        <div className="add-options-card">
          <h2 className="add-options-question">What would you like to add?</h2>

          <div className="option-list">
            <button
              onClick={() => {
                setCreateComponentPage(true);
                setAddButtonPressed(false);
                setType("button");
              }
              }
              className="option-item"
            >
              🔘
              <span>New button</span>
            </button>

            <button
              onClick={() => {
                setCreateComponentPage(true);
                setAddButtonPressed(false);
                setType("block");
              }}
              className="option-item"
            >
              🔳
              <span>New block</span>
            </button>

            <button
              onClick={() => {
                setCreateComponentPage(true);
                setAddButtonPressed(false);
                setType("input");
              }}
              className="option-item"
            >
              📥
              <span>New input</span>
            </button>

            <button
              onClick={() => {
                  setCreateComponentPage(true);
                  setAddButtonPressed(false);
                  setType("divToDisplayProducts");
              }}
              className="option-item"
            >
              🛒
              <span>Division to Display Products</span>
            </button>
            <button
              onClick={()=>{
                setAddButtonPressed(false);
              }}
              className="discard-button"
              >Discard</button>
          </div>
        </div>
        </div>
      );
    }
