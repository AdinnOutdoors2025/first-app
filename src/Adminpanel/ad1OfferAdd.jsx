import React, { useState, useContext, useEffect } from 'react';
import './ad1Manage.css';
import Calendar from './adNewCalender';
import { useSpot } from '../components/B0SpotContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from './BASE_URL';

function AddOfferProduct() {
    // Rating Components
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

    // State variables
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [products, setProducts] = useState([]);
    const [offerProducts, setOfferProducts] = useState([]);
    const [productImage, setProductImage] = useState("");
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
    const [prodRating, setProdRating] = useState(0);
    const [productOfferPrice, setProductOfferPrice] = useState('');
    const [prodwidth, setProdWidth] = useState('');
    const [prodheight, setProdHeight] = useState('');
    const [prodType, setProdType] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]);
    const [similarProdId, setSimilarProdId] = useState('');
    const [editOffProd, setEditOffProd] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { initialStateDistricts, initialMediaTypes, toggleStateDropdown, handleStateClick, handleDistrictClick, stateDistricts, setStateDistricts, mediaTypes, setMediaTypes, showDistricts, setShowDistricts, showStates, setShowStates } = useSpot();

    const { state } = useLocation();

    // Calculate square feet
    const ProdSquareFeet = () => {
        const width = parseFloat(prodwidth) || 0;
        const height = parseFloat(prodheight) || 0;
        return (width * height).toFixed(2);
    };

    // Handle rating change
    const handleRatingChange = (value) => {
        let newRating = parseFloat(value);
        if (newRating >= 0 && newRating <= 5) {
            setProdRating(newRating);
        }
    };

    // Fetch products and offer products
    useEffect(() => {
        fetchProducts();
        fetchOfferProducts();
    }, []);

    const fetchProducts = () => {
        fetch(`${baseUrl}/products`)
            .then((response) => response.json())
            .then((data) => {
                const productsWithVisibility = data.map((product) => ({
                    ...product,
                    visible: product.visible !== false,
                }));
                setProducts(productsWithVisibility.sort((a, b) => b.visible - a.visible));
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
            });
    };

    const fetchOfferProducts = () => {
        fetch(`${baseUrl}/OfferedProduct/offerProduct`)
            .then((response) => response.json())
            .then((data) => {
                setOfferProducts(data);
            })
            .catch(error => {
                console.error('Error fetching offer products:', error);
            });
    };

    // Fetch product by ID and auto-fill form
    const fetchProductById = (code) => {
        const cleanedInput = code.replace(/^#/, '').trim().toLowerCase();

        // Reset all fields first
        resetProductFields();

        const product = products.find(p => {
            const prodCode = p.prodCode || '';
            const cleanedProdCode = prodCode.replace(/^#/, '').trim().toLowerCase();
            return cleanedProdCode === cleanedInput;
        });

        if (product) {
            // Fill main product details
            setProductImage(product.image || "");
            setProductName(product.name || "");
            setProductAmount(product.price?.toString() || "");
            setProductPrintingCost(product.printingCost?.toString() || "");
            setProductMountingCost(product.mountingCost?.toString() || "");
            setProdLighting(product.lighting || "");
            setProductFrom(product.from || "");
            setProductTo(product.to || "");
            setProdRating(product.rating || 0);
            setProdWidth(product.width?.toString() || "");
            setProdHeight(product.height?.toString() || "");
            setProductFixedAmount(product.fixedAmount?.toString() || "");
            setProductFixedAmountOffer(product.fixedOffer?.toString() || "");
            setProdType(product.mediaType || "");
            setSelectedState(product.location?.state || "");
            setSelectedDistrict(product.location?.district || "");

            // Fill similar products
            if (product.similarProducts && product.similarProducts.length > 0) {
                const normalizedSimilarProducts = product.similarProducts.map(sp => ({
                    name: sp.Prodname || sp.name,
                    productCode: sp.ProdCode || sp.prodCode,
                    image: sp.image,
                    price: sp.ProdPrice || sp.price
                }));
                setSelectedSimilarProducts(normalizedSimilarProducts);
            }

            setShowError(false);
        } else {
            setErrorMessage('Product not found!');
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
        }
    };

    // Reset product fields
    const resetProductFields = () => {
        setProductImage("");
        setProductName("");
        setProductAmount("");
        setProductPrintingCost("");
        setProductMountingCost("");
        setProdLighting("");
        setProductFrom("");
        setProductTo("");
        setProdRating(0);
        setProdWidth("");
        setProdHeight("");
        setProductFixedAmount('');
        setProductFixedAmountOffer('');
        setProdType("");
        setSelectedState("");
        setSelectedDistrict("");
        setSelectedSimilarProducts([]);
    };

    // Handle product ID change with suggestions
    const handleProductIdChange = (e) => {
        const id = e.target.value;
        setProductId(id);

        // Show suggestions
        const matches = products.filter(p => {
            const code = (p.prodCode || '').toLowerCase();
            return code.includes(id.toLowerCase().replace(/^#/, ''));
        });
        setSearchSuggestions(matches);

        // Fetch product details if ID matches
        if (id.length > 2) {
            fetchProductById(id);
        }
    };

    // Similar products functionality
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

        if (selectedSimilarProducts.some(p => normalizeCode(p.productCode) === normalizeCode(productToAdd.prodCode))) {
            toast.warning("Product already added");
            return;
        }

        const similarProduct = {
            name: productToAdd.name,
            productCode: productToAdd.prodCode,
            image: productToAdd.image,
            price: productToAdd.price
        };

        setSelectedSimilarProducts(prev => [...prev, similarProduct]);
        setSimilarProdId('');
        setSearchSuggestions([]);
    };

    const handleRemoveProduct = (productCode) => {
        if (!window.confirm("Are you sure you want to remove this similar product?")) return;
        const targetCode = normalizeCode(productCode);
        setSelectedSimilarProducts(prev =>
            prev.filter(product => normalizeCode(product.productCode) !== targetCode)
        );
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!productID) newErrors.productID = "Product ID is required";
        if (!productOfferPrice || parseFloat(productOfferPrice) <= 0) {
            newErrors.productOfferPrice = "Valid offer price is required";
        }
        if (!productName) newErrors.productName = "Product name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save/Update offer product - CORRECTED VERSION
    const handleSaveOfferProduct = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        setIsSaving(true);
        setUploadProgress(0);

        try {
            setUploadProgress(30);

            const offerProductData = {
                originalProductId: productID,
                productCode: editOffProd ? editOffProd.productCode : `OFFER-${productID}`,
                name: productName,
                originalPrice: parseFloat(productAmount) || 0,
                offerPrice: parseFloat(productOfferPrice) || 0,
                image: productImage,
                printingCost: parseFloat(productPrintingCost) || 0,
                mountingCost: parseFloat(productMountingCost) || 0,
                lighting: prodLighting,
                fromLocation: productFrom,
                toLocation: productTo,
                rating: parseFloat(prodRating) || 0,
                size: {
                    width: parseFloat(prodwidth) || 0,
                    height: parseFloat(prodheight) || 0,
                    squareFeet: parseFloat(ProdSquareFeet()) || 0
                },
                fixedAmount: parseFloat(productFixedAmount) || 0,
                fixedOffer: parseFloat(productFixedAmountOffer) || 0,
                mediaType: prodType,
                location: {
                    state: selectedState,
                    district: selectedDistrict
                },
                similarProducts: selectedSimilarProducts,
                isActive: true,
                visible: true
            };

            setUploadProgress(60);

            // Determine API endpoint and method
            const method = editOffProd ? "PUT" : "POST";
            const url = editOffProd
                ? `${baseUrl}/OfferedProduct/offerProduct/${editOffProd._id}`
                : `${baseUrl}/OfferedProduct/offerProduct`;

            console.log('Sending offer product data:', offerProductData);

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offerProductData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${editOffProd ? 'update' : 'create'} offer product`);
            }

            const result = await response.json();
            console.log('Server response:', result);

            setUploadProgress(100);

            alert(`Offer product ${editOffProd ? 'updated' : 'created'} successfully!`);

            // Reset form and refresh data
            setTimeout(() => {
                if (editOffProd) {
                    setEditOffProd(null);
                    resetForm();
                    // Optionally navigate back or refresh
                    window.location.reload();
                } else {
                    resetForm();
                    fetchOfferProducts();
                }
                setIsSaving(false);
                setUploadProgress(0);
            }, 1000);

        } catch (error) {
            console.error("Save error:", error);
            toast.error(`Error: ${error.message}`);
            setIsSaving(false);
            setUploadProgress(0);
        }
    };

    // Delete offer product
    const handleDeleteOffer = async (offerId) => {
        if (!window.confirm("Are you sure you want to delete this offer?")) return;

        try {
            const response = await fetch(`${baseUrl}/OfferedProduct/offerProduct/${offerId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete offer');
            }

            toast.success("Offer deleted successfully!");
            fetchOfferProducts();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error deleting offer");
        }
    };

    // Edit offer product - CORRECTED VERSION
    useEffect(() => {
        if (state?.editOffProd) {
            const offer = state.editOffProd;
            console.log('Editing offer product:', offer);
            setEditOffProd(offer);
            setProductId(offer.originalProductId || "");
            setProductName(offer.name || "");
            setProductAmount(offer.originalPrice?.toString() || "");
            setProductOfferPrice(offer.offerPrice?.toString() || "");
            setProductImage(offer.image || "");
            setProductPrintingCost(offer.printingCost?.toString() || "");
            setProductMountingCost(offer.mountingCost?.toString() || "");
            setProdLighting(offer.lighting || "");
            setProductFrom(offer.fromLocation || "");
            setProductTo(offer.toLocation || "");
            setProdRating(offer.rating || 0);
            setProdWidth(offer.size?.width?.toString() || "");
            setProdHeight(offer.size?.height?.toString() || "");
            setProductFixedAmount(offer.fixedAmount?.toString() || "");
            setProductFixedAmountOffer(offer.fixedOffer?.toString() || "");
            setProdType(offer.mediaType || "");
            setSelectedState(offer.location?.state || "");
            setSelectedDistrict(offer.location?.district || "");
            setSelectedSimilarProducts(offer.similarProducts || []);

            // Scroll to top
            window.scrollTo(0, 0);
        }
    }, [state]);

    // Reset form
    const resetForm = () => {
        setEditOffProd(null);
        setProductId("");
        resetProductFields();
        setProductOfferPrice("");
    };

    return (
        <div>
            <form onSubmit={handleSaveOfferProduct}>
                <div className='adManageMain'>
                    {/* Left side section */}
                    <div className='adManageContentLeft'>
                        <div className='ManageLeftImg1'>
                            <img src={productImage} alt={productName} className='ManageLeftImg1' />
                        </div>

                        {/* Product details section */}
                        <div className='manageprodMain'>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Name</div>
                                <div className='ManageProdRightContent'>{productName}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Original Price</div>
                                <div className='ManageProdRightContent'>₹ {productAmount} Per Day</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Offer Price</div>
                                <div className='ManageProdRightContent'>₹ {productOfferPrice} Per Day</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Printing Cost</div>
                                <div className='ManageProdRightContent'>₹ {productPrintingCost}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Mounting Cost</div>
                                <div className='ManageProdRightContent'>₹ {productMountingCost}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Size</div>
                                <div className='ManageProdRightContent'>{prodwidth} X {prodheight} | {ProdSquareFeet()} Sq.ft</div>
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
                                <div className='ManageProdLeftHeading'>Fixed Amount</div>
                                <div className='ManageProdRightContent'>{productFixedAmount}</div>
                            </div>
                            <div className="ManageProdDetails">
                                <div className='ManageProdLeftHeading'>Fixed Offer</div>
                                <div className='ManageProdRightContent'>{productFixedAmountOffer}%</div>
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

                        {/* Selected Category section */}
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

                        {/* Similar Products Section */}
                        <div className='manageprodMain'>
                            <div className='manageprodSideHeading'>Selected Similar products</div>
                            {selectedSimilarProducts.length > 0 ? (
                                selectedSimilarProducts.map((product, index) => (
                                    <div className='manageSimilarprod' key={index}>
                                        <div className='manageSimilarImg'>
                                            <img src={product.image} alt={product.name} className='manageSimilarImg' />
                                        </div>
                                        <div>
                                            <div className='ManageProdRightContent1'>{product.name}</div>
                                            <div className='manageSimilarProdCode'>{product.productCode}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='smilarProdError'>No Similar Products Selected</p>
                            )}
                        </div>
                    </div>

                    {/* Right section */}
                    <div className='adManageContentRight'>
                        {/* Deal of the Day Section */}
                        <div className='manageClientSection'>
                            <div className='manageRightSideHeading'>
                                {editOffProd ? 'Edit Offer Product' : 'Deal Of The Day'}
                            </div>
                            <div className='d-flex manageClientInformation'>
                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product Code</div>
                                        <input
                                            type='text'
                                            placeholder='Enter Product ID'
                                            value={productID}
                                            onChange={handleProductIdChange}
                                            className={errors.productID ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}
                                        // disabled={editOffProd} // Disable when editing
                                        />
                                        {errors.productID && <div className="AdminClienterror-message">Product ID is required</div>}
                                        {showError && <div className="error-message">{errorMessage}</div>}

                                        {searchSuggestions.length > 0 && !editOffProd && (
                                            <div className="suggestions-dropdown">
                                                {searchSuggestions.map((product) => (
                                                    <div
                                                        key={product.prodCode}
                                                        onClick={() => {
                                                            setProductId(product.prodCode);
                                                            fetchProductById(product.prodCode);
                                                            setSearchSuggestions([]);
                                                        }}
                                                        className="suggestion-item"
                                                    >
                                                        {product.prodCode} - {product.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Offer Price</div>
                                        <input
                                            type='number'
                                            placeholder='Enter Offer Price'
                                            value={productOfferPrice}
                                            onChange={(e) => {
                                                setProductOfferPrice(e.target.value);
                                                setErrors(prev => ({ ...prev, productOfferPrice: false }));
                                            }}
                                            className={errors.productOfferPrice ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}
                                        />
                                        {errors.productOfferPrice && <div className="AdminClienterror-message">Valid offer price is required</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Management Section */}
                        <div className='manageClientSection'>
                            <div className='manageRightSideHeading'>Product Management</div>
                            <div className='d-flex manageClientInformation'>
                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product Name</div>
                                        <input
                                            type='text'
                                            placeholder='Product Name'
                                            value={productName}
                                            readOnly
                                            className={errors.productName ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}
                                        />
                                        {errors.productName && <div className="AdminClienterror-message">Product name is required</div>}
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Original Price</div>
                                        <input
                                            type='number'
                                            placeholder='Original Price'
                                            value={productAmount}
                                            readOnly
                                            className='clientDetailsInput'
                                        />
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Lighting Type</div>
                                        <input
                                            type='text'
                                            placeholder='Lighting Type'
                                            value={prodLighting}
                                            readOnly
                                            className='clientDetailsInput'
                                        />
                                    </div>
                                </div>
                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product ID</div>
                                        <input
                                            type='text'
                                            placeholder='Product ID'
                                            value={productID}
                                            readOnly
                                            className='clientDetailsInput'
                                        />
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Size</div>
                                        <div className='sizeWidthValues'>
                                            W: <input type='number' value={prodwidth} readOnly className='sizeWidthInput' />
                                            <span className='sizeMultiply'> X </span>
                                            H: <input type='number' value={prodheight} readOnly className='sizeWidthInput' />
                                            <span className='sizeWidthSlash'> | </span>
                                            <label>{ProdSquareFeet()} Sq.ft</label>
                                        </div>
                                    </div>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Location</div>
                                        <label className='locationFromLabel'>From</label>
                                        <input
                                            type='text'
                                            placeholder='From'
                                            value={productFrom}
                                            readOnly
                                            className='clientDetailsInput locationInput'
                                        /><br></br>
                                        <label className='locationFromLabel'>To</label>
                                        <input
                                            type='text'
                                            placeholder='To'
                                            value={productTo}
                                            readOnly
                                            className='clientDetailsInput locationInput'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating and Offers Section */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className='manageClientSection' style={{ width: '40%' }}>
                                <div className='clientDetailHeading'>Ratings</div>
                                <div className='ProductRatingMain'>
                                    <div className='Product-star-main'>
                                        <RatingStars1 rating={parseFloat(prodRating) || 0} />
                                    </div>
                                    <div>
                                        <input
                                            type='text'
                                            className='clientDetailsInput ratingInput'
                                            value={prodRating}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='manageClientSection' style={{ width: '60%' }}>
                                <div className='clientDetailHeading'>Offers</div>
                                <div className='ProductRatingMain'>
                                    <div className='AdminOfferDetails'>
                                        Pay ₹
                                        <input
                                            type='number'
                                            value={productFixedAmount}
                                            readOnly
                                            className='sizeWidthInput adminOfferAmountInput'
                                        />
                                        and Get
                                        <input
                                            type='number'
                                            value={productFixedAmountOffer}
                                            readOnly
                                            className='sizeWidthInput adminOfferAmountPercentage'
                                        />
                                        % Off
                                        <span className='adminOfferRefundDetails'>100% Refundable</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Select Category Section */}
                        <div className='manageClientSection'>
                            <div className='clientDetailHeading'>Select Category</div>
                            <div className='d-flex manageClientInformation'>
                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailHeading'>Location</div>
                                    <input
                                        type="text"
                                        className="clientDetailsInput locationSelectInput"
                                        value={selectedState && selectedDistrict ? `${selectedState}, ${selectedDistrict}` : ""}
                                        placeholder="Select Location"
                                        readOnly
                                    />
                                </div>
                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailHeading'>Media Type</div>
                                    <input
                                        type='text'
                                        className='clientDetailsInput'
                                        value={prodType}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {/* {uploadProgress > 0 && (
                    <div className="upload-progress" style={{ margin: '20px 0' }}>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <div className="progress-text">{uploadProgress}%</div>
                    </div>
                )} */}

                {/* Action Buttons */}
                <div className='action-buttons' style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                        className="calendarSaveBtn"
                        type='submit'
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <span>
                                <i className="fa fa-spinner fa-spin"></i>
                                {editOffProd ? " Updating..." : " Saving..."}
                            </span>
                        ) : (
                            editOffProd ? "Update" : "Save"
                        )}
                    </button>

                    {/* {editOffProd && (
                        <button 
                            type='button' 
                            onClick={resetForm}
                            className="calendarCancelBtn"
                            disabled={isSaving}
                        >
                            Cancel Edit
                        </button>
                    )} */}
                </div>
            </form>
        </div>
    );
}

export default AddOfferProduct;
