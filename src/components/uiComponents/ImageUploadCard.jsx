/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Box, Button, Typography, Dialog, DialogContent } from "@mui/material";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ImageUpload = ({ onImagesChange, initialImages = [] }) => {
    const [images, setImages] = useState(() => {
        // Initialize with initialImages if provided, otherwise use null placeholders
        const initialArray = Array(5).fill(null);
        initialImages.forEach((url, index) => {
            if (index < 5) {
                initialArray[index] = { url, bgColor: "" };
            }
        });
        return initialArray;
    });
    const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Index of the image being edited
    const [backgroundColor, setBackgroundColor] = useState(""); // Selected background color
    const [dialogOpen, setDialogOpen] = useState(false); // Dialog modal state
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    // Notify parent component when images change
    useEffect(() => {
        if (onImagesChange) {
            const imageUrls = images.map(img => img?.url || null).filter(url => url !== null);
            onImagesChange(imageUrls);
        }
    }, [images, onImagesChange]);

    const validateFile = (file) => {
        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Only JPG, JPEG and PNG files are allowed');
        }
    };

    const uploadToS3 = async (file) => {
        if (!(file instanceof File)) {
            console.error("Invalid file provided:", file);
            return null;
        }

        const fileName = `Item_Image/${Date.now()}-${file.name}`;

        const s3Client = new S3Client({
            region: "eu-north-1",
            requestChecksumCalculation: "WHEN_REQUIRED",
            credentials: {
                accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
                secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
            },
        });

        const params = {
            Bucket: "drooda-frontend-admin-demo",
            Key: fileName,
            Body: file,
            ContentType: file.type,
        };

        console.log("Uploading with params:", params);

        try {
            console.log("Uploading to S3...");
            const upload = await s3Client.send(new PutObjectCommand(params));
            console.log("S3 Upload response:", upload);
            
            // Construct the URL
            const fileUrl = `https://drooda-frontend-admin-demo.s3.eu-north-1.amazonaws.com/${fileName}`;
            
            // Log the URL to verify it's correct
            console.log("Generated S3 URL:", fileUrl);
            
            return fileUrl;
        } catch (error) {
            console.error("S3 Upload Error:", error);
            return null;
        }
    };

    const handleImageUpload = async (event, index) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            validateFile(file);
            
            // Upload to S3 first
            const s3Url = await uploadToS3(file);
            if (!s3Url) {
                throw new Error("Failed to upload to S3");
            }

            const isPng = file.type === "image/png";

            setImages((prev) => {
                const updatedImages = [...prev];
                updatedImages[index] = { url: s3Url, bgColor: "" };
                return updatedImages;
            });

            if (isPng) {
                setSelectedImageIndex(index);
                setDialogOpen(true);
            }
        } catch (error) {
            setError(error.message);
            console.error("Error uploading image:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => {
            const updatedImages = [...prev];
            updatedImages[index] = null; // Remove the image from the box
            return updatedImages;
        });
    };

    const openDialog = (index) => {
        setSelectedImageIndex(index);
        setDialogOpen(true);
    };

    const handleBackgroundSelect = (color) => {
        setBackgroundColor(color);
    };

    const saveBackground = () => {
        setImages((prev) => {
            const updatedImages = [...prev];
            updatedImages[selectedImageIndex] = {
                ...updatedImages[selectedImageIndex],
                bgColor: backgroundColor,
            };
            return updatedImages;
        });
        setDialogOpen(false); // Close dialog
        setBackgroundColor(""); // Reset background color
    };

    return (
        <div className="w-full flex flex-col">
            <Typography variant="h6" className="mb-4">
                Upload photos *{" "}
                <span className="text-gray-500 font-light text-base ml-4 italic">
                    Note: The first image will be the cover photo of your ad
                </span>
            </Typography>

            {error && (
                <Typography color="error" className="mb-2">
                    {error}
                </Typography>
            )}

            {/* Large box on top */}
            <Box className="w-full mb-4">
                <div
                    className={`relative h-[200px] border-dashed border-2 border-gray-400 rounded-md overflow-hidden ${images[0]?.bgColor ? "p-2" : ""
                        }`}
                    style={{
                        backgroundColor: images[0]?.bgColor || "transparent",
                    }}
                >
                    {images[0]?.url ? (
                        <img
                            src={images[0]?.url}
                            alt="uploaded-0"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full">
                            <Typography className="text-gray-500">
                                {uploading ? "Uploading..." : "Upload up to 5 images"}
                            </Typography>
                        </div>
                    )}
                    <label className="absolute w-full h-full top-0 left-0 ">
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) => handleImageUpload(e, 0)}
                            className="absolute w-full h-full opacity-0"
                            disabled={uploading}
                        />
                    </label>
                    {images[0]?.url && (
                        <Button
                            onClick={() => handleRemoveImage(0)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            size="small"
                            sx={{
                                minWidth: 0,
                                width: "24px",
                                height: "24px",
                            }}
                        >
                            ✕
                        </Button>
                    )}
                    {images[0]?.url && (
                        <Button
                            onClick={() => openDialog(0)}
                            className="absolute bottom-2 right-2 bg-gray-700 text-white rounded-md p-1"
                            size="small"
                        >
                            Change BG
                        </Button>
                    )}
                </div>
            </Box>

            {/* Four smaller boxes below */}
            <Box className="grid gap-4" sx={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                {images.slice(1).map((image, index) => (
                    <div
                        key={index + 1}
                        className={`relative h-[100px] border-dashed border-2 border-gray-400 rounded-md overflow-hidden ${image?.bgColor ? "p-2" : ""
                            }`}
                        style={{
                            backgroundColor: image?.bgColor || "transparent",
                        }}
                    >
                        {image?.url ? (
                            <img
                                src={image?.url}
                                alt={`uploaded-${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col justify-center items-center h-full">
                                <Typography className="text-gray-500">
                                    {uploading ? "Uploading..." : "Upload"}
                                </Typography>
                            </div>
                        )}
                        <label className="absolute w-full h-full top-0 left-0 ">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={(e) => handleImageUpload(e, index + 1)}
                                className="absolute w-full h-full opacity-0"
                                disabled={uploading}
                            />
                        </label>
                        {image?.url && (
                            <Button
                                onClick={() => handleRemoveImage(index + 1)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                size="small"
                                sx={{
                                    minWidth: 0,
                                    width: "24px",
                                    height: "24px",
                                }}
                            >
                                ✕
                            </Button>
                        )}
                        {image?.url && (
                            <Button
                                onClick={() => openDialog(index + 1)}
                                className="absolute bottom-2 right-2 bg-gray-700 text-white rounded-md p-1"
                                size="small"
                            >
                                Change BG
                            </Button>
                        )}
                    </div>
                ))}
            </Box>

            {/* Dialog modal */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogContent>
                    <div className="w-full flex flex-col items-center">
                        {selectedImageIndex !== null && images[selectedImageIndex]?.url && (
                            <div
                                className="relative w-full mb-4"
                                style={{
                                    backgroundColor: backgroundColor || "transparent",
                                }}
                            >
                                <img
                                    src={images[selectedImageIndex]?.url}
                                    alt="dialog-preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        {/* Background color options */}
                        <div className="flex min-h-[100px] space-x-2 ">
                            {["#E36667", "#E88081", "#F1B3B3", "#F6CCCC", "#FAE6E6"].map(
                                (color) => (
                                    <div
                                        key={color}
                                        onClick={() => handleBackgroundSelect(color)}
                                        className="w-16 mb-4 mt-auto h-16  "
                                        style={{
                                            backgroundColor: color,
                                            border:
                                                backgroundColor === color
                                                    ? "2px solid black"
                                                    : "none",
                                        }}
                                    />
                                )
                            )}
                        </div>
                        <Button
                            variant="contained"
                            onClick={saveBackground}
                            sx={{
                                backgroundColor: backgroundColor ? '#D10002' : '#F1B3B3',
                                width: '70%',
                                padding: 2,
                            }}
                        >
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

ImageUpload.propTypes = {
    onImagesChange: PropTypes.func.isRequired,
    initialImages: PropTypes.array
};

export default ImageUpload;
