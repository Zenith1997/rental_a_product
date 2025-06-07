import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRange } from 'react-date-range';
import { useState } from 'react';
import './DatePicker.css'; 
import { useFilterStore } from '../../store';

const DatePicker = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  const {ava_from, ava_to, setFilter} = useFilterStore();
  
  const [state, setState] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ]);

  const handleChange = (item) => {
    const {startDate, endDate} = item.selection;
    setState([item.selection]);
    setFilter('ava_from', formatDate(startDate));
    setFilter('ava_to', formatDate(endDate));
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between p-4 border border-gray-300 rounded-lg  hover:border-orange-400 transition-colors duration-200"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <div className="text-base text-gray-400">
          {ava_from && ava_to ? (
            `${formatDisplayDate(ava_from)} - ${formatDisplayDate(ava_to)}`
          ) : (
            'Select date range'
          )}
        </div>
        <svg 
          className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${showCalendar ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {showCalendar && (
        <div className="absolute z-10 mt-2">
          <div className="rdrCalendarWrapper rounded-lg border-2 border-red-500 overflow-hidden bg-white shadow-lg">
            <DateRange
              editableDateInputs={true}
              onChange={handleChange}
              moveRangeOnFirstSelection={false}
              ranges={state}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
