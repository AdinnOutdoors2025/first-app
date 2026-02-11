// src/components/FooterContactTable.js
import React, { useState, useEffect } from 'react';
import './ad1Orders.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './BASE_URL';
import { getPaginationGroup } from "../utils/pagination";

const FooterContactTable = () => {
    const [footerContacts, setFooterContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const fetchFooterContacts = async () => {
    setLoading(true);
    try {
        //${baseUrl}/ContactInfo/footerContactInfo
        const response = await fetch(`${baseUrl}/ContactInfo/footerContactInfo`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to fetch footer contacts: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        // Transform the data to ensure consistent structure
        const transformedData = data.map(item => ({
            _id: item._id?.$id || item._id,
            contactInfo: item.contactInfo,
            createdAt: item.createdAt?.$date?.$numberLong 
                ? new Date(parseInt(item.createdAt.$date.$numberLong)).toISOString()
                : item.createdAt
        }));

        // Sort by most recent first
        const sortedData = transformedData.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        setFooterContacts(sortedData);
        console.log("FooterContacts", sortedData);
    } catch (error) {
        console.error("Error fetching footer contacts:", error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
        fetchFooterContacts();
    }, []);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const contactsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');

    // Filter contacts based on search term
    const filteredContacts = footerContacts.filter(contact => {
        const createdAt = contact.createdAt ? new Date(contact.createdAt) : null;

        /* 🔍 Search filter */
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();

            const matchesContactInfo =
                contact.contactInfo &&
                contact.contactInfo.toLowerCase().includes(searchLower);

            const matchesDate =
                createdAt &&
                (
                    createdAt.getDate().toString().includes(searchTerm) ||
                    (createdAt.getMonth() + 1).toString().includes(searchTerm) ||
                    createdAt.getFullYear().toString().includes(searchTerm)
                );

            if (!matchesContactInfo && !matchesDate) {
                return false;
            }
        }

        /* 📅 Date range filter */
        if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            if (!createdAt || createdAt < from) return false;
        }

        if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            if (!createdAt || createdAt > to) return false;
        }

        return true;
    });


    // Calculate pagination
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
    const pages = getPaginationGroup(currentPage, totalPages);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this contact permanently?")) {
            try {
                const response = await fetch(`${baseUrl}/ContactInfo/footerContactInfo/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete contact');
                }
                setFooterContacts(prev => prev.filter(c => c._id !== id));
            } catch (error) {
                console.error("Error deleting contact:", error);
                alert("Failed to delete contact. Please try again.");
            }
        }
    };

    if (loading) return <div className="loading-message">Loading contacts...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div>
            <div className='productsHeader'>
                <div className='productsHeading'>Footer Contact Submissions</div>
                <div className="date-filter-wrapper">
    <div className="date-filter">
        <label>From</label>
        <input
            type="date"
            value={fromDate}
            onChange={(e) => {
                setFromDate(e.target.value);
                setCurrentPage(1);
            }}
        />
    </div>

            <div className="date-filter">
                    <label>To</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {(fromDate || toDate) && (
                    <button
                        className="clear-date-filter"
                        onClick={() => {
                            setFromDate('');
                            setToDate('');
                            setCurrentPage(1);
                        }}
                    >
                        Clear Date
                    </button>
                )}
            </div>

                <div className="Admin-order-search-enquire">
                    <i className="fas fa-search search-icon Admin-order-search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search by email, phone or date" 
                        className='Admin-order-search-name' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
            </div>

            <div className="order-product-table">
                <table>
                    <thead style={{textAlign: 'center'}}>
                        <tr className='enquireUserHead'>
                            <th><div className='TableOrderName'>Contact Info</div></th>
                            <th><div>Submission Date</div></th>
                            <th><div>Actions</div></th>
                        </tr>
                    </thead>
                    <tbody style={{textAlign: 'center'}}>
                        {currentContacts.map((contact, index) => (
                            <tr key={contact._id || index} className='enquireUsersData'>
                                <td className='order-TableOrderName'>
                                    {contact.contactInfo.includes('@') ? (
                                        <a href={`mailto:${contact.contactInfo}`}>{contact.contactInfo}</a>
                                    ) : (
                                        <a href={`tel:${contact.contactInfo}`}>{contact.contactInfo}</a>
                                    )}
                                </td>
                                <td>
                                    {contact.createdAt
                                        ? new Date(contact.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })
                                        : '--'}
                                </td>
                                <td className="order-threeDotsTd">
                                    <i 
                                        className="fa-solid fa-trash" 
                                        title="Delete" 
                                        onClick={() => handleDelete(contact._id)}
                                        style={{cursor: 'pointer'}}
                                    ></i>
                                </td>
                            </tr>
                        ))}

                        {currentContacts.length === 0 && (
                            <tr>
                                <td colSpan="3" className="no-orders-found">
                                    <div className="no-orders-message">
                                        <i className="fas fa-exclamation-circle"></i>
                                        {searchTerm ? "No contacts match your search" : "No contacts found"}
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
                    <button 
                        className="order-Productprev-button" 
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {pages.map((page, index) =>
                        page === "..." ? (
                            <span key={index} className="order-paginationDots">...</span>
                        ) : (
                            <button
                                key={index}
                                className={`order-Productpage-number ${currentPage === page ? "active" : ""}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        )
                    )}
                    <button 
                        className="order-Productnext-button" 
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default FooterContactTable;