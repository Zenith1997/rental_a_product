// eslint-disable-next-line no-unused-vars
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    // Legend,
} from "recharts";
import PropTypes from 'prop-types';

const Chart = ({ data, type, orderData }) => {
    // Transform the incoming data into recharts format
    let chartData = [];
    let barKey = 'value';
    let barLabel = '';

    if (orderData) {
        // Map order data to chart format
        chartData = orderData.map(order => ({
            name: order.product.product_name,
            value: order.amount,
            status: order.status.status_name
        }));
        barKey = 'value';
        barLabel = 'Amount';
    } else if (type === 'followers' || type === 'visitors') {
        // data is an object: { '2025-05': 0, ... }
        chartData = Object.entries(data || {}).map(([month, value]) => ({
            name: month,
            value: value
        }));
        barKey = 'value';
        barLabel = type === 'followers' ? 'Followers' : 'Visitors';
    } else if (type === 'earnings') {
        // data is an object: { '2025-05': { count: 47, products: [...] }, ... }
        chartData = Object.entries(data || {}).map(([month, obj]) => ({
            name: month,
            value: obj.count || 0
        }));
        barKey = 'value';
        barLabel = 'Sales';
    }

    return (
        <div className="p-4 bg-[#FAE6E626] rounded-lg my-5 shadow-md max-w-md ">
            <h3 className="text-left text-red-500 font-medium mb-4 ml-2">
                Monthly Stats
            </h3>
            <BarChart
                width={400}
                height={250}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="40%"
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F6CCCC" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#E88081" }} />
                <YAxis tick={{ fontSize: 12, fill: "#E88081" }} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#fff0f0", borderRadius: "8px" }}
                />
                {/* <Legend verticalAlign="top" height={36} /> */}
                <Bar
                    dataKey={barKey}
                    fill="#E88081"
                    radius={[8, 8, 0, 0]}
                    barSize={14}
                    name={barLabel}
                />
            </BarChart>
        </div>
    );
};

Chart.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    type: PropTypes.string,
    orderData: PropTypes.array
};

export default Chart;
