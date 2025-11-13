// import React, { useState, useContext, useEffect } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import './ad1Manage.css';
// import './ad1File.css';
// import './ad1FileVideoUpload.css';
// import { useSpot } from '../components/B0SpotContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { toast } from 'react-toastify';
// import { baseUrl } from './BASE_URL';

// function ClientSection() {
//     const { state } = useLocation();
//     const { id } = useParams();
//     //Start rating board
//     const RatingStars = ({ rating }) => {
//         const fullStars = Math.floor(rating);
//         const halfStar = rating % 1 !== 0;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         return (
//             <div className='Product-rating-star'>
//                 {[...Array(fullStars)].map((_, index) => (
//                     <span key={index} className="fa-solid fa-star Product-stars1"></span>
//                 ))}
//                 {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
//                 {[...Array(emptyStars)].map((_, index) => (
//                     <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
//                 ))}
//             </div>
//         );
//     };
//     // PRODUCT RATING SECTION 
//     const RatingStars1 = ({ rating }) => {
//         const fullStars = Math.floor(rating);
//         const halfStar = rating % 1 !== 0;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         return (
//             <div>
//                 <div className='Product-rating-star1'>
//                     {[...Array(fullStars)].map((_, index) => (
//                         <span key={index} className="fa-solid fa-star Product-stars1"></span>
//                     ))}
//                     {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
//                     {[...Array(emptyStars)].map((_, index) => (
//                         <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
//                     ))}
//                 </div>
//                 <div>

//                 </div>
//             </div>

//         );
//     };
//     //HANDLING ERRORS
//     const [errors, setErrors] = useState({
//         productName: false,
//         productAmount: false,
//         productID: false,
//         productFrom: false,
//         productTo: false,
//         productPrintingCost: false,
//         productMountingCost: false,
//         prodwidth: false,
//         prodheight: false,
//         prodSide: false,
//         image: false,
//         selectedState: false,
//         selectedDistrict: false,
//         similarProducts: false,
//         prodLatitude: false,
//         prodLongitude: false,
//         prodLocationLink: false,
//     });

//     const validateForm = () => {
//         const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
//         const newErrors = {
//             productName: !productName,
//             productAmount: !productAmount,
//             productID: !productID,
//             productFrom: !productFrom,
//             productTo: !productTo,
//             productPrintingCost: !productPrintingCost,
//             productMountingCost: !productMountingCost,
//             prodwidth: !prodwidth,
//             prodheight: !prodheight,
//             prodSide: !prodSide,
//             image: !image || image === " ",
//             selectedState: !selectedState,
//             selectedDistrict: !selectedDistrict,
//             similarProducts: false,
//             prodLatitude: !prodLatitude,
//             prodLongitude: !prodLongitude,
//             prodLocationLink: false,
//             // additionalFiles: validAdditionalFiles.length < 3 // Add validation for additional files
//             //NEWLY ADDED 2 
//             additionalFiles: validAdditionalFiles.length > 3 // Add validation for additional files

//         };
//         setErrors(newErrors);
//         return !Object.values(newErrors).some(error => error);
//     };

//     // SIMILAR PRODUCTS 
//     const [products, setProducts] = useState([]);
//     //Fetch/get  products from data
//     useEffect(() => {
//         fetch(`${baseUrl}/products`)
//             .then((response) => response.json())
//             .then((data) => {
//                 const productsWithVisibility = data.map((product) => ({
//                     ...product,
//                     visible: product.visible !== false, // fallback to true
//                 }));
//                 setProducts(productsWithVisibility.sort((a, b) => b.visible - a.visible));
//             });
//     }, []);

//     const normalizeSimilarProducts = (products) =>
//         products.map(p => ({
//             ...p,
//             prodCode: p.ProdCode, // for UI consistency
//             name: p.Prodname
//         }));

//     const [similarProdId, setSimilarProdId] = useState('');
//     const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]); // Store selected products

//     const normalizeCode = (code) => (code || '').replace(/^#/, '').trim().toLowerCase();
//     const handleSelectProduct = () => {
//         const enteredId = similarProdId.trim();
//         if (!enteredId) return;

//         // Find matches using fuzzy search
//         const matches = products.filter(product => {
//             const matchCode = normalizeCode(product.prodCode) === normalizeCode(enteredId);
//             const matchName = product.name.toLowerCase().includes(enteredId.toLowerCase());
//             return matchCode || matchName;
//         });

//         if (matches.length === 0) {
//             toast.error("No matching products found");
//             return;
//         }

//         if (matches.length > 1) {
//             toast.info("Multiple matches found - please select from suggestions");
//             return;
//         }

//         const productToAdd = matches[0];

//         if (selectedSimilarProducts.some(p => normalizeCode(p.prodCode) === normalizeCode(productToAdd.prodCode))) {
//             toast.warning("Product already added");
//             return;
//         }

//         setSelectedSimilarProducts(prev => [...prev, productToAdd]);
//         setSimilarProdId('');
//         setSearchSuggestions([]);
//     };

//     const handleRemoveProduct = (prodCode) => {
//         if (!window.confirm("Are you sure you want to delete this product?")) return;

//         // Normalize code for comparison
//         const normalize = code => code.replace(/^#/, '').trim().toLowerCase();
//         const targetCode = normalize(prodCode);

//         setSelectedSimilarProducts(prev =>
//             prev.filter(product =>
//                 normalize(product.prodCode) !== targetCode
//             )
//         );
//     };

//     const [productName, setProductName] = useState("");
//     const [productAmount, setProductAmount] = useState("");
//     const [productID, setProductId] = useState("");
//     const [prodLighting, setProdLighting] = useState("");
//     const [productFrom, setProductFrom] = useState("");
//     const [productTo, setProductTo] = useState("");
//     const [productPrintingCost, setProductPrintingCost] = useState("");
//     const [productMountingCost, setProductMountingCost] = useState("");
//     const [productFixedAmount, setProductFixedAmount] = useState('999');
//     const [productFixedAmountOffer, setProductFixedAmountOffer] = useState('5');

//     // Optional: Add typeahead search
//     const [searchSuggestions, setSearchSuggestions] = useState([]);
//     // Rating section 
//     const [prodRating, setProdRating] = useState(4.5);
//     // LATITUDE AND LOGITUDE
//     const [prodLatitude, setProdLatitude] = useState('');
//     const [prodLongitude, setProdLongitude] = useState('');
//     const [prodLocationLink, setProdLocationLink] = useState('');

//     const generateGoogleMapsLink = () => {
//         if (!prodLatitude || !prodLongitude) {
//             toast.error("Please enter both latitude and longitude");
//             return;
//         }
//         // Convert decimal degrees to degrees, minutes, seconds format
//         const latDegrees = Math.floor(Math.abs(prodLatitude));
//         const latMinutes = Math.floor((Math.abs(prodLatitude) - latDegrees) * 60);
//         const latSeconds = ((Math.abs(prodLatitude) - latDegrees - latMinutes / 60) * 3600).toFixed(1);
//         const latDirection = prodLatitude >= 0 ? 'N' : 'S';

//         const lonDegrees = Math.floor(Math.abs(prodLongitude));
//         const lonMinutes = Math.floor((Math.abs(prodLongitude) - lonDegrees) * 60);
//         const lonSeconds = ((Math.abs(prodLongitude) - lonDegrees - lonMinutes / 60) * 3600).toFixed(1);
//         const lonDirection = prodLongitude >= 0 ? 'E' : 'W';

//         // Construct the DMS (Degrees, Minutes, Seconds) string
//         const dmsString = `${latDegrees}°${latMinutes.toString().padStart(2, '0')}'${latSeconds}"${latDirection}+${lonDegrees}°${lonMinutes.toString().padStart(2, '0')}'${lonSeconds}"${lonDirection}`;

//         // Create the Google Maps link
//         const link = `https://www.google.com/maps/place/${dmsString}/@${prodLatitude},${prodLongitude},17z/data=!3m1!4b1!4m4!3m3!8m2!3d${prodLatitude}!4d${prodLongitude}?entry=ttu&g_ep=EgoyMDI1MDgwNC4wIKXMDSoASAFQAw%3D%3D`;

//         setProdLocationLink(link);
//         setErrors(prev => ({ ...prev, prodLocationLink: false }));

//     };
//     const handleRatingChange = (value) => {
//         // Convert the value to a valid number, ensuring it remains within 0-5 range
//         let newRating = parseFloat(value);
//         if (newRating >= 0 && newRating <= 5) {
//             setProdRating(newRating);
//         }
//     };

//     const [prodType, setProdType] = useState("Select");
//     // // State District selection 
//     const { initialStateDistricts, initialMediaTypes, toggleStateDropdown, handleStateClick, handleDistrictClick, mediaTypes, setMediaTypes, selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, showDistricts, setShowDistricts, showStates, setShowStates } = useSpot();
//     //IMAGE UPLOADED & ADDED SUB IMAGES/VIDEOS
//     const [imageFile, setImageFile] = useState(null); // Store the File object
//     const [image, setImage] = useState(""); // Store the preview URL or existing image URL

//     const [localFiles, setLocalFiles] = useState([]);
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [additionalFiles, setAdditionalFiles] = useState([]);

//     const [uploading, setUploading] = useState(false);
//     const [isSubmitted, setIsSubmitted] = useState(false);

//     // Modified handleImageUpload to only create a preview
//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             // Create a preview URL
//             const previewUrl = URL.createObjectURL(file);
//             setImage(previewUrl);
//             setImageFile(file);
//         }
//     };
//     console.log("MainImage URL :", image);
//     const handleFileChangeAdded = (e) => {
//         if (!e.target.files || e.target.files.length === 0) return;
//         const files = Array.from(e.target.files).filter(file =>
//             file.type.startsWith('video/') ||
//             file.type.startsWith('image/') ||
//             ['.mp4', '.mov', '.avi', '.mkv', '.jpg', '.jpeg', '.png', '.gif'].some(ext =>
//                 file.name.toLowerCase().endsWith(ext))
//         );
//         if (files.length === 0) {
//             alert('Please select valid video or image files');
//             return;
//         }

//         // Count only non-deleted files
//         const currentNonDeletedFiles = additionalFiles.filter(f => !f.markedForDeletion).length;

//         if (currentNonDeletedFiles + files.length > 3) {
//             alert(`Maximum 3 files allowed. You already have ${currentNonDeletedFiles} files.`);
//             return;
//         }

//         const newFiles = files.map(file => ({
//             file,
//             previewUrl: URL.createObjectURL(file),
//             id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//             type: file.type.startsWith('video/') ? 'video' : 'image',
//             isNew: true // Mark as new for upload handling

//         }));
//         setAdditionalFiles(prev => [...prev, ...newFiles]);
//         e.target.value = '';
//     };

//     const handleDeleteAdded = async (fileToDelete) => {
//         if (!window.confirm('Delete this file?')) return;
//         try {
//             // If it's an uploaded file, delete from Cloudinary
//             if (fileToDelete.public_id) {
//                 setAdditionalFiles(prev =>
//                     prev.map(file =>
//                         file.public_id === fileToDelete.public_id
//                             ? { ...file, markedForDeletion: true }
//                             : file
//                     )
//                 );


//             } else {
//                 // If it's a local file, just remove from state
//                 setAdditionalFiles(prev =>
//                     prev.filter(file => file.id !== fileToDelete.id)
//                 );
//             }
//         } catch (error) {
//             console.error('Delete error:', error);
//             alert('Failed to delete file');
//         }
//     };

//     const [productsData, setProductsData] = useState([]);
//     const [editProduct, setEditProduct] = useState(null);

//     // 👇 Prefill form if state has editProduct
//     useEffect(() => {
//         if (state?.editProduct) {
//             const prod = state.editProduct;
//             setEditProduct(prod);
//             //image
//             setImage(prod.image || " ");
//             setProductName(prod.name || '');
//             setProductAmount(prod.price || '');
//             setProductFixedAmount(prod.fixedAmount || '999');
//             setProductFixedAmountOffer(prod.fixedOffer || '5');
//             setProductPrintingCost(prod.printingCost || '');
//             setProductMountingCost(prod.mountingCost || '');
//             setProductId(prod.prodCode || '');
//             setProdLighting(prod.lighting);
//             setProductFrom(prod.from || '');
//             setProductTo(prod.to || '');
//             setProdRating(prod.rating || 0);
//             setProdWidth(prod.width || '');
//             setProdHeight(prod.height || '');
//             setProdSide(prod.side || '');
//             setSizeWidth1(prod.sizeCalculation?.sizeWidth1 || '');
//             setSizeWidth2(prod.sizeCalculation?.sizeWidth2 || '');
//             setSizeWidth3(prod.sizeCalculation?.sizeWidth3 || '');
//             setSizeQuantity1(prod.sizeCalculation?.sizeQuantity1 || '');
//             setSizeQuantity2(prod.sizeCalculation?.sizeQuantity2 || '');
//             setSizeQuantity3(prod.sizeCalculation?.sizeQuantity3 || '');

//             setProdType(prod.mediaType || '');
//             setSelectedState(prod.location?.state || '');
//             setSelectedDistrict(prod.location?.district || '');
//             setImage(prod.image || '');
//             // setSelectedSimilarProducts(prod.similarProducts || []);
//             setSelectedSimilarProducts(normalizeSimilarProducts(prod.similarProducts || []));
//             setProdLatitude(prod.Latitude || '');
//             setProdLongitude(prod.Longitude || '');
//             setProdLocationLink(prod.LocationLink || '');
//             // Set additional files if they exist
//             if (prod.additionalFiles && prod.additionalFiles.length > 0) {
//                 setAdditionalFiles(prod.additionalFiles);
//             }
//         }
//     }, [state]);

//     const fetchProduct = async () => {
//         const response = await fetch(`${baseUrl}/products`);
//         const data = await response.json();
//         setProductsData(data);
//         console.log(data);
//         // setEditProduct(data[0]);   
//     }
//     useEffect(
//         () => {
//             fetchProduct();
//         },
//         []
//     );

//     const handleSaveProduct = async (e) => {
//         e.preventDefault();
//         // Validate form first
//         if (!validateForm()) {
//             toast.error("Please fill all required fields correctly");
//             return;
//         }
//         // Validate additional files
//         const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
//         // if (validAdditionalFiles.length < 3) {
//         //     alert(`Please upload ${3 - validAdditionalFiles.length} more file(s)`);
//         //     return;
//         // }
//         if (validAdditionalFiles.length > 3) {
//             alert(`Maximum 3 additional files allowed. You have ${validAdditionalFiles.length} files.`);
//             return;
//         }

//         // Validate location link
//         if (!prodLocationLink) {
//             alert("Please generate location link");
//             return;
//         }

//         // // First check similar products count
//         // if (selectedSimilarProducts.length < 4) {
//         //     alert("Please add at least 4 similar products");
//         //     return;
//         // }
//         console.log("Save product");
//         // Optional warning (but still allows submission)
//         if (selectedSimilarProducts.length === 0) {
//             if (!window.confirm("You haven't added any similar products. Continue anyway?")) {
//                 return;
//             }
//         }

//         // Show confirmation for products without additional files NEWLY ADDED 2 
//         if (validAdditionalFiles.length === 0) {
//             if (!window.confirm("You haven't added any additional files. Continue without additional files?")) {
//                 return;
//             }
//         }
//         setUploading(true);
//         // Save product to database
//         const method = editProduct ? 'PUT' : 'POST';
//         const url = editProduct ? `${baseUrl}/products/${editProduct._id}` :
//             `${baseUrl}/products`;
//         try {
//             // STEP 1: Upload main image if it's a new file
//             let cloudinaryUrl = image; // Use existing URL if editing
//             // let additionalFiles = [...uploadedFiles];
//             let cloudinaryPublicId = editProduct?.imagePublicId || null;

//             // Only upload if we have a new file
//             if (imageFile && !image.startsWith('http')) {
//                 const formData = new FormData();
//                 formData.append("file", imageFile);
//                 const uploadResponse = await fetch(`${baseUrl}/upload`, {
//                     method: "POST",
//                     body: formData
//                 });
//                 if (!uploadResponse.ok) {
//                     throw new Error('Failed to upload main image');
//                 }
//                 const uploadData = await uploadResponse.json();
//                 cloudinaryUrl = uploadData.imageUrl;
//                 cloudinaryPublicId = uploadData.public_id;
//                 console.log("Main image URL:", cloudinaryUrl);

//             }
//             else if (image.startsWith('http')) {
//                 console.log("Using existing main image URL:", image);
//             }
//             else {
//                 throw new Error('Main image is required');
//             }
//             // Step 2: Handle additional files
//             const finalAdditionalFiles = [];
//             let fileIndex = 1;
//             // Upload new files
//             const newFilesToUpload = additionalFiles.filter(file => !file.public_id && file.file && !file.markedForDeletion);
//             // .filter(file => file.isNew && !file.public_id);
//             if (newFilesToUpload.length > 0) {
//                 const formData = new FormData();
//                 newFilesToUpload.forEach(fileObj => {
//                     formData.append('files', fileObj.file);
//                 });
//                 console.log(`Uploading ${newFilesToUpload.length} additional files...`);
//                 const filesResponse = await fetch(`${baseUrl}/save-videos`, {
//                     method: 'POST',
//                     body: formData
//                 });
//                 if (filesResponse.ok) {
//                     const savedFiles = await filesResponse.json();
//                     savedFiles.forEach(file => {
//                         console.log(`Additional file ${fileIndex} URL:`, file.url);
//                         fileIndex++;
//                         finalAdditionalFiles.push({
//                             url: file.url,
//                             public_id: file.public_id,
//                             type: file.type
//                         });
//                     });
//                 }
//                 else {
//                     console.error('Failed to upload additional files');
//                 }
//             }

//             // Add existing files that aren't marked for deletion
//             additionalFiles.forEach(file => {
//                 if (file.public_id && !file.markedForDeletion) {
//                     console.log(`Using existing additional file URL:`, file.url);

//                     finalAdditionalFiles.push({
//                         url: file.url,
//                         public_id: file.public_id,
//                         type: file.type
//                     });
//                 }
//             });

//             // Step 3: Delete any files marked for deletion
//             const filesToDelete = additionalFiles.filter(file => file.markedForDeletion && file.public_id);
//             for (const file of filesToDelete) {
//                 try {
//                     console.log("Deleting file with public_id:", file.public_id);
//                     await fetch(`${baseUrl}/delete-video`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({
//                             public_id: file.public_id,
//                             resource_type: file.type
//                         })
//                     });
//                 } catch (deleteError) {
//                     console.error('Error deleting file:', deleteError);
//                 }
//             }

//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: productName,
//                     // description: "Sample", // Update if you use
//                     price: productAmount,
//                     printingCost: productPrintingCost,
//                     mountingCost: productMountingCost,
//                     image: cloudinaryUrl,
//                     imagePublicId: cloudinaryPublicId, // Store public_id for future deletion
//                     additionalFiles: finalAdditionalFiles,
//                     prodCode: productID,
//                     lighting: prodLighting,
//                     from: productFrom,
//                     to: productTo,
//                     rating: prodRating,
//                     width: prodwidth,
//                     height: prodheight,
//                     side: prodSide,
//                     sizeCalculation :{
//                         sizeWidth1 : sizeWidth1,
//                         sizeWidth2 : sizeWidth2,
//                         sizeWidth3 : sizeWidth3,
//                         sizeQuantity1 : sizeQuantity1,
//                         sizeQuantity2 : sizeQuantity2,
//                         sizeQuantity3 : sizeQuantity3,
//                     },
//                     fixedAmount: productFixedAmount,
//                     fixedOffer: productFixedAmountOffer,
//                     mediaType: prodType,
//                     visible: true,
//                     productsquareFeet: ProdSquareFeet(),
//                     location: {
//                         state: selectedState,
//                         district: selectedDistrict
//                     },
//                     similarProducts: selectedSimilarProducts.map(prod => ({
//                         Prodname: prod.name,
//                         ProdCode: prod.prodCode,
//                         image: prod.image,
//                         ProdPrice: prod.price,
//                         ProdPrintingCost: prod.printingCost,
//                         ProdMountingCost: prod.mountingCost
//                     })),
//                     Latitude: prodLatitude,
//                     Longitude: prodLongitude,
//                     LocationLink: prodLocationLink,
//                 }),
//             });
//             //  console.log("Submitting product data to MongoDB:", productData);
//             const result = await response.json();
//             console.log(result);
//             if (!editProduct) {
//                 // setProductsData([...productsData, result]);
//                 setProductsData(prev => [...prev, result]);
//                 alert("Product added successfully!");
//             }
//             else {
//                 // setProductsData(productsData.map((product) => (product._id === result._id ? result : product)));  // Update task
//                 setProductsData(prev =>
//                     prev.map((product) =>
//                         product._id === result._id ? result : product
//                     )
//                 );
//                 alert("Product updated successfully!");
//                 // Force reload or update parent state if needed
//                 window.location.reload();
//             }
//             // Reset form
//             resetForm();
//         }
//         catch (error) {
//             console.error(error);
//             alert("An error occurred while saving the product.");
//         }
//         finally {
//             setUploading(false);
//         }
//     };



//     // Add this helper function
//     const resetForm = () => {
//         setProductName('');
//         setImage('');
//         setProductAmount('');
//         setProductFixedAmount('999');
//         setProductFixedAmountOffer('5');
//         setProductMountingCost('');
//         setProductPrintingCost('');
//         setProductId('');
//         setProdLighting('');
//         setProductFrom('');
//         setProductTo('');
//         setProdRating(0);
//         setProdWidth('');
//         setProdHeight('');
//         setProdSide('1');
//         setSizeWidth1('');
//         setSizeWidth2('');
//         setSizeWidth3('');
//         setSizeQuantity1('');
//         setSizeQuantity2('');
//         setSizeQuantity3('');
//         setProdType('');
//         setSelectedSimilarProducts([]);
//         setProdLatitude('');
//         setProdLongitude('');
//         setProdLocationLink('');
//         setAdditionalFiles([]);
//         setEditProduct(null);
//     };

//     // Clean up preview URLs
//     useEffect(() => {
//         return () => {
//             if (image && !image.startsWith('http')) {
//                 URL.revokeObjectURL(image);
//             }
//             additionalFiles.forEach(file => {
//                 if (file.previewUrl) {
//                     URL.revokeObjectURL(file.previewUrl);
//                 }
//             });
//         };
//     }, [image, additionalFiles]);

//     //FETCH STATE AND DISTRICTS IN CATEGORY SECTION
//     const [stateDistricts, setStateDistricts] = useState({});

//     useEffect(() => {
//         const fetchCategoryData = async () => {
//             try {
//                 const res = await fetch(`${baseUrl}/category`);
//                 const data = await res.json();

//                 // Convert to { "Tamil Nadu": ["Chennai", "Coimbatore"], ... }
//                 const mappedData = {};
//                 data.forEach(({ state, districts }) => {
//                     mappedData[state] = districts;
//                 });

//                 setStateDistricts(mappedData);
//             } catch (err) {
//                 console.error("Failed to fetch category data:", err);
//             }
//         };

//         fetchCategoryData();
//     }, []);

//     //FETCH MEDIA TYPES FROM THE DATABASE
//     const [mediaTypesData, setMediaTypesData] = useState([]);
//     const fetchMediaTypes = async () => {
//         try {
//             const res = await fetch(`${baseUrl}/mediatype`);
//             const data = await res.json();
//             setMediaTypesData(data);
//         } catch (err) {
//             alert('Failed to fetch media types: ' + err.message);
//         }
//     };

//     useEffect(() => {
//         fetchMediaTypes();
//     }, []);




//     //POLICE BOOTH, SIGNAL POST, POLE KIOSK 

//     // const [prodWidth, setProdWidth] = useState('');
//     // const [prodHeight, setProdHeight] = useState('');
//     // const [prodSquareFeet, setProdSquareFeet] = useState('');
//     // Product Size calculation 
//     const [prodwidth, setProdWidth] = useState('');
//     const [prodheight, setProdHeight] = useState('');
//     // const ProdSquareFeet = () => {
//     //     const squareFeet = prodwidth * prodheight;
//     //     return squareFeet;
//     // };
//     // const ProdSquareFeet = () => {
//     //     // Convert to numbers to avoid string concatenation
//     //     const width = Number(prodwidth) || 0;
//     //     const height = Number(prodheight) || 0;
//     //     const side = Number(prodSide) || 1;
//     //     const squareFeet = width * height * side;
//     //     return squareFeet;
//     // };

//     const [sizeWidth1, setSizeWidth1] = useState('');
//     const [sizeWidth2, setSizeWidth2] = useState('');
//     const [sizeWidth3, setSizeWidth3] = useState('');


//     const [sizeHeight, setSizeHeight] = useState('');

//     const [sizeQuantity1, setSizeQuantity1] = useState('');
//     const [sizeQuantity2, setSizeQuantity2] = useState('');
//     const [sizeQuantity3, setSizeQuantity3] = useState('');


//     const [prodSide, setProdSide] = useState('1');
//     // const sizeCalculation = () =>{
//     //  const prodwidth = (sizeWidth1 * sizeQuantity1) + (sizeWidth2 * sizeQuantity2) + (sizeWidth3 * sizeQuantity3)
//     // Convert all values to numbers to avoid string issues
//     // prodwidth = (Number(sizeWidth1) * Number(sizeQuantity1)) +
//     //     (Number(sizeWidth2) * Number(sizeQuantity2)) +
//     //     (Number(sizeWidth3) * Number(sizeQuantity3));
//     // const heightCalc = prodheight
//     // const squareFeet = Math.round(prodwidth * heightCalc * Number(prodSide));



//     // Calculate total width
// const [totalCalculatedWidth, setTotalCalculatedWidth] = useState(0);

// useEffect(() => {
//     const calculatedWidth = (Number(sizeWidth1) * Number(sizeQuantity1)) +
//                           (Number(sizeWidth2) * Number(sizeQuantity2)) +
//                           (Number(sizeWidth3) * Number(sizeQuantity3));
//     setTotalCalculatedWidth(calculatedWidth);
//     setProdWidth(calculatedWidth); // Also update prodwidth state
// }, [sizeWidth1, sizeWidth2, sizeWidth3, sizeQuantity1, sizeQuantity2, sizeQuantity3]);

// // Calculate square feet
// const squareFeet = Math.round(totalCalculatedWidth * Number(prodheight) * Number(prodSide));

// const ProdSquareFeet = () => squareFeet;

//     // const squareFeet = (sizeCalc * heightCalc * prodSide).toPrecision(2);
//     console.log(prodwidth);
//     // console.log(heightCalc);
//     console.log(squareFeet);
//     console.log(prodSide);

//     return (
//         <div>
//             <form onSubmit={handleSaveProduct}>
//                 <div className='adManageMain'>
//                     {/* Left side section  */}
//                     <div className='adManageContentLeft'>
//                         <div className='ManageLeftImg1'><img src={image} className='ManageLeftImg1' alt="Product_Image"></img></div>
//                         {/* Product details section  */}
//                         <div className='manageprodMain'>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Name</div>
//                                 <div className='ManageProdRightContent'>{productName}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Price</div>
//                                 <div className='ManageProdRightContent'>₹ {productAmount} Per Day </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Printing Cost</div>
//                                 <div className='ManageProdRightContent'>₹ {productPrintingCost} Per Day </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Mounting Cost</div>
//                                 <div className='ManageProdRightContent'>₹ {productMountingCost} Per Day </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Size</div>
//                                 <div className='ManageProdRightContent'>{prodwidth} X {prodheight} | {ProdSquareFeet()} Sq.ft </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Side</div>
//                                 <div className='ManageProdRightContent'>{prodSide}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Lighting</div>
//                                 <div className='ManageProdRightContent'>{prodLighting}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>From</div>
//                                 <div className='ManageProdRightContent'>{productFrom}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>To</div>
//                                 <div className='ManageProdRightContent'>{productTo}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>FixedAmount</div>
//                                 <div className='ManageProdRightContent'>{productFixedAmount}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>FixedOffer</div>
//                                 <div className='ManageProdRightContent'>{productFixedAmountOffer}</div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Rating</div>
//                                 <div className='ManageProdRightContent'>
//                                     <span className='Product-star-main'>
//                                         <span><img src='./images/rating_board.png' className='Product-rate-board1'></img></span>
//                                         <span><RatingStars rating={prodRating} /> </span>
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Select Category  section  */}
//                         <div className='manageprodMain manageProdSideContents'>
//                             <div className='manageprodSideHeading'>Selected Category</div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Location</div>
//                                 <div className='ManageProdRightContent'>
//                                     {selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : "Select a location"}
//                                 </div>
//                             </div>
//                             <div className="ManageProdDetails">
//                                 <div className='ManageProdLeftHeading'>Media Type</div>
//                                 <div className='ManageProdRightContent'>{prodType}</div>
//                             </div>
//                         </div>

//                         {/* PRODUCT LOCATION LINK  */}
//                         <div className='manageprodMain'>
//                             <div className='manageprodSideHeading'>Product Location Link</div>
//                             <div className='ManageProductLocationLink'>
//                                 {prodLocationLink && (
//                                     <div style={{ marginTop: '20px' }}>
//                                         <a href={prodLocationLink}
//                                             target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }} >
//                                             {prodLocationLink}
//                                         </a>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         {/* ADDED DEMO PRODUCT IMAGES/VIDEOS  */}
//                         <div className='manageprodMain manageProdSideContents'>
//                             <div className='manageprodSideHeading'>Demo Products</div>
//                             <div className='adminProductVideoLeft'>
//                                 <div className='videoPreviewMain'>
//                                     {additionalFiles
//                                         .filter(file => !file.markedForDeletion)
//                                         .slice(0, 3)
//                                         .map((file, index) => (
//                                             <div key={file.id || file.public_id} className={`videoPreview ${index + 1}`}>
//                                                 <div className="videoPreviewContainer">
//                                                     {file.type === 'video'
//                                                         || (file.url && file.url.match(/\.(mp4|mov|avi|mkv)$/i))
//                                                         ? (
//                                                             <video controls>
//                                                                 <source src={file.url || file.previewUrl} type="video/mp4" />
//                                                             </video>
//                                                         ) : (
//                                                             <img
//                                                                 src={file.url || file.previewUrl}
//                                                                 alt="Preview"
//                                                                 style={{ objectFit: 'cover', height: '100%', width: '100%' }}
//                                                             />
//                                                         )}
//                                                     <button
//                                                         className="deleteButton"
//                                                         onClick={() => handleDeleteAdded(file)}
//                                                         disabled={uploading}
//                                                     >
//                                                         ×
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     {Array.from({ length: 3 - additionalFiles.filter(f => !f.markedForDeletion).length }).map((_, index) => (
//                                         <div key={`empty_${index}`} className={`videoPreview ${index + 1}`}>
//                                             <div className="emptyPreview">No file</div>
//                                         </div>
//                                     ))}

//                                 </div>
//                             </div>
//                         </div>

//                         {/* Similar Product Section  */}
//                         <div className='manageprodMain'>
//                             <div className='manageprodSideHeading'>Selected Similar products</div>
//                             {selectedSimilarProducts.length > 0 ? (
//                                 selectedSimilarProducts.map((product, index) => (
//                                     <div className='manageSimilarprod' key={index}>
//                                         <div className='manageSimilarImg'>
//                                             <img src={product.image} className='manageSimilarImg'></img>
//                                         </div>
//                                         <div>
//                                             <div className='ManageProdRightContent1'>{product.name}</div>
//                                             <div className='manageSimilarProdCode'>{product.prodCode}</div>
//                                         </div>
//                                         <div className='similarProdClose' onClick={() => handleRemoveProduct(product.prodCode)}>
//                                             <i className="fa-solid fa-xmark"></i>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className='smilarProdError'>No Similar Products Selected</p>
//                             )
//                             }
//                         </div>
//                     </div>

//                     {/* Right section  */}
//                     <div>
//                         {/* Client Section  */}
//                         <div className='manageClientSection'>
//                             <div className="upload-section">
//                                 <input type="file" accept="image/*" id='fileInput' onChange={handleImageUpload} hidden />
//                                 <label htmlFor="fileInput" className={`file-upload-box ${errors.image ? 'AdminProdinput-error' : ''}`}>
//                                     <center>
//                                         <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
//                                     </center>
//                                     <div className="upload-text">
//                                         <div className="FileHeading">Drag and Drop an Image or Choose File</div>
//                                         <span className="file-info">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</span>
//                                     </div>
//                                 </label>
//                                 {errors.image && <div className="AdminProderror-message">Product image is required</div>}
//                             </div>
//                         </div>

//                         {/* Product Section  */}
//                         <div className='manageClientSection'>
//                             <div className='manageRightSideHeading'>Product Management</div>
//                             <div className='d-flex manageClientInformation'>

//                                 <div className='manageClientInfoLeft'>
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Product Name</div>
//                                         <input type='text' placeholder='Enter Product Name' value={productName}
//                                             onChange={(e) => {
//                                                 setProductName(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productName: false }));

//                                             }}
//                                             className={`clientDetailsInput ${errors.productName ? 'AdminProdinput-error' : ''}`}>

//                                         </input>
//                                         {errors.productName && <div className="AdminProderror-message ">Product name is required</div>}
//                                     </div>
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Price</div>
//                                         <input type='number' placeholder='Enter Price' value={productAmount}
//                                             onChange={(e) => {
//                                                 setProductAmount(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productAmount: false }));
//                                             }}
//                                             className={`clientDetailsInput ${errors.productAmount ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productAmount && <div className="AdminProderror-message ">Product Amount is required</div>}


//                                     </div>
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Lighting Type</div>
//                                         <select className={`clientDetailsInput ${errors.prodLighting ? 'AdminProdinput-error' : ''}`} value={prodLighting}
//                                             onChange={(e) => {
//                                                 setProdLighting(e.target.value);
//                                                 setErrors(prev => ({ ...prev, prodLighting: false }));
//                                             }}>
//                                             <option value="Select">Select</option>
//                                             <option value="Not-Lit">Not-Lit</option>
//                                             <option value="Front-Lit">Front-Lit</option>
//                                             <option value="Back-Lit">Back-Lit</option>
//                                         </select>
//                                         {errors.prodLighting && <div className="AdminProderror-message ">Product Lighting is required</div>}

//                                     </div>
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Printing Cost</div>
//                                         <input type='number' placeholder='Enter Price' value={productPrintingCost}
//                                             onChange={(e) => {
//                                                 setProductPrintingCost(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productPrintingCost: false }));
//                                             }}
//                                             className={`clientDetailsInput ${errors.productPrintingCost ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productPrintingCost && <div className="AdminProderror-message ">Printing Cost is required</div>}
//                                     </div>

//                                     {/* PRODUCT CALCULATION  */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Size</div>
//                                         <div>
//                                             W   <input type='number' value={sizeWidth1}
//                                                 onChange={(e) => {
//                                                     setSizeWidth1(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodheight: false }));
//                                                 }} className={`sizeWidthInput 
//                                 `}></input>
//                                             <span className='sizeMultiply'> X </span>

//                                             Q  <input type='number' value={sizeQuantity1}
//                                                 onChange={(e) => {
//                                                     setSizeQuantity1(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodheight: false }));
//                                                 }} className={`sizeWidthInput 
//                                 `}></input>

//                                             {/* 2 */}
//                                             <span className='sizeMultiply'> + </span>

//                                             W   <input type='number' value={sizeWidth2}
//                                                 onChange={(e) => {
//                                                     setSizeWidth2(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodheight: false }));
//                                                 }} className={`sizeWidthInput 
//                                 `}></input>
//                                             <span className='sizeMultiply'> X </span>

//                                             Q  <input type='number' value={sizeQuantity2}
//                                                 onChange={(e) => {
//                                                     setSizeQuantity2(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodheight: false }));
//                                                 }} className={`sizeWidthInput 
//                                 `}></input>

//                                             {/* 3 */}
//                                             <span className='sizeMultiply'> + </span>

//                                             W   <input type='number' value={sizeWidth3}
//                                                 onChange={(e) => {
//                                                     setSizeWidth3(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodheight: false }));
//                                                 }} className={`sizeWidthInput 
//                                 `}></input>
//                                             <span className='sizeMultiply'> X </span>

//                                             Q  <input type='number' value={sizeQuantity3}
//                                                 onChange={(e) => {
//                                                     setSizeQuantity3(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodheight: false }));
//                                                 }} className={`sizeWidthInput 
//                                 `}></input>

//                                             <span className='sizeMultiply'> = </span>
//                                             <span> {prodwidth}</span>
//                                         </div>


//                                         <div className='sizeWidthValues'>
//                                             W : <input type='number' value={prodwidth}
//                                                 onChange={(e) => {
//                                                     setProdWidth(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodwidth: false }));
//                                                 }} className={`sizeWidthInput ${errors.prodwidth ? 'AdminProdinput-error' : ''}`}  ></input>
//                                             <span className='sizeMultiply'> X </span>
//                                             H : <input type='number' value={prodheight}
//                                                 onChange={(e) => {
//                                                     setProdHeight(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodheight: false }));
//                                                 }} className={`sizeWidthInput ${errors.prodheight ? 'AdminProdinput-error' : ''}`}></input>

//                                             {/* <span className='sizeWidthSlash'> | </span> <lable> {ProdSquareFeet()} </lable>Sq.ft */}

//                                             <span className='sizeMultiply'> X </span>



//                                             S : <input type='number' value={prodSide}
//                                                 onChange={(e) => {
//                                                     setProdSide(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodSide: false }));
//                                                 }} className={`sizeWidthInput ${errors.prodSide ? 'AdminProdinput-error' : ''}`}></input> <span className='sizeWidthSlash'> | </span> <lable> {squareFeet} </lable>Sq.ft


//                                             {errors.prodwidth && errors.prodheight && errors.prodwidth && <div className="AdminProderror-message ">Product Height & Width & Side is required</div>}
//                                         </div>
//                                     </div>

//                                 </div>
//                                 <div className='manageClientInfoRight'>
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Product ID</div>
//                                         <input type='text' placeholder='Enter Product ID' value={productID}
//                                             onChange={(e) => {
//                                                 setProductId(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productID: false }));
//                                             }} className={`clientDetailsInput ${errors.productID ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productID && <div className="AdminProderror-message ">Product ID is required</div>}

//                                     </div>
//                                     {/* <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Size</div>


//                                         <div className='sizeWidthValues'>
//                                             W : <input type='number' value={prodwidth}
//                                                 onChange={(e) => {
//                                                     setProdWidth(e.target.value);
//                                                     setErrors(prev => ({ ...prev, prodwidth: false }));
//                                                 }} className={`sizeWidthInput ${errors.prodwidth ? 'AdminProdinput-error' : ''}`}  ></input><span className='sizeMultiply'> X </span>
//                                             H : <input type='number' value={prodheight}
//                                                     onChange={(e) => {
//                                                         setProdHeight(e.target.value);
//                                                         setErrors(prev => ({ ...prev, prodheight: false }));
//                                                     }} className={`sizeWidthInput ${errors.prodheight ? 'AdminProdinput-error' : ''}`}></input> <span className='sizeWidthSlash'> | </span> <lable> {ProdSquareFeet()} </lable>Sq.ft
//                                             {errors.prodwidth && errors.prodheight && <div className="AdminProderror-message ">Product Height & Width is required</div>}
//                                         </div>
//                                     </div> */}
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Location</div>
//                                         <label className='locationFromLabel'>From <label style={{ float: 'right' }}>-</label></label>
//                                         <input type='text' placeholder='Enter From' value={productFrom}
//                                             onChange={(e) => {
//                                                 setProductFrom(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productFrom: false }));
//                                             }} className={`clientDetailsInput locationInput ${errors.productFrom ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productFrom && <div className="AdminProderror-message ">Product From is required</div>}

//                                         <br></br>
//                                         <label className='locationFromLabel'>To<label style={{ float: 'right' }}>-</label></label>
//                                         <input type='text' placeholder='Enter To' value={productTo}
//                                             onChange={(e) => {
//                                                 setProductTo(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productTo: false }));
//                                             }} className={`clientDetailsInput locationInput ${errors.productTo ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productTo && <div className="AdminProderror-message ">Product To is required</div>}
//                                     </div>
//                                     <div className='clientDetailSection'>
//                                         <div className='clientDetailHeading'>Mounting Cost</div>
//                                         <input type='number' placeholder='Enter Price' value={productMountingCost}
//                                             onChange={(e) => {
//                                                 setProductMountingCost(e.target.value);
//                                                 setErrors(prev => ({ ...prev, productMountingCost: false }));
//                                             }}
//                                             className={`clientDetailsInput ${errors.productMountingCost ? 'AdminProdinput-error' : ''}`}></input>
//                                         {errors.productMountingCost && <div className="AdminProderror-message ">Mouting Cost is required</div>}

//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Rating section  with OFFER */}
//                         <div style={{ display: 'flex', gap: '10px' }}>
//                             <div className='manageClientSection' style={{ width: '40%' }}>
//                                 <div className='clientDetailHeading'>Ratings</div>
//                                 <div className='ProductRatingMain'>
//                                     <div >
//                                         <div>
//                                             {/* <span><img src='./images/rating_board.png' className='Product-rate-board1'></img></span> */}
//                                             <span className='Product-star-main' >
//                                                 <RatingStars1 rating={parseFloat(prodRating) || 0} />
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         {/* <input type='number' step='0.1' min='0' max='5' placeholder='Rating' value={prodRating}
//                                     onChange={(e) => handleRatingChange(e.target.value)} className='clientDetailsInput ratingInput'></input> */}
//                                         <select className='clientDetailsInput ratingInput' value={prodRating}
//                                             onChange={(e) => handleRatingChange(e.target.value)}>
//                                             <option value="1">1</option>
//                                             <option value="1.5">1.5</option>
//                                             <option value="2">2</option>
//                                             <option value="2.5">2.5</option>
//                                             <option value="3">3</option>
//                                             <option value="3.5">3.5</option>
//                                             <option value="4">4</option>
//                                             <option value="4.5">4.5</option>
//                                             <option value="5">5</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='manageClientSection' style={{ width: '60%' }}>
//                                 <div className='clientDetailHeading'>Offers</div>
//                                 <div className='ProductRatingMain'>
//                                     <div className='AdminOfferDetails' >Pay ₹<input type='number' value={productFixedAmount} onChange={(e) => setProductFixedAmount(e.target.value)} className='sizeWidthInput adminOfferAmountInput' readOnly></input> and Get <input type='number' value={productFixedAmountOffer} onChange={(e) => setProductFixedAmountOffer(e.target.value)} className='sizeWidthInput adminOfferAmountPercentage' readOnly></input>% Off <span className='adminOfferRefundDetails'> 100% Refundable </span>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                         {/* Select Category section   */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'>Select Category</div>
//                             <div className='d-flex manageClientInformation'>
//                                 <div className='manageClientInfoLeft'>
//                                     <div className='clientDetailHeading'>Location</div>
//                                     <div className="location-container11">
//                                         {/* Input field to display selected state & district */}                                        <div className="input-wrapper" onClick={toggleStateDropdown}>
//                                             <input
//                                                 type="text"
//                                                 className="clientDetailsInput locationSelectInput"
//                                                 value={selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : ""}
//                                                 placeholder="Select Location"
//                                                 readOnly />
//                                             {/* Chevron Icon for dropdown */}
//                                             <i className={`fa-solid ${showStates ? "fa-chevron-up" : "fa-chevron-down"} dropdown-arrow11`} style={{ fontSize: '10px' }}></i>
//                                         </div>
//                                         <div className="dropdown-container11">
//                                             {/* State Dropdown */}
//                                             {showStates && (
//                                                 <div className="dropdown11">
//                                                     <ul className="dropdown-list11">
//                                                         {Object.keys(stateDistricts).map((state) => (
//                                                             <li
//                                                                 key={state}
//                                                                 onClick={() => handleStateClick(state)}
//                                                                 className={selectedState === state ? "selected" : ""}
//                                                             >
//                                                                 {state}
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             )}

//                                             {/* District Dropdown (Only visible if a state is selected) */}
//                                             {showDistricts && selectedState && (
//                                                 <div className="dropdown11">
//                                                     <ul className="dropdown-list11">
//                                                         {stateDistricts[selectedState].map((district) => (
//                                                             <li
//                                                                 key={district}
//                                                                 onClick={() => handleDistrictClick(district)}
//                                                                 className={selectedDistrict === district ? "selected" : ""} >
//                                                                 {district}
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='manageClientInfoRight'>
//                                     <div className='clientDetailHeading'>Media Type</div>
//                                     <select className='clientDetailsInput' value={prodType} onChange={(e) => setProdType(e.target.value)} >
//                                         <option value="">Select Media Type</option>
//                                         {mediaTypesData.map((media, id) => (
//                                             <option key={media._id} value={media.type}>
//                                                 {media.type}
//                                             </option>
//                                         ))}
//                                     </select>

//                                 </div>
//                             </div>

//                         </div>

//                         {/* SELECT LOGITUDE AND LATITUDE FROM MAP */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'>Generate Location</div>
//                             <div className='ProdLocationLinkMain'>
//                                 <div className='clientDetailSection'>
//                                     <div className='clientDetailHeading'>Product Latitude</div>
//                                     <input type='text' placeholder='Enter Product Name' value={prodLatitude}
//                                         onChange={(e) => {
//                                             setProdLatitude(e.target.value);
//                                             setErrors(prev => ({ ...prev, prodLatitude: false }));

//                                         }}
//                                         className={`clientDetailsInput ${errors.prodLatitude ? 'AdminProdinput-error' : ''}`}>

//                                     </input>
//                                     {errors.prodLatitude && <div className="AdminProderror-message ">Product Latitude is required</div>}
//                                 </div>
//                                 <div className='clientDetailSection'>
//                                     <div className='clientDetailHeading'>Product Longitude</div>
//                                     <input type='text' placeholder='Enter Product Name' value={prodLongitude}
//                                         onChange={(e) => {
//                                             setProdLongitude(e.target.value);
//                                             setErrors(prev => ({ ...prev, prodLongitude: false }));

//                                         }}
//                                         className={`clientDetailsInput ${errors.prodLongitude ? 'AdminProdinput-error' : ''}`}>
//                                     </input>
//                                     {errors.prodLongitude && <div className="AdminProderror-message ">Product Longitude is required</div>}
//                                 </div>
//                             </div>
//                             <div onClick={generateGoogleMapsLink} style={{ padding: '10px 15px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} > Generate Link </div>
//                         </div>

//                         {/* ADDED PRODUCTS IMAGES/VIDEOS  */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'>Added Products</div>
//                             <div className='adminProductVideoRight'>
//                                 <center>
//                                     <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
//                                 </center>
//                                 <input
//                                     type='file'
//                                     accept='video/*,image/*'
//                                     onChange={handleFileChangeAdded}
//                                     multiple
//                                     disabled={uploading
//                                         || additionalFiles.filter(f => !f.markedForDeletion).length >= 3
//                                         //    || additionalFiles.length >= 3
//                                     }
//                                 />
//                                 <p>
//                                     {uploading ? 'Uploading...' :
//                                         isSubmitted ? 'Files saved' :
//                                             `Upload up to ${3 - additionalFiles.filter(f => !f.markedForDeletion).length} more files`}
//                                 </p>

//                                 {errors.additionalFiles && (
//                                     <div className="AdminProderror-message">
//                                         {/* Please upload exactly 3 files (currently have {additionalFiles.filter(f => !f.markedForDeletion).length}) */}
//                                                                                   //NEWLY ADDED 2

//                                         Maximum 3 files allowed

//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Similar Products section  */}
//                         <div className='manageClientSection'>
//                             <div className='clientDetailHeading'>Similar Products</div>
//                             <div className='manageClientInformation'>
//                                 <div className='manageClientInfoLeft' style={{ position: 'relative' }}>
//                                     <input type='text' placeholder='Product Code' value={similarProdId}
//                                         onChange={(e) => {
//                                             setSimilarProdId(e.target.value);
//                                             // Show suggestions only when there's input
//                                             if (e.target.value.trim()) {
//                                                 const normalizedInput = normalizeCode(e.target.value);
//                                                 const selectedCodes = selectedSimilarProducts.map(p => normalizeCode(p.prodCode));

//                                                 const matches = products.filter(product => {
//                                                     const isMatch =
//                                                         (normalizeCode(product.prodCode).includes(normalizedInput) ||
//                                                             product.name.toLowerCase().includes(e.target.value.toLowerCase()
//                                                             ));
//                                                     const notSelected = !selectedCodes.includes(normalizeCode(product.prodCode));
//                                                     return isMatch && notSelected;
//                                                 }).slice(0, 5);
//                                                 setSearchSuggestions(matches);
//                                             } else {
//                                                 setSearchSuggestions([]);
//                                             }

//                                         }}


//                                         className='clientDetailsInput'></input>


//                                     {/* Typeahead Suggestions */}
//                                     {searchSuggestions.length > 0 && (
//                                         <div className="suggestions-dropdown">
//                                             {searchSuggestions.map((product) => (
//                                                 <div
//                                                     key={product.prodCode}
//                                                     className="suggestion-item"
//                                                     onClick={() => {
//                                                         setSelectedSimilarProducts(prev => [...prev, product]);
//                                                         setSimilarProdId('');
//                                                         setSearchSuggestions([]);
//                                                     }} >
//                                                     <div className="suggestion-code">{product.prodCode}</div>
//                                                     <div className="suggestion-name">{product.name}</div>
//                                                     <div className="suggestion-image">
//                                                         <img src={product.image} alt={product.name} />
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className='manageClientInfoRight'>
//                                     <div className='manageProductSelectBtn' onClick={handleSelectProduct} >Select</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <button className="calendarSaveBtn" type='submit'
//                     disabled={uploading}>
//                     {uploading ? 'Processing...' : (editProduct ? 'Update' : 'Save')}
//                 </button>
//             </form>
//         </div>
//     )
// }
// export default ClientSection;



// EXCEL EXTRACTION CORRECTED CODE
import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ad1Manage.css';
import './ad1File.css';
import './ad1FileVideoUpload.css';
import { useSpot } from '../components/B0SpotContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { baseUrl } from './BASE_URL';
import * as XLSX from 'xlsx';

function ClientSection() {
    const { state } = useLocation();
    const { id } = useParams();

    // Excel upload state
    const [excelData, setExcelData] = useState([]);
    const [isUploadingExcel, setIsUploadingExcel] = useState(false);
    const [showExcelPreview, setShowExcelPreview] = useState(false);
    // ADDITIONAL FILES ADDED INPUT
    const [additionalFileUrl, setAdditionalFileUrl] = useState('');
    // Main image URL input for Excel
    const [mainImageUrl, setMainImageUrl] = useState('');

    // Excel file upload handler
    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setExcelData(jsonData);
                setShowExcelPreview(true);
                alert(`Successfully loaded ${jsonData.length} records from Excel`);
            } catch (error) {
                console.error('Error reading Excel file:', error);
                alert('Error reading Excel file. Please check the format.');
            }
        };
        reader.readAsArrayBuffer(file);
        e.target.value = ''; // Reset file input
    };

    // ENHANCED FILE TYPE DETECTION WITH BETTER URL HANDLING
    const getFileType = (file) => {
        // If it's already a file object with type
        if (file && file.type) {
            return file.type.startsWith('video/') ? 'video' : 'image';
        }

        // If it's a URL string or from existing data
        const url = file.url || file;
        if (!url) return 'image';

        // Convert to string and handle protocol-relative URLs
        let urlString = url.toString().toLowerCase().trim();
        
        // Handle protocol-relative URLs (//example.com/path)
        if (urlString.startsWith('//')) {
            urlString = 'https:' + urlString;
        }
        
        // Handle URLs without protocol
        if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
            urlString = 'https://' + urlString;
        }

        const urlWithoutParams = urlString.split('?')[0];
        const urlWithoutHash = urlWithoutParams.split('#')[0];

        // Comprehensive video extensions
        const videoExtensions = [
            '.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv',
            '.3gp', '.m4v', '.mpg', '.mpeg', '.ogg', '.qt', '.mp2',
            '.mpe', '.mpv', '.m2v', '.m4p', '.m4v', '.3g2'
        ];

        const imageExtensions = [
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg',
            '.ico', '.tiff', '.tif', '.jfif', '.pjpeg', '.pjp'
        ];

        // Check for exact file extensions first (most reliable)
        const hasVideoExtension = videoExtensions.some(ext =>
            urlWithoutHash.endsWith(ext)
        );
        const hasImageExtension = imageExtensions.some(ext =>
            urlWithoutHash.endsWith(ext)
        );

        if (hasVideoExtension) return 'video';
        if (hasImageExtension) return 'image';

        // Check for video hosting domains and patterns
        const videoDomains = [
            'catbox.moe', 'youtube.com', 'youtu.be', 'vimeo.com',
            'dailymotion.com', 'twitch.tv', 'streamable.com', 'cloudinary.com'
        ];

        // Check if URL contains video indicators
        const videoIndicators = [
            '/video/', '/videos/', 'video=true', 'type=video',
            'media=video', 'resource_type=video'
        ];

        const isVideoDomain = videoDomains.some(domain =>
            urlString.includes(domain)
        );

        const hasVideoIndicator = videoIndicators.some(indicator =>
            urlString.includes(indicator)
        );

        // Check for common video MIME type patterns
        const hasVideoMimePattern = urlString.includes('video/') ||
            urlString.includes('/video');

        // For catbox.moe specifically - prioritize as video
        if (urlString.includes('catbox.moe')) {
            return 'video';
        }

        // If multiple video indicators exist, treat as video
        if ((isVideoDomain && hasVideoIndicator) ||
            (isVideoDomain && hasVideoMimePattern) ||
            (hasVideoIndicator && hasVideoMimePattern)) {
            return 'video';
        }

        // Check for image patterns
        const imagePatterns = [
            '/image/', '/images/', 'image=true', 'type=image',
            'media=image', 'resource_type=image'
        ];

        const hasImagePattern = imagePatterns.some(pattern =>
            urlString.includes(pattern)
        );

        const hasImageMimePattern = urlString.includes('image/') ||
            urlString.includes('/image');

        // If we have strong image indicators, return image
        if (hasImagePattern || hasImageMimePattern) {
            return 'image';
        }

        // Default to image for safety, but log for debugging
        console.warn('Unable to determine file type for URL:', url, 'Defaulting to image');
        return 'image';
    };

    // ENHANCED URL VALIDATION AND NORMALIZATION
    const normalizeUrl = (url) => {
        if (!url || typeof url !== 'string') return '';
        
        let normalizedUrl = url.trim();
        
        // Handle protocol-relative URLs
        if (normalizedUrl.startsWith('//')) {
            normalizedUrl = 'https:' + normalizedUrl;
        }
        
        // Add protocol if missing
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
            normalizedUrl = 'https://' + normalizedUrl;
        }
        
        return normalizedUrl;
    };

    // Function to generate Google Maps link from coordinates
    const generateLocationLink = (latitude, longitude) => {
        if (!latitude || !longitude) return '';

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) return '';

        // Convert to degrees, minutes, seconds format
        const latDegrees = Math.floor(Math.abs(lat));
        const latMinutes = Math.floor((Math.abs(lat) - latDegrees) * 60);
        const latSeconds = ((Math.abs(lat) - latDegrees - latMinutes / 60) * 3600).toFixed(1);
        const latDirection = lat >= 0 ? 'N' : 'S';

        const lonDegrees = Math.floor(Math.abs(lng));
        const lonMinutes = Math.floor((Math.abs(lng) - lonDegrees) * 60);
        const lonSeconds = ((Math.abs(lng) - lonDegrees - lonMinutes / 60) * 3600).toFixed(1);
        const lonDirection = lng >= 0 ? 'E' : 'W';

        const dmsString = `${latDegrees}°${latMinutes.toString().padStart(2, '0')}'${latSeconds}"${latDirection}+${lonDegrees}°${lonMinutes.toString().padStart(2, '0')}'${lonSeconds}"${lonDirection}`;

        return `https://www.google.com/maps/place/${dmsString}/@${lat},${lng},17z/data=!3m1!4b1!4m4!3m3!8m2!3d${lat}!4d${lng}?entry=ttu&g_ep=EgoyMDI1MDgwNC4wIKXMDSoASAFQAw%3D%3D`;
    };

    // CORRECTED Excel to Product mapping - FIXED DUPLICATE ISSUE
    const mapExcelToProduct = (excelRow, allProducts = []) => {
        // Calculate square feet
        const width = parseInt(excelRow['W'] || excelRow['Width'] || '0');
        const height = parseInt(excelRow['H'] || excelRow['Height'] || '0');
        const squareFeet = width * height;

        // Process additional files from Excel columns - FIXED DUPLICATE ISSUE
        const additionalFiles = [];

        // Helper function to add file if it exists - CORRECTED
        const addFileIfExists = (url, columnName) => {
            if (url && url.toString().trim() !== '') {
                const fileUrl = normalizeUrl(url.toString().trim());

                // Check if this URL is already added to prevent duplicates - FIXED LOGIC
                const isDuplicate = additionalFiles.some(file =>
                    file.url === fileUrl ||
                    file.previewUrl === fileUrl ||
                    (file.excelColumn && file.excelColumn === columnName && file.url === fileUrl)
                );

                if (!isDuplicate) {
                    additionalFiles.push({
                        url: fileUrl,
                        previewUrl: fileUrl,
                        type: getFileType({ url: fileUrl }),
                        public_id: null,
                        isFromExcel: true,
                        excelColumn: columnName,
                        markedForDeletion: false,
                        id: `excel_${columnName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                    });
                }
            }
        };

        // Check all possible additional file columns - CORRECTED ORDER
        // Process each column individually to maintain order
        const additionalFileColumns = [
            'AdditionalFiles1', 'AdditionalFiles2', 'AdditionalFiles3',
            'AdditionalFiles4', 'AdditionalFiles5'
        ];

        additionalFileColumns.forEach(column => {
            if (excelRow[column] && excelRow[column].toString().trim() !== '') {
                addFileIfExists(excelRow[column], column);
            }
        });

        // Generate location link
        const latitude = excelRow['Latitude'] || '';
        const longitude = excelRow['Longitude'] || '';
        const locationLink = excelRow['Location Link'] || generateLocationLink(latitude, longitude);

        // Process similar products (if provided in Excel)
        const similarProducts = [];
        if (excelRow['Similar Product'] && excelRow['Similar Product'].trim() !== '') {
            const similarProductCodes = excelRow['Similar Product'].split(',').map(code => code.trim());
            similarProductCodes.forEach(productCode => {
                if (productCode) {
                    // Try to find the product in existing products
                    const foundProduct = Array.isArray(allProducts)
                        ? allProducts.find(product =>
                            product && (product.prodCode === productCode ||
                                (product.name && product.name.toLowerCase().includes(productCode.toLowerCase())))
                        )
                        : null;

                    if (foundProduct) {
                        similarProducts.push({
                            Prodname: foundProduct.name || productCode,
                            ProdCode: foundProduct.prodCode || productCode,
                            image: foundProduct.image || "",
                            ProdPrice: foundProduct.price || "0",
                            ProdPrintingCost: foundProduct.printingCost || "0",
                            ProdMountingCost: foundProduct.mountingCost || "0"
                        });
                    } else {
                        // If product not found, create a basic entry
                        similarProducts.push({
                            Prodname: productCode,
                            ProdCode: productCode,
                            image: "",
                            ProdPrice: "0",
                            ProdPrintingCost: "0",
                            ProdMountingCost: "0"
                        });
                    }
                }
            });
        }

        // Use main image URL from input or from Excel (with normalization)
        const mainImage = normalizeUrl(mainImageUrl.trim() || excelRow['Image'] || " ");

        return {
            name: excelRow['Product Name'] || 'Unnamed Product',
            price: excelRow['Product Amount'] || '0',
            printingCost: excelRow['Product Printing Cost'] || '0',
            mountingCost: excelRow['Product Mounting Cost'] || '0',
            prodCode: excelRow['Product ID'],
            lighting: excelRow['Lighting'] || 'Not-Lit',
            width: (excelRow['W'] || '0').toString(),
            height: (excelRow['H'] || '0').toString(),
            mediaType: excelRow['Media Type'] || 'Hoarding',
            location: {
                state: excelRow['Location(State)'] || excelRow['State'] || 'Tamil Nadu',
                district: excelRow['Location(District)'] || excelRow['District'] || 'Tamil Nadu'
            },
            area: squareFeet.toString(),
            quantity: excelRow['Qty'] || '1',
            // Additional fields from your database structure
            from: excelRow['From'] || " ",
            to: excelRow['To'] || " ",
            rating: parseFloat(excelRow['Rating']) || 4.5,
            side: "1",
            fixedAmount: "999",
            fixedOffer: "5",
            visible: true,
            productsquareFeet: squareFeet.toString() || excelRow['SquareFeet'],
            similarProducts: similarProducts,
            Latitude: latitude,
            Longitude: longitude,
            LocationLink: locationLink,
            image: mainImage,
            imagePublicId: null,
            additionalFiles: additionalFiles,
        };
    };

    // Enhanced Excel Preview Section
    const EnhancedExcelPreview = ({ excelData, onConfirm, onCancel, isUploading, products = [] }) => {
        const mappedProducts = excelData.map(row => mapExcelToProduct(row, products));
        return (
            <div className="excel-preview-section enhanced-preview">
                <h4>Excel Data Preview - {excelData.length} Records</h4>

                {/* Main Image URL Input */}
                <div className="main-image-url-section" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                        Main Image URL (for all products):
                    </label>
                    <input
                        type="url"
                        placeholder="Enter main image URL for all products"
                        value={mainImageUrl}
                        onChange={(e) => setMainImageUrl(e.target.value)}
                        className="clientDetailsInput"
                        style={{ width: '100%', padding: '8px' }}
                    />
                    <small style={{ color: '#666' }}>
                        This image will be used for all products in the Excel file. Leave empty to use individual product images from Excel.
                    </small>
                </div>

                {/* Mapping Summary */}
                <div className="mapping-summary">
                    <h5>Data Mapping Summary:</h5>
                </div>

                {/* Preview Table */}
                <div className="excel-preview-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Media Type</th>
                                <th>Size</th>
                                <th>Price</th>
                                <th>Additional Files</th>
                                <th>Similar Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappedProducts.slice(0, 50).map((product, index) => (
                                <tr key={index}>
                                    <td>{product.prodCode}</td>
                                    <td>{product.name}</td>
                                    <td>{product.location.district}, {product.location.state}</td>
                                    <td>{product.mediaType}</td>
                                    <td>{product.width} x {product.height}</td>
                                    <td>₹{product.price}</td>
                                    <td>
                                        {product.additionalFiles && product.additionalFiles.length > 0 ? (
                                            <span className="file-count-badge">
                                                {product.additionalFiles.length} files
                                            </span>
                                        ) : 'None'}
                                    </td>
                                    <td>
                                        {product.similarProducts && product.similarProducts.length > 0 ? (
                                            <span className="similar-products-badge">
                                                {product.similarProducts.length} products
                                            </span>
                                        ) : 'None'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {excelData.length > 20 && (
                        <p className="preview-more">... and {excelData.length - 20} more records</p>
                    )}
                </div>

                {/* Upload Actions */}
                <div className="bulk-upload-actions">
                    <button
                        type="button"
                        className="calendarSaveBtn bulk-upload-btn"
                        onClick={onConfirm}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : `Upload ${excelData.length} Products`}
                    </button>
                    <button
                        type="button"
                        className="calendarCancelBtn"
                        onClick={onCancel}
                        disabled={isUploading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    const handleAddFileFromUrl = () => {
        if (!additionalFileUrl.trim()) {
            alert('Please enter a valid URL');
            return;
        }

        const currentNonDeletedFiles = additionalFiles.filter(f => !f.markedForDeletion).length;
        if (currentNonDeletedFiles >= 3) {
            alert(`Maximum 3 files allowed. You already have ${currentNonDeletedFiles} files.`);
            return;
        }

        try {
            // Normalize and validate URL
            const normalizedUrl = normalizeUrl(additionalFileUrl);
            new URL(normalizedUrl); // This will throw if invalid

            const fileType = getFileType(normalizedUrl);

            console.log('URL File Type Detection:', {
                originalUrl: additionalFileUrl,
                normalizedUrl: normalizedUrl,
                detectedType: fileType
            });

            const newFile = {
                url: normalizedUrl,
                previewUrl: normalizedUrl,
                id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: fileType,
                markedForDeletion: false,
                isFromUrl: true,
                public_id: null,
                isNew: true
            };

            setAdditionalFiles(prev => [...prev, newFile]);
            setAdditionalFileUrl('');

            if (fileType === 'video') {
                alert('Video URL added successfully. Please note: Some video URLs may not preview correctly in the admin panel but will work on the main site.');
            } else {
                alert('Image URL added successfully');
            }

        } catch (error) {
            alert('Please enter a valid URL');
            console.error('Invalid URL:', error);
        }
    };

    const handleBulkSave = async () => {
        if (excelData.length === 0) {
            toast.error('No data to upload');
            return;
        }

        setIsUploadingExcel(true);
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Fetch current products for update check and similar product lookup
        let currentProducts = [];
        try {
            const response = await fetch(`${baseUrl}/products`);
            currentProducts = await response.json();
        } catch (error) {
            console.error('Error fetching products for similar product lookup:', error);
        }

        for (const [index, row] of excelData.entries()) {
            try {
                console.log(`Processing row ${index + 1}:`, row);
                const productData = mapExcelToProduct(row, currentProducts);

                // Validate required fields
                if (!productData.name || !productData.prodCode) {
                    errors.push(`Row ${index + 1}: Missing required fields (Name or Product ID)`);
                    errorCount++;
                    continue;
                }

                // Check if product already exists (for update)
                const existingProduct = currentProducts.find(
                    product => product.prodCode === productData.prodCode
                );

                // Prepare complete product data matching your database structure
                const completeProductData = {
                    ...productData,
                    image: productData.image || " ",
                    imagePublicId: existingProduct?.imagePublicId || null,
                    additionalFiles: productData.additionalFiles || [],
                    from: productData.from || " ",
                    to: productData.to || " ",
                    rating: parseFloat(productData.rating) || 4.5,
                    side: productData.side || "1",
                    sizeCalculation: {
                        sizeWidth1: productData.width,
                        sizeWidth2: "",
                        sizeWidth3: "",
                        sizeQuantity1: productData.quantity || "1",
                        sizeQuantity2: "",
                        sizeQuantity3: ""
                    },
                    fixedAmount: productData.fixedAmount || "999",
                    fixedOffer: productData.fixedOffer || "5",
                    visible: true,
                    productsquareFeet: productData.productsquareFeet ||
                        (parseInt(productData.width) * parseInt(productData.height)).toString(),
                    similarProducts: productData.similarProducts || [],
                    Latitude: productData.Latitude || "",
                    Longitude: productData.Longitude || "",
                    LocationLink: productData.LocationLink || ""
                };

                let response;
                if (existingProduct) {
                    // UPDATE existing product
                    console.log(`Updating existing product: ${productData.prodCode}`);
                    response = await fetch(`${baseUrl}/products/${existingProduct._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(completeProductData),
                    });
                } else {
                    // CREATE new product
                    console.log(`Creating new product: ${productData.prodCode}`);
                    response = await fetch(`${baseUrl}/products`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(completeProductData),
                    });
                }

                if (response.ok) {
                    successCount++;
                    console.log(`Successfully processed: ${productData.prodCode}`);
                } else {
                    const errorText = await response.text();
                    errors.push(`Row ${index + 1}: ${errorText}`);
                    errorCount++;
                    console.error(`Failed to process ${productData.prodCode}:`, errorText);
                }
            } catch (error) {
                console.error('Error saving product:', error);
                errors.push(`Row ${index + 1}: ${error.message}`);
                errorCount++;
            }
        }

        setIsUploadingExcel(false);
        setShowExcelPreview(false);
        setExcelData([]);
        setMainImageUrl(''); // Reset main image URL

        // Show detailed results
        if (errors.length > 0) {
            toast.error(
                <div>
                    Upload completed with errors:<br />
                    Successful: {successCount}<br />
                    Failed: {errorCount}<br />
                    <details>
                        <summary>Show errors</summary>
                        {errors.slice(0, 5).map((error, i) => <div key={i}>{error}</div>)}
                        {errors.length > 5 && <div>... and {errors.length - 5} more errors</div>}
                    </details>
                </div>,
                { autoClose: 10000 }
            );
        } else {
            alert(`Bulk upload completed: ${successCount} products processed successfully`);
        }

        // Refresh products list
        fetchProduct();
    };

    // ENHANCED FILE PREVIEW COMPONENT WITH BETTER ERROR HANDLING
    const FilePreview = ({ file, onDelete, uploading }) => {
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        const [retryCount, setRetryCount] = useState(0);

        const fileType = getFileType(file);
        // Use normalized URL for preview
        const previewUrl = normalizeUrl(file.url || file.previewUrl);

        const handleLoad = () => {
            setLoading(false);
            setError(false);
        };

        const handleError = () => {
            setLoading(false);
            setError(true);
            console.error('Failed to load media:', previewUrl, 'Type:', fileType, 'File object:', file);
        };

        const handleRetry = () => {
            setLoading(true);
            setError(false);
            setRetryCount(prev => prev + 1);
        };

        // Add cache busting for retries
        const getUrlWithCacheBust = () => {
            if (retryCount > 0) {
                const separator = previewUrl.includes('?') ? '&' : '?';
                return `${previewUrl}${separator}retry=${retryCount}&t=${Date.now()}`;
            }
            return previewUrl;
        };

        // Debug info
        useEffect(() => {
            console.log('FilePreview Debug:', {
                file,
                fileType,
                previewUrl,
                loading,
                error
            });
        }, [file, fileType, previewUrl, loading, error]);

        return (
            <div className={`videoPreview`}>
                <div className="videoPreviewContainer">
                    {loading && (
                        <div className="file-loading">
                            <div className="loading-spinner"></div>
                            <span>Loading {fileType}...</span>
                        </div>
                    )}

                    {error && (
                        <div className="file-error">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <span>Failed to load {fileType}</span>
                            <button
                                className="retry-btn"
                                onClick={handleRetry}
                                disabled={uploading}
                            >
                                Retry
                            </button>
                            <div className="url-debug">
                                <small>URL: {previewUrl}</small>
                            </div>
                        </div>
                    )}

                    {!error && fileType === 'video' ? (
                        <video
                            key={`video-${retryCount}`}
                            controls
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: loading ? 'none' : 'block'
                            }}
                            onLoadStart={handleLoad}
                            onLoadedData={handleLoad}
                            onCanPlay={handleLoad}
                            onError={handleError}
                            preload="metadata"
                            playsInline
                            muted
                        >
                            <source src={getUrlWithCacheBust()} type="video/mp4" />
                            <source src={getUrlWithCacheBust()} type="video/webm" />
                            <source src={getUrlWithCacheBust()} type="video/ogg" />
                            Your browser does not support the video tag.
                        </video>
                    ) : !error && (
                        <img
                            key={`image-${retryCount}`}
                            src={getUrlWithCacheBust()}
                            alt="Preview"
                            style={{
                                objectFit: 'cover',
                                height: '100%',
                                width: '100%',
                                display: loading ? 'none' : 'block'
                            }}
                            onLoad={handleLoad}
                            onError={handleError}
                            loading="lazy"
                            crossOrigin="anonymous" // This helps with CORS issues
                        />
                    )}

                    <button
                        className="deleteButton"
                        onClick={() => onDelete(file)}
                        disabled={uploading}
                        title="Delete file"
                    >
                        ×
                    </button>

                    {file.isFromExcel && (
                        <div className="file-source-badge" title="From Excel">
                            Excel
                        </div>
                    )}
                    {file.isFromUrl && (
                        <div className="file-source-badge" title="From URL">
                            URL
                        </div>
                    )}

                    {/* File type indicator */}
                    <div className={`file-type-indicator ${fileType}`}>
                        {fileType === 'video' ? 'VID' : 'IMG'}
                    </div>
                </div>
            </div>
        );
    };

    // Rest of your existing code remains the same...
    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className='Product-rating-star'>
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star Product-stars1"></span>
                ))}
                {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
                ))}
            </div>
        );
    };

    const RatingStars1 = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div>
                <div className='Product-rating-star1'>
                    {[...Array(fullStars)].map((_, index) => (
                        <span key={index} className="fa-solid fa-star Product-stars1"></span>
                    ))}
                    {halfStar && <span className="fa-solid fa-star-half-alt Product-stars1"></span>}
                    {[...Array(emptyStars)].map((_, index) => (
                        <span key={index} className="fa-solid fa-star Product-empty-star1 Product-stars1"></span>
                    ))}
                </div>
            </div>
        );
    };

    const [errors, setErrors] = useState({
        productName: false,
        productAmount: false,
        productID: false,
        productFrom: false,
        productTo: false,
        productPrintingCost: false,
        productMountingCost: false,
        prodwidth: false,
        prodheight: false,
        prodSide: false,
        image: false,
        selectedState: false,
        selectedDistrict: false,
        similarProducts: false,
        prodLatitude: false,
        prodLongitude: false,
        prodLocationLink: false,
    });

    const validateForm = () => {
        const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
        const newErrors = {
            productName: !productName,
            productAmount: !productAmount,
            productID: !productID,
            productFrom: !productFrom,
            productTo: !productTo,
            productPrintingCost: !productPrintingCost,
            productMountingCost: !productMountingCost,
            prodwidth: !prodwidth,
            prodheight: !prodheight,
            prodSide: !prodSide,
            image: !image || image === " ",
            selectedState: !selectedState,
            selectedDistrict: !selectedDistrict,
            similarProducts: false,
            prodLatitude: !prodLatitude,
            prodLongitude: !prodLongitude,
            prodLocationLink: false,
            additionalFiles: validAdditionalFiles.length > 3
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch(`${baseUrl}/products`)
            .then((response) => response.json())
            .then((data) => {
                const productsWithVisibility = data.map((product) => ({
                    ...product,
                    visible: product.visible !== false,
                }));
                setProducts(productsWithVisibility.sort((a, b) => b.visible - a.visible));
            });
    }, []);

    const normalizeSimilarProducts = (products) =>
        products.map(p => ({
            ...p,
            prodCode: p.ProdCode,
            name: p.Prodname
        }));

    const [similarProdId, setSimilarProdId] = useState('');
    const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]);

    const normalizeCode = (code) => (code || '').replace(/^#/, '').trim().toLowerCase();
    const handleSelectProduct = () => {
        const enteredId = similarProdId.trim();
        if (!enteredId) return;

        const matches = products.filter(product => {
            const matchCode = normalizeCode(product.prodCode) === normalizeCode(enteredId);
            const matchName = product.name.toLowerCase().includes(enteredId.toLowerCase());
            return matchCode || matchName;
        });

        if (matches.length === 0) {
            toast.error("No matching products found");
            return;
        }

        if (matches.length > 1) {
            toast.info("Multiple matches found - please select from suggestions");
            return;
        }

        const productToAdd = matches[0];

        if (selectedSimilarProducts.some(p => normalizeCode(p.prodCode) === normalizeCode(productToAdd.prodCode))) {
            toast.warning("Product already added");
            return;
        }

        setSelectedSimilarProducts(prev => [...prev, productToAdd]);
        setSimilarProdId('');
        setSearchSuggestions([]);
    };

    const handleRemoveProduct = (prodCode) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const normalize = code => code.replace(/^#/, '').trim().toLowerCase();
        const targetCode = normalize(prodCode);

        setSelectedSimilarProducts(prev =>
            prev.filter(product =>
                normalize(product.prodCode) !== targetCode
            )
        );
    };

    const [productName, setProductName] = useState("");
    const [productAmount, setProductAmount] = useState("");
    const [productID, setProductId] = useState("");
    const [prodLighting, setProdLighting] = useState("");
    const [productFrom, setProductFrom] = useState("");
    const [productTo, setProductTo] = useState("");
    const [productPrintingCost, setProductPrintingCost] = useState("");
    const [productMountingCost, setProductMountingCost] = useState("");
    const [productFixedAmount, setProductFixedAmount] = useState('999');
    const [productFixedAmountOffer, setProductFixedAmountOffer] = useState('5');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [prodRating, setProdRating] = useState(4.5);
    const [prodLatitude, setProdLatitude] = useState('');
    const [prodLongitude, setProdLongitude] = useState('');
    const [prodLocationLink, setProdLocationLink] = useState('');

    //  Main image URL input handler
    const [mainImageInputUrl, setMainImageInputUrl] = useState('');

    const handleMainImageUrlAdd = () => {
        if (!mainImageInputUrl.trim()) {
            alert('Please enter a valid image URL');
            return;
        }

        try {
            // Normalize and validate URL
            const normalizedUrl = normalizeUrl(mainImageInputUrl);
            new URL(normalizedUrl);

            // Check if it's likely an image
            const fileType = getFileType(normalizedUrl);
            if (fileType !== 'image') {
                if (!window.confirm('This URL does not appear to be an image. Continue anyway?')) {
                    return;
                }
            }

            setImage(normalizedUrl);
            setImageFile(null); // Clear any uploaded file
            setMainImageInputUrl('');
            alert('Main image URL set successfully');
        } catch (error) {
            alert('Please enter a valid URL');
            console.error('Invalid URL:', error);
        }
    };

    const generateGoogleMapsLink = () => {
        if (!prodLatitude || !prodLongitude) {
            toast.error("Please enter both latitude and longitude");
            return;
        }
        const latDegrees = Math.floor(Math.abs(prodLatitude));
        const latMinutes = Math.floor((Math.abs(prodLatitude) - latDegrees) * 60);
        const latSeconds = ((Math.abs(prodLatitude) - latDegrees - latMinutes / 60) * 3600).toFixed(1);
        const latDirection = prodLatitude >= 0 ? 'N' : 'S';

        const lonDegrees = Math.floor(Math.abs(prodLongitude));
        const lonMinutes = Math.floor((Math.abs(prodLongitude) - lonDegrees) * 60);
        const lonSeconds = ((Math.abs(prodLongitude) - lonDegrees - lonMinutes / 60) * 3600).toFixed(1);
        const lonDirection = prodLongitude >= 0 ? 'E' : 'W';

        const dmsString = `${latDegrees}°${latMinutes.toString().padStart(2, '0')}'${latSeconds}"${latDirection}+${lonDegrees}°${lonMinutes.toString().padStart(2, '0')}'${lonSeconds}"${lonDirection}`;
        const link = `https://www.google.com/maps/place/${dmsString}/@${prodLatitude},${prodLongitude},17z/data=!3m1!4b1!4m4!3m3!8m2!3d${prodLatitude}!4d${prodLongitude}?entry=ttu&g_ep=EgoyMDI1MDgwNC4wIKXMDSoASAFQAw%3D%3D`;

        setProdLocationLink(link);
        setErrors(prev => ({ ...prev, prodLocationLink: false }));
    };

    const handleRatingChange = (value) => {
        let newRating = parseFloat(value);
        if (newRating >= 0 && newRating <= 5) {
            setProdRating(newRating);
        }
    };

    const [prodType, setProdType] = useState("Select");
    const { toggleStateDropdown, handleStateClick, handleDistrictClick, selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, showDistricts, setShowDistricts, showStates, setShowStates } = useSpot();
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState("");
    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImage(previewUrl);
            setImageFile(file);
            setMainImageInputUrl(''); // Clear URL input when file is uploaded
        }
    };

    const handleFileChangeAdded = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const files = Array.from(e.target.files).filter(file =>
            file.type.startsWith('video/') ||
            file.type.startsWith('image/') ||
            ['.mp4', '.mov', '.avi', '.mkv', '.jpg', '.jpeg', '.png', '.gif'].some(ext =>
                file.name.toLowerCase().endsWith(ext))
        );
        if (files.length === 0) {
            alert('Please select valid video or image files');
            return;
        }

        const currentNonDeletedFiles = additionalFiles.filter(f => !f.markedForDeletion).length;
        if (currentNonDeletedFiles + files.length > 3) {
            alert(`Maximum 3 files allowed. You already have ${currentNonDeletedFiles} files.`);
            return;
        }

        const newFiles = files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: getFileType(file),
            markedForDeletion: false,
            isNew: true
        }));
        setAdditionalFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    // Fixed handleDeleteAdded function
    const handleDeleteAdded = async (fileToDelete) => {
        if (!window.confirm('Delete this file?')) return;
        try {
            setAdditionalFiles(prev =>
                prev.map(file => {
                    // Match by multiple identifiers to be safe
                    const isMatch =
                        (fileToDelete.id && file.id === fileToDelete.id) ||
                        (fileToDelete.public_id && file.public_id === fileToDelete.public_id) ||
                        (fileToDelete.url && file.url === fileToDelete.url) ||
                        (fileToDelete.previewUrl && file.previewUrl === fileToDelete.previewUrl);

                    if (isMatch) {
                        // For files with public_id (already uploaded), mark for deletion
                        if (file.public_id && !file.isNew) {
                            return { ...file, markedForDeletion: true };
                        }
                        // For new files without public_id, remove completely
                        else {
                            // Revoke object URL to prevent memory leaks
                            if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(file.previewUrl);
                            }
                            return null;
                        }
                    }
                    return file;
                }).filter(Boolean) // Remove null entries
            );
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete file');
        }
    };

    const [productsData, setProductsData] = useState([]);
    const [editProduct, setEditProduct] = useState(null);

    // Enhanced useEffect for editing products
    useEffect(() => {
        if (state?.editProduct) {
            const prod = state.editProduct;
            setEditProduct(prod);
            // Normalize image URL when loading from edit
            setImage(normalizeUrl(prod.image || " "));
            setProductName(prod.name || '');
            setProductAmount(prod.price || '');
            setProductFixedAmount(prod.fixedAmount || '999');
            setProductFixedAmountOffer(prod.fixedOffer || '5');
            setProductPrintingCost(prod.printingCost || '');
            setProductMountingCost(prod.mountingCost || '');
            setProductId(prod.prodCode || '');
            setProdLighting(prod.lighting);
            setProductFrom(prod.from || '');
            setProductTo(prod.to || '');
            setProdRating(prod.rating || 0);
            setProdWidth(prod.width || '');
            setProdHeight(prod.height || '');
            setProdSide(prod.side || '');
            setSizeWidth1(prod.sizeCalculation?.sizeWidth1 || '');
            setSizeWidth2(prod.sizeCalculation?.sizeWidth2 || '');
            setSizeWidth3(prod.sizeCalculation?.sizeWidth3 || '');
            setSizeQuantity1(prod.sizeCalculation?.sizeQuantity1 || '');
            setSizeQuantity2(prod.sizeCalculation?.sizeQuantity2 || '');
            setSizeQuantity3(prod.sizeCalculation?.sizeQuantity3 || '');
            setProdType(prod.mediaType || '');
            setSelectedState(prod.location?.state || '');
            setSelectedDistrict(prod.location?.district || '');
            setSelectedSimilarProducts(normalizeSimilarProducts(prod.similarProducts || []));
            setProdLatitude(prod.Latitude || '');
            setProdLongitude(prod.Longitude || '');
            setProdLocationLink(prod.LocationLink || '');

            // Enhanced additional files handling for edit with URL normalization
            if (prod.additionalFiles && prod.additionalFiles.length > 0) {
                const enhancedFiles = prod.additionalFiles.map(file => ({
                    ...file,
                    url: normalizeUrl(file.url), // Normalize URLs when loading
                    id: file.public_id || `existing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    previewUrl: normalizeUrl(file.url),
                    markedForDeletion: false,
                    isNew: false,
                    // Preserve the original file data for proper handling
                    originalData: file
                }));
                setAdditionalFiles(enhancedFiles);
            } else {
                setAdditionalFiles([]);
            }
        }
    }, [state]);

    const fetchProduct = async () => {
        const response = await fetch(`${baseUrl}/products`);
        const data = await response.json();
        setProductsData(data);
        console.log(data);
    }

    useEffect(() => {
        fetchProduct();
    }, []);
    
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Please fill all required fields correctly");
            return;
        }

        const validAdditionalFiles = additionalFiles.filter(file => !file.markedForDeletion);
        if (validAdditionalFiles.length > 3) {
            alert(`Maximum 3 additional files allowed. You have ${validAdditionalFiles.length} files.`);
            return;
        }

        if (!prodLocationLink) {
            alert("Please generate location link");
            return;
        }

        if (selectedSimilarProducts.length === 0) {
            if (!window.confirm("You haven't added any similar products. Continue anyway?")) {
                return;
            }
        }

        if (validAdditionalFiles.length === 0) {
            if (!window.confirm("You haven't added any additional files. Continue without additional files?")) {
                return;
            }
        }
        setUploading(true);

        const method = editProduct ? 'PUT' : 'POST';
        const url = editProduct ? `${baseUrl}/products/${editProduct._id}` : `${baseUrl}/products`;

        try {
            let cloudinaryUrl = image;
            let cloudinaryPublicId = editProduct?.imagePublicId || null;

            // Handle main image - either uploaded file or URL
            if (imageFile && !image.startsWith('http')) {
                // Upload file to Cloudinary
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadResponse = await fetch(`${baseUrl}/upload`, {
                    method: "POST",
                    body: formData
                });
                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload main image');
                }
                const uploadData = await uploadResponse.json();
                cloudinaryUrl = uploadData.imageUrl;
                cloudinaryPublicId = uploadData.public_id;
            }
            else if (image.startsWith('http')) {
                // Use existing URL (from input or existing product)
                console.log("Using existing main image URL:", image);
                // For URL images, we don't have a public_id unless it's from Cloudinary
                if (!cloudinaryPublicId && image.includes('cloudinary')) {
                    // Extract public_id from Cloudinary URL if possible
                    const match = image.match(/upload\/(?:v\d+\/)?([^\.]+)/);
                    if (match) {
                        cloudinaryPublicId = match[1];
                    }
                }
            }
            else {
                throw new Error('Main image is required');
            }

            // CORRECTED: Enhanced additional files handling
            const finalAdditionalFiles = [];
            const filesToDelete = [];
            const filesToUpload = [];

            console.log("Processing additional files:", additionalFiles);

            // Separate files for different operations
            additionalFiles.forEach(file => {
                if (file.markedForDeletion) {
                    // Mark files for deletion (only if they have public_id and are not new)
                    if (file.public_id && !file.isNew) {
                        filesToDelete.push(file);
                    }
                    // For new files without public_id, they will be filtered out by not being added to finalAdditionalFiles
                } else {
                    // Files to keep
                    if (file.public_id && !file.isNew && !file.isFromUrl && !file.isFromExcel) {
                        // Keep existing Cloudinary files that are not marked for deletion
                        finalAdditionalFiles.push({
                            url: file.url,
                            public_id: file.public_id,
                            type: file.type
                        });
                    }
                    else if (file.isNew && file.file) {
                        // New local files to upload
                        filesToUpload.push(file);
                    }
                    else if (file.isFromUrl || file.isFromExcel || (file.url && !file.public_id)) {
                        // URL files or Excel files - store as-is (with normalized URL)
                        finalAdditionalFiles.push({
                            url: normalizeUrl(file.url),
                            public_id: null,
                            type: file.type,
                            isFromUrl: file.isFromUrl || false,
                            isFromExcel: file.isFromExcel || false
                        });
                    }
                    else if (file.public_id && file.isFromUrl) {
                        // Special case: URL files that were previously saved
                        finalAdditionalFiles.push({
                            url: normalizeUrl(file.url),
                            public_id: null, // Don't use public_id for URL files
                            type: file.type,
                            isFromUrl: true
                        });
                    }
                }
            });

            console.log("Files to upload:", filesToUpload);
            console.log("Files to delete:", filesToDelete);
            console.log("Final files before upload:", finalAdditionalFiles);

            // Upload new local files to Cloudinary
            const localFilesToUpload = filesToUpload.filter(file => file.file);
            if (localFilesToUpload.length > 0) {
                const formData = new FormData();
                localFilesToUpload.forEach(fileObj => {
                    formData.append('files', fileObj.file);
                });

                const filesResponse = await fetch(`${baseUrl}/save-videos`, {
                    method: 'POST',
                    body: formData
                });

                if (filesResponse.ok) {
                    const savedFiles = await filesResponse.json();
                    savedFiles.forEach(file => {
                        finalAdditionalFiles.push({
                            url: file.url,
                            public_id: file.public_id,
                            type: file.type
                        });
                    });
                } else {
                    console.error('Failed to upload local files');
                    throw new Error('Failed to upload some files');
                }
            }

            // Delete files marked for deletion
            for (const file of filesToDelete) {
                try {
                    if (file.public_id && !file.isFromUrl) {
                        await fetch(`${baseUrl}/delete-video`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                public_id: file.public_id,
                                resource_type: file.type
                            })
                        });
                    }
                } catch (deleteError) {
                    console.error('Error deleting file from Cloudinary:', deleteError);
                    // Continue with other operations even if deletion fails
                }
            }

            console.log("Final additional files to save:", finalAdditionalFiles);

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: productName,
                    price: productAmount,
                    printingCost: productPrintingCost,
                    mountingCost: productMountingCost,
                    image: cloudinaryUrl,
                    imagePublicId: cloudinaryPublicId,
                    additionalFiles: finalAdditionalFiles,
                    prodCode: productID,
                    lighting: prodLighting,
                    from: productFrom,
                    to: productTo,
                    rating: prodRating,
                    width: prodwidth,
                    height: prodheight,
                    side: prodSide,
                    sizeCalculation: {
                        sizeWidth1: sizeWidth1,
                        sizeWidth2: sizeWidth2,
                        sizeWidth3: sizeWidth3,
                        sizeQuantity1: sizeQuantity1,
                        sizeQuantity2: sizeQuantity2,
                        sizeQuantity3: sizeQuantity3,
                    },
                    fixedAmount: productFixedAmount,
                    fixedOffer: productFixedAmountOffer,
                    mediaType: prodType,
                    visible: true,
                    productsquareFeet: ProdSquareFeet(),
                    location: {
                        state: selectedState,
                        district: selectedDistrict
                    },
                    similarProducts: selectedSimilarProducts.map(prod => ({
                        Prodname: prod.name,
                        ProdCode: prod.prodCode,
                        image: prod.image,
                        ProdPrice: prod.price,
                        ProdPrintingCost: prod.printingCost,
                        ProdMountingCost: prod.mountingCost
                    })),
                    Latitude: prodLatitude,
                    Longitude: prodLongitude,
                    LocationLink: prodLocationLink,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to save product');
            }

            console.log('Save result:', result);
            if (!editProduct) {
                setProductsData(prev => [...prev, result]);
                alert("Product added successfully!");
            }
            else {
                setProductsData(prev =>
                    prev.map((product) =>
                        product._id === result._id ? result : product
                    )
                );
                alert("Product updated successfully!");
            }
            resetForm();
        }
        catch (error) {
            console.error(error);
            alert("An error occurred while saving the product.");
        }
        finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setProductName('');
        setImage('');
        setImageFile(null);
        setProductAmount('');
        setProductFixedAmount('999');
        setProductFixedAmountOffer('5');
        setProductMountingCost('');
        setProductPrintingCost('');
        setProductId('');
        setProdLighting('');
        setProductFrom('');
        setProductTo('');
        setProdRating(0);
        setProdWidth('');
        setProdHeight('');
        setProdSide('1');
        setSizeWidth1('');
        setSizeWidth2('');
        setSizeWidth3('');
        setSizeQuantity1('');
        setSizeQuantity2('');
        setSizeQuantity3('');
        setProdType('');
        setSelectedSimilarProducts([]);
        setProdLatitude('');
        setProdLongitude('');
        setProdLocationLink('');
        setAdditionalFiles([]);
        setEditProduct(null);
        setAdditionalFileUrl('');
        setMainImageInputUrl('');
        setIsSubmitted(false);

        // Clear file inputs
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';

        const additionalFileInput = document.querySelector('input[type="file"][accept="video/*,image/*"]');
        if (additionalFileInput) additionalFileInput.value = '';
    };

    useEffect(() => {
        return () => {
            if (image && !image.startsWith('http')) {
                URL.revokeObjectURL(image);
            }
            additionalFiles.forEach(file => {
                if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(file.previewUrl);
                }
            });
        };
    }, [image, additionalFiles]);

    const [stateDistricts, setStateDistricts] = useState({});
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const res = await fetch(`${baseUrl}/category`);
                const data = await res.json();
                const mappedData = {};
                data.forEach(({ state, districts }) => {
                    mappedData[state] = districts;
                });
                setStateDistricts(mappedData);
            } catch (err) {
                console.error("Failed to fetch category data:", err);
            }
        };
        fetchCategoryData();
    }, []);

    const [mediaTypesData, setMediaTypesData] = useState([]);
    const fetchMediaTypes = async () => {
        try {
            const res = await fetch(`${baseUrl}/mediatype`);
            const data = await res.json();
            setMediaTypesData(data);
        } catch (err) {
            alert('Failed to fetch media types: ' + err.message);
        }
    };

    useEffect(() => {
        fetchMediaTypes();
    }, []);

    const [prodwidth, setProdWidth] = useState('');
    const [prodheight, setProdHeight] = useState('');
    const [sizeWidth1, setSizeWidth1] = useState('');
    const [sizeWidth2, setSizeWidth2] = useState('');
    const [sizeWidth3, setSizeWidth3] = useState('');
    const [sizeHeight, setSizeHeight] = useState('');
    const [sizeQuantity1, setSizeQuantity1] = useState('');
    const [sizeQuantity2, setSizeQuantity2] = useState('');
    const [sizeQuantity3, setSizeQuantity3] = useState('');
    const [prodSide, setProdSide] = useState('1');
    const [totalCalculatedWidth, setTotalCalculatedWidth] = useState(0);

    useEffect(() => {
        const calculatedWidth = (Number(sizeWidth1) * Number(sizeQuantity1)) +
            (Number(sizeWidth2) * Number(sizeQuantity2)) +
            (Number(sizeWidth3) * Number(sizeQuantity3));
        setTotalCalculatedWidth(calculatedWidth);
        setProdWidth(calculatedWidth);
    }, [sizeWidth1, sizeWidth2, sizeWidth3, sizeQuantity1, sizeQuantity2, sizeQuantity3]);

    const squareFeet = Math.round(totalCalculatedWidth * Number(prodheight) * Number(prodSide));
    const ProdSquareFeet = () => squareFeet;

    return (
        <div>
            <form onSubmit={handleSaveProduct}>
                <div className='adManageMain'>

                    {/* Left side content */}
                    <div className='adManageContentLeft'>
                        <div className='ManageLeftImg1'>
                            <img 
                                src={image} 
                                className='ManageLeftImg1' 
                                alt="Product_Image"
                                onError={(e) => {
                                    console.error('Failed to load main image:', image);
                                    e.target.src = './images/placeholder-image.jpg'; // Fallback image
                                }}
                            />
                        </div>

                        {/* Product details section */}
                        <div className='manageprodMain'>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Name</div>
                                <div className='ManageProdRightContent'>{productName}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Price</div>
                                <div className='ManageProdRightContent'>₹ {productAmount} Per Day </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Printing Cost</div>
                                <div className='ManageProdRightContent'>₹ {productPrintingCost} Per Day </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Mounting Cost</div>
                                <div className='ManageProdRightContent'>₹ {productMountingCost} Per Day </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Size</div>
                                <div className='ManageProdRightContent'>{prodwidth} X {prodheight} | {ProdSquareFeet()} Sq.ft </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Side</div>
                                <div className='ManageProdRightContent'>{prodSide}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Lighting</div>
                                <div className='ManageProdRightContent'>{prodLighting}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>From</div>
                                <div className='ManageProdRightContent'>{productFrom}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>To</div>
                                <div className='ManageProdRightContent'>{productTo}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>FixedAmount</div>
                                <div className='ManageProdRightContent'>{productFixedAmount}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>FixedOffer</div>
                                <div className='ManageProdRightContent'>{productFixedAmountOffer}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Rating</div>
                                <div className='ManageProdRightContent'>
                                    <span className='Product-star-main'>
                                        <span><img src='./images/rating_board.png' className='Product-rate-board1'></img></span>
                                        <span><RatingStars rating={prodRating} /> </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Select Category section */}
                        <div className='manageprodMain manageProdSideContents'>
                            <div className='manageprodSideHeading'>Selected Category</div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Location</div>
                                <div className='ManageProdRightContent'>
                                    {selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : "Select a location"}
                                </div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Media Type</div>
                                <div className='ManageProdRightContent'>{prodType}</div>
                            </div>
                        </div>

                        {/* PRODUCT LOCATION LINK */}
                        <div className='manageprodMain'>
                            <div className='manageprodSideHeading'>Product Location Link</div>
                            <div className='ManageProductLocationLink'>
                                {prodLocationLink && (
                                    <div style={{ marginTop: '20px' }}>
                                        <a href={prodLocationLink}
                                            target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }} >
                                            {prodLocationLink}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ADDED DEMO PRODUCT IMAGES/VIDEOS */}
                        <div className='manageprodMain manageProdSideContents'>
                            <div className='manageprodSideHeading'>Demo Products</div>
                            <div className='adminProductVideoLeft'>
                                <div className='videoPreviewMain'>
                                    {additionalFiles
                                        .filter(file => !file.markedForDeletion)
                                        .slice(0, 3)
                                        .map((file, index) => (
                                            <FilePreview
                                                key={file.id || file.public_id || `file-${index}`}
                                                file={file}
                                                onDelete={handleDeleteAdded}
                                                uploading={uploading}
                                            />
                                        ))}

                                    {/* Empty slots */}
                                    {Array.from({
                                        length: 3 - additionalFiles.filter(f => !f.markedForDeletion).length
                                    }).map((_, index) => (
                                        <div key={`empty-${index}`} className={`videoPreview ${index + 1}`}>
                                            <div className="emptyPreview">No file</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Similar Product Section */}
                        <div className='manageprodMain'>
                            <div className='manageprodSideHeading'>Selected Similar products</div>
                            {selectedSimilarProducts.length > 0 ? (
                                selectedSimilarProducts.map((product, index) => (
                                    <div className='manageSimilarprod' key={index}>
                                        <div className='manageSimilarImg'>
                                            <img 
                                                src={product.image} 
                                                className='manageSimilarImg'
                                                alt={product.name}
                                                onError={(e) => {
                                                    console.error('Failed to load similar product image:', product.image);
                                                    e.target.src = './images/placeholder-image.jpg';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className='ManageProdRightContent1'>{product.name}</div>
                                            <div className='manageSimilarProdCode'>{product.prodCode}</div>
                                        </div>
                                        <div className='similarProdClose' onClick={() => handleRemoveProduct(product.prodCode)}>
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='smilarProdError'>No Similar Products Selected</p>
                            )
                            }
                        </div>
                    </div>

                    {/* Right side content */}
                    <div>
                        {/* Bulk Upload Section */}
                        <div className='manageClientSection'>
                            <div className='manageRightSideHeading'>Bulk Upload from Excel</div>
                            <div className='bulk-upload-section'>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleExcelUpload}
                                    id="excelFileInput"
                                    hidden
                                />
                                <label
                                    htmlFor="excelFileInput"
                                    className="file-upload-box excel-upload-box"
                                >
                                    <div>
                                        <i className="fa-solid fa-file-excel excelIconAdmin"></i>
                                    </div>
                                    <div className="upload-text">
                                        <div className="FileHeading">Upload Excel File</div>
                                        <span className="file-info">Upload .xlsx or .xls files with product data</span>
                                    </div>
                                </label>

                                {showExcelPreview && (
                                    <EnhancedExcelPreview
                                        excelData={excelData}
                                        onConfirm={handleBulkSave}
                                        onCancel={() => {
                                            setShowExcelPreview(false);
                                            setExcelData([]);
                                            setMainImageUrl('');
                                        }}
                                        isUploading={isUploadingExcel}
                                    />
                                )}
                            </div>
                        </div>

                        <div >
                            <div className='manageClientSection'>
                                {/* Main Image Upload Section with URL Input */}
                                <div className="upload-section" >
                                    <div className='adminProductUrlInput' style={{ marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                            <input
                                                type='url'
                                                placeholder='Enter main image URL'
                                                value={mainImageInputUrl}
                                                onChange={(e) => setMainImageInputUrl(e.target.value)}
                                                className='clientDetailsInput'
                                                style={{ flex: 1 }}
                                                disabled={uploading}
                                            />
                                            <button
                                                type='button'
                                                className='calendarSaveBtn'
                                                onClick={handleMainImageUrlAdd}
                                                disabled={uploading || !mainImageInputUrl.trim()}
                                                style={{ padding: '8px 15px', whiteSpace: 'nowrap' }}
                                            >
                                                Set URL
                                            </button>
                                        </div>
                                        <small style={{ color: '#666', display: 'block' }}>
                                            Or upload an image file below
                                        </small>
                                    </div>

                                    <div style={{border:'2px dashed gray'}}>
                                        <div className="upload-section">
                                            <input type="file" accept="image/*" id='fileInput' onChange={handleImageUpload} hidden />
                                            <label htmlFor="fileInput" className={`file-upload-box ${errors.image ? 'AdminProdinput-error' : ''}`}>
                                                <center>
                                                    <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
                                                </center>
                                                <div className="upload-text">
                                                    <div className="FileHeading">Drag and Drop an Image or Choose File</div>
                                                    <span className="file-info">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</span>
                                                </div>
                                            </label>
                                            {errors.image && <div className="AdminProderror-message">Product image is required</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Section */}
                            <div className='manageClientSection'>
                                <div className='manageRightSideHeading'>Product Management</div>
                                <div className='d-flex manageClientInformation'>

                                    <div className='manageClientInfoLeft'>
                                        <div className='clientDetailSection'>
                                            <div className='clientDetailHeading'>Product Name</div>
                                            <input type='text' placeholder='Enter Product Name' value={productName}
                                                onChange={(e) => {
                                                    setProductName(e.target.value);
                                                    setErrors(prev => ({ ...prev, productName: false }));
                                                }}
                                                className={`clientDetailsInput ${errors.productName ? 'AdminProdinput-error' : ''}`} />
                                            {errors.productName && <div className="AdminProderror-message ">Product name is required</div>}
                                        </div>
                                        <div className='clientDetailSection'>
                                            <div className='clientDetailHeading'>Price</div>
                                            <input type='number' placeholder='Enter Price' value={productAmount}
                                                onChange={(e) => {
                                                    setProductAmount(e.target.value);
                                                    setErrors(prev => ({ ...prev, productAmount: false }));
                                                }}
                                                className={`clientDetailsInput ${errors.productAmount ? 'AdminProdinput-error' : ''}`} />
                                            {errors.productAmount && <div className="AdminProderror-message ">Product Amount is required</div>}
                                        </div>
                                        <div className='clientDetailSection'>
                                            <div className='clientDetailHeading'>Lighting Type</div>
                                            <select className={`clientDetailsInput ${errors.prodLighting ? 'AdminProdinput-error' : ''}`} value={prodLighting}
                                                onChange={(e) => {
                                                    setProdLighting(e.target.value);
                                                    setErrors(prev => ({ ...prev, prodLighting: false }));
                                                }}>
                                                <option value="Select">Select</option>
                                                <option value="Not-Lit">Not-Lit</option>
                                                <option value="Front-Lit">Front-Lit</option>
                                                <option value="Back-Lit">Back-Lit</option>
                                            </select>
                                            {errors.prodLighting && <div className="AdminProderror-message ">Product Lighting is required</div>}
                                        </div>
                                        <div className='clientDetailSection'>
                                            <div className='clientDetailHeading'>Printing Cost</div>
                                            <input type='number' placeholder='Enter Price' value={productPrintingCost}
                                                onChange={(e) => {
                                                    setProductPrintingCost(e.target.value);
                                                    setErrors(prev => ({ ...prev, productPrintingCost: false }));
                                                }}
                                                className={`clientDetailsInput ${errors.productPrintingCost ? 'AdminProdinput-error' : ''}`} />
                                            {errors.productPrintingCost && <div className="AdminProderror-message ">Printing Cost is required</div>}
                                        </div>

                                        {/* PRODUCT CALCULATION */}
                                        <div className='clientDetailSection'>
                                            <div className='clientDetailHeading'>Size</div>
                                            <div>
                                                W   <input type='number' value={sizeWidth1}
                                                    onChange={(e) => {
                                                        setSizeWidth1(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodheight: false }));
                                                    }} className={`sizeWidthInput`} />
                                                <span className='sizeMultiply'> X </span>

                                                Q  <input type='number' value={sizeQuantity1}
                                                    onChange={(e) => {
                                                        setSizeQuantity1(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodheight: false }));
                                                    }} className={`sizeWidthInput`} />

                                                <span className='sizeMultiply'> + </span>

                                                W   <input type='number' value={sizeWidth2}
                                                    onChange={(e) => {
                                                        setSizeWidth2(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodheight: false }));
                                                    }} className={`sizeWidthInput`} />
                                                <span className='sizeMultiply'> X </span>

                                                Q  <input type='number' value={sizeQuantity2}
                                                    onChange={(e) => {
                                                        setSizeQuantity2(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodheight: false }));
                                                    }} className={`sizeWidthInput`} />

                                                <span className='sizeMultiply'> + </span>

                                                W   <input type='number' value={sizeWidth3}
                                                    onChange={(e) => {
                                                        setSizeWidth3(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodheight: false }));
                                                    }} className={`sizeWidthInput`} />
                                                <span className='sizeMultiply'> X </span>

                                                Q  <input type='number' value={sizeQuantity3}
                                                    onChange={(e) => {
                                                        setSizeQuantity3(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodheight: false }));
                                                    }} className={`sizeWidthInput`} />

                                                <span className='sizeMultiply'> = </span>
                                                <span> {prodwidth}</span>
                                            </div>

                                            <div className='sizeWidthValues'>
                                                W : <input type='number' value={prodwidth}
                                                    onChange={(e) => {
                                                        setProdWidth(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodwidth: false }));
                                                    }} className={`sizeWidthInput ${errors.prodwidth ? 'AdminProdinput-error' : ''}`} />
                                                <span className='sizeMultiply'> X </span>
                                                H : <input type='number' value={prodheight}
                                                    onChange={(e) => {
                                                        setProdHeight(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodheight: false }));
                                                    }} className={`sizeWidthInput ${errors.prodheight ? 'AdminProdinput-error' : ''}`} />
                                                <span className='sizeMultiply'> X </span>
                                                S : <input type='number' value={prodSide}
                                                    onChange={(e) => {
                                                        setProdSide(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodSide: false }));
                                                    }} className={`sizeWidthInput ${errors.prodSide ? 'AdminProdinput-error' : ''}`} /> <span className='sizeWidthSlash'> | </span> <label> {squareFeet} </label>Sq.ft
                                                {errors.prodwidth && errors.prodheight && errors.prodwidth && <div className="AdminProderror-message ">Product Height & Width & Side is required</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='manageClientInfoRight'>
                                        <div className='clientDetailSection'>
                                            <div className='clientDetailHeading'>Product ID</div>
                                            <input type='text' placeholder='Enter Product ID' value={productID}
                                                onChange={(e) => {
                                                    setProductId(e.target.value);
                                                    setErrors(prev => ({ ...prev, productID: false }));
                                                }} className={`clientDetailsInput ${errors.productID ? 'AdminProdinput-error' : ''}`} />
                                            {errors.productID && <div className="AdminProderror-message ">Product ID is required</div>}
                                        </div>
                                        <div className='clientDetailSection'>
                                            <div className='clientDetailHeading'>Location</div>
                                            <label className='locationFromLabel'>From <label style={{ float: 'right' }}>-</label></label>
                                            <input type='text' placeholder='Enter From' value={productFrom}
                                                onChange={(e) => {
                                                    setProductFrom(e.target.value);
                                                    setErrors(prev => ({ ...prev, productFrom: false }));
                                                }} className={`clientDetailsInput locationInput ${errors.productFrom ? 'AdminProdinput-error' : ''}`} />
                                            {errors.productFrom && <div className="AdminProderror-message ">Product From is required</div>}
                                            <br />
                                            <label className='locationFromLabel'>To<label style={{ float: 'right' }}>-</label></label>
                                            <input type='text' placeholder='Enter To' value={productTo}
                                                onChange={(e) => {
                                                    setProductTo(e.target.value);
                                                    setErrors(prev => ({ ...prev, productTo: false }));
                                                }} className={`clientDetailsInput locationInput ${errors.productTo ? 'AdminProdinput-error' : ''}`} />
                                            {errors.productTo && <div className="AdminProderror-message ">Product To is required</div>}
                                        </div>
                                        <div className='clientDetailSection'>
                                            <div className='clientDetailHeading'>Mounting Cost</div>
                                            <input type='number' placeholder='Enter Price' value={productMountingCost}
                                                onChange={(e) => {
                                                    setProductMountingCost(e.target.value);
                                                    setErrors(prev => ({ ...prev, productMountingCost: false }));
                                                }}
                                                className={`clientDetailsInput ${errors.productMountingCost ? 'AdminProdinput-error' : ''}`} />
                                            {errors.productMountingCost && <div className="AdminProderror-message ">Mouting Cost is required</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating section with OFFER */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className='manageClientSection' style={{ width: '40%' }}>
                                    <div className='clientDetailHeading'>Ratings</div>
                                    <div className='ProductRatingMain'>
                                        <div >
                                            <div>
                                                <span className='Product-star-main' >
                                                    <RatingStars1 rating={parseFloat(prodRating) || 0} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <select className='clientDetailsInput ratingInput' value={prodRating}
                                                onChange={(e) => handleRatingChange(e.target.value)}>
                                                <option value="1">1</option>
                                                <option value="1.5">1.5</option>
                                                <option value="2">2</option>
                                                <option value="2.5">2.5</option>
                                                <option value="3">3</option>
                                                <option value="3.5">3.5</option>
                                                <option value="4">4</option>
                                                <option value="4.5">4.5</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='manageClientSection' style={{ width: '60%' }}>
                                    <div className='clientDetailHeading'>Offers</div>
                                    <div className='ProductRatingMain'>
                                        <div className='AdminOfferDetails' >Pay ₹<input type='number' value={productFixedAmount} onChange={(e) => setProductFixedAmount(e.target.value)} className='sizeWidthInput adminOfferAmountInput' readOnly /> and Get <input type='number' value={productFixedAmountOffer} onChange={(e) => setProductFixedAmountOffer(e.target.value)} className='sizeWidthInput adminOfferAmountPercentage' readOnly />% Off <span className='adminOfferRefundDetails'> 100% Refundable </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Select Category section */}
                            <div className='manageClientSection'>
                                <div className='clientDetailHeading'>Select Category</div>
                                <div className='d-flex manageClientInformation'>
                                    <div className='manageClientInfoLeft'>
                                        <div className='clientDetailHeading'>Location</div>
                                        <div className="location-container11">
                                            <div className="input-wrapper" onClick={toggleStateDropdown}>
                                                <input
                                                    type="text"
                                                    className="clientDetailsInput locationSelectInput"
                                                    value={selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : ""}
                                                    placeholder="Select Location"
                                                    readOnly />
                                                <i className={`fa-solid ${showStates ? "fa-chevron-up" : "fa-chevron-down"} dropdown-arrow11`} style={{ fontSize: '10px' }}></i>
                                            </div>
                                            <div className="dropdown-container11">
                                                {showStates && (
                                                    <div className="dropdown11">
                                                        <ul className="dropdown-list11">
                                                            {Object.keys(stateDistricts).map((state) => (
                                                                <li
                                                                    key={state}
                                                                    onClick={() => handleStateClick(state)}
                                                                    className={selectedState === state ? "selected" : ""}
                                                                >
                                                                    {state}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {showDistricts && selectedState && (
                                                    <div className="dropdown11">
                                                        <ul className="dropdown-list11">
                                                            {stateDistricts[selectedState].map((district) => (
                                                                <li
                                                                    key={district}
                                                                    onClick={() => handleDistrictClick(district)}
                                                                    className={selectedDistrict === district ? "selected" : ""} >
                                                                    {district}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='manageClientInfoRight'>
                                        <div className='clientDetailHeading'>Media Type</div>
                                        <select className='clientDetailsInput' value={prodType} onChange={(e) => setProdType(e.target.value)} >
                                            <option value="">Select Media Type</option>
                                            {mediaTypesData.map((media, id) => (
                                                <option key={media._id} value={media.type}>
                                                    {media.type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* SELECT LOGITUDE AND LATITUDE FROM MAP */}
                            <div className='manageClientSection'>
                                <div className='clientDetailHeading'>Generate Location</div>
                                <div className='ProdLocationLinkMain'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product Latitude</div>
                                        <input type='text' placeholder='Enter Product Name' value={prodLatitude}
                                            onChange={(e) => {
                                                setProdLatitude(e.target.value);
                                                setErrors(prev => ({ ...prev, prodLatitude: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.prodLatitude ? 'AdminProdinput-error' : ''}`} />
                                        {errors.prodLatitude && <div className="AdminProderror-message ">Product Latitude is required</div>}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product Longitude</div>
                                        <input type='text' placeholder='Enter Product Name' value={prodLongitude}
                                            onChange={(e) => {
                                                setProdLongitude(e.target.value);
                                                setErrors(prev => ({ ...prev, prodLongitude: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.prodLongitude ? 'AdminProdinput-error' : ''}`} />
                                        {errors.prodLongitude && <div className="AdminProderror-message ">Product Longitude is required</div>}
                                    </div>
                                </div>
                                <div onClick={generateGoogleMapsLink} style={{ padding: '10px 15px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} > Generate Link </div>
                            </div>

                            {/* ADDED PRODUCTS IMAGES/VIDEOS WITH URL INPUT */}
                            <div className='manageClientSection'>
                                <div className='clientDetailHeading'>Added Products</div>

                                {/* URL Input Section */}
                                <div className='adminProductUrlInput' style={{ marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type='url'
                                            placeholder='Enter image or video URL'
                                            value={additionalFileUrl}
                                            onChange={(e) => setAdditionalFileUrl(e.target.value)}
                                            className='clientDetailsInput'
                                            style={{ flex: 1 }}
                                            disabled={uploading || additionalFiles.filter(f => !f.markedForDeletion).length >= 3}
                                        />
                                        <button
                                            type='button'
                                            className='calendarSaveBtn'
                                            onClick={handleAddFileFromUrl}
                                            disabled={uploading || !additionalFileUrl.trim() || additionalFiles.filter(f => !f.markedForDeletion).length >= 3}
                                            style={{ padding: '8px 15px', whiteSpace: 'nowrap' }}
                                        >
                                            Add URL
                                        </button>
                                    </div>
                                </div>

                                {/* File Upload Section */}
                                <div className='adminProductVideoRight'>
                                    <center>
                                        <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
                                    </center>
                                    <input
                                        type='file'
                                        accept='video/*,image/*'
                                        onChange={handleFileChangeAdded}
                                        multiple
                                        disabled={uploading || additionalFiles.filter(f => !f.markedForDeletion).length >= 3}
                                    />
                                    <p>
                                        {uploading ? 'Uploading...' :
                                            isSubmitted ? 'Files saved' :
                                                `${3 - additionalFiles.filter(f => !f.markedForDeletion).length} files remaining`}
                                    </p>

                                    {errors.additionalFiles && (
                                        <div className="AdminProderror-message">
                                            Maximum 3 files allowed
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Similar Products section */}
                            <div className='manageClientSection'>
                                <div className='clientDetailHeading'>Similar Products</div>
                                <div className='manageClientInformation'>
                                    <div className='manageClientInfoLeft' style={{ position: 'relative' }}>
                                        <input type='text' placeholder='Product Code' value={similarProdId}
                                            onChange={(e) => {
                                                setSimilarProdId(e.target.value);
                                                if (e.target.value.trim()) {
                                                    const normalizedInput = normalizeCode(e.target.value);
                                                    const selectedCodes = selectedSimilarProducts.map(p => normalizeCode(p.prodCode));

                                                    const matches = products.filter(product => {
                                                        const isMatch =
                                                            (normalizeCode(product.prodCode).includes(normalizedInput) ||
                                                                product.name.toLowerCase().includes(e.target.value.toLowerCase()
                                                                ));
                                                        const notSelected = !selectedCodes.includes(normalizeCode(product.prodCode));
                                                        return isMatch && notSelected;
                                                    }).slice(0, 5);
                                                    setSearchSuggestions(matches);
                                                } else {
                                                    setSearchSuggestions([]);
                                                }
                                            }}
                                            className='clientDetailsInput' />

                                        {/* Typeahead Suggestions */}
                                        {searchSuggestions.length > 0 && (
                                            <div className="suggestions-dropdown">
                                                {searchSuggestions.map((product) => (
                                                    <div
                                                        key={product.prodCode}
                                                        className="suggestion-item"
                                                        onClick={() => {
                                                            setSelectedSimilarProducts(prev => [...prev, product]);
                                                            setSimilarProdId('');
                                                            setSearchSuggestions([]);
                                                        }} >
                                                        <div className="suggestion-code">{product.prodCode}</div>
                                                        <div className="suggestion-name">{product.name}</div>
                                                        <div className="suggestion-image">
                                                            <img src={product.image} alt={product.name} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className='manageClientInfoRight'>
                                        <div className='manageProductSelectBtn' onClick={handleSelectProduct} >Select</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="calendarSaveBtn" type='submit' disabled={uploading}>
                    {uploading ? 'Processing...' : (editProduct ? 'Update' : 'Save')}
                </button>
            </form>
        </div>
    );
}
export default ClientSection;