/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';

const ProfileListCard = ({ item }) => {
    console.log("item here",item)
    const navigate = useNavigate();

    const handleClickCard = () => {
        navigate(`/product/${item.id}`, { state: { item } });
    };

    return (
        <div
            onClick={handleClickCard}
            className="item-card h-[250px] border border-[#99A4B3] p-2 rounded-xl "
        >
            <img
                src={item.images[0]}
                alt={item.product_name}
                className="h-[190px] w-[214px] rounded-xl"
            />
            <h3 className="text-sm mb-1 font-medium">{item.product_name}</h3>
            <p className="text-sm font-medium">${item.price} /day</p>
        </div>
    );
};

export default ProfileListCard;
