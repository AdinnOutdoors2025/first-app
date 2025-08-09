import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ad1Manage.css';
import './ad1File.css';
import { useSpot } from '../components/B0SpotContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { baseUrl } from './BASE_URL';
function ClientSection() {
    const { state } = useLocation();
    const { id } = useParams();
    //Start rating board
    // Function to render star ratings
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
    // PRODUCT RATING SECTION
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
                <div>

                </div>
            </div>
        );
    };
    //HANDLING ERRORS
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
        image: false,
        selectedState: false,
        selectedDistrict: false,
        similarProducts: false,
        prodLatitude: false,
        prodLongitude: false,
        prodLocationLink: false,
    });

    const validateForm = () => {
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
            image: !image || image === " ",
            selectedState: !selectedState,
            selectedDistrict: !selectedDistrict,
            similarProducts: false,
            prodLatitude: !prodLatitude,
            prodLongitude: !prodLongitude,
            prodLocationLink: !prodLocationLink,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    // SIMILAR PRODUCTS
    const [products, setProducts] = useState([]);
    //Fetch/get  products from data
    useEffect(() => {
        fetch(`${baseUrl}/products`)
            .then((response) => response.json())
            .then((data) => {
                const productsWithVisibility = data.map((product) => ({
                    ...product,
                    visible: product.visible !== false, // fallback to true
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
    const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]); // Store selected products
    const normalizeCode = (code) => (code || '').replace(/^#/, '').trim().toLowerCase();
    const handleSelectProduct = () => {
        const enteredId = similarProdId.trim();
        if (!enteredId) return;
        // Find matches using fuzzy search
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
        // Normalize code for comparison
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
    // Optional: Add typeahead search
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    // Rating section
    const [prodRating, setProdRating] = useState(4.5);
    // LATITUDE AND LOGITUDE
    const [prodLatitude, setProdLatitude] = useState('');
    const [prodLongitude, setProdLongitude] = useState('');
    const [prodLocationLink, setProdLocationLink] = useState('');
    const generateGoogleMapsLink = () => {
        // Convert decimal degrees to degrees, minutes, seconds format
        const latDegrees = Math.floor(Math.abs(prodLatitude));
        const latMinutes = Math.floor((Math.abs(prodLatitude) - latDegrees) * 60);
        const latSeconds = ((Math.abs(prodLatitude) - latDegrees - latMinutes / 60) * 3600).toFixed(1);
        const latDirection = prodLatitude >= 0 ? 'N' : 'S';

        const lonDegrees = Math.floor(Math.abs(prodLongitude));
        const lonMinutes = Math.floor((Math.abs(prodLongitude) - lonDegrees) * 60);
        const lonSeconds = ((Math.abs(prodLongitude) - lonDegrees - lonMinutes / 60) * 3600).toFixed(1);
        const lonDirection = prodLongitude >= 0 ? 'E' : 'W';

        // Construct the DMS (Degrees, Minutes, Seconds) string
        const dmsString = `${latDegrees}°${latMinutes.toString().padStart(2, '0')}'${latSeconds}"${latDirection}+${lonDegrees}°${lonMinutes.toString().padStart(2, '0')}'${lonSeconds}"${lonDirection}`;

        // Create the Google Maps link
        const link = `https://www.google.com/maps/place/${dmsString}/@${prodLatitude},${prodLongitude},17z/data=!3m1!4b1!4m4!3m3!8m2!3d${prodLatitude}!4d${prodLongitude}?entry=ttu&g_ep=EgoyMDI1MDgwNC4wIKXMDSoASAFQAw%3D%3D`;
        setProdLocationLink(link);
    };
    const handleRatingChange = (value) => {
        // Convert the value to a valid number, ensuring it remains within 0-5 range
        let newRating = parseFloat(value);
        if (newRating >= 0 && newRating <= 5) {
            setProdRating(newRating);
        }
    };
    // Product Size calculation
    const [prodwidth, setProdWidth] = useState('');
    const [prodheight, setProdHeight] = useState('');
    const ProdSquareFeet = () => {
        const squareFeet = prodwidth * prodheight;
        return squareFeet;
    };
    const [prodType, setProdType] = useState("");
    // // State District selection
    const { initialStateDistricts, initialMediaTypes, toggleStateDropdown, handleStateClick, handleDistrictClick, mediaTypes, setMediaTypes, selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, showDistricts, setShowDistricts, showStates, setShowStates } = useSpot();

    const [image, setImage] = useState(" "); // Store uploaded image
    // const handleImageUpload = async (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const formData = new FormData();
    //         formData.append("image", file);
    //         try {
    //             const res = await fetch(`${baseUrl}/upload`, {
    //                 method: "POST",
    //                 body: formData,
    //             });
    //             const data = await res.json();
    //             setImage(`${baseUrl}${data.imageUrl}`); // Use full URL to backend
    //         } catch (error) {
    //             console.error("Upload failed:", error);
    //         }
    //     }
    // };

    const handleImageUpload = async (event) => {
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append("file", file);
        const res = await fetch(`${baseUrl}/upload`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        console.log("Image Uploaded:", data.imageUrl);
        setImage(data.imageUrl);
    } 
    console.log(setImage);
    // This will log the image URL whenever it changes
    useEffect(() => {
        if (image) {
            console.log("Current image URL:", image);
        }
    }, [image]);

    const [productsData, setProductsData] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    // 👇 Prefill form if state has editProduct
    useEffect(() => {
        if (state?.editProduct) {
            const prod = state.editProduct;
            setEditProduct(prod);
            //image
            setImage(prod.image || " ");
            setProductName(prod.name || '');
            setProductAmount(prod.price || '');
            setProductFixedAmount(prod.fixedAmount || '999');
            setProductFixedAmountOffer(prod.fixedOffer || '5');
            setProductPrintingCost(prod.printingCost || '');
            setProductMountingCost(prod.mountingCost || '');
            setProductId(prod.prodCode || '');
            setProdLighting(prod.lighting || '');
            setProductFrom(prod.from || '');
            setProductTo(prod.to || '');
            setProdRating(prod.rating || 0);
            setProdWidth(prod.width || '');
            setProdHeight(prod.height || '');
            setProdType(prod.mediaType || '');
            setSelectedState(prod.location?.state || '');
            setSelectedDistrict(prod.location?.district || '');
            setImage(prod.image || '');
            setSelectedSimilarProducts(normalizeSimilarProducts(prod.similarProducts || []));
            setProdLatitude(prod.Latitude || '');
            setProdLongitude(prod.Longitude || '');
            setProdLocationLink(prod.LocationLink || '');
        }
    }, [state]);


    const fetchProduct = async () => {
        const response = await fetch(`${baseUrl}/products`);
        const data = await response.json();
        setProductsData(data);
        console.log(data);
    }
    useEffect(
        () => {
            fetchProduct();
        },
        []
    );


    const handleSaveProduct = async (e) => {
        e.preventDefault();
        // Validate form first
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly");
            return;
        }
        console.log("Save product");
        // Optional warning (but still allows submission)
        if (selectedSimilarProducts.length === 0) {
            if (!window.confirm("You haven't added any similar products. Continue anyway?")) {
                return;
            }
        }
        // Save product to database
        const method = editProduct ? 'PUT' : 'POST';
        const url = editProduct ? `${baseUrl}/products/${editProduct._id}` :
            `${baseUrl}/products`;
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: productName,
                    description: "Sample", // Update if you use
                    price: productAmount,
                    printingCost: productPrintingCost,
                    mountingCost: productMountingCost,
                    image,
                    prodCode: productID,
                    lighting: prodLighting,
                    from: productFrom,
                    to: productTo,
                    rating: prodRating,
                    width: prodwidth,
                    height: prodheight,
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
            console.log(result);
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
                // Force reload or update parent state if needed
                window.location.reload();
            }
            setProductName('');
            setImage('');
            setProductAmount('');
            setProductFixedAmount('999');
            setProductFixedAmountOffer('5');
            setProductMountingCost('');
            setProductPrintingCost('');
            setProductId('');
            setProdLighting('Lightning');
            setProductFrom('');
            setProductTo('');
            setProdRating(0);
            setProdWidth('');
            setProdHeight('');
            setProdType('');
            setSelectedSimilarProducts([]);
            setProdLatitude('');
            setProdLongitude('');
            setProdLocationLink('');
            setEditProduct(null);
        }
        catch (error) {
            console.error(error);
            alert("An error occurred while saving the product.");
        }
    };


    //FETCH STATE AND DISTRICTS IN CATEGORY SECTION
    const [stateDistricts, setStateDistricts] = useState({});
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const res = await fetch(`${baseUrl}/category`);
                const data = await res.json();
                // Convert to { "Tamil Nadu": ["Chennai", "Coimbatore"], ... }
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

    //FETCH MEDIA TYPES FROM THE DATABASE
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


    return (
        <div>
            <form onSubmit={handleSaveProduct}>
                <div className='adManageMain'>
                    {/* Left side section  */}
                    <div className='adManageContentLeft'>
                        <div className='ManageLeftImg1'><img src={image} className='ManageLeftImg1' alt="Product_Image"></img></div>
                        {/* Product details section  */}
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
                            {/* PRODUCT LOCATION LINK  */}
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
                        {/* Select Category  section  */}
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


                        {/* Similar Product Section  */}
                        <div className='manageprodMain'>
                            <div className='manageprodSideHeading'>Selected Similar products</div>
                            {selectedSimilarProducts.length > 0 ? (
                                selectedSimilarProducts.map((product, index) => (
                                    <div className='manageSimilarprod' key={index}>
                                        <div className='manageSimilarImg'>
                                            <img src={product.image} className='manageSimilarImg'></img>
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
                    {/* Right section  */}
                    <div>
                        {/* Client Section  */}
                        <div className='manageClientSection'>
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


                        {/* Product Section  */}
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
                                            className={`clientDetailsInput ${errors.productName ? 'AdminProdinput-error' : ''}`}>
                                        </input>
                                        {errors.productName && <div className="AdminProderror-message ">Product name is required</div>}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Price</div>
                                        <input type='number' placeholder='Enter Price' value={productAmount}
                                            onChange={(e) => {
                                                setProductAmount(e.target.value);
                                                setErrors(prev => ({ ...prev, productAmount: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.productAmount ? 'AdminProdinput-error' : ''}`}></input>
                                        {errors.productAmount && <div className="AdminProderror-message ">Product Amount is required</div>}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Lighting Type</div>
                                        <select className={`clientDetailsInput ${errors.prodLighting ? 'AdminProdinput-error' : ''}`} value={prodLighting}
                                            onChange={(e) => {
                                                setProdLighting(e.target.value);
                                                setErrors(prev => ({ ...prev, prodLighting: false }));
                                            }}>
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
                                            className={`clientDetailsInput ${errors.productPrintingCost ? 'AdminProdinput-error' : ''}`}></input>
                                        {errors.productPrintingCost && <div className="AdminProderror-message ">Printing Cost is required</div>}
                                    </div>
                                </div>
                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product ID</div>
                                        <input type='text' placeholder='Enter Product ID' value={productID}
                                            onChange={(e) => {
                                                setProductId(e.target.value);
                                                setErrors(prev => ({ ...prev, productID: false }));
                                            }} className={`clientDetailsInput ${errors.productID ? 'AdminProdinput-error' : ''}`}></input>
                                        {errors.productID && <div className="AdminProderror-message ">Product ID is required</div>}


                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Size</div>
                                        <div className='sizeWidthValues'>
                                            W : <input type='number' value={prodwidth}
                                                onChange={(e) => {
                                                    setProdWidth(e.target.value);
                                                    setErrors(prev => ({ ...prev, prodwidth: false }));
                                                }} className={`sizeWidthInput ${errors.prodwidth ? 'AdminProdinput-error' : ''}`}  ></input><span className='sizeMultiply'> X </span>H : <input type='number' value={prodheight}
                                                    onChange={(e) => {
                                                        setProdHeight(e.target.value);
                                                        setErrors(prev => ({ ...prev, prodheight: false }));
                                                    }} className={`sizeWidthInput ${errors.prodheight ? 'AdminProdinput-error' : ''}`}></input> <span className='sizeWidthSlash'> | </span> <lable> {ProdSquareFeet()} </lable>Sq.ft
                                            {errors.prodwidth && errors.prodheight && <div className="AdminProderror-message ">Product Height & Width is required</div>}
                                        </div>
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Location</div>
                                        <label className='locationFromLabel'>From <label style={{ float: 'right' }}>-</label></label>
                                        <input type='text' placeholder='Enter From' value={productFrom}
                                            onChange={(e) => {
                                                setProductFrom(e.target.value);
                                                setErrors(prev => ({ ...prev, productFrom: false }));
                                            }} className={`clientDetailsInput locationInput ${errors.productFrom ? 'AdminProdinput-error' : ''}`}></input>
                                        {errors.productFrom && <div className="AdminProderror-message ">Product From is required</div>}


                                        <br></br>
                                        <label className='locationFromLabel'>To<label style={{ float: 'right' }}>-</label></label>
                                        <input type='text' placeholder='Enter To' value={productTo}
                                            onChange={(e) => {
                                                setProductTo(e.target.value);
                                                setErrors(prev => ({ ...prev, productTo: false }));
                                            }} className={`clientDetailsInput locationInput ${errors.productTo ? 'AdminProdinput-error' : ''}`}></input>
                                        {errors.productTo && <div className="AdminProderror-message ">Product To is required</div>}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Mounting Cost</div>
                                        <input type='number' placeholder='Enter Price' value={productMountingCost}
                                            onChange={(e) => {
                                                setProductMountingCost(e.target.value);
                                                setErrors(prev => ({ ...prev, productMountingCost: false }));
                                            }}
                                            className={`clientDetailsInput ${errors.productMountingCost ? 'AdminProdinput-error' : ''}`}></input>
                                        {errors.productMountingCost && <div className="AdminProderror-message ">Mouting Cost is required</div>}


                                    </div>
                                </div>


                            </div>


                        </div>

                        {/* Rating section  with OFFER */}
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
                                    <div className='AdminOfferDetails' >Pay ₹<input type='number' value={productFixedAmount} onChange={(e) => setProductFixedAmount(e.target.value)} className='sizeWidthInput adminOfferAmountInput' readOnly></input> and Get <input type='number' value={productFixedAmountOffer} onChange={(e) => setProductFixedAmountOffer(e.target.value)} className='sizeWidthInput adminOfferAmountPercentage' readOnly></input>% Off <span className='adminOfferRefundDetails'> 100% Refundable </span>
                                    </div>


                                </div>
                            </div>
                        </div>
                        {/* Select Category section   */}
                        <div className='manageClientSection'>
                            <div className='clientDetailHeading'>Select Category</div>
                            <div className='d-flex manageClientInformation'>
                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailHeading'>Location</div>
                                    <div className="location-container11">
                                        {/* Input field to display selected state & district */}
                                        <div className="input-wrapper" onClick={toggleStateDropdown}>
                                            <input
                                                type="text"
                                                className="clientDetailsInput locationSelectInput"
                                                value={selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : ""}
                                                placeholder="Select Location"
                                                readOnly />
                                            {/* Chevron Icon for dropdown */}
                                            <i className={`fa-solid ${showStates ? "fa-chevron-up" : "fa-chevron-down"} dropdown-arrow11`} style={{ fontSize: '10px' }}></i>
                                        </div>
                                        <div className="dropdown-container11">
                                            {/* State Dropdown */}
                                            {showStates && (
                                                <div className="dropdown11">
                                                    <ul className="dropdown-list11">
                                                        {Object.keys(stateDistricts).map((state) => (
                                                            <li
                                                                key={state}
                                                                onClick={() => handleStateClick(state)}
                                                                className={selectedState === state ? "selected" : ""}>
                                                                {state}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {/* District Dropdown (Only visible if a state is selected) */}
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
                                        className={`clientDetailsInput ${errors.prodLatitude ? 'AdminProdinput-error' : ''}`}>
                                    </input>
                                    {errors.prodLatitude && <div className="AdminProderror-message ">Product Latitude is required</div>}
                                </div>
                                <div className='clientDetailSection'>
                                    <div className='clientDetailHeading'>Product Longitude</div>
                                    <input type='text' placeholder='Enter Product Name' value={prodLongitude}
                                        onChange={(e) => {
                                            setProdLongitude(e.target.value);
                                            setErrors(prev => ({ ...prev, prodLongitude: false }));
                                        }}
                                        className={`clientDetailsInput ${errors.prodLongitude ? 'AdminProdinput-error' : ''}`}>
                                    </input>
                                    {errors.prodLongitude && <div className="AdminProderror-message ">Product Longitude is required</div>}
                                </div>
                            </div>
                            <div onClick={generateGoogleMapsLink} style={{ padding: '10px 15px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} > Generate Link </div>
                        </div>
                        {/* Similar Products section  */}
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
                                        }} className='clientDetailsInput'></input>

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
                {/* <Calendar/>  */}
                <button className="calendarSaveBtn" type='submit'>  {editProduct ? 'Update' : 'Save'}</button>
            </form>
        </div>
    )
}
export default ClientSection;