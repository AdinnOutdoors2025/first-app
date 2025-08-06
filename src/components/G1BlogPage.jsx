import React, { useEffect, useState } from 'react';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
import '../components/G1BlogPage.css';
import { baseUrl } from '../Adminpanel/BASE_URL.js';
import { useParams, useNavigate } from 'react-router-dom';
//slick animations
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';


function BlogNew() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState(null);
    const [otherBlogs, setOtherBlogs] = useState([]);


    //Fetch Blogs from Backend
    const fetchBlogs = async () => {
        try {


            ///products/${productId}
            const response = await fetch(`${baseUrl}/BlogAdd/getBlog/${id}`);
            const data = await response.json();
            setBlogData(data);


        }
        catch (err) {
            console.log("Failed to fetch Blogs", err);


        }


    }




    // Fetch other blogs (excluding the current one)
    const fetchOtherBlogs = async () => {
        try {
            const response = await fetch(`${baseUrl}/BlogAdd/getBlog`);
            const data = await response.json();
            setOtherBlogs(data.filter(blog => blog._id !== id));
        } catch (err) {
            console.log("Failed to fetch other Blogs", err);
        }
    };


    // Fetch blogs on component mount
    useEffect(() => {
        fetchBlogs();
        fetchOtherBlogs();
    }, [id]);
    if (!blogData) return <div>Loading...</div>;




    //OTHER BLOG ANIMATIONS
    // Custom Next Arrow
    const NextArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="custom-arrow1 next-arrow1" onClick={onClick}>
                ❯
            </div>
        );
    };


    // Custom Previous Arrow
    const PrevArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="custom-arrow1 prev-arrow1" onClick={onClick}>
                ❮
            </div>
        );
    };


    // Carousel settings
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerPadding: "0px",
        // autoplay: true,
        autoplaySpeed: 2000,
        beforeChange: (current, next) => {
            const elements = document.querySelectorAll(".slick-slide1");
            elements.forEach((el, index) => {
                if (index === next) {
                    el.classList.add("slick-center1");
                } else {
                    el.classList.remove("slick-center1");
                }
            });
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerPadding: "40px",
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerPadding: "0px", // Set to 0 to remove any center padding
                    centerMode: false // Disable center mode if not needed
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                // centerPadding:"10px",
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                // centerPadding:"50px",


                }
            },
        ]
    };
//NAVIGATE TO TOP SHOW THE OTHER BLOG DETAILS
  // Handle navigation to other blog
    const handleBlogNavigation = (blogId) => {
        navigate(`/blog/${blogId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };




    return (
        <MainLayout>
            <div>
                {/* Navbar section  */}
                <MainNavbar />


                {/* {
                    blogData.map(
                        (blog, index) => {
                            return (
                                <div key={index}> */}
                {/* Blog Above section  */}




                <div className='blogPageContentMain container' id='otherblogshow'>
                    <div className='blogPageLeftContent'>
                        <img src={blogData.blogImage} className='BlogPageContentImg'></img>
                    </div>
                    <div className='blogPageRightContent'>
                        <div className='blogPageHeading'>
                            {blogData.blogTitle}
                            {/* Top Outdoor Advertisement Formats that are Suitable for Chennai Audience */}
                        </div>
                        <div className='BlogAuthorMain'>
                            <div className='BlogAuthorLeft'>
                                <img src={blogData.authorImage} className='BlogAuthorImg'></img>
                            </div>
                            <div className='BlogAuthorRight'>
                                <div className='BlogAuthorName'>{blogData.authorName}</div>
                                <div className='BlogAuthorTitle'>{blogData.authorBlogTitle}</div>
                                <div className='BlogAuthorPublishedDate'>Published on {blogData.authorPublishDate}</div>
                            </div>
                        </div>
                        <div className='Blog2ndContentPara'>


                            {blogData.blogSampleContent}
                        </div>
                    </div>
                </div>
                <div className='Blog2ndSectionMain container'
                    dangerouslySetInnerHTML={{ __html: blogData.richTextContent }}
                />
                <div className='Blog3rdSection'>
                    <div className='Blog3rdHeading container' >Other Blog</div>
                    <div className='other-blogs-container container-fluid'>
                        <Slider {...settings}>
                            {otherBlogs.map((otherBlog, index) => (
                                <div
                                    key={otherBlog._id}
                                    className='other-blog-item'
                                    onClick={() => handleBlogNavigation(otherBlog._id)}>
                                    <img src={otherBlog.blogImage} alt={otherBlog.blogTitle} />
                                    <div className='otherBlogTitle'>{otherBlog.blogTitle}</div>
                                    <div className='otherBlogContent'>{otherBlog.blogSampleContent}</div>
                                    <button className='read-more-btn'
                                    onClick={() => handleBlogNavigation(otherBlog._id)}
                                    >Read More</button>
                                </div>
                            ))}
                        </Slider>


                    </div>
                </div>
                <MainFooter />
            </div>
        </MainLayout>
    )
}
export default BlogNew;

