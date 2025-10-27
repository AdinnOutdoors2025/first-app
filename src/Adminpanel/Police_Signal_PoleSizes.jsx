import React,{useState} from 'react'

function PoliceBooth_SignalPost() {
    const [policeWidth, setPoliceWidth] = useState('');
    const [policeHeight, setPoliceHeight] = useState('');
    const [policeQuantity, setPoliceQuantity] = useState('');
    const [policeWidth1, setPoliceWidth1] = useState('');
    const [policeHeight1, setPoliceHeight1] = useState('');
    const [policeQuantity1, setPoliceQuantity1] = useState('');
    const [poleWidth, setPoleWidth] = useState('');
    const [poleHeight, setPoleHeight] = useState('');
    const [poleQuantity, setPoleQuantity] = useState('');
    const [poleSides, setPoleSides] = useState('2');


const policeSizeCalculation = () =>{
     const squareFeet = policeHeight * policeWidth * policeQuantity 
    const squareFeet1 = policeHeight1 * policeWidth1 * policeQuantity1
    const squareFeetFinal = squareFeet + squareFeet1
     return squareFeetFinal;
}

    const poleSignalSizeCalculation =() =>{
        const poleSquareFeet = poleHeight * poleWidth * poleSides * poleQuantity
        return poleSquareFeet;
    }
    return (

        <div>

            <div>PoliceBooth_SignalPost_PoleKiosk inputs Sizes</div>

            <form>
{/* POLICE BOOTH  */}
                <div className='clientDetailSection'>
                    <div className='clientDetailHeading'>PoliceBooth Size</div>
                    <div className='sizeWidthValues'>
                        W : <input type='number' value={policeWidth}
                            onChange={(e) => {
                                setPoliceWidth(e.target.value);
                                // setErrors(prev => ({ ...prev, prodwidth: false }));
                            }} 
                            className={`sizeWidthInput 
                            `} 
                             >

                             </input>
                             <span className='sizeMultiply'> X </span>
                        H : <input type='number' value={policeHeight}
                                onChange={(e) => {
                                    setPoliceHeight(e.target.value);
                                    // setErrors(prev => ({ ...prev, prodheight: false }));
                                }} className={`sizeWidthInput 
                                `}></input> 

                        <span className='sizeMultiply'> X </span>
                        Q : <input type='number' value={policeQuantity}
                            onChange={(e) => {
                                setPoliceQuantity(e.target.value);
                                // setErrors(prev => ({ ...prev, prodheight: false }));
                            }} className={`sizeWidthInput 
                                `}></input>
                                <span className='sizeWidthSlash'> | </span> <br>

                                </br>


                        W : <input type='number' value={policeWidth1}
                            onChange={(e) => {
                                setPoliceWidth1(e.target.value);
                                // setErrors(prev => ({ ...prev, prodwidth: false }));
                            }}
                            className={`sizeWidthInput 
                            `}
                        >

                        </input>
                        <span className='sizeMultiply'> X </span>
                        H : <input type='number' value={policeHeight1}
                            onChange={(e) => {
                                setPoliceHeight1(e.target.value);
                                // setErrors(prev => ({ ...prev, prodheight: false }));
                            }} className={`sizeWidthInput 
                                `}></input>

                        <span className='sizeMultiply'> X </span>
                        Q : <input type='number' value={policeQuantity1}
                            onChange={(e) => {
                                setPoliceQuantity1(e.target.value);
                                // setErrors(prev => ({ ...prev, prodheight: false }));
                            }} className={`sizeWidthInput 
                                `}></input>


                                 <label>
                            {policeSizeCalculation()} 
                                 </label>Sq.ft
                        {/* {errors.prodwidth && errors.prodheight && <div className="AdminProderror-message ">Product Height & Width is required</div>} */}
                    </div>
                </div>


{/* SIGNAL POST POLE KIOSK  */}
                <div className='clientDetailSection'>
                    <div className='clientDetailHeading'>Signal Post / Pole Kiosk Size</div>
                    <div className='sizeWidthValues'>
                        W : <input type='number' value={poleWidth}
                            onChange={(e) => {
                                setPoleWidth(e.target.value);
                                // setErrors(prev => ({ ...prev, prodwidth: false }));
                            }}
                            className={`sizeWidthInput 
                            `}
                        >

                        </input>
                        <span className='sizeMultiply'> X </span>
                        H : <input type='number' value={poleHeight}
                            onChange={(e) => {
                                setPoleHeight(e.target.value);
                                // setErrors(prev => ({ ...prev, prodheight: false }));
                            }} className={`sizeWidthInput 
                                `}></input>

                        <span className='sizeMultiply'> X </span>
                        S : <input type='number' value={poleSides}
                            onChange={(e) => {
                                setPoleSides(e.target.value);
                                // setErrors(prev => ({ ...prev, prodheight: false }));
                            }} className={`sizeWidthInput 
                                `}></input>

                        <span className='sizeMultiply'> X </span>
                        Q : <input type='number' value={poleQuantity}
                            onChange={(e) => {
                                setPoleQuantity(e.target.value);
                                // setErrors(prev => ({ ...prev, prodheight: false }));
                            }} className={`sizeWidthInput 
                                `}></input>
                        <span className='sizeWidthSlash'> | </span> 


                        <label>
                            {poleSignalSizeCalculation()}
                        </label>Sq.ft
                        {/* {errors.prodwidth && errors.prodheight && <div className="AdminProderror-message ">Product Height & Width is required</div>} */}
                    </div>
                </div>
            </form>

        </div>
    )
}

export default PoliceBooth_SignalPost