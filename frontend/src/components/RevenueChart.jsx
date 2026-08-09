import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ transactions, chartType, setChartType }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={transactions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="user" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
          <YAxis width={80} axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `$${value}`} />
          <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
          <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      );
    } else if (chartType === 'line') {
      return (
        <LineChart data={transactions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="user" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
          <YAxis width={80} axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `$${value}`} />
          <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
          <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} dot={{ r: 6, fill: '#10B981' }} activeDot={{ r: 8 }} />
        </LineChart>
      );
    } else if (chartType === 'pie') {
      return (
        <PieChart>
          <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
          <Pie data={transactions} dataKey="amount" nameKey="user" cx="50%" cy="50%" outerRadius={100} label>
            {transactions.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-xl border border-gray-100 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-700">Revenue Analytics</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setChartType('bar')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${chartType === 'bar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Bar</button>
          <button onClick={() => setChartType('line')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${chartType === 'line' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Line</button>
          <button onClick={() => setChartType('pie')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${chartType === 'pie' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Pie</button>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;