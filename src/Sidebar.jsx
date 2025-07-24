

import React from "react";

function Sidebar (){


  const spots = [
    {
        id: 1,
        location: "Adayar L B Road towards Thiruvanmiyur",
        price: "₹1,20,000",
        dimensions: "24 x 30",
        rating: 4.5,
        imageUrl: "./images/spot1.png",
    },
    {
        id: 2,
        location: "Adayar L B Road towards Thiruvanmiyur",
        price: "₹1,20,000",
        dimensions: "24 x 30",
        rating: 4.5,
        imageUrl: "./images/spot2.png",
    },
    {
        id: 3,
        location: "Adayar L B Road towards Thiruvanmiyur",
        price: "₹1,20,000",
        dimensions: "24 x 30",
        rating: 4.5,
        imageUrl: "./images/spot3.png",
    },
    {
        id: 4,
        location: "Adayar L B Road towards Thiruvanmiyur",
        price: "₹1,20,000",
        dimensions: "24 x 30",
        rating: 4.5,
        imageUrl: "./images/spot1.png",
    },
];

  return(
<div>
  <div className="container">
    <div className="row">
      {/* Left Sidebar */}
      <div className="col-md-3" style={{ border: "1px solid gray" }}>
        {/* Sidebar Section */}
        <h5>Outdoor Medium</h5>
        <form>
          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="busShelter"
              />
              <label className="form-check-label" htmlFor="busShelter">
                Bus shelter
              </label>
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="gantry" />
              <label className="form-check-label" htmlFor="gantry">
                Gantry
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="hoarding"
              />
              <label className="form-check-label" htmlFor="hoarding">
                Hoarding
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="poleKiosk"
              />
              <label className="form-check-label" htmlFor="poleKiosk">
                Pole Kiosk
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="policeBooth"
              />
              <label className="form-check-label" htmlFor="policeBooth">
                Police Booth
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="signalPost"
              />
              <label className="form-check-label" htmlFor="signalPost">
                Signal Post
              </label>
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="unipole" />
              <label className="form-check-label" htmlFor="unipole">
                Unipole
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="wallGraphic"
              />
              <label className="form-check-label" htmlFor="wallGraphic">
                Wall graphic
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="wallHoarding"
              />
              <label className="form-check-label" htmlFor="wallHoarding">
                Wall Hoarding
              </label>
            </div>
          </div>
        </form>

        {/* Sorting Dropdown */}
        <h5>Sort</h5>
        <div className="dropdown">
          <button
            className="btn btn-success dropdown-toggle"
            type="button"
            id="sortDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            By
          </button>
          <ul className="dropdown-menu" aria-labelledby="sortDropdown">
            <li>
              <a className="dropdown-item" href="#/action-1">
                Option 1
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#/action-2">
                Option 2
              </a>
            </li>
          </ul>
        </div>

        {/* Location Filters */}
        <h5>Location</h5>
        <form>
          <div className="form-group">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="chennai" />
              <label className="form-check-label" htmlFor="chennai">
                Chennai
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="kanyakumari"
              />
              <label className="form-check-label" htmlFor="kanyakumari">
                Kanyakumari
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="karaikudi"
              />
              <label className="form-check-label" htmlFor="karaikudi">
                Karaikudi
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="krishnagiri"
              />
              <label className="form-check-label" htmlFor="krishnagiri">
                Krishnagiri
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="madurai"
              />
              <label className="form-check-label" htmlFor="madurai">
                Madurai
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="mayiladuthurai"
              />
              <label className="form-check-label" htmlFor="mayiladuthurai">
                Mayiladuthurai
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="pondicherry"
              />
              <label className="form-check-label" htmlFor="pondicherry">
                Pondicherry
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="sivagangai"
              />
              <label className="form-check-label" htmlFor="sivagangai">
                Sivagangai
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="trichy"
              />
              <label className="form-check-label" htmlFor="trichy">
                Trichy
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Right Content Area */}
<div className="col-md-9" style={{ border: "1px solid red" }}>
  <div className="row">
    {spots.map((spot, index) => (
      <div
        className="col-lg-4 col-md-6 col-sm-12 mb-4"
        key={spot.id}
      >
        <div className="card h-100">
          <img
            src={spot.imageUrl}
            alt={spot.location}
            className="card-img-top"
            style={{ height: "150px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">{spot.location}</h5>
            <p className="card-text">
              <span>{spot.dimensions}</span>
              <br />
              <span>Price: {spot.price}</span>
              <br />
              <span className="d-flex align-items-center">
                <img
                  src="./images/star-board.png"
                  alt="Rating"
                  className="me-2"
                  style={{ height: "20px", width: "20px" }}
                />
              </span>
            </p>
            <button className="btn btn-primary btn-block">Book Now</button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  </div>

</div>
  )
}

export default Sidebar;