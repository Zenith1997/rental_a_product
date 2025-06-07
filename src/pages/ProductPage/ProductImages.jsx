/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

const ProductImages = ({ images }) => {
    return (
        <ImageList
            sx={{
                zIndex:0,
                width: '70%',
                height: 330, // Adjust height for a compact design
                gap: 1, // Add spacing between images
                marginTop: '5%', // Center align the grid
            }}
            variant="quilted"
            cols={4} // Total columns
            rowHeight={160} // Define row height for smaller size
        >
            {/* First (big) image */}
            <ImageListItem
                style={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    marginRight: 10,
                }}
                key={images}
                cols={2} rows={2}>
                <img
                    {...srcset(images, 160, 2, 2)} // Adjust size to match the rows and cols
                    alt={`Product ${images}`}
                    loading="lazy"
                    style={{
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        // marginRight: 0,
                    }}
                />
            </ImageListItem>

            {/* Remaining four images */}
            {images.slice(1, 5).map((image) => (
                <ImageListItem key={image} cols={1} rows={1}>
                    <img
                        {...srcset(image, 160, 1, 1)}
                        alt={`Product ${image}`}
                        loading="lazy"
                        style={{
                            zIndex:'0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
                        }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

export default ProductImages;
