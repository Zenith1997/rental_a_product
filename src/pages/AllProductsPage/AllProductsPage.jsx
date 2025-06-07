import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/Header/SearchBar';
import ItemCard from '../../components/uiComponents/ItemCard';
import { CircularProgress, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import useSWR from 'swr';
import apiRoutes from '../../lib/apiRoutes';
import useFetcher from '../../lib/fetcher';
import { useFilterStore } from '../../store';
import InfiniteScroll from 'react-infinite-scroll-component';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RiseLoader } from 'react-spinners';

const AllProductsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [items, setItems] = useState([]);
    const { filterOn, filteredProducts } = useFilterStore();

    const fetcher = useFetcher();
    const { data: allProducts, error, isLoading } = useSWR(
        apiRoutes.getAllProducts({ page, limit }),
        fetcher
    );

    useEffect(() => {
        if (allProducts?.data) {
            if (page === 1) {
                setItems(allProducts.data);
            } else {
                setItems(prevItems => [...prevItems, ...allProducts.data]);
            }
        }
    }, [allProducts?.data, page]);

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        setPage(1);
        setItems([]);
    };

    const fetchMoreData = () => {
        if (allProducts?.totalPages > page) {
            setPage(prevPage => prevPage + 1);
        }
    };

    if (isLoading && page === 1) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-xl mb-4">Error loading products</h2>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Return Home
                </button>
            </div>
        );
    }

    const products = filterOn ? filteredProducts : items;
    const hasMore = !filterOn && allProducts?.totalPages > page;

    return (
        <div className="w-full min-h-screen bg-gray-50">
                  
            <div className="sticky top-0 mt-9    z-10 bg-white shadow-sm">
                <div className="flex items-center px-4 py-5 border-b border-gray-100">
                    <IconButton 
                        onClick={() => navigate(-1)}
                        className="mr-2 hover:bg-gray-100"
                        size="small"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <SearchBar/>
                    {/* <SearchBar /> */}
                </div>
            </div>
            
            <div className="w-full py-8 flex flex-col items-center">
                <div className="w-full max-w-7xl px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-logoFont font-bold text-gray-800">All Products</h1>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel id="items-per-page-label">Items per page</InputLabel>
                            <Select
                                labelId="items-per-page-label"
                                value={limit}
                                label="Items per page"
                                onChange={handleLimitChange}
                                size="small"
                            >
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                                <MenuItem value={16}>16</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-600 text-lg">No products found.</p>
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={products.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            loader={
                                <div className="flex justify-center my-8">
                                    <CircularProgress />
                                </div>
                            }
                            endMessage={
                                <div className="text-center py-6 text-gray-600">
                                    {products.length > 0 &&      <RiseLoader color="#fd3c3c" />}
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {products.map((item) => (
                                    <ItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProductsPage; 