import React, { useState, useEffect } from 'react';
import './ad2BlogsPg.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './BASE_URL';
function AdminBlogPage() {
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState([]);
    //Fetch Blogs from Backend
    const fetchBlogs = async () => {
        try {
            const response = await fetch(`${baseUrl}/BlogAdd/getBlog`);
            const data = await response.json();
            setBlogData(data);
        }
        catch (err) {
            console.log("Failed to fetch Blogs", err);
        }
    }

    // Fetch blogs on component mount
    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleAction = (action, blog) => {
        if (action === 'Edit') {
            navigate('/admin#EditBlogPage', {
                state: {
                    editBlog: blog,
                    activeBlogPage: "Add Blogs"
                }
            });
        } else if (action === 'Delete') {
            handleDeleteBlog(blog._id);
        }
    };
    //DELETE BLOG
    const handleDeleteBlog = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog ?"))
            try {
                await fetch(`${baseUrl}/BlogAdd/deleteBlog/${id}`, {
                    method: 'DELETE',


                });
                setBlogData(prev => prev.filter(blog => blog._id !== id));
                alert("Blog deleted successfully");
            }
            catch (err) {
                console.error(err);
                alert('An error deleting Blog');
            }
    }
    return (
        <div>
            {/* Blog List Section */}
            <div className="blogListContainer">
                <h2>Blog List</h2>
                <table className="blogTable">
                    <thead>
                        <tr>
                            <th>Blog Image</th>
                            <th>Blog Title</th>
                            <th>Author Image</th>
                            <th>Author</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogData.map(blog => (
                            <tr key={blog._id}>
                                <td>
                                    <img src={blog.blogImage} alt="Blog Image" style={{ width: "100px", height: '100px' }} />


                                </td>
                                <td>{blog.blogTitle}</td>
                                <td>
                                    <img src={blog.authorImage} alt="Blog Image" style={{ width: "100px", height: '100px', borderRadius: "50%" }} />


                                </td>
                                <td>{blog.authorName}</td>
                                <td>{blog.authorPublishDate}</td>
                                <td>
                                    <button
                                        className="editBtn"
                                        onClick={() => handleAction('Edit', blog)}
                                    // onClick={() => handleEditBlog(blog)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="deleteBtn"
                                        onClick={() => handleAction('Delete', blog)}
                                    // onClick={() => handleDeleteBlog(blog._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default AdminBlogPage;
