import bannerImage from "../../assets/images/bannerOneImg.png";
import bannerTwoImage from "../../assets/images/bannerTwoImg.png";
import MobileImgSvg from "../../assets/svgFiles/MobileImgSvg";
import GoogleDownloadImg from "../../assets/svgFiles/GoogleDownloadImg";
import IosDownloadImd from "../../assets/svgFiles/IosDownloadImd";
import useSWR from "swr";
import apiRoutes from "../../lib/apiRoutes";
import useFetcher from "../../lib/fetcher";
import Products from "./BestProducts";
import { useEffect } from "react";
import AllProducts from "./AllProducts";
import { useFilterStore } from "../../store";
import { RiseLoader } from "react-spinners";
import Footer from "../../components/Footer/Footer";
import SecondarySearchBar from "../../components/Header/SecondarySearchBar";
import SearchBar from "../../components/Header/SearchBar";

const HomePage = () => {
  const { filterOn, filteredProducts } = useFilterStore();
  const fetcher = useFetcher();
  const {
    data: products,
    isLoading: newArrivalsLoading,
  } = useSWR(apiRoutes.getNewArrivals({ page: 1, limit: 10 }), fetcher);
  const { data: bestPros, isLoading: bestProsLoading } = useSWR(apiRoutes.getBestProducts(), fetcher);
  const { data: allProducts, isLoading: allProductsLoading } = useSWR(apiRoutes.getAllProducts(), fetcher);

  // Check if any of the data is still loading
  const isLoading = newArrivalsLoading || bestProsLoading || allProductsLoading;

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        // Handle loading state if needed
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const newArrivals = products?.data
    ?.toSorted((a, b) => b.id - a.id)
    .slice(0, 8);
  const allproducts = allProducts?.data
    ?.toSorted((a, b) => b.id - a.id)
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RiseLoader color="#fd3c3c" />
      </div>
    );
  }

  if (filteredProducts) {
    return (
      <div className="flex flex-col items-center w-full mt-8">
        <div className="w-full max-w-7xl px-4">
          <h1 className="text-3xl font-logoFont font-bold mb-6">Search Results</h1>
          {filteredProducts.length > 0 ? (
            <AllProducts allProducts={filteredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No results found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (filterOn) {
    return (
      <div className="flex flex-col items-center w-full mt-8">
        <div className="w-full max-w-7xl px-4">
          <h1 className="text-3xl font-logoFont font-bold mb-6">Filter Results</h1>
          {filteredProducts && filteredProducts.length > 0 ? (
            <AllProducts allProducts={filteredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No matching items found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col">
      <div className="flex flex-col justify-center w-full align-start">
      
        <div className=" w-full">
          <img src={bannerImage} alt="banner" className="w-full " />
        </div>
      </div>
      <div className=" flex w-full justify-center ">
            <SecondarySearchBar/>
            
        </div>
      <Products products={newArrivals} loading={newArrivalsLoading} title="New Arrivals" />
      <Products products={bestPros?.topOrdered} loading={bestProsLoading} title="Best Rentals" />
      <div>
        <h1 className="text-3xl font-logoFont font-bold mb-6">All Products</h1>
        <AllProducts allProducts={allproducts} loading={allProductsLoading} />
      </div>
      <img src={bannerTwoImage} alt="banner" className="w-full top-0" />

      <div className="flex items-center justify-around w-full">
        <MobileImgSvg />
        <div className="w-1/2">
          <h1 className="text-[58px] font-logoFont">Download our Mobile app</h1>
          <h1 className="text-[58px] font-logoFont mb-20">
            to make life easier
          </h1>
          <div className="flex">
            <div className="mr-20">
              <GoogleDownloadImg />
            </div>
            <div>
              <IosDownloadImd />
            </div>
          </div>
        </div>
      </div>
      <Footer  />
    </div>
  );
};

export default HomePage;
