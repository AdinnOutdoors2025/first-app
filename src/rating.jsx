// import React from 'react';

// function Rating() {
//   const ratings = [
//     {
//       id: 1,
//       name: "John",
//       rating: 4.5,
//     },
//     {
//       id: 2,
//       name: "Jane",
//       rating: 4.8,
//     },
//   ];

//   // Function to render star rating
//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating); // Number of full stars
//     const halfStar = rating % 1 !== 0; // Check if there's a half star
//     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

//     return (
//       <>
//         {`<i class="fa-solid fa-star"></i>`.repeat(fullStars)} {/* Full stars */}
//         {halfStar && "☆"} {/* Half star if applicable */}
//         {"☆".repeat(emptyStars)} {/* Empty stars */}
//       </>
//     );
//   };

//   return (
//     <div>
//       <h2>User Ratings</h2>
//       {ratings.map((user) => (
//         <div key={user.id}>
//           <strong>{user.name}</strong>: {renderStars(user.rating)}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Rating;





// import React from "react";
// import "./rating.css";

// function Rating() {
//   // Function to render star ratings
//   const renderStars = () => {
//     const fullStars = Math.floor(3.5); // Number of full stars
//     const halfStar = 3.5 % 1 !== 0; // Check if there's a half star
//     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

//     return (
//       <div>

//      <span>
//      <img src='./images/rating_board.png' className="rate-board"></img>
//       <div className="rate">
//         {[...Array(fullStars)].map((_, index) => (
//           <span key={index} className="fa-solid fa-star stars"></span>
//         ))}
//         {halfStar && <span className="fa-solid fa-star-half-alt stars"></span>}
//         {[...Array(emptyStars)].map((_, index) => (
//           <span key={index} className="fa-solid fa-star empty-star"></span>
//         ))}

//         </div>
//      </span>
//       </div>
//     );
//   };

//   return <div className="rate">{renderStars()}</div>;
// }

// export default Rating;
