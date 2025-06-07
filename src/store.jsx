import createStore from 'react-auth-kit/createStore';
import { create } from 'zustand'
const store = createStore({
    authName:'_auth',
    authType:'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:',
  });


const useFilterStore = create((set)=>({
  category:'',
  location: '',
  delivery_type:'',
  ava_from:'',
  ava_to:'',
  priceMin:'',
  priceMax:'',
  floading: false,
  filterOn:false,
  setLoading: (isLoading) => set(() => ({ isLoading })),  
  setFilteredProducts: (products) => set({ filteredProducts: products }),
  setFilter:(key,value)=>
    
    set((state)=>({
      ...state,[key]:value
    })),

resetFilters:()=>{
  set({
    page:'',
    limit:'',
    category:'',
    flocation: '',
    product_name:'',  
    delivery_type:'',
    ava_from:'',
    ava_to:'',
    priceMin:'',
    priceMax:'',
  })
}

}));



export {store,useFilterStore}