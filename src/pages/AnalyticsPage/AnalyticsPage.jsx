/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ProfileVisitorsIcon from '../../assets/svgFiles/ProfileVisitorsIcon';
import CoinBagIcon from '../../assets/svgFiles/CoinBagIcon';
import EarningsTable from './EarningsTable';
import Chart from './Chart';
import useAxiosAuth from '../../lib/auth';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import SearchBar from '../../components/Header/SearchBar';

const AnalyticsPage = () => {
    const [state, setState] = useState('followers');
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosAuth = useAxiosAuth();
    const auth = useAuthUser();
    const userId = auth?.id;

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        axiosAuth.get(`${import.meta.env.VITE_BASE_URL}/api/user/get_dashboard`)
        .then(res => {
            const data = res.data;
            setDashboard({
                totalFollows: data.totalFollows,
                totalProfileVisitors: data.totalProfileVisitors,
                totalEarnings: data.totalEarnings,
                totalSalesCount: data.totalSalesCount,
                avgSaleAmount: data.avgSaleAmount,
                followsByMonth: data.followsByMonth,
                visitorsByMonth: data.visitorsByMonth,
                productsSoldByMonth: data.productsSoldByMonth,
                top10productsAllTime: data.top10productsAllTime,
            });
            setLoading(false);
        })
        .catch(err => {
            setError('Failed to load dashboard');
            setLoading(false);
        });
    }, [userId]);

    return (
        <div className=' h-full mt-10  mb-20'>
             <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
          <SearchBar/>
       </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : dashboard ? (
                <>
                    <div className='flex gap-10 items-center'>
                        <div className='flex flex-col h-32  p-8 px-10 min-w-40 border items-center justify-center border-[#B3BBC6] bg-[#F6F6F6] rounded-2xl'>
                            <GroupsOutlinedIcon sx={{ color: '#67778C', fontSize: '40px' }} />
                            <h1 className=' text-[#1A3353] text-xl font-medium '>{dashboard.totalFollows}</h1>
                            <h5 className=' text-[#808EA0] text-sm font-medium '>Followers</h5>
                        </div>
                        <div className='flex flex-col h-32  pt-5 p-8 px-10 min-w-40 border items-center justify-center border-[#B3BBC6] bg-[#F0F3FF] rounded-2xl'>
                            <ProfileVisitorsIcon />
                            <h1 className=' text-[#1A3353] text-xl font-medium '>{dashboard.totalProfileVisitors}</h1>
                            <h5 className=' text-[#808EA0] text-sm font-medium '>Profile Visitors</h5>
                        </div>
                        <div className='flex flex-col h-32  pt-5 p-8 px-10 min-w-40 border items-center justify-center border-[#B3BBC6]  rounded-2xl'>
                            <CoinBagIcon />
                            <h1 className=' text-[#1A3353] text-xl font-medium '>${dashboard.totalEarnings}</h1>
                            <h5 className=' text-[#808EA0] text-sm font-medium '>Total Earnings</h5>
                        </div>
                        <div className='flex flex-col h-32  p-8 px-10  xl:min-w-80 border gap-1 justify-center shadow-lg border-[#E6E8EC]  rounded-2xl'>
                            <div className='flex gap-7'>
                                <CoinBagIcon />
                                <h1 className='text-[#011C40] text-lg '>Sales overview</h1>
                            </div>
                            <div className='flex gap-5'>
                                <div>
                                    <h1 className='text-[#99A4B3]  '>Total Rentals</h1>
                                    <h1 className='text-[#011C40] text-lg font-semibold '>{dashboard.totalSalesCount}</h1>
                                </div>
                                <div>
                                    <h1 className='text-[#99A4B3]  '>Avg Amounts</h1>
                                    <h1 className='text-[#011C40] text-lg font-semibold '>${dashboard.avgSaleAmount}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-10'>
                        <div className='flex items-end border-b border-b[#B1A8A852] px-2 w-fit  gap-20'>
                            <button onClick={() => setState('followers')} className={`text-[#99A4B3] pb-2 px-3 text-center  ${state === 'followers' ? "border-b-4 border-b-[#344966]" : ""}`}>Followers</button>
                            <button onClick={() => setState('visitors')} className={`text-[#99A4B3] pb-2 px-3 text-center  ${state === 'visitors' ? "border-b-4 border-b-[#344966]" : ""}`}>Visitors</button>
                            <button onClick={() => setState('earnings')} className={`text-[#99A4B3] pb-2 px-3 text-center  ${state === 'earnings' ? "border-b-4 border-b-[#344966]" : ""}`}>Earnings</button>
                        </div>
                        <div>
                            {state === 'earnings' && <EarningsTable earnings={dashboard.productsSoldByMonth} />}
                        </div>
                        <div>
                            {state === 'followers' && <Chart data={dashboard.followsByMonth} type="followers" />}
                            {state === 'visitors' && <Chart data={dashboard.visitorsByMonth} type="visitors" />}
                            {state === 'earnings' && <Chart data={dashboard.productsSoldByMonth} type="earnings" />}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default AnalyticsPage