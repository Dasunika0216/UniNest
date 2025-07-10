import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ViewBoarding = () => {
  const location = useLocation();
  const boarding = location.state?.boarding;
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    currentIndex: 0,
    images: [],
    title: ''
  });

  if (!boarding) {
    return (
      <div className="min-h-screen bg-[#fdfde3]">
        <Navbar />
        <div className="p-8 text-center text-gray-500">
          No boarding details found.
        </div>
        <Footer />
      </div>
    );
  }

  // Images logic
  const images = boarding.images || [];
  const mainImage = images[0];
  const sideImages = images.slice(1, 3); // Show 2 side images
  const extraCount = images.length - 3;

  // Image viewer functions
  const openImageViewer = (images, title) => {
    setImageViewer({
      isOpen: true,
      currentIndex: 0,
      images: images,
      title: title
    });
  };

  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      currentIndex: 0,
      images: [],
      title: ''
    });
  };

  const nextImage = () => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  };

  // Handle keyboard events for image viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imageViewer.isOpen) return;
      
      switch(e.key) {
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'Escape':
          closeImageViewer();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageViewer.isOpen]);

  return (
    <div className="min-h-screen bg-[#fdfde3]">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        {/* Images display */}
        {images.length === 0 ? (
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-2xl aspect-[4/3] rounded overflow-hidden bg-gray-200">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 mb-6">
            {/* Main large image */}
            <div className="relative flex-1 min-w-0 aspect-[4/3] rounded overflow-hidden bg-gray-200 cursor-pointer">
              <img
                src={mainImage}
                alt="Main Boarding"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onClick={() => openImageViewer(images, `${boarding.type} - ${boarding.address}`)}
              />
            </div>
            
            {/* Side images and plus sign */}
            <div className="grid grid-cols-1 gap-2 w-48 min-w-48">
              {sideImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded overflow-hidden bg-gray-200 cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Boarding ${idx + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onClick={() => openImageViewer(images, `${boarding.type} - ${boarding.address}`)}
                  />
                </div>
              ))}
              
              {/* Plus sign for more images */}
              {extraCount > 0 && (
                <div 
                  className="relative aspect-square rounded overflow-hidden bg-gray-200 cursor-pointer border-2 border-dashed border-gray-400 hover:border-gray-600 transition-colors duration-300"
                  onClick={() => openImageViewer(images, `${boarding.type} - ${boarding.address}`)}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 hover:text-gray-800">
                    <div className="text-3xl font-bold mb-1">+</div>
                    <div className="text-sm font-medium">{extraCount}</div>
                    <div className="text-xs text-gray-500">More</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Address */}
        <h2 className="text-2xl font-bold mb-2">{boarding.address}</h2>
        {/* Description */}
        <p className="text-gray-700 mb-4">{boarding.description}</p>
        {/* Available Count */}
        <div className="mb-2">
          <span className="font-semibold">Available:</span>{" "}
          {boarding.availableCount}{" "}
          {boarding.availableCount === 1 ? "bed" : "beds"}
        </div>
        {/* Facilities */}
        {boarding.facilities && boarding.facilities.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold">Facilities:</span>
            <ul className="list-disc list-inside ml-4">
              {boarding.facilities.map((facility, idx) => (
                <li key={idx}>{facility}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />

      {/* Image Viewer Modal */}
      {imageViewer.isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            color: 'white'
          }}
          onClick={closeImageViewer}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              left: 0,
              right: 0,
              textAlign: 'center',
              zIndex: 1
            }}>
              <h3 style={{ margin: 0, color: 'white' }}>{imageViewer.title}</h3>
              <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>
                {imageViewer.currentIndex + 1} of {imageViewer.images.length}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={closeImageViewer}
              style={{
                position: 'absolute',
                top: '-70px',
                right: '0px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 1
              }}
            >
              ×
            </button>

            {/* Main image */}
            <img
              src={imageViewer.images[imageViewer.currentIndex]}
              alt={`Image ${imageViewer.currentIndex + 1}`}
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.4)'
              }}
            />

            {/* Navigation buttons */}
            {imageViewer.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    color: 'white',
                    fontSize: '28px',
                    padding: '15px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    color: 'white',
                    fontSize: '28px',
                    padding: '15px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
                >
                  ›
                </button>
              </>
            )}

            {/* Thumbnail navigation */}
            {imageViewer.images.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                overflowX: 'auto',
                padding: '10px'
              }}>
                {imageViewer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '60px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: index === imageViewer.currentIndex ? '2px solid #3498db' : '2px solid transparent',
                      opacity: index === imageViewer.currentIndex ? 1 : 0.7
                    }}
                    onClick={() => setImageViewer(prev => ({ ...prev, currentIndex: index }))}
                  />
                ))}
              </div>
            )}

            {/* Instructions */}
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: 0,
              right: 0,
              textAlign: 'center',
              color: '#ccc',
              fontSize: '12px'
            }}>
              Use arrow keys to navigate • Press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBoarding;
