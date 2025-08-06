import React, { useEffect, useRef, useState } from 'react'
import './a3home.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
// import ColorThief from 'color-thief-react';
import ColorThief from 'colorthief';
import { baseUrl } from '../Adminpanel/BASE_URL';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';


function AdinnHome3() {
    const navigate = useNavigate();
    const imageRefs = useRef([]);
    const textRefs = useRef([]);


    useEffect(() => {
        const colorThief = new ColorThief();


        const updateTextColor = (img, index) => {
            try {
                // Get dominant color from image
                const color = colorThief.getColor(img);
                // Calculate brightness (perceived luminance)
                const brightness = Math.sqrt(
                    color[0] * color[0] * 0.299 +
                    color[1] * color[1] * 0.587 +
                    color[2] * color[2] * 0.114
                );


                // Use higher threshold for better contrast
                const textColor = brightness > 130 ? "black" : "white";


                // Apply to both text and number elements
                if (textRefs.current[index]) {
                    textRefs.current[index].style.color = textColor;
                    // Also find the number element and apply same color
                    const numberElement = textRefs.current[index].closest('.ooh-intro')?.querySelector('.ooh-num');
                    if (numberElement) {
                        numberElement.style.color = textColor;
                    }
                }
            } catch (e) {
                console.warn("Color extraction failed:", e);
                // Fallback to white with black outline if extraction fails
                if (textRefs.current[index]) {
                    textRefs.current[index].style.color = "white";
                    textRefs.current[index].style.textShadow = "1px 1px 2px black";
                }
            }
        };


        const handleImageLoad = (img, index) => {
            updateTextColor(img, index);
        };


        imageRefs.current.forEach((img, index) => {
            if (!img) return;


            if (img.complete) {
                handleImageLoad(img, index);
            } else {
                img.addEventListener('load', () => handleImageLoad(img, index));
            }
        });


        return () => {
            imageRefs.current.forEach((img, index) => {
                if (img) {
                    img.removeEventListener('load', () => handleImageLoad(img, index));
                }
            });
        };
    }, []);


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
            // {
            //     breakpoint: 2000,
            //     settings: {
            //         slidesToShow: 4,
            //         slidesToScroll: 1,
            //     }
            // },
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
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
        ]
    };


    //TEXT COLOR AUTOMATICALLY CHANGED BASED ON THE BACKGROUND IMAGE
    // const img = document.getElementById("bgImage");
    //   const textContainer = document.getElementById("textContainer");
    //   const colorThief = new ColorThief();


    //   function updateTextColor() {
    //     try {
    //       const color = colorThief.getColor(img);
    //       const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
    //       textContainer.style.color = brightness > 150 ? "black" : "white";
    //     } catch (e) {
    //       console.warn("Color extraction failed:", e);
    //     }
    //   }


    //   if (img.complete) {
    //     updateTextColor();
    //   } else {
    //     img.addEventListener('load', updateTextColor);
    //   }


    const [blogData, setBlogData] = useState([]);
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


 const handleBlogClick = (blogId) => {
        // navigate(`/Blog/${blog}`); // Navigate to blog details page with ID
        navigate(`/Blog/${blogId}`); // Navigate to blog details page with ID


    };
    return (
        <div>


            {/* Our highlights section  */}
            <div className='high container'>
                <h1 className='heading'>Our <span className='highlight'>Highlights</span></h1>
                <div class="high-content">
                    <div class="high-inside">
                        <img src='./images/high-img1.png' className='high-img'></img> <br></br>
                        <p className='high-para'>Innovative Campaign
                            Execution</p>
                    </div>
                    <div class="high-inside">
                        <img src='./images/high-img2.png' className='high-img'></img>  <br></br>
                        <p className='high-para'>Exceptional Team</p>
                    </div>
                    <div class="high-inside high-inside-last">
                        <img src='./images/high-img3.png' className='high-img' ></img>  <br></br>
                        <p className='high-para'>Over 550 Proprietary Ad mediums</p>
                    </div>
                </div>
            </div>
            {/* OOH Insights  section  */}
            <div className='ooh '>
                <h1 className='heading'><span className='highlight'>OOH </span>Insights</h1>
                <div className='ooh-content '>
                    <Slider {...settings}>
                        {
                            blogData.map((blog, _id) => (
                                <div className='ooh-inside' key={blog._id} >
                                    <div className='ooh-inside-content'
                                    onClick={() => handleBlogClick(blog._id)}>
                                        <img
                                            // ref={el => imageRefs.current[0] = el}
                                            src={blog.blogImage} className='ooh-img'
                                            crossOrigin="anonymous" // Important for ColorThief to work
                                            id='bgImage'ref={el => imageRefs.current[_id] = el}></img>
                                        <div className='eye'>
                                            <div className='eye-content'>
                                                {/* <span><img src='./images/ooh4.png' className='eyeImg'></img></span>
                                        <span>102</span> */}
                                            </div>
                                            <div className='eye-content'>
                                                <span><img src='./images/ooh5.png' className='boxImg'></img></span>
                                                <span>{blog.authorPublishDate}</span>
                                            </div>
                                        </div>
                                        <div className='intro-main'>
                                            <div className='ooh-intro' id='textContainer'
                                                ref={el => textRefs.current[_id] = el} >
                                                <div className='intro-content'>
                                                    <p className='ooh-para'>
                                                        {blog.blogTitle}
                                                    </p>
                                                </div>
                                                <div className='intro-content'>
                                                    <p className='ooh-num'>0{_id + 1}</p>
                                                </div>
                                            </div>
                                            <button className='ooh-btn'>Read More &nbsp; <img src='./images/Arrow_btn.png' className='arrow'></img></button>


                                        </div>
                                    </div>
                                </div>
                            ))
                        }  
                    </Slider>
                </div>
            </div>
        </div>
    )
}


export default AdinnHome3;
