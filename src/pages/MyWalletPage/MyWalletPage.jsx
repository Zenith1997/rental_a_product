/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchBar from '../../components/Header/SearchBar';
import CreditCard from '../../components/uiComponents/CreditCard';

import { transactionData } from '../../assets/dummyData/transactionData';
import TransactionCard from '../../components/uiComponents/TransactionCard';

const MyWalletPage = () => {
    const [state, setState] = useState('all');

    // Filter transactions based on the selected state
    const filteredTransactions = transactionData.filter((transaction) => {
        if (state === 'all') return true; // Show all transactions
        return transaction.type === state; // Filter by type (income or expense)
    });

    return (

        <div className=' h-full pl-10 mb-20'>
            <h1 className='text-2xl font-medium mb-4'>My Wallet</h1>
            <div className='flex pl-10 mt-10 w-full'>
                <CreditCard />
                <div className='flex ml-24 flex-col justify-between'>
                    <div>
                        <h1 className='font-normal text-[#99A4B3] text-4xl'>Your Balance</h1>
                        <h1 className='font-medium text-[#011C40] text-6xl'>$2053.00</h1>
                    </div>
                    <button className='bg-[#FAE6E6] text-xl border border-[#F6CCCC] w-32 rounded-xl p-2 '>
                        + Add card
                    </button>
                </div>
            </div>

            <div className='mt-10'>
                <h1 className='text-2xl font-medium mb-10'>Recent Transactions</h1>
                <div className='flex gap-1 items-center mb-10'>
                    <button
                        onClick={() => setState('all')}
                        className={`px-4 py-0.5 rounded-md ${state === 'all' ? 'bg-[#F6CCCC] text-[#626060]' : 'text-[#67778C]'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setState('income')}
                        className={`px-4 py-0.5 rounded-md ${state === 'income' ? 'bg-[#F6CCCC] text-[#626060]' : 'text-[#67778C]'
                            }`}
                    >
                        Income
                    </button>
                    <button
                        onClick={() => setState('expense')}
                        className={`px-4 py-0.5 rounded-md ${state === 'expense' ? 'bg-[#F6CCCC] text-[#626060]' : 'text-[#67778C]'
                            }`}
                    >
                        Expenses
                    </button>
                </div>
                <div>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                            <TransactionCard key={transaction.id} transaction={transaction} />
                        ))
                    ) : (
                        <p className='mt-5 text-[#99A4B3]'>No transactions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyWalletPage;
