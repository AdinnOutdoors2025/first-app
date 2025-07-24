import React from 'react';
import MainNavbar from './A1NAVBAR.jsx';
import MainFooter from './A1FOOTER.jsx';
import { MainLayout } from './MainLayout';
import '../components/G1BlogPage.css';
function BlogNew() {
    return (

        <MainLayout>
            <div>
                {/* Navbar section  */}
                <MainNavbar />
                <div>
                    {/* Blog Above section  */}
                    <div className='blogPageContentMain container'>
                        <div className='blogPageLeftContent'>
                            <img src='/images/BlogPageContentImg.png' className='BlogPageContentImg'></img>
                        </div>
                        <div className='blogPageRightContent'>
                            <div className='blogPageHeading'>
                                Top Outdoor Advertisement Formats that are Suitable for Chennai Audience
                            </div>

                            <div className='BlogAuthorMain'>
                                <div className='BlogAuthorLeft'>
                                    <img src='/images/BlogAuthorImg.png' className='BlogAuthorImg'></img>
                                </div>
                                <div className='BlogAuthorRight'>
                                    <div className='BlogAuthorName'>Sudhakar</div>
                                    <div className='BlogAuthorTitle'>OOH Plan Strategist @ Adinn Outdoors</div>
                                    <div className='BlogAuthorPublishedDate'>Published on 20.06.2024</div>
                                </div>
                            </div>
                            <div className='Blog2ndContentPara'>
                                Outdoor advertising in Chennai is more effective in reaching brand awareness strategies. Many brands target Chennai City to cover a wide exposure for their brand to reach successful OOH campaigns. Adinn Outdoor Advertising has a great media planning execution to deliver your brand fame on hoarding advertising.
                            </div>

                        </div>
                    </div>
                    {/* Blog  Below section  */}
                    <div className='Blog2ndSectionMain container'>

                        <div className='Blog2ndContentPara'>
                            Accordingly Chennai is a buzzing location city Your brand is unmissable for attracting more customers. Outdoor advertising in Chennai is more effective in reaching brand awareness strategies. Many brands target Chennai City to cover a wide exposure for their brand to reach successful OOH campaigns. Adinn Outdoor Advertising has a great media planning execution to deliver your brand fame on hoarding advertising.
                        </div>

                        <div>
                            <div className='Blog2ndSideHeading'>Effective outdoor advertising campaign in Chennai</div>
                            <div className='Blog2ndContentPara'>
                                Chennai is the most urban core city in Tamilnadu and more People are more likely to travel outside their day-to-day life. Adinn will help you guide the proper outdoor advertising marketing strategies to reach a diverse audience. We owned the largest portfolio of OOH media assets in Tamil Nadu, Kerala & Puducherry. Altogether our team of experts is passionate about outdoor advertising and knows how to deliver results that exceed expectations in Chennai. The main benefit of targeting the Chennai location it’s evolving fast and it delivers your targeted audience. Another reason for it can create greater impact and visibility for the brands and make audience potential to actual customers.
                            </div>
                        </div>


                        <div>
                            <div className='BlogSideHeadingMain'>TOP OUTDOOR ADVERTISEMENT FORMAT IN CHENNAI</div>
                            <div >
                                <div className='Blog2ndSideHeading'>Chennai Hoarding advertisement :</div>
                                <div className='Blog2ndContentPara'>Hoarding advertisements in Chennai very effectively makes your brand’s OOH campaign successful to have chances to engage the general audience. Adinn outdoor advertisement reviles prominent locations in Chennai, for example, OMR road connects many highway areas as your brand hoarding advertisement gets more visibility.</div>
                            </div>

                            <div>
                                <div className='Blog2ndSideHeading'>Chennai bus shelter advertisement :</div>
                                <div className='Blog2ndContentPara'>Bus shelter advertisements in Chennai are most strategically placed in high-traffic locations. Accordingly, Chennai has like many other urban areas to reach an enormous audience. Adinn Outdoor makes your brand aesthetically pleasing bus shelter advertisements visually stimulating to the audience.</div>
                            </div>

                            <div>
                                <div className='Blog2ndSideHeading'>Chennai Bus back advertisement:</div>
                                <div className='Blog2ndContentPara'>Bus Back advertisement in Chennai, While compared to other OOH advertisement Bus Back is very cheap and the best advertisement. It can create an immediate impact grabbing attention on road travelers. Chennai has various bus routes to cover the entire city.</div>
                            </div>

                            <div>
                                <div className='Blog2ndSideHeading'>Chennai Police booth advertisement:</div>
                                <div className='Blog2ndContentPara'>Police advertisements in Chennai highly visible in traffic locations. Use high-quality graphics and concise text to make your message stand out to passersby. Adinn has various locations to dissemination your brand and captivate the visual stimulating the audience.</div>
                            </div>

                            <div>
                                <div className='Blog2ndSideHeading'>Chennai Pole kiosk advertisement:</div>
                                <div className='Blog2ndContentPara'>Pole kiosk advertisements in Chennai are also affordable cost they can bigger impact on small sized advertisements. Basically, pole kiosk advertisements are mounted on utility poles, streetlights, or other roadside structures. so this service we are providing outdoor advertisement in Chennai.</div>
                            </div>


                        </div>
                    </div>


                    <div className='Blog3rdSection container'>
                        <div className='Blog3rdHeading' >Other Blog</div>
                    </div>

                </div>

                <MainFooter />

            </div>
        </MainLayout>
    )
}
export default BlogNew;
