import React from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const LightboxComponent = ({
  images,
  photoIndex,
  isOpen,
  handleClose,
  handlePrev,
  handleNext,
}) => {
  return (
    isOpen && (
      <Lightbox
        mainSrc={images[photoIndex]}
        nextSrc={images[(photoIndex + 1) % images.length]}
        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
        onCloseRequest={handleClose}
        onMovePrevRequest={handlePrev}
        onMoveNextRequest={handleNext}
      />
    )
  );
};

export default LightboxComponent;
