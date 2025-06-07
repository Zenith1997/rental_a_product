import React, { useState } from 'react';
import { Slider } from '@mui/material';
import { useFilterStore } from '../../store';

const RangeSliderExample = () => {
  const [value, setValue] = useState([620, 1037]);
  const {setFilter} = useFilterStore()

  const handleChange = (event, newValue) => {
    setValue(newValue); // newValue is an array [min, max]
    setFilter('priceMin',value[0])
    setFilter('priceMax',value[1])
  };

  const getAriaValueText = (value) => `${value}°C`;

  const marks = [
    { value: 100, label: '100$' },
    { value: 500, label: '500$' },
    { value: 1000, label: '1000$' },
    { value: 1500, label: '1500$' },
  ];

  return (
    <div className='px-8'>
      <Slider 
        color="warning"
        getAriaLabel={() => 'Temperature'}
        track="inverted"
        getAriaValueText={getAriaValueText}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        marks={marks}
        min={100}
        max={1500}
      />
      
    </div>
  );
};

export default RangeSliderExample;
