import React, { useState, useContext, useEffect } from 'react';
import './ad1Manage.css';
import { useSpot } from '../components/B0SpotContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from './BASE_URL';

function AddPrimeSpots() {
    // Rating Components (keep your existing rating components)
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
    const [isPrimeStatus, setIsPrimeStatus] = useState(1); // Default to Prime (1)
    const [editingProductId, setEditingProductId] = useState(null);
    const [originalProductId, setOriginalProductId] = useState(null);
    const [currentProductIsPrime, setCurrentProductIsPrime] = useState(0);
    const [primeUpdatedAt, setPrimeUpdatedAt] = useState(null);
    
    const { state } = useLocation();

    // Calculate square feet
    const ProdSquareFeet = () => {
        const width = parseFloat(prodwidth) || 0;
        const height = parseFloat(prodheight) || 0;
        return (width * height).toFixed(2);
    };

    // Fetch products
    useEffect(() => {
        fetchProducts();
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

    // Check if product is already prime
    const checkIfProductIsPrime = async (productId, prodCode) => {
        try {
            const response = await fetch(`${baseUrl}/products/check-prime/${prodCode}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    return {
                        isPrime: data.isPrime,
                        productId: data.productId,
                        name: data.name
                    };
                }
            }
            return null;
        } catch (error) {
            console.error('Error checking prime status:', error);
            return null;
        }
    };

    // Fetch product by ID and auto-fill form
    const fetchProductById = async (code) => {
        const cleanedInput = code.replace(/^#/, '').trim().toLowerCase(); 
        // Reset all fields first
        resetProductFields();
        setEditingProductId(null);
        setCurrentProductIsPrime(0);

        const product = products.find(p => {
            const prodCode = p.prodCode || '';
            const cleanedProdCode = prodCode.replace(/^#/, '').trim().toLowerCase();
            return cleanedProdCode === cleanedInput;
        });

        if (product) {
            // Check if product is already prime
            const primeCheck = await checkIfProductIsPrime(product._id, product.prodCode);
            
            if (primeCheck && primeCheck.isPrime === 1) {
                // Product is already prime
                toast.warning(`"${primeCheck.name}" is already a Prime Spot! Loading for editing...`);
                setIsPrimeStatus(1);
                setCurrentProductIsPrime(1);
            } else {
                // Product is not prime
                setIsPrimeStatus(1); // Default to Prime when adding new
                setCurrentProductIsPrime(0);
            }
            
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
            
            // Store product IDs
            setEditingProductId(product._id);
            setOriginalProductId(product.prodCode);
            
            // Set prime updated timestamp if exists
            if (product.primeUpdatedAt) {
                setPrimeUpdatedAt(new Date(product.primeUpdatedAt).toLocaleString());
            }
            
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
            setEditingProductId(null);
            setCurrentProductIsPrime(0);
        }
    };

    // Load product for editing
    useEffect(() => {
        if (state?.editProduct) {
            const product = state.editProduct;
            console.log('Editing product:', product);
            
            // Fill form with product data
            setProductId(product.prodCode || "");
            setProductName(product.name || "");
            setProductAmount(product.price?.toString() || "");
            setProductImage(product.image || "");
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
            setSelectedSimilarProducts(product.similarProducts || []);
            
            // Set prime status
            const primeStatus = product.isPrime || 0;
            setIsPrimeStatus(primeStatus);
            setCurrentProductIsPrime(primeStatus);
            
            // Store the product ID for editing
            setEditingProductId(product._id);
            setOriginalProductId(product.prodCode);
            
            // Set prime updated timestamp if exists
            if (product.primeUpdatedAt) {
                setPrimeUpdatedAt(new Date(product.primeUpdatedAt).toLocaleString());
            }
            
            window.scrollTo(0, 0);
        }
    }, [state]);

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
        setEditingProductId(null);
        setOriginalProductId(null);
        setCurrentProductIsPrime(0);
        setPrimeUpdatedAt(null);
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

    // Toggle Prime Status
    const togglePrimeStatus = () => {
        setIsPrimeStatus(prev => prev === 1 ? 0 : 1);
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        
        if (!productID) newErrors.productID = "Product ID is required";
        if (!productName) newErrors.productName = "Product name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save/Update prime status in main products collection
    const handleSavePrimeSpots = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        if (!editingProductId) {
            toast.error("Please select a valid product first");
            return;
        }

        // Check if trying to set as prime when already prime
        if (isPrimeStatus === 1 && currentProductIsPrime === 1) {
            const confirm = window.confirm("This product is already a Prime Spot. Do you want to update it anyway?");
            if (!confirm) return;
        }

        setIsSaving(true);

        try {
            // Update the isPrime field in the main products collection
            const updateData = {
                isPrime: isPrimeStatus
            };

            console.log('Updating product prime status:', {
                productId: editingProductId,
                isPrime: isPrimeStatus,
                currentIsPrime: currentProductIsPrime
            });

            const response = await fetch(`${baseUrl}/products/${editingProductId}/mark-prime`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update prime status');
            }

            console.log('Server response:', result);

            const primeStatusText = isPrimeStatus === 1 ? 'Prime Spot' : 'Regular Spot';
            const actionText = currentProductIsPrime === isPrimeStatus ? 'updated' : 
                             (isPrimeStatus === 1 ? 'added as' : 'removed from');
            
            toast.success(`Product ${actionText} ${primeStatusText} successfully!`);
            
            // Reset form and refresh data
            setTimeout(() => {
                resetForm();
                fetchProducts();
                setIsSaving(false);
                
                // Navigate back to prime spots table
                navigate('/admin#PrimeSpots');
            }, 1000);
            
        } catch (error) {
            console.error("Save error:", error);
            toast.error(`Error: ${error.message}`);
            setIsSaving(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setEditingProductId(null);
        setOriginalProductId(null);
        setProductId("");
        resetProductFields();
        setIsPrimeStatus(1);
        setCurrentProductIsPrime(0);
    };

    return (
        <div>
            <form onSubmit={handleSavePrimeSpots}>
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
                                <div className='ManageProdLeftHeading'>Price</div>
                                <div className='ManageProdRightContent'>₹ {productAmount} Per Day</div>
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
                                <div className='ManageProdRightContent'>₹ {productFixedAmount}</div>
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
                            {/* Prime Status Display */}
                            {currentProductIsPrime === 1 && (
                                <div className="ManageProdDetails">
                                    <div className='ManageProdLeftHeading' style={{color: '#ffc107'}}>Prime Status</div>
                                    <div className='ManageProdRightContent' style={{color: '#28a745', fontWeight: 'bold'}}>
                                        <i className="fa-solid fa-crown" style={{marginRight: '5px'}}></i>
                                        Currently Prime Spot
                                    </div>
                                </div>
                            )}
                            {primeUpdatedAt && (
                                <div className="ManageProdDetails">
                                    <div className='ManageProdLeftHeading'>Last Updated</div>
                                    <div className='ManageProdRightContent'>{primeUpdatedAt}</div>
                                </div>
                            )}
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
                        {/* Prime Advertising Spots Section */}
                        <div className='manageClientSection'>
                            <div className='manageRightSideHeading'>
                                {state?.editProduct ? 'Edit Prime Status' : 
                                 currentProductIsPrime === 1 ? 'Update Prime Spot' : 'Add Prime Spot'}
                            </div>
                            <div className='d-flex manageClientInformation'>
                                <div className='manageClientInfoLeft'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Product Code</div>
                                        <input 
                                            type='text' 
                                            placeholder='Enter Product ID (e.g., ADINMDU135)' 
                                            value={productID}
                                            onChange={handleProductIdChange}
                                            className={errors.productID ? "clientDetailsInput AdminProdinput-error" : "clientDetailsInput"}
                                            disabled={state?.editProduct} // Disable when editing
                                        />
                                        {errors.productID && <div className="AdminClienterror-message">Product ID is required</div>}
                                        {showError && <div className="error-message">{errorMessage}</div>}

                                        {searchSuggestions.length > 0 && !state?.editProduct && (
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
                                                        {product.isPrime === 1 && (
                                                            <span style={{color: '#ffc107', marginLeft: '10px'}}>
                                                                <i className="fa-solid fa-crown"></i> Prime
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='manageClientInfoRight'>
                                    <div className='clientDetailSection'>
                                        <div className='clientDetailHeading'>Prime Status</div>
                                        <div className="prime-toggle-container">
                                            <button
                                                type="button"
                                                className={`prime-toggle-btn-lg ${isPrimeStatus === 1 ? 'active-prime-lg' : 'inactive-prime-lg'}`}
                                                onClick={togglePrimeStatus}
                                            >
                                                <i className={`fa-solid ${isPrimeStatus === 1 ? 'fa-crown' : 'fa-star'}`}></i>
                                                {isPrimeStatus === 1 ? 'Prime Spot (1)' : 'Regular Spot (0)'}
                                            </button>
                                        </div>
                                        {currentProductIsPrime === 1 && isPrimeStatus === 1 && (
                                            <div className="prime-status-warning">
                                                <i className="fa-solid fa-exclamation-triangle"></i> This product is already Prime
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className=''>
                                <div className='d-flex manageClientInformation' style={{ justifyContent: 'space-between', marginTop: '20px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            className="confirmPrimeBtn" 
                                            type='submit' 
                                            disabled={isSaving || !editingProductId}
                                        >
                                            {isSaving ? (
                                                <span>
                                                    <i className="fa fa-spinner fa-spin"></i>
                                                    {currentProductIsPrime === 1 ? ' Updating...' : ' Saving...'}
                                                </span>
                                            ) : (
                                                currentProductIsPrime === 1 ? 'Update Prime Status' : 'Set as Prime Spot'
                                            )}
                                        </button>
                                        
                                        {(state?.editProduct || editingProductId) && (
                                            <button 
                                                type="button" 
                                                className="cancelPrimeBtn"
                                                onClick={() => {
                                                    resetForm();
                                                    navigate('/admin#PrimeSpots');
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                    
                                    {currentProductIsPrime === 1 && (
                                        <button 
                                            type="button" 
                                            className="removePrimeBtn"
                                            onClick={() => {
                                                // Remove prime status (set to 0)
                                                setIsPrimeStatus(0);
                                                toast.info("Prime status will be removed. Click 'Update Prime Status' to save.");
                                            }}
                                        >
                                            <i className="fa-solid fa-star"></i> Remove Prime
                                        </button>
                                    )}
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
            </form>
        </div>
    );
}

export default AddPrimeSpots;