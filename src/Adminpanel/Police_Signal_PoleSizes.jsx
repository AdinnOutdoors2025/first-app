import React, { useState } from 'react'

function PoliceBooth_SignalPost() {
    const [prodWidth, setProdWidth] = useState('');
    const [prodHeight, setProdHeight] = useState('');
    const [prodSquareFeet, setProdSquareFeet] = useState('');

    const [sizeWidth1, setSizeWidth1] = useState('');
    const [sizeWidth2, setSizeWidth2] = useState('');
    const [sizeWidth3, setSizeWidth3] = useState('');


    const [sizeHeight, setSizeHeight] = useState('');

    const [sizeQuantity1, setSizeQuantity1] = useState('');
    const [sizeQuantity2, setSizeQuantity2] = useState('');
    const [sizeQuantity3, setSizeQuantity3] = useState('');


    const [prodSide, setProdSide] = useState('1');
    // const sizeCalculation = () =>{
    const sizeCalc = (sizeWidth1 * sizeQuantity1) + (sizeWidth2 * sizeQuantity2) + (sizeWidth3 * sizeQuantity3)
    const heightCalc = sizeHeight
    const squareFeet = Math.round(sizeCalc * heightCalc * prodSide);
    // const squareFeet = (sizeCalc * heightCalc * prodSide).toPrecision(2);

    console.log(sizeCalc);
    console.log(heightCalc);
    console.log(squareFeet); 

    // return squareFeet;
    //     } 

    return (
        <div>
            <div>PoliceBooth_SignalPost_PoleKiosk inputs Sizes</div>
            <form>
                W   <input type='number' value={sizeWidth1}
                    onChange={(e) => {
                        setSizeWidth1(e.target.value);
                        // setErrors(prev => ({ ...prev, prodheight: false }));
                    }} className={`sizeWidthInput 
                                `}></input>
                <span className='sizeMultiply'> X </span>

                Q  <input type='number' value={sizeQuantity1}
                    onChange={(e) => {
                        setSizeQuantity1(e.target.value);
                        // setErrors(prev => ({ ...prev, prodheight: false }));
                    }} className={`sizeWidthInput 
                                `}></input>

                {/* 2 */}
                <span className='sizeMultiply'> + </span>

                W   <input type='number' value={sizeWidth2}
                    onChange={(e) => {
                        setSizeWidth2(e.target.value);
                        // setErrors(prev => ({ ...prev, prodheight: false }));
                    }} className={`sizeWidthInput 
                                `}></input>
                <span className='sizeMultiply'> X </span>

                Q  <input type='number' value={sizeQuantity2}
                    onChange={(e) => {
                        setSizeQuantity2(e.target.value);
                        // setErrors(prev => ({ ...prev, prodheight: false }));
                    }} className={`sizeWidthInput 
                                `}></input>

                {/* 3 */}
                <span className='sizeMultiply'> + </span>

                W   <input type='number' value={sizeWidth3}
                    onChange={(e) => {
                        setSizeWidth3(e.target.value);
                        // setErrors(prev => ({ ...prev, prodheight: false }));
                    }} className={`sizeWidthInput 
                                `}></input>
                <span className='sizeMultiply'> X </span>

                Q  <input type='number' value={sizeQuantity3}
                    onChange={(e) => {
                        setSizeQuantity3(e.target.value);
                        // setErrors(prev => ({ ...prev, prodheight: false }));
                    }} className={`sizeWidthInput 
                                `}></input>

                <span className='sizeMultiply'> = </span>
                <span> {sizeCalc}</span>
                <div>


                    W <input type='number' value={sizeCalc} readOnly
                        onChange={(e) => {
                            setSizeHeight(e.target.value);
                            // setErrors(prev => ({ ...prev, prodheight: false }));
                        }} className={`sizeWidthInput 
                                `}></input>
                    <span className='sizeMultiply'> X </span>

                    H  <input type='number' value={sizeHeight}
                        onChange={(e) => {
                            setSizeHeight(e.target.value);
                            // setErrors(prev => ({ ...prev, prodheight: false }));
                        }} className={`sizeWidthInput 
                                `}></input>
                <span className='sizeMultiply'> X </span>

                                S  <input type='number' value={prodSide}
                        onChange={(e) => {
                            setProdSide(e.target.value);
                            // setErrors(prev => ({ ...prev, prodheight: false }));
                        }} className={`sizeWidthInput 
                                `}></input>

                    <span className='sizeMultiply'> = </span>
                    <span> {squareFeet} Sq.ft</span>
                </div>

            </form>

        </div>
    )
}

export default PoliceBooth_SignalPost;