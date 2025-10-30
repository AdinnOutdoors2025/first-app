import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ad2BlogAddPg.css';
import './RichText.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { baseUrl } from './BASE_URL';
function AdminBlogAdd() {
    const location = useLocation();
    const { state } = useLocation();
    // State variables
    const [blogTitle, setBlogTitle] = useState("Top Outdoor Advertisement Formats that are Suitable for Chennai Audience");
    const [authorImage, setAuthorImage] = useState('');
    const [authorName, setAuthorName] = useState('Sudhakar');
    const [authorBlogTitle, setAuthorBlogTitle] = useState('OOH Plan Strategist @ Adinn Outdoors');
    const [blogSampleContent, setBlogSampleContent] = useState('Outdoor advertising in Chennai is more effective in reaching brand awareness strategies. Many brands target Chennai City to cover a wide exposure for their brand to reach successful OOH campaigns. Adinn Outdoor Advertising has a great media planning execution to deliver your brand fame on hoarding advertising.');
    const [blogData, setBlogData] = useState([]);
    const [editBlog, setEditBlog] = useState(null);


    

    //HANDLING ERRORS
    const [errors, setErrors] = useState({
        image: false,
        blogTitle: false,
        authorImage: false,
        authorName: false,
        authorBlogTitle: false,
        authorPublishDate: false,
        blogSampleContent: false,
        richTextContent: false,
    });
    const validateForm = () => {
        const newErrors = {
            image: !image || image === " ",
            blogTitle: !blogTitle || blogTitle === " ",
            authorImage: !authorImage || authorImage === " ",
            authorName: !authorName || authorName === " ",
            authorBlogTitle: !authorBlogTitle || authorBlogTitle === " ",
            authorPublishDate: !authorPublishDate || authorPublishDate === " ",
            blogSampleContent: !blogSampleContent || blogSampleContent === " ",
            richTextContent: !richTextContent || richTextContent === " ",
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };


    // Sending messages
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };
        setAuthorPublishDate(formatDate(new Date()));
    }, []);

    const [authorPublishDate, setAuthorPublishDate] = useState('');
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
    useEffect(() => {
        fetchBlogs();
    }, []);
    // 👇 Prefill form if state has editProduct
    //UPDATE THE CONTENTS
    useEffect(() => {
        if (state?.editBlog) {
            const Blog = state.editBlog;
            setEditBlog(Blog);
            setImage(Blog.blogImage || " ");
            setBlogTitle(Blog.blogTitle || " ");
            setAuthorImage(Blog.authorImage || " ");
            setAuthorName(Blog.authorName || " ");
            setAuthorBlogTitle(Blog.authorBlogTitle || " ");
            setAuthorPublishDate(Blog.authorPublishDate || " ");
            setBlogSampleContent(Blog.blogSampleContent || " ");
            setRichTextContent(Blog.richTextContent || " ");
        }
    }, [state]);

    // // BLOG MAIN IMAGE UPLOAD SECTION
    // const handleImageUpload = async (event) => {
    //     const formData = new FormData();
    //     const file = event.target.files[0];
    //     formData.append("file", file);
    //     const res = await fetch(`${baseUrl}/BlogAdd/uploadBlog`, {
    //         method: "POST",
    //         body: formData,
    //     });
    //     const data = await res.json();

    //     console.log('Blog Image uploaded:', data.imageUrl);
    //     setImage(data.imageUrl);
    // };
    // console.log(setImage);
    // // This will log the image URL whenever it changes
    // useEffect(() => {
    //     if (image) {
    //         console.log("Current Blog image URL:", image);
    //     }
    // }, [image]);


    
    const [image, setImage] = useState(""); // Store uploaded image
    const [imageFile, setImageFile] = useState(null); // Store the File object
    const [authorImageFile, setAuthorImageFile] = useState(null);
    // Modified handleImageUpload to only create a preview
    // const handleImageUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         // Create a preview URL
    //         const previewUrl = URL.createObjectURL(file);
    //         setImage(previewUrl);
    //         setImageFile(file);
    //         setErrors(prev => ({ ...prev, image: false }));
    //     }
    // };
    // // Author image upload section
    // const handleAuthorImageUpload = async (event) => {
    //     const formData = new FormData();
    //     const file = event.target.files[0];
    //     formData.append("file", file);
    //     const res = await fetch(`${baseUrl}/BlogAdd/uploadBlog`, {
    //         method: "POST",
    //         body: formData,
    //     });
    //     const data = await res.json();
    //     console.log('Blog Author Image uploaded:', data.imageUrl);
    //     setAuthorImage(data.imageUrl); // Use full URL to backend
    // };


    // Handle blog image selection (preview only)
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setImage(previewUrl);
            setImageFile(file);
            setErrors(prev => ({ ...prev, image: false }));
        }
    };

    // Handle author image selection (preview only)
    const handleAuthorImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setAuthorImage(previewUrl);
            setAuthorImageFile(file);
            setErrors(prev => ({ ...prev, authorImage: false }));
        }
    };

    console.log(setAuthorImage);
            console.log("Current authorImage URL:", authorImage);

    // // This will log the image URL whenever it changes
    // useEffect(() => {
    //     if (authorImage) {
    //         console.log("Current authorImage URL:", authorImage);
    //     }
    // }, [authorImage]);

   
// Upload image to Cloudinary
    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch(`${baseUrl}/BlogAdd/uploadBlog`, {
            method: "POST",
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        
        return await response.json();
    };



//     const handleSaveBlog = async (e) => {
//         e.preventDefault();
//         console.log("Save Blog");
//         if (!validateForm()) {
//             return;
//         }
//         const method = editBlog ? "PUT" : "POST";
//         const url = editBlog ? `${baseUrl}/BlogAdd/updateBlog/${editBlog._id}` : `${baseUrl}/BlogAdd/createBlog`;
//         try {



// // STEP 1: Upload main image if it's a new file
//             let cloudinaryUrl = image; // Use existing URL if editing
//             // let additionalFiles = [...uploadedFiles];
//             let cloudinaryPublicId = editBlog?.imagePublicId || null;

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




//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     blogImage: image,
//                     blogTitle: blogTitle,
//                     authorImage: authorImage,
//                     blogImagePublicId: cloudinaryPublicId,
//                     authorName: authorName,
//                     authorBlogTitle: authorBlogTitle,
//                     authorPublishDate: authorPublishDate,
//                     blogSampleContent: blogSampleContent,
//                     richTextContent: richTextContent,
//                 })
//             });
//             const result = await response.json();
//             console.log(result);
//             if (editBlog) {
//                 alert("Blog updated successfully!");
//                 setEditBlog(null); // Clear edit mode after successful update
//                 window.location.reload();
//             } else {
//                 alert("Blog added successfully!");
//             }
//             setImage('');
//             setBlogTitle('');
//             setAuthorImage('');
//             setAuthorName('');
//             setAuthorBlogTitle('');
//             setAuthorPublishDate('');
//             setBlogSampleContent('');
//             setRichTextContent('')
//         }
//         catch (err) {
//             console.error(err);
//             alert('An error Uploading Blog');
//         }
//         console.log(image);
//         console.log(authorImage);
//         console.log(authorName);
//         console.log(authorBlogTitle);
//         console.log(authorPublishDate);
//         console.log(blogSampleContent);
//     }



    
    // Clean up preview URLs
      // Save blog function
    const handleSaveBlog = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setUploadProgress(0);
        
        try {
            let blogImageUrl = image;
            let blogImagePublicId = editBlog?.blogImagePublicId || null;
            let authorImageUrl = authorImage;
            let authorImagePublicId = editBlog?.authorImagePublicId || null;
            
            // Upload blog image if it's a new file
            if (imageFile && !image.startsWith('http')) {
                setUploadProgress(20);
                const blogImageData = await uploadImageToCloudinary(imageFile);
                blogImageUrl = blogImageData.imageUrl;
                blogImagePublicId = blogImageData.public_id;
            } else if (editBlog?.blogImage && !imageFile) {
                // Use existing image if in edit mode and no new file was selected
                blogImageUrl = editBlog.blogImage;
                blogImagePublicId = editBlog.blogImagePublicId;
            }
            
            // Upload author image if it's a new file
            if (authorImageFile && !authorImage.startsWith('http')) {
                setUploadProgress(60);
                const authorImageData = await uploadImageToCloudinary(authorImageFile);
                authorImageUrl = authorImageData.imageUrl;
                authorImagePublicId = authorImageData.public_id;
            } else if (editBlog?.authorImage && !authorImageFile) {
                // Use existing image if in edit mode and no new file was selected
                authorImageUrl = editBlog.authorImage;
                authorImagePublicId = editBlog.authorImagePublicId;
            }
            
            setUploadProgress(80);
            
            // Determine API endpoint and method
            const method = editBlog ? "PUT" : "POST";
            const url = editBlog ? 
                `${baseUrl}/BlogAdd/updateBlog/${editBlog._id}` : 
                `${baseUrl}/BlogAdd/createBlog`;
            
            // Send blog data to server
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    blogImage: blogImageUrl,
                    blogImagePublicId: blogImagePublicId,
                    blogTitle: blogTitle,
                    authorImage: authorImageUrl,
                    authorImagePublicId: authorImagePublicId,
                    authorName: authorName,
                    authorBlogTitle: authorBlogTitle,
                    authorPublishDate: authorPublishDate,
                    blogSampleContent: blogSampleContent,
                    richTextContent: richTextContent,
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save blog');
            }
            
            const result = await response.json();
            console.log(result);
            
            setUploadProgress(100);
            setIsSuccess(true);
            
            // Show success message and reset form or redirect
            setTimeout(() => {
                // if (editBlog) {
                //     alert("Blog updated successfully!");
                //     navigate('/admin/blogs'); // Redirect to blogs list
                // }
                
                
                if (editBlog) {
                alert("Blog updated successfully!");
                setEditBlog(null); // Clear edit mode after successful update
                window.location.reload();
            } 
                
                
                else {
                    alert("Blog added successfully!");
                    // Reset form for new entry
                    setImage("");
                    setImageFile(null);
                    setBlogTitle("");
                    setAuthorImage("");
                    setAuthorImageFile(null);
                    setAuthorName("");
                    setAuthorBlogTitle("");
                    setBlogSampleContent("");
                    setRichTextContent("");
                    // Keep the published date as it was initially set
                }
                setIsSubmitting(false);
            }, 1000);
            
        } catch (err) {
            console.error(err);
            alert('An error occurred while saving the blog: ' + err.message);
            setIsSubmitting(false);
        }
    };



    useEffect(() => {
        return () => {
            if (image && !image.startsWith('http')) {
                URL.revokeObjectURL(image);
            }
            if (authorImage && !authorImage.startsWith('http')) {
                URL.revokeObjectURL(authorImage);
            }
            // additionalFiles.forEach(file => {
            //     if (file.previewUrl) {
            //         URL.revokeObjectURL(file.previewUrl);
            //     }
            // });
        };
    }, [image, authorImage]);

    //RICH TEXT CONTENTS
    const [richTextContent, setRichTextContent] = useState('');
    // Define toolbar modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: [] }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            ],
            ['link', 'image', 'video'],
        ]
    };
    const formats = ['header', 'font', 'size', 'align', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'list', 'ordered', 'link', 'image', 'video'];
    return (
        <div>



{isSubmitting && (
                <div className="upload-progress-overlay">
                    <div className="upload-progress-container">
                        <h3>{editBlog ? "Updating Blog..." : "Saving Blog..."}</h3>
                        <div className="progress-bar">
                            <div 
                                className="progress-bar-fill" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <span>{uploadProgress}% Complete</span>
                    </div>
                </div>
            )}
            


            <form onSubmit={handleSaveBlog}>
                {/* Check the version of React  */}
                {/* {React.version} */}
                <div className='adminBlogMain'>
                    {/* Left Blog Content  */}
                    <div className="adminBlogLeft">
                        <div className='adminBlogImgMain'>
                            {/* <img src={image} className='adminBlogImg' alt="BlogImage"></img> */}
                            {image && <img src={image} className='adminBlogImg' alt="BlogImg" />}
                        </div>
                        <div className='BlogNameMain'>
                            <div className='BlogNameHeading'>BLOG NAME : </div>
                            <div className='BlogName'>
                                {blogTitle || "No title set"}
                                {/* Top Outdoor Advertisement Formats that are Suitable for Chennai Audience */}
                            </div>
                        </div>
                        <div className='adminBlogAuthorImgMain'>
                            {/* <center> */}
                            {/* <img src={authorImage} className='adminBlogAuthorImg' ></img> */}
                            {authorImage && <img src={authorImage} className='adminBlogAuthorImg' alt="AuthorImg" />}
                            {/* </center> */}
                        </div>
                        <div className='adminBlogAuthorMain' >
                            <div className='adminBlogAuthorContent'>
                                <div className='adminBlogAuthorContentLeft'>Author Name</div>
                                <div className='adminBlogAuthorContentRight'>{authorName}</div>
                            </div>
                            <div className='adminBlogAuthorContent'>
                                <div className='adminBlogAuthorContentLeft'>Blog Title</div>
                                <div className='adminBlogAuthorContentRight'>{authorBlogTitle}</div>
                            </div>
                            <div className='adminBlogAuthorContent'>
                                <div className='adminBlogAuthorContentLeft'>Published Date</div>
                                <div className='adminBlogAuthorContentRight'>{authorPublishDate}</div>
                            </div>
                        </div>
                        <div className='BlogNameMain'>
                            <div className='BlogNameHeading text-center'>BLOG CONTENT</div>
                            <div className='BlogName BlogName1'>
                                {blogSampleContent}
                            </div>
                        </div>
                    </div>
                    {/* Right Blog Content  */}
                    <div className="adminBlogRight">
                        {/* BLOG IMAGE UPLOAD SECTION  */}
                        <div className='adminBlogRightContent'>
                            <div className="adminBlog-upload-section">
                                <input type="file" accept="image/*" id='fileInput' onChange={handleImageUpload} hidden />
                                <label htmlFor="fileInput" className={`adminBlog-file-upload-box ${errors.image ? 'AdminProdinput-error' : ''}`}>
                                    <center>
                                        <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
                                    </center>
                                    <div className="adminBlog-upload-text">
                                        <div className="adminBlog-FileHeading">Drag and Drop an Blog Image or Choose File</div>
                                        <span className="adminBlog-file-info">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</span>
                                    </div>
                                </label>
                                {errors.image && <div className="AdminProderror-message">Blog image is required</div>}
                            </div>
                        </div>
                        {/* BLOG TITLE  */}
                        <div className='adminBlogRightContent'>
                            <div className='BlogRightSideHeading'>
                                Blog Title
                            </div>
                            <div>
                                <input type='text' placeholder='Enter Blog Title' value={blogTitle} onChange={(e) => {
                                    setBlogTitle(e.target.value);
                                    setErrors(prev => ({ ...prev, blogTitle: false }));
                                }} className={`BlogDetailsInput BlogTitleInput ${errors.blogTitle ? 'AdminProdinput-error' : ''}`} >
                                </input>
                                {errors.blogTitle && <div className="AdminProderror-message ">Blog Title is required</div>}
                            </div>
                        </div>
                        {/* AUTHOR IMAGE  */}
                        <div className='adminBlogAuthorRightContent adminBlogRightContent'>
                            <div className="adminBlog-upload-section adminBlogAuthorUpload-section">
                                <input type="file" accept="image/*" id='authorFileInput' onChange={handleAuthorImageUpload} hidden />
                                <label htmlFor="authorFileInput" className={`adminBlog-file-upload-box ${errors.image ? 'AdminProdinput-error' : ''}`}>
                                    <center>
                                        <img src="./images/FileUpload.svg" height={50} width={50} alt="Upload Icon" />
                                    </center>
                                    <div className="adminBlog-upload-text">
                                        <div className="adminBlog-FileHeading">Drag and Drop an Author Image or Choose File</div>
                                        <span className="adminBlog-file-info">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</span>
                                    </div>
                                </label>
                                {errors.authorImage && <div className="AdminProderror-message">Author image is required</div>}
                            </div>


                            <div>
                                {/* 1 */}
                                <div className='BlogAuthorDetailsContent'>
                                    <div className='BlogRightSideHeading'>
                                        Author Name
                                    </div>
                                    <div>
                                        <input type='text' placeholder='Enter Blog Title' value={authorName} onChange={(e) => {
                                            setAuthorName(e.target.value);
                                            setErrors(prev => ({ ...prev, authorName: false }));
                                        }} className={`BlogDetailsInput ${errors.authorName ? 'AdminProdinput-error' : ''}`} >


                                        </input>
                                        {errors.authorName && <div className="AdminProderror-message ">Author Name is required</div>}


                                    </div>
                                </div>
                                {/* 2 */}
                                <div className='BlogAuthorDetailsContent'>
                                    <div className='BlogRightSideHeading'>
                                        Author Blog Title
                                    </div>
                                    <div>
                                        <input type='text' placeholder='Enter Blog Title' value={authorBlogTitle} onChange={(e) => {
                                            setAuthorBlogTitle(e.target.value);
                                            setErrors(prev => ({ ...prev, authorBlogTitle: false }));
                                        }} className={`BlogDetailsInput ${errors.authorBlogTitle ? 'AdminProdinput-error' : ''}`} >


                                        </input>
                                        {errors.authorBlogTitle && <div className="AdminProderror-message ">Author Blog Title is required</div>}


                                    </div>
                                </div>
                                {/* 3 */}
                                <div className='BlogAuthorDetailsContent'>
                                    <div className='BlogRightSideHeading'>
                                        Published Date
                                    </div>
                                    <div>
                                        <input type='text'
                                            readOnly
                                            placeholder='Enter Blog Title' value={authorPublishDate} onChange={(e) => {
                                                setAuthorPublishDate(e.target.value);
                                                setErrors(prev => ({ ...prev, authorPublishDate: false }));
                                            }} className={`BlogDetailsInput ${errors.authorPublishDate ? 'AdminProdinput-error' : ''}`} >
                                        </input>
                                        {errors.authorPublishDate && <div className="AdminProderror-message ">Published Date is required</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* BLOG SAMPLE CONTENT  */}
                        <div className='adminBlogRightContent'>
                            <div className='BlogRightSideHeading'> BLOG SAMPLE CONTENT</div>
                            <textarea placeholder='Enter Blog Content' value={blogSampleContent} onChange={(e) => {
                                setBlogSampleContent(e.target.value);
                                setErrors(prev => ({ ...prev, blogSampleContent: false }));
                            }} className={`BlogSampleContentInput  ${errors.authorPublishDate ? 'AdminProdinput-error' : ''}`} > </textarea>
                            {errors.blogSampleContent && <div className="AdminProderror-message ">Blog Sample Content is required</div>}
                        </div>
                    </div>
                </div>
                {/* RICH TEXT FIELDS  */}
                <div className='richTextEditorMain'>
                    <div className='BlogContentEditorMain'>
                        <div className='BlogContentEditor'>
                            <ReactQuill
                                theme="snow"
                                value={richTextContent}
                                onChange={setRichTextContent}
                                modules={modules}
                                formats={formats}
                                className='BlogContentEditor-frame'
                            />
                            {errors.richTextContent && (
                                <div className="AdminProderror-message">Rich text content is required</div>
                            )}
                        </div>
                        <div className='BlogContentPreview'>
                            <h4 className="text-center">Content Preview</h4>
                            <div
                                className='preview-content'
                                dangerouslySetInnerHTML={{ __html: richTextContent }} />
                        </div>
                    </div>
                </div>
                <button className="adminBlogSaveBtn" type='submit' disabled={isSubmitting}>
                    {/* {editBlog ? "Update Blog" : "Save Blog"} */}
              {isSubmitting ? 'Saving...' : (editBlog ? "Update Blog" : "Save Blog")}
                </button>
            </form>
        </div>
    )
}
export default AdminBlogAdd;