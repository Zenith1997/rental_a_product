import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import { Button, Typography } from '@mui/material';
import ItemCard from '../../components/uiComponents/ItemCard';
import { useNavigate } from 'react-router-dom';
import { RiseLoader } from 'react-spinners';
import SearchBar from '../../components/Header/SearchBar';

function AllProducts({ allProducts, loading }) {
    const navigate = useNavigate();
    const itemsPerPage = 8;

    const handleExploreMore = () => {
        navigate('/all-products');
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <RiseLoader color="#fd3c3c" />
            </div>
        );
    }

    if (!allProducts?.length) {
        return (
            <div className="flex-col justify-center w-full items-center bg-[#FAE6E64D] mt-10">
                <div className="flex flex-col justify-center items-center w-full py-5 rounded-md">
                    <Typography variant="h5" className="text-gray-700 mb-4">
                        No products found
                    </Typography>
                    <Button 
                        variant="contained"
                        color="error"
                        onClick={() => navigate('/')}
                        className="px-6 py-2"
                    >
                        Return Home
                    </Button>
                </div>
            </div>
        );
    }

    const currentProducts = allProducts.slice(0, itemsPerPage);

    return (
        <div className="w-full min-h-screen bg-gray-50">
        
            <div className="w-full py-20 flex flex-col items-center">
                <div className="w-full max-w-[1600px] px-6">
                    <div className="flex justify-between items-center mb-14">
                        <h2 className="text-3xl font-bold text-gray-900"></h2>
                    </div>

                    {currentProducts.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-600 text-lg">No products found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                                {currentProducts.map((item) => (
                                    <Grid key={item.id} item>
                                        <div className="w-full h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                                            <ItemCard item={item} />
                                        </div>
                                    </Grid>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center mb-24">
                <Button 
                    variant="contained" 
                    color="error"
                    onClick={handleExploreMore}
                    className="px-14 py-3.5 text-lg font-semibold hover:bg-red-700 transition-colors duration-300 rounded-full shadow-md hover:shadow-lg"
                >
                    Explore More
                </Button>
            </div>
        </div>
    );
}

AllProducts.propTypes = {
    allProducts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            ratings: PropTypes.number,
            image_url: PropTypes.string.isRequired
        })
    ),
    loading: PropTypes.bool
};

export default AllProducts;
