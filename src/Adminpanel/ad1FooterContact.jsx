

// src/components/ProductTable.js
import React, { useState, useEffect } from 'react';
import './ad1Orders.css';
import { useNavigate } from 'react-router-dom';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import {baseUrl} from './BASE_URL';



const EnquireUsersTable = () => {
    //FETCHED PRODUCTS ORDER PAGE
    const [footerContact, setFooterContact] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // In your fetchOrders function, normalize the data
    const fetchFooterContacts = async () => {
        try {
            const response = await fetch(`${baseUrl}/ContactInfo/footerContactInfo`);
            if (!response.ok) {
                throw new Error('Failed to fetch enquiries');
            }
            const data = await response.json();
            // Add safe product fallback
            // const normalizedData = data.map(enquiry => ({
            //     ...enquiry,
            //     createdAt: enquiry.createdAt || new Date().toISOString(),
            //     contactInfo : enquiry.contactInfo
            //     //  createdAt: enquiry.createdAt || new Date().toISOString(),
            //     // productId: enquiry.productId || 'No Product',
            //     // prodCode: enquiry.prodCode || "--",
            //     // phone: enquiry.phone,
            //     // status: 'Enquiry',
            //     // prodName: enquiry.prodName || "--",
            //     // location: enquiry.location || "--"
            //     // // products: enquiry.products || [], // Ensure product exists
            //     // // booking:enquiry.products?.[0]?.booking || {}  // Ensure booking exists
            // }));
            setFooterContact(data);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchFooterContacts();
    }, []);
    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const enquiriesPerPage = 10;

    // Add state for search date(FILTERED DATE TO SHOW THE PRODUCT)
    const [searchDate, setSearchDate] = useState('');


    const filteredEnquiries = footerContact.filter(enquiry => {
        if (!searchDate) return true;
        const searchLower = searchDate.toLowerCase();
       // Check text fields first
    // const textMatch = (
    //         (enquiry.phone && enquiry.phone.toLowerCase().includes(searchLower)) ||
    //         (enquiry.prodCode && enquiry.prodCode.toLowerCase().includes(searchLower)) ||
    //         (enquiry.prodName && enquiry.prodName.toLowerCase().includes(searchLower)) ||
    //         (enquiry.location && enquiry.location.toLowerCase().includes(searchLower))
    //     )
    //     // If text matches, return true immediately
    // if (textMatch) return true;
    

        if (enquiry.createdAt) {
        const date = new Date(enquiry.createdAt);
        const day = date.getDate().toString();
        const month = (date.getMonth() + 1).toString(); // Months are 0-indexed
        const year = date.getFullYear().toString();
        
        // Check if search term matches any part
        return( day.includes(searchDate) || 
               month.includes(searchDate) || 
               year.includes(searchDate) ||
            //    `${day}/${month}/${year}`.includes(searchDate);
        `${day}/${month}/${year}`.includes(searchDate) ||
            `${month}/${day}/${year}`.includes(searchDate) ||
            `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`.includes(searchDate)
        );
    }
return false;
    });


    // Calculate Total Pages
    const totalPages = Math.ceil(filteredEnquiries.length / enquiriesPerPage);
    // Get Current Products for Display
    const indexOfLastEnquiry = currentPage * enquiriesPerPage;
    const indexOfFirstEnquiry = indexOfLastEnquiry - enquiriesPerPage;
    const currentEnquiries = filteredEnquiries.slice(indexOfFirstEnquiry, indexOfLastEnquiry);

    // // Pagination Function
    // Function to Generate Pagination Buttons
    const getPaginationGroup = () => {
        let pages = [];
        const maxPagesToShow = 3; // Show 3 pages around the current page

        if (totalPages <= 6) {
            // If there are few pages, show all
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        else {
            if (currentPage <= maxPagesToShow + 1) {
                // If near start: Show first few + last 2
                pages = [...Array(maxPagesToShow + 1).keys()].map((i) => i + 1);
                pages.push("...", totalPages - 1, totalPages);
            } else if (currentPage >= totalPages - maxPagesToShow) {
                // If near end: Show first 2 + last few
                pages = [1, 2, "..."];
                pages.push(...Array.from({ length: maxPagesToShow + 1 }, (_, i) => totalPages - maxPagesToShow + i));
            } else {
                // Middle section: Show current, 1 before & after
                pages = [1, 2, "..."];
                pages.push(currentPage - 1, currentPage, currentPage + 1);
                pages.push("...", totalPages - 1, totalPages);
            }
        }
        return pages;
    };
    // 3 DOTS SECTION 
    const [menuOpenId, setMenuOpenId] = useState(null); // Use ID if multiple rows

    const toggleMenu = (id) => {
        setMenuOpenId(prevId => (prevId === id ? null : id));
    };

    const navigate = useNavigate();
    // view details of the order  
    const handleViewEnquiryDetails = (enquiry) => {
        navigate(
            '/admin#enquiryDetailsPg', {
            state: {
                enquiry,
                activeMenu: 'enquiries',
                activeSubOrder: 'Enquiry Info'
            }
        })
    }
    // EDIT PRODUCT 
    const handleAction = (action, enquiry) => {
        if (action === 'Edit') {

            //   navigate(`/manageProducts/${product._id}`, { state: product });
            // navigate('/manageProducts', { state: { editProduct: product } });
            navigate('/admin#manageEnquiryEdit', {
                state: {
                    ediEnquiry: enquiry,
                    activeMenu: 'enquiries',
                    activeSubOrder: 'Edit Enquiry'
                }
            });
            {/* <Link to="/admin#admanager">Ad Manager</Link> */ }

        } else if (action === 'Delete') {
            handleEnquiryDelete(enquiry._id);
        }
    };

    const handleEnquiryDelete = async (id) => {
        // Show confirmation dialog
        if (window.confirm("Are you sure you want to delete this order permanently?")) {
            try {
                const response = await fetch(`${baseUrl}/verify/enquiries/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete enquiry');
                }
                setFooterContact(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                console.error("Error deleting enquiry:", error);
                alert("Failed to delete enquiry. Please try again.");

            }
        }
    };
    if (loading) return <div>Loading enquiries...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <div>
            <div className='productsHeader'>
                <div className='productsHeading'>All Footer Contacts</div>
                <div className="Admin-order-search-enquire">
                    <i className="fas fa-search search-icon Admin-order-search-icon"></i>
                    <input type="text" placeholder="Search by phone, code / location" className='Admin-order-search-name' value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)} />
                </div>
            </div>

            <div className="order-product-table">
                <table>
                    <thead style={{textAlign:'center'}}>
                        <tr className='enquireUserHead'>
                              <th><div className='TableOrderName'>User Details</div></th>
                            {/* <th><div>Product Code</div></th>
                            <th><div>Location</div></th> */}
                            <th><div>Enquire Date</div></th>
                            {/* <th><div>Status</div></th>
                            <th ><div>Actions</div></th> */}
                        </tr>
                    </thead>
                    <tbody style={{textAlign:'center'}}>
                        {currentEnquiries.map((enquiry, index) => (
                            <tr key={enquiry._id || index}  className='enquireUsersData'>
                                <td className='order-TableOrderName'>{enquiry.contactInfo}</td>
                                {/* <td className='order-TableProdCode'>{enquiry.prodCode}</td>
                                <td className='enquireUser_location'>{enquiry.location}</td> */}
                                <td>{enquiry.createdAt
                                    ? new Date(enquiry.createdAt).toLocaleDateString('en-GB')
                                    : '--'}</td>

                                {/* <td>{enquiry.status}</td> */}

                                <td className="order-threeDotsTd" onClick={() => toggleMenu(enquiry._id)} style={{textAlign:'center'}}>
                                    
                                            <i className="fa-solid fa-trash" title="Delete" onClick={() => handleAction('Delete', enquiry)}></i>
                                        
                                </td>
                            </tr>
                        ))}


                        {currentEnquiries.length === 0 && (
                            <tr>
                                <td colSpan="7" className="no-orders-found">
                                    <div className="no-orders-message">
                                        <i className="fas fa-exclamation-circle"></i>
                                        {/* No orders found for the searched date */}
                                        {searchDate ? "No enquiries match your search" : "No enquiries found"}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="order-Productpagination d-flex justify-content-center">
                    <button className="order-Productprev-button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1} >
                        Prev
                    </button>
                    {getPaginationGroup().map((page, index) =>
                        page === "..." ? (
                            <span key={index} className="order-paginationDots">...</span>
                        ) : (
                            <button
                                key={index}
                                className={`order-Productpage-number ${currentPage === page ? "active" : ""}`}
                                onClick={() => setCurrentPage(page)} >
                                {page}
                            </button>
                        )
                    )}
                    <button className="order-Productnext-button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnquireUsersTable;