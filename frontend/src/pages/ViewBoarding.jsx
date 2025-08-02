import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ViewBoardingMap from "../components/ViewBoardingMap";

const ViewBoarding = () => {
  const location = useLocation();
  const boarding = location.state?.boarding;
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    currentIndex: 0,
    images: [],
    title: "",
  });

  // Image viewer functions
  const openImageViewer = useCallback((images, title) => {
    setImageViewer({
      isOpen: true,
      currentIndex: 0,
      images: images,
      title: title,
    });
  }, []);

  const closeImageViewer = useCallback(() => {
    setImageViewer({
      isOpen: false,
      currentIndex: 0,
      images: [],
      title: "",
    });
  }, []);

  const nextImage = useCallback(() => {
    setImageViewer((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  }, []);

  const prevImage = useCallback(() => {
    setImageViewer((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0
          ? prev.images.length - 1
          : prev.currentIndex - 1,
    }));
  }, []);

  // Handle keyboard events for image viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imageViewer.isOpen) return;

      switch (e.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          closeImageViewer();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageViewer.isOpen, nextImage, prevImage, closeImageViewer]);

  if (!boarding) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="p-8 text-center text-ash">
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-ash p-4 md:p-8 flex flex-col lg:flex-row gap-8">
          {/* Images Section */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-ash flex items-center justify-center cursor-pointer group">
              {images.length > 0 ? (
                <img
                  src={mainImage}
                  alt="Main Boarding"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onClick={() =>
                    openImageViewer(
                      images,
                      `${boarding.type} - ${boarding.address}`
                    )
                  }
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-ash/60">
                  <svg className="mx-auto h-16 w-16 text-ash/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-base">No Image</span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-2">
                {images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-navy' : 'border-ash'} cursor-pointer hover:border-navy transition`}
                    onClick={() =>
                      openImageViewer(
                        images,
                        `${boarding.type} - ${boarding.address}`
                      )
                    }
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {images.length > 4 && (
                  <div className="w-20 h-16 rounded-lg overflow-hidden border-2 border-ash flex items-center justify-center text-navy bg-ash cursor-pointer hover:border-navy transition font-bold text-lg"
                    onClick={() =>
                      openImageViewer(
                        images,
                        `${boarding.type} - ${boarding.address}`
                      )
                    }
                  >+{images.length - 4}</div>
                )}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Type badge and address */}
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-navy text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow">{boarding.type}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-navy break-words">{boarding.address}</h2>
            </div>
            {/* Cost, Available, Gender */}
            <div className="flex flex-wrap gap-4 mb-2">
              <div className="flex items-center gap-2 bg-ash/30 px-3 py-2 rounded-lg">
                <span className="font-semibold text-navy">Cost:</span>
                <span className="text-navy">Rs. {boarding.cost.toLocaleString()}/month</span>
              </div>
              <div className="flex items-center gap-2 bg-ash/30 px-3 py-2 rounded-lg">
                <span className="font-semibold text-navy">Available:</span>
                <span className="text-navy">{boarding.availableCount} {boarding.availableCount === 1 ? 'bed' : 'beds'}</span>
              </div>
              <div className="flex items-center gap-2 bg-ash/30 px-3 py-2 rounded-lg">
                <span className="font-semibold text-navy">For:</span>
                <span className="text-navy">{boarding.gender}</span>
              </div>
            </div>
            {/* Facilities */}
            {boarding.facilities && boarding.facilities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {boarding.facilities.map((facility, idx) => (
                  <span key={idx} className="bg-navy/10 text-navy px-3 py-1 rounded-full text-xs font-medium shadow-sm">{facility}</span>
                ))}
              </div>
            )}
            {/* Description */}
            <div className="bg-ash/20 rounded-xl p-4 text-navy text-base shadow-inner">
              {boarding.description}
            </div>
          </div>
        </div>
        {/* Map Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow border border-ash p-4">
            <h3 className="text-lg font-semibold text-navy mb-2">Location</h3>
            <ViewBoardingMap 
              lat={boarding.lat} 
              lng={boarding.lng} 
              address={boarding.address} 
            />
          </div>
        </div>
      </div>
      <Footer />

      {/* Image Viewer Modal */}
      {imageViewer.isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            color: "white",
          }}
          onClick={closeImageViewer}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                position: "absolute",
                top: "-60px",
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 1,
              }}
            >
              <h3 style={{ margin: 0, color: "white" }}>{imageViewer.title}</h3>
              <p style={{ margin: "5px 0 0 0", color: "#ccc" }}>
                {imageViewer.currentIndex + 1} of {imageViewer.images.length}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={closeImageViewer}
              style={{
                position: "absolute",
                top: "-70px",
                right: "0px",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 1,
              }}
            >
              ×
            </button>

            {/* Main image */}
            <img
              src={imageViewer.images[imageViewer.currentIndex]}
              alt={`Image ${imageViewer.currentIndex + 1}`}
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
              }}
            />

            {/* Navigation buttons */}
            {imageViewer.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    border: "none",
                    color: "white",
                    fontSize: "28px",
                    padding: "15px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(5px)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(0, 0, 0, 0.8)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "rgba(0, 0, 0, 0.6)")
                  }
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    border: "none",
                    color: "white",
                    fontSize: "28px",
                    padding: "15px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(5px)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(0, 0, 0, 0.8)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "rgba(0, 0, 0, 0.6)")
                  }
                >
                  ›
                </button>
              </>
            )}

            {/* Thumbnail navigation */}
            {imageViewer.images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                  overflowX: "auto",
                  padding: "10px",
                }}
              >
                {imageViewer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: "60px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border:
                        index === imageViewer.currentIndex
                          ? "2px solid #000957"
                          : "2px solid transparent",
                      opacity: index === imageViewer.currentIndex ? 1 : 0.7,
                    }}
                    onClick={() =>
                      setImageViewer((prev) => ({
                        ...prev,
                        currentIndex: index,
                      }))
                    }
                  />
                ))}
              </div>
            )}

            {/* Instructions */}
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                left: 0,
                right: 0,
                textAlign: "center",
                color: "#ccc",
                fontSize: "12px",
              }}
            >
              Use arrow keys to navigate • Press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBoarding;
