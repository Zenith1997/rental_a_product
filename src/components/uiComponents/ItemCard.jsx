import PropTypes from 'prop-types';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/product/${item.id}`, { state: { item } });
    };
    // //console.log("Items",item)
    return (
        <div className="relative z-0 h-full cursor-pointer group" onClick={handleCardClick}>
            <div className="relative mx-4 mt-4 overflow-hidden rounded-xl h-[280px]">
                {item?.images && (
                    <img
                        src={item?.images[0] || "https://placehold.co/600x400"}
                        alt={item.brand_name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
            </div>
            
            <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                        <h3 className="text-sm font-medium text-gray-700">{item.year_manufacture}</h3>
                        <h3 className="text-sm font-medium text-gray-700">{item.brand_name}</h3>
                    </div>
                    <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                        <StarIcon sx={{ color: '#FFDF00', fontSize: '1.1rem' }} />
                        <span className="ml-1.5 text-sm font-medium text-gray-700">
                            {item.avgRating ? Number(item.avgRating).toFixed(1) : 'N/A'}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-baseline">
                    <p className="text-xl font-semibold text-[#344966]">
                        ${item.price}
                    </p>
                    <span className="ml-1.5 text-sm text-gray-500">/day</span>
                </div>
            </div>
        </div>
    );
};

ItemCard.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        brand_name: PropTypes.string,
        year_manufacture: PropTypes.number,
        price: PropTypes.number,
        avgRating: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
    })
};

export default ItemCard;