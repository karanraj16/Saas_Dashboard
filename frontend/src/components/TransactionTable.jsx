const TransactionTable = ({ transactions, handleDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{transaction.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600">${transaction.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                    transaction.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button onClick={() => handleDelete(transaction._id)} className="text-red-500 hover:text-red-700 font-bold transition">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400 font-medium">No transactions found. Add your first data!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;