const baseURL = import.meta.env.VITE_BASE_URL;

//console.log(baseURL);

const apiRoutes = {
  getHomeItems: (
    page = 1,
    limit = 10,
    product_name,
    category,
    ava_from,
    ava_to,
    flocation,
    priceMin,
    priceMax,
    delivery_type
  ) => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
    if (product_name) params.append("product_name", product_name);
    if (category) params.append("category", category);
    if (ava_from) params.append("ava_from", ava_from);
    if (ava_to) params.append("ava_to", ava_to);
    if (flocation) params.append("location", flocation);
    if (priceMin) params.append("priceMin", priceMin);
    if (priceMax) params.append("priceMax", priceMax);
    if (delivery_type) params.append("delivery_type", delivery_type);

    return `${baseURL}/api/products/get_home_items?${params.toString()}`;
  },
  getNewArrivals: (page = 1, limit = 10) =>
    `${baseURL}/api/products/get_new_arrivals?${page}&${limit}`,

  getProductById: (id) => `${baseURL}/api/products/get_pro_by_id/${id}`,
  getUserReviews: (id) => `${baseURL}/api/user/get_user_reviews_seller?sellerId=${id}`,
  getProductNameList: (page = 1, limit = 10) =>
    `${baseURL}/api/products/get_product_names?${page}&${limit}`,
  getBestProducts: () => `${baseURL}/api/products/get_home_index`,
  getWishList: (page = 1, limit = 10) =>
    `${baseURL}/api/products/get_wishlist_products?${page}&${limit}`,
  getAllProducts: ({ page, limit } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    return `${baseURL}/api/products/get_all_product?${params.toString()}`;
  },
  getAllNotifications: ({ page, limit } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    return `${baseURL}/api/user/notifications?${params.toString()}`;
  },
    getOrderHistory: (id) => `${baseURL}/api/orders/orders_history/${id}`,
  getUserProfile: () => `${baseURL}/api/auth/get_user_profile`,
  getSellerProfile: (userId, sellerId, page = 1, limit = 10) =>
    `${baseURL}/api/auth/get_seller_profile?userId=${userId}&sellerId=${sellerId}&page=${page}&limit=${limit}`,
  getCategoryList: (page = 1, limit = 10) =>
    `${baseURL}/api/products/load_category?${page}&${limit}`,
  // add more endpoints here
  signUpUser: () => `${baseURL}/api/auth/signup`,
};

export default apiRoutes;
