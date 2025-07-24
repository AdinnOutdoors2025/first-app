import React from 'react'
import './a3home.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

function AdinnHome3() {

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
        autoplay: true,
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
                    centerPadding: "50px",
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
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

                        {/* 1st section  */}
                        <div className='ooh-inside'>
                            <div className='ooh-inside-content'>
                                <img src='./images/ooh1.png' className='ooh-img'></img>
                                <div className='eye'>
                                    <div className='eye-content'>
                                        <span><img src='./images/ooh4.png' className='eyeImg'></img></span>
                                        <span>102</span>
                                    </div>
                                    <div className='eye-content'>
                                        <span><img src='./images/ooh5.png' className='boxImg'></img></span>
                                        <span>24.07.2020</span>
                                    </div>
                                </div>
                                <div className='intro-main'>
                                    <div className='ooh-intro'>
                                        <div className='intro-content'>
                                            <p className='ooh-para'>Top Outdoor <br></br>
                                                Advertisement Formats that are Suitable for Chennai Audience</p>
                                        </div>
                                        <div className='intro-content'>
                                            <p className='ooh-num'>01</p>
                                        </div>
                                    </div>
                                    <button className='ooh-btn'>Read More &nbsp; <img src='./images/Arrow_btn.png' className='arrow'></img></button>

                                </div>
                                {/* <button className='ooh-btn'>Read More 
                                <img src='./images/ooh-btn.png' className='arrow'></img>
                                </button> */}
                            </div>
                        </div>


                        {/* 2nd section  */}

                        <div className='ooh-inside1'>
                            <div className='ooh-inside-content'>
                                <img src='./images/ooh2.png' className='ooh-img'></img>

                                <div className='eye'>
                                    <div className='eye-content'>
                                        <span><img src='./images/ooh4.png' className='eyeImg'></img></span>
                                        <span>102</span>
                                    </div>
                                    <div className='eye-content'>
                                        <span><img src='./images/ooh5.png' className='boxImg'></img></span>
                                        <span>24.07.2022</span>
                                    </div>
                                </div>
                                <div className='intro-main1'>
                                    <div className='ooh-intro1'>
                                        <div className='intro-content'>
                                            <p className='ooh-para1'>Impact of outdoor Advertising</p>
                                        </div>
                                        <div className='intro-content'>
                                            <p className='ooh-num1'>02</p>

                                        </div>
                                    </div>
                                    <button className='ooh-btn'>Read More &nbsp; <img src='./images/Arrow_btn.png' className='arrow'></img></button>
                                </div>
                            </div>
                        </div>
                        {/* 3rd section  */}

                        <div className='ooh-inside2'>
                            <div className='ooh-inside-content'>
                                <img src='./images/ooh3.png' className='ooh-img'></img>
                                <div className='eye'>
                                    <div className='eye-content'>
                                        <span><img src='./images/ooh4.png' className='eyeImg'></img></span>
                                        <span>102</span>
                                    </div>
                                    <div className='eye-content'>
                                        <span><img src='./images/ooh5.png' className='boxImg'></img></span>
                                        <span>24.07.2024</span>
                                    </div>
                                </div>


                                <div className='intro-main2'>
                                    <div className='ooh-intro2'>
                                        <div className='intro-content'>
                                            <p className='ooh-para2'>What is the most effective outdoor advertising ?</p>
                                        </div>
                                        <div className='intro-content'>
                                            <p className='ooh-num2'>03</p>
                                        </div>
                                        {/* <br></br>
                                <p style={{display:'block'}}>read</p> */}
                                    </div>
                                    <button className='ooh-btn'>Read More &nbsp; <img src='./images/Arrow_btn.png' className='arrow'></img></button>
                                </div>
                            </div>
                        </div>


                        {/* 4th section  */}

                        <div className='ooh-inside2'>
                            <div className='ooh-inside-content'>
                                <img src='./images/ooh3.png' className='ooh-img'></img>
                                <div className='eye'>
                                    <div className='eye-content'>
                                        <span><img src='./images/ooh4.png' className='eyeImg'></img></span>
                                        <span>102</span>
                                    </div>
                                    <div className='eye-content'>
                                        <span><img src='./images/ooh5.png' className='boxImg'></img></span>
                                        <span>24.07.2024</span>
                                    </div>
                                </div>


                                <div className='intro-main2'>
                                    <div className='ooh-intro2'>
                                        <div className='intro-content'>
                                            <p className='ooh-para2'>What is the most effective outdoor advertising ?</p>
                                        </div>
                                        <div className='intro-content'>
                                            <p className='ooh-num2'>03</p>
                                        </div>
                                        {/* <br></br>
                                <p style={{display:'block'}}>read</p> */}
                                    </div>
                                    <button className='ooh-btn'>Read More &nbsp; <img src='./images/Arrow_btn.png' className='arrow'></img></button>
                                </div>
                            </div>
                        </div>

                    </Slider>

                </div>
            </div>


        </div>

    )
}

export default AdinnHome3;



