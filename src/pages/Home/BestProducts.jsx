/* eslint-disable react/prop-types */
import ItemCard from "../../components/uiComponents/ItemCard";
import Slider from "react-slick";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RiseLoader } from 'react-spinners';

const Products = ({ products, title, loading }) => {
    // Check if products are available
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col justify-center w-full items-center bg-gray-50 ">
                <div className="flex flex-col justify-center items-center w-full py-5 rounded-2xl">
                    <h2 className="self-start mx-10 font-logoFont font-bold text-2xl">{title}</h2>
                    <p>No products available at the moment.</p>
                </div>
            </div>
        );
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <RiseLoader color="#fd3c3c" />
            </div>
        );
    }

    const NextArrow = (props) => (
        <button
            {...props}
            className="slick-arrow slick-next bg-white p-3 rounded-full shadow-lg absolute right-[-20px] top-1/2 -translate-y-1/2 z-[100] hover:bg-gray-100 transition-all duration-300 hover:shadow-xl"
            style={{ ...props.style, display: "block" }}
            aria-label="Next"
        >
            <ArrowForwardIosIcon className="text-gray-700" />
        </button>
    );
    const PrevArrow = (props) => (
        <button
            {...props}
            className="slick-arrow slick-prev bg-white p-3 rounded-full shadow-lg absolute left-[-20px] top-1/2 -translate-y-1/2 z-[100] hover:bg-gray-100 transition-all duration-300 hover:shadow-xl"
            style={{ ...props.style, display: "block" }}
            aria-label="Previous"
        >
            <ArrowBackIosNewIcon className="text-gray-700" />
        </button>
    );

    const settings = {
        dots: false,
        infinite: products.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="w-full py-16 bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 px-4">{title}</h2>
                <div className="relative">
                    <Slider {...settings}>
                        {products.map((item) => (
                            <div key={item?.id} className="px-4 py-6">
                                <div className="w-full h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                                    <ItemCard item={item} />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default Products;
