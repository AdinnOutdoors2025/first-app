import React, { useState, useEffect } from 'react';
import './ad1Orders.css';
import { useNavigate } from 'react-router-dom';
//BASE URL OF http://localhost:3001 FILE IMPORT 
import {baseUrl} from './BASE_URL';
import { getPaginationGroup } from "../utils/pagination";
import { formatIndianDateTime } from '../../src/DateTimeFormatter';


const EnquireUsersTable = () => {
    //FETCHED PRODUCTS ORDER PAGE
    const [enquiriesData, setEnquiriesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    // In your fetchOrders function, normalize the data
    const fetchEnquiries = async () => {
        try {
            const response = await fetch(`${baseUrl}/verify/enquiries`);
            if (!response.ok) {
                throw new Error('Failed to fetch enquiries');
            }
            const data = await response.json();
            // Add safe product fallback
            const normalizedData = data.map(enquiry => ({
                ...enquiry,
                enquiryDate: enquiry.enquiryDate || new Date().toISOString(),
                //  createdAt: enquiry.createdAt || new Date().toISOString(),
                productId: enquiry.productId || 'No Product',
                prodCode: enquiry.prodCode || "--",
                phone: enquiry.phone,
                status: 'Enquiry',
                prodName: enquiry.prodName || "--",
                location: enquiry.location || "--"
                // products: enquiry.products || [], // Ensure product exists
                // booking:enquiry.products?.[0]?.booking || {}  // Ensure booking exists
            }));
            setEnquiriesData(normalizedData);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
            setError(error.message);

        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEnquiries();
    }, []);
    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const enquiriesPerPage = 10;

    // Add state for search date(FILTERED DATE TO SHOW THE PRODUCT)
    const [searchDate, setSearchDate] = useState('');


 const filteredEnquiries = enquiriesData.filter(enquiry => {

    /* =========================
       1️⃣ ENQUIRE DATE RANGE FILTER
    ========================= */
    if (fromDate || toDate) {
        if (!enquiry.enquiryDate) return false;

        const enquiryDate = new Date(enquiry.enquiryDate);

        if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            if (enquiryDate < from) return false;
        }

        if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            if (enquiryDate > to) return false;
        }
    }

    /* =========================
       2️⃣ TEXT SEARCH FILTER
    ========================= */
    if (!searchDate.trim()) return true;

    const searchLower = searchDate.toLowerCase();

    // 🔹 Text fields
    const textMatch = (
        enquiry.phone?.toLowerCase().includes(searchLower) ||
        enquiry.prodCode?.toLowerCase().includes(searchLower) ||
        enquiry.prodName?.toLowerCase().includes(searchLower) ||
        enquiry.location?.toLowerCase().includes(searchLower)
    );

    if (textMatch) return true;

    /* =========================
       3️⃣ DATE TEXT SEARCH (dd/mm/yyyy etc)
    ========================= */
    if (enquiry.enquiryDate) {
        const date = new Date(enquiry.enquiryDate);
        const day = date.getDate().toString();
        const month = (date.getMonth() + 1).toString();
        const year = date.getFullYear().toString();

        return (
            day.includes(searchDate) ||
            month.includes(searchDate) ||
            year.includes(searchDate) ||
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

 
    const pages = getPaginationGroup(currentPage, totalPages);
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
                setEnquiriesData(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                console.error("Error deleting enquiry:", error);
                alert("Failed to delete enquiry. Please try again.");

            }
        }
    };
    if (loading) return <div>Loading enquiries...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <div className='EnquireUsersTableMain'>
            <div className='productsHeader' style={{border:'1px solid red'}}>
                <div className='productsHeading'>All Enquiries</div>
                <div className="Admin-order-date-filter">
                    <span className="adminDate-separator">From</span>

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <span className="adminDate-separator">To</span>

                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>


                <div className="Admin-order-search-enquire">
                    <i className="fas fa-search search-icon Admin-order-search-icon"></i>
                    <input type="text" placeholder="Search by phone, code / location" className='Admin-order-search-name' value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)} />
                </div>

                {(searchDate || fromDate || toDate) && (
                        <button
                            className="clear-all-filters"
                            onClick={() => {
                                setSearchDate('');
                                setFromDate('');
                                setToDate('');
                                setCurrentPage(1);
                            }}
                        >
                            Clear all
                        </button>
                    )}

                
            </div>

            

            <div className="order-product-table">
                <table>
                    <thead style={{textAlign:'center'}}>
                        <tr className='enquireUserHead'>
                              <th><div className='TableOrderName'>User Phone</div></th>
                            <th><div>Product Code</div></th>
                            <th><div>Location</div></th>
                            <th><div>Enquire Date</div></th>
                            <th><div>Status</div></th>
                            <th ><div>Actions</div></th>
                        </tr>
                    </thead>
                    <tbody style={{textAlign:'center'}}>
                        {currentEnquiries.map((enquiry, index) => (
                            <tr key={enquiry._id || index}  className='enquireUsersData'>
                                <td className='order-TableOrderName'>{enquiry.phone}</td>
                                <td className='order-TableProdCode'>{enquiry.prodCode}</td>
                                <td className='enquireUser_location'>{enquiry.location}</td>
                                {/* <td>{enquiry.enquiryDate
                                    ? new Date(enquiry.enquiryDate).toLocaleDateString('en-GB')
                                    : '--'}</td> */}
  <td>                                            {formatIndianDateTime(enquiry.enquiryDate)}
  </td>
                                <td>{enquiry.status}</td>

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
                    {pages.map((page, index) =>
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