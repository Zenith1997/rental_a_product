import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

jest.mock('../../components/Footer/Footer', () => () => <div>Footer</div>);
jest.mock('./BestProducts', () => () => <div>BestProducts</div>);
jest.mock('./AllProducts', () => () => <div>AllProducts</div>);
jest.mock('../../components/Header/SecondarySearchBar', () => () => <div>SecondarySearchBar</div>);

// Mock useSWR and useFilterStore to avoid data fetching and state issues
jest.mock('swr', () => () => ({ data: { data: [] }, isLoading: false }));
jest.mock('../../store', () => ({ useFilterStore: () => ({ filterOn: false, filteredProducts: null }) }));
jest.mock('../../lib/fetcher', () => () => jest.fn());


describe('HomePage', () => {
  it('renders the main banner and download section', () => {
    render(<HomePage />);
    expect(screen.getByAltText(/banner/i)).toBeInTheDocument();
    expect(screen.getByText(/Download our Mobile app/i)).toBeInTheDocument();
    expect(screen.getByText(/to make life easier/i)).toBeInTheDocument();
    expect(screen.getByText(/Footer/i)).toBeInTheDocument();
  });
}); 