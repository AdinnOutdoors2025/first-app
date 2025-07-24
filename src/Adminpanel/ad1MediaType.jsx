import React, { useState, useEffect } from 'react'
import './ad1MediaType.css';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import {baseUrl} from './BASE_URL';

function MediaTypeSection() {

  const [ adminMediaType, setAdminMediaType] = useState('Gantry');
  //Fetch
  const [mediaTypesData, setMediaTypesData] = useState([]);
  const [editingId, setEditingId] = useState(null);

   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // const fetchMediaTypes = async () => {
  //   try {
  //     const res = await fetch('http://localhost:3001/mediatype');
  //     const data = await res.json();
  //     setMediaTypesData(data);
  //   } catch (err) {
  //     alert('Failed to fetch media types: ' + err.message);
  //   }
  // };

 const fetchMediaTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${baseUrl}/mediatype`);
      if (!res.ok) {
        throw new Error('Failed to fetch media types');
      }
      const data = await res.json();
      setMediaTypesData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchMediaTypes();
  }, []);

  const handleMediaTypeSave = async (e) => {
    e.preventDefault();
     if (error) {
      alert("Cannot save while connection error exists. Please check your server connection.");
      return;
    }
    try {
      const requestOptions = {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: adminMediaType }),
      };

      const url = editingId
        ? `${baseUrl}/mediatype/${editingId}`
        : `${baseUrl}/mediatype`;

      const res = await fetch(url, requestOptions);
      if (!res.ok) throw new Error(await res.text());

      alert(editingId ? 'Media type updated successfully' : 'Media type added successfully');
      setAdminMediaType('');
      setEditingId(null);
      fetchMediaTypes();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (media) => {
    setAdminMediaType(media.type);
    setEditingId(media._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media type?')) {
      try {
        const res = await fetch(`${baseUrl}/mediatype/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Media type deleted');
        fetchMediaTypes();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };


    return (

        <div>


        {loading ? (
        <div className="loading-message">Loading media types...</div>
      ) : error ? (
        <div className="error-message">
          Failed to load media types. Please make sure the server is running and try again.
          <button onClick={fetchMediaTypes} className="retry-button">Retry</button>
        </div>
      ) : (
      <form onSubmit={handleMediaTypeSave} >
        <div className='mediaTypeMain'>
          <div className='mediaTypeLeft'>
            <div className='adminMediaHeadings'>Media Category</div>
            <div className='mediaContent'>
              <div className='mediaAdd'>
                <div className='mediaContent1 adminMediaHeadings'>
                  Media Type
                 <div> <input
                    type='text'
                    placeholder='Enter Media Type'
                    className='AdminMediaInput'  value={adminMediaType} onChange={(e) => setAdminMediaType(e.target.value)} /></div>
                </div>
                {/* <div className='AdminMediaPlusSection' >
                  <img src='./images/plusIcon.svg' className='AdminMediaPlus' alt="Add Icon" />
                  Add
                </div> */}
              </div>
              <button className='mediaSaveBtn' type='submit'>
                {editingId ? 'Update' : 'Save'}
              </button>
                          </div>
          </div>

          <div className='mediaTypeRight'>
            <div className='adminCategoryHeadings'>Added Types</div>
            <div className='categoryContent'>
    {mediaTypesData.length > 0 ? (
                  mediaTypesData.map((media) => (
                <div key={media._id} className="categoryStateList">
                  {media.type}
                  <i
                    className="fa-solid fa-pen-to-square MediaeditIcon"
                    onClick={() => handleEdit(media)}
                  ></i>
                  <i
                    className="fa-regular fa-circle-xmark MediaPlusXmark"
                    onClick={() => handleDelete(media._id)}
                  ></i>
                </div>
              ))
              ) : (
                  <div className="no-data-message">No media types available. Add a new media type.</div>
                )}
                    
                </div>

            </div>
          </div>
      </form>
       )}
    </div>
        
    )
}

export default MediaTypeSection;
