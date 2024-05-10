import React from 'react'
import './Images.css'
import leftImage from '../../assets/leftImage.png';
import rightImage1 from '../../assets/rightImage1.png';
import rightImage2 from '../../assets/rightImage2.png';
const Images = () => {

    return (
        <div className="image-layout">
            <div className="left-image">
                <img src={leftImage} alt="LeftImage" />
            </div>
            <div className="right-images">
                <img src={rightImage1} alt="RightImage 1" />
                <img src={rightImage2} alt="RightImage 2" />
            </div>
        </div>
    )
}

export default Images
