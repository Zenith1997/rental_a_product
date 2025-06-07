/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, Button, TextField, Rating } from "@mui/material";

const AddReviewModal = ({ open, onClose }) => {
    const [rating, setRating] = useState(0);
    const [images, setImages] = useState([]);
    const [comment, setComment] = useState("");

    const handleImageUpload = (e) => {
        if (images.length < 4) {
            const files = Array.from(e.target.files).slice(0, 4 - images.length);
            setImages((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
        }
    };

    const handleSubmit = () => {
        const reviewData = { rating, images, comment };
        //console.log("Review Submitted:", reviewData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ paddingX: 10 }} maxWidth="sm">
            <h1 className="text-2xl mt-5 font-medium text-center">How is your order?</h1>
            <DialogContent className="flex flex-col items-center">
                <div className="my-4">
                    <p className="text-sm text-center text-[#E88081] mb-4">Your overall rating</p>
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={(e, newValue) => setRating(newValue)}
                        sx={{ fontSize: 40 }}
                    />
                </div>
                <div>
                    <h3 className="font-light">Add photo</h3>
                    <div className="mb-8 flex gap-2">
                        {/* Dynamically generate 4 slots */}
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="relative w-28 h-32 border rounded overflow-hidden">
                                {images[index] ? (
                                    <>
                                        <img
                                            src={images[index]}
                                            alt={`Uploaded ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() =>
                                                setImages(images.filter((_, i) => i !== index))
                                            }
                                            className="absolute top-0 right-0 text-red-500 bg-white rounded-full w-5 h-5 flex justify-center items-center"
                                        >
                                            &times;
                                        </button>
                                    </>
                                ) : (
                                    <label className="w-full h-full flex justify-center text-7xl text-[#B1A8A8] items-center  bg-[#F6F6F6] border-[#E3E3E3]">
                                        +
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                    <h3 className="font-light">Comment</h3>
                    <TextField
                        label="Enter here"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ backgroundColor: '#F6F6F6', color: '#E88081' }}
                    />
                </div>
            </DialogContent>
            <DialogActions sx={{ width: '100%' }} className="flex w-full justify-between px-4">
                <Button
                    className="w-full "
                    sx={{ py: 1.5, backgroundColor: '#FAE6E6', color: "#DA3335", border: 'none' }}
                    onClick={onClose}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    sx={{ py: 1.5 }}
                    className="w-full " onClick={handleSubmit} variant="contained" color="error">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddReviewModal;
