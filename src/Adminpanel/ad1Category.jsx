
import React, { useState, useEffect } from 'react';
import './ad1Category.css';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import {baseUrl} from './BASE_URL';




function CategorySection() {
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const [districtInput, setDistrictInput] = useState("");
  const [newStateInput, setNewStateInput] = useState("Tamil Nadu");
  const [statesData, setStatesData] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [editDistrictIndex, setEditDistrictIndex] = useState(null);

  const [isDirty, setIsDirty] = useState(false);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fetchCategory = async () => {
  //   const response = await fetch("http://localhost:3001/category");
  //   const data = await response.json();
  //   setCategoryData(data);

  //   // Populate the local state with data from backend
  //   const mapped = {};
  //   data.forEach(({ state, districts }) => {
  //     mapped[state] = districts;
  //   });
  //   setStatesData(mapped);
  // };


 const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${baseUrl}/category`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategoryData(data);

      // Populate the local state with data from backend
      const mapped = {};
      data.forEach(({ state, districts }) => {
        mapped[state] = districts;
      });
      setStatesData(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setStatesData({ "Tamil Nadu": [] }); // Default empty state
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategory();
  }, []);
  // const handleSelectState = (stateName) => {
  //   setSelectedState(stateName);
  //   setNewStateInput(stateName);
  // };


  const handleSelectState = (stateName) => {
    if (isDirty) {
      const confirmLeave = window.confirm("You have unsaved changes. Do you want to save them?");
      if (confirmLeave) {
        handleSaveCategory(new Event("submit")); // simulate save
      }
    }
    setSelectedState(stateName);
    setNewStateInput(stateName);
    setDistrictInput("");
    setEditDistrictIndex(null);
    setEditCategory(null);
    setIsDirty(false);
  };
  
  //START WITH 1ST LETTER CAPS
  const toTitleCase = (str) =>
    str.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  // ADD STATE FUNCTION 
  const handleAddState = () => {
    // const newState = newStateInput.trim();
    const newState = toTitleCase(newStateInput.trim());
    if (!newState) return;
    const existingStates = Object.keys(statesData).map(s => s.toLowerCase());

    // If in edit mode and the state name was changed
    if (editCategory && editCategory.state !== selectedState) {
      const confirmRename = window.confirm(
        `You're renaming the state from '${selectedState}' to '${newState}'. Proceed?`
      );
      if (!confirmRename) return;

       // Just update the name (rename)
  const updatedDistricts = statesData[selectedState];
  const newStatesData = { ...statesData };
  delete newStatesData[selectedState];
  newStatesData[newState] = updatedDistricts;

  setStatesData(newStatesData);
  setSelectedState(newState);
  setEditCategory({ ...editCategory, state: newState });
  setIsDirty(true);
  alert(`State renamed to '${newState}'`);
  return;
    }
   
    if (existingStates.includes(newState.toLowerCase()) && newState.toLowerCase() !== selectedState.toLowerCase()) {
      alert("State name already exists!");
      return;
    }
    
    

    setStatesData((prev) => ({
      ...prev,
      [newState]: []
    }));
    setSelectedState(newState);
    alert(`State '${newState}' added!`);

    setTimeout(() => {
      handleSaveCategory(new Event("submit"));
    }, 0);
  };
  //ADD DISTRICT FUNCTION
  // const handleAddDistrict = () => {
  //   // const trimmedDistrict = districtInput.trim();
  //   const trimmedDistrict = toTitleCase(districtInput.trim());
  //   if (!trimmedDistrict) return;
  //   const existingDistricts = (statesData[selectedState] || []).map(d => d.toLowerCase());
  //   if (existingDistricts.includes(trimmedDistrict.toLowerCase())) {
  //     alert("District already added!");
  //     return;
  //   }

  //   setStatesData((prev) => ({
  //     ...prev,
  //     [selectedState]: [...(prev[selectedState] || []), trimmedDistrict]
  //   }));
  //   setDistrictInput("");
  // };


  const handleAddDistrict = () => {
    const trimmedDistrict = toTitleCase(districtInput.trim());
    if (!trimmedDistrict) return;
  
    const existingDistricts = (statesData[selectedState] || []).map(d => d.toLowerCase());
    const isDuplicate = existingDistricts.includes(trimmedDistrict.toLowerCase());
  
    if (editDistrictIndex !== null) {
      // Edit mode
      const updated = [...statesData[selectedState]];
      updated[editDistrictIndex] = trimmedDistrict;
  
      setStatesData((prev) => ({
        ...prev,
        [selectedState]: updated,
      }));
  
      setDistrictInput("");
      setEditDistrictIndex(null);
    } else {
      if (isDuplicate) {
        alert("District already added!");
        return;
      }
  
      setStatesData((prev) => ({
        ...prev,
        [selectedState]: [...(prev[selectedState] || []), trimmedDistrict],
      }));
      setDistrictInput("");
    }
  };
 
  const handleRemoveDistrict = (districtToRemove) => {
    const confirmDelete = window.confirm("Do you want to delete this district?");
    if (!confirmDelete) return;
  
    const updated = statesData[selectedState].filter((dist) => dist !== districtToRemove);
    setStatesData((prev) => ({
      ...prev,
      [selectedState]: updated,
    }));
  
    setEditDistrictIndex(null); // Reset if deleting edited district
    setDistrictInput(""); // Reset input
  };
  
  //REMOVE STATES
  const handleRemoveState = (stateToRemove) => {
    //alert to remove the date
    const confirmDelete = window.confirm(
      "If you delete the state, all its districts will also be deleted. Do you want to proceed?"
    );
    if (!confirmDelete) return;

    const newData = { ...statesData };
    delete newData[stateToRemove];
    setStatesData(newData);

    // Also remove from database if exists
    const category = categoryData.find(c => c.state === stateToRemove);
    if (category) handleDelete(category._id);
  };


  //SAVE THIS CATEGORY TO DATABASE
  const handleSaveCategory = async (e) => {
    e.preventDefault();
     if (error) {
      alert("Cannot save while connection error exists. Please check your server connection.");
      return;
    }

    try {
      const existing = categoryData.find(
        (c) => c.state.toLowerCase() === selectedState.toLowerCase()
      );

      const payload = {
        state: selectedState,
        districts: statesData[selectedState] || [],
      };

      if (!payload.districts.length) {
        alert("Cannot save a state without at least one district.");
        return;
      }

      let method = "POST";
      let url = `${baseUrl}/category`;
      let isUpdate = false;

      // Check if it's an existing state and not in edit mode
      if (existing && !editCategory) {
        // Check if district list has changed
        // const existingDistricts = existing.districts.sort().join(",");
        // const currentDistricts = payload.districts.sort().join(",");
        const existingDistricts = existing.districts.map(d => d.toLowerCase()).sort().join(",");
        const currentDistricts = payload.districts.map(d => d.toLowerCase()).sort().join(",");
        if (existingDistricts === currentDistricts) {
          alert("Only the state was added already. No district updates to save.");
          return;
        }

        // Districts updated
        method = "PUT";
        url = `${baseUrl}/category/${existing._id}`;
        isUpdate = true;
      }

      if (editCategory) {
        method = "PUT";
        url = `${baseUrl}/category/${editCategory._id}`;
        isUpdate = true;
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save");
      }

      const data = await response.json();

      // Update local categoryData
      if (!editCategory && !existing) {
        setCategoryData([...categoryData, data]);
        alert("New state added successfully!");
      } else {
        const updated = categoryData.map((c) =>
          c._id === (editCategory?._id || existing?._id) ? data : c
        );
        setCategoryData(updated);
        alert(
          editCategory
            ? "Edited successfully!"
            : "State updated with new districts."
        );
      }

      setEditCategory(null);
      setEditDistrictIndex(null);

      setNewStateInput("");
      setDistrictInput("");
      setIsDirty(false); // Reset dirty flag

      fetchCategory();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };



  const handleDelete = async (id) => {
    const category = categoryData.find(c => c._id === id);
    if (!category) return;
 try {
    await fetch(`${baseUrl}/category/${id}`, { method: "DELETE" });

    setCategoryData(categoryData.filter(c => c._id !== id));

    const updatedStates = { ...statesData };
    delete updatedStates[category.state];
    setStatesData(updatedStates);

    if (selectedState === category.state) {
      setSelectedState(Object.keys(updatedStates)[0] || "");
    }
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };


  const handleEditState = (category) => {
    // setEditCategory(category);
    setSelectedState(category.state);
    setNewStateInput(category.state);
    setEditCategory(category);
  };



  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
  
  return (
    <div>
    {loading ? (
        <div className="loading-message">Loading categories...</div>
      ) : error ? (
        <div className="error-message">
          Failed to load categories. Please make sure the server is running and try again.
          <button onClick={fetchCategory} className="retry-button">Retry</button>
        </div>
      ) : (
      <form onSubmit={handleSaveCategory}>
        <div className='categoryStateDistrictMain'>
          <div className='categoryStateDistrictLeft'>
            <div className='adminCategoryHeadings'>Location Category</div>
            <div className='categoryContent'>
              <div className='CategoryDistrictAdd'>
                <div className='categoryContent1 adminCategoryHeadings'>
                  State
                  <input
                    type='text'
                    placeholder='Enter State'
                    className='categoryInput'
                    value={newStateInput}
                    // onChange={(e) => setNewStateInput(e.target.value);
                    
                    // }
                    onChange={(e) => {
  setNewStateInput(e.target.value);
  setIsDirty(true);
}}
                  />
                </div>
                <div className='categoryPlusSection' onClick={handleAddState}>
                  <img src='./images/plusIcon.svg' className='categoryPlus' alt="Add Icon" />
                  {editCategory ? "Update" : "Add"}
                  {/* {editCategory ? "Edit State" : "Add State"} */}
                </div>
              </div>

              <div className='CategoryDistrictAdd'>
                <div className='categoryContent1 adminCategoryHeadings'>
                  District
                  <input
                    type='text'
                    className='categoryInput'
                    placeholder='Enter District'
                    value={districtInput}
                    // onChange={(e) => setDistrictInput(e.target.value)}
                    onChange={(e) => {
  setDistrictInput(e.target.value);
  setIsDirty(true);
}}
                 
                  />
                </div>
                <div className='categoryPlusSection' onClick={handleAddDistrict}>
                  <img src='./images/plusIcon.svg' className='categoryPlus' alt="Add Icon" />
                  {/* Add */}
                  {editDistrictIndex !== null ? "Update" : "Add"}
                </div>
              </div>
            </div>

            <div className='categoryAddedShow'>
              <div className='adminCategoryHeadings'>Added Districts</div>
              <div className='d-flex categoryContent categoryAddedMain'>

                                {statesData[selectedState]?.length > 0 ? (

                statesData[selectedState]?.map((district, idx) => (
                  <div key={idx} className='categoryAddedContent'>
                    {district}
                    <i
                    className="fa-solid fa-pen-to-square categoryeditIcon"
                    onClick={() => {
  setDistrictInput(district);
  setEditDistrictIndex(idx);
  setIsDirty(true);
}}></i>
                    <i className="fa-regular fa-circle-xmark categoryplusXmark"
                      onClick={() => handleRemoveDistrict(district)}></i>

                  </div>
                ))

                 ) : (
                    <div className="no-data-message">No districts added yet</div>
                  )}
              </div>
            </div>
          </div>

          <div className='categoryStateDistrictRight'>
            <div className='adminCategoryHeadings'>Added States</div>
            <div className='categoryContent'>
                            {Object.keys(statesData).length > 0 ? (

              Object.keys(statesData).map((stateName, idx) => {
                const isMatch = newStateInput.trim() && stateName.toLowerCase().includes(newStateInput.trim().toLowerCase());
                return (
                  <div
                    key={idx}
                    className={`categoryStateList ${selectedState === stateName ? "activeState" : ""} ${isMatch ? "matchState" : ""}`}
                    onClick={() => handleSelectState(stateName)}>
                    {stateName}
                    <i
                    className="fa-solid fa-pen-to-square categoryeditIcon"
                    onClick={(e) => {
  e.stopPropagation(); // prevent selecting the state as well
  const toEdit = categoryData.find(c => c.state === stateName);
  if (toEdit) handleEditState(toEdit);
}}
                    // onClick={()=>handleEditState()}
                  ></i>
                    <i className="fa-regular fa-circle-xmark categoryplusXmark"
                    onClick={(e) => {
  e.stopPropagation();
  handleRemoveState(stateName);
}}
                     // onClick={()=>handleRemoveState()}
                      ></i>
                  </div>
                )
              })
               ) : (
                  <div className="no-data-message">No states available. Add a new state.</div>
                )}
            </div>
          </div>
        </div>
        {/* <button className='categorySaveBtn' type='submit' disabled={!statesData[selectedState]?.length}>Save</button> */}
        <button className='categorySaveBtn' type='submit' disabled={!selectedState  || error}>Save</button>

      </form>
      )}
    </div>
  );
}

export default CategorySection;

