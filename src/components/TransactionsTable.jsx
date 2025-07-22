import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { 
  Receipt, 
  CreditCard, 
  DollarSign, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock data fallback
  const getMockTransactions = () => [
    {
      id: 'TXN-DEMO-001',
      transactionId: 'TXN-DEMO-001',
      orderId: 'ORDER-DEMO-001',
      receiptId: 'REC-DEMO-001',
      amount: 89.00,
      paymentMethod: 'cash',
      cashier: 'demo@flamecafe.com',
      cashierName: 'Demo Cashier',
      timestamp: new Date('2025-07-19T10:30:00'),
      type: 'sale',
      status: 'completed',
      items: [
        { name: 'Dagwood Burger', quantity: 1, price: 89.00, total: 89.00 }
      ],
      customer: 'Walk-in Customer',
      subtotal: 89.00,
      tax: 7.12,
      total: 96.12
    },
    {
      id: 'TXN-DEMO-002',
      transactionId: 'TXN-DEMO-002',
      orderId: 'ORDER-DEMO-002',
      receiptId: 'REC-DEMO-002',
      amount: 65.00,
      paymentMethod: 'card',
      cashier: 'admin@flamecafe.com',
      cashierName: 'Restaurant Admin',
      timestamp: new Date('2025-07-19T09:15:00'),
      type: 'sale',
      status: 'completed',
      items: [
        { name: 'Sunrise Surprise Wrap', quantity: 1, price: 65.00, total: 65.00 }
      ],
      customer: 'Walk-in Customer',
      subtotal: 65.00,
      tax: 5.20,
      total: 70.20
    },
    {
      id: 'TXN-DEMO-003',
      transactionId: 'TXN-DEMO-003',
      orderId: 'ORDER-DEMO-003',
      receiptId: 'REC-DEMO-003',
      amount: 43.00,
      paymentMethod: 'cash',
      cashier: 'cashier@flamecafe.com',
      cashierName: 'POS Cashier',
      timestamp: new Date('2025-07-19T08:45:00'),
      type: 'sale',
      status: 'completed',
      items: [
        { name: 'Bacon & Egg Roll', quantity: 1, price: 43.00, total: 43.00 }
      ],
      customer: 'Walk-in Customer',
      subtotal: 43.00,
      tax: 3.44,
      total: 46.44
    }
  ];

  // Real-time Firebase listener
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Build query based on filters
      let q = query(
        collection(db, 'transactions'),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      // Add date filter
      if (dateFilter === 'today') {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        
        q = query(
          collection(db, 'transactions'),
          where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
          where('timestamp', '<', Timestamp.fromDate(endOfDay)),
          orderBy('timestamp', 'desc')
        );
      }

      // Set up real-time listener
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const transactionData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Convert Firestore timestamp to JavaScript Date
            const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
            
            transactionData.push({
              id: doc.id,
              docId: doc.id,
              ...data,
              timestamp: timestamp
            });
          });
          
          setTransactions(transactionData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching transactions:', err);
          setError(`Firebase Error: ${err.message}`);
          setLoading(false);
          
          // Fallback to mock data if Firebase fails
          setTransactions(getMockTransactions());
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up transactions listener:', err);
      setError(`Setup Error: ${err.message}`);
      setLoading(false);
      
      // Use mock data as fallback
      setTransactions(getMockTransactions());
    }
  }, [dateFilter]);

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (txn.transactionId || txn.id).toLowerCase().includes(searchLower) ||
        (txn.orderId || '').toLowerCase().includes(searchLower) ||
        (txn.cashierName || '').toLowerCase().includes(searchLower) ||
        (txn.customer || '').toLowerCase().includes(searchLower) ||
        (txn.items || []).some(item => 
          item.name.toLowerCase().includes(searchLower)
        );
      
      if (!matchesSearch) return false;
    }

    // Payment method filter
    if (paymentFilter !== 'all' && txn.paymentMethod !== paymentFilter) {
      return false;
    }

    return true;
  });

  // Calculate totals
  const totalSales = filteredTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const cashSales = filteredTransactions
    .filter(txn => txn.paymentMethod === 'cash')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const cardSales = filteredTransactions
    .filter(txn => txn.paymentMethod === 'card')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);

  // Export transactions
  const exportTransactions = () => {
    const csvContent = [
      ['Transaction ID', 'Order ID', 'Amount', 'Payment Method', 'Cashier', 'Customer', 'Date', 'Time', 'Items'].join(','),
      ...filteredTransactions.map(txn => [
        txn.transactionId || txn.id,
        txn.orderId || '',
        `R${(txn.amount || 0).toFixed(2)}`,
        txn.paymentMethod || '',
        txn.cashierName || '',
        txn.customer || '',
        txn.timestamp ? txn.timestamp.toLocaleDateString() : '',
        txn.timestamp ? txn.timestamp.toLocaleTimeString() : '',
        (txn.items || []).map(item => `${item.quantity}x ${item.name}`).join('; ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Print receipt
  const printReceipt = (transaction) => {
    const receiptWindow = window.open('', '_blank', 'width=300,height=600');
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${transaction.receiptId || transaction.id}</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; margin: 10px; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .receipt-info { margin: 10px 0; }
            .items { border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin: 2px 0; }
            .totals { margin-top: 10px; }
            .total-line { display: flex; justify-content: space-between; margin: 2px 0; }
            .final-total { border-top: 1px solid #000; padding-top: 5px; font-weight: bold; }
            .footer { text-align: center; margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>🔥 FLAME GRILLED CAFE</h2>
            <p>123 Main Street, Cape Town<br>Tel: (021) 123-4567</p>
          </div>
          
          <div class="receipt-info">
            <p><strong>Receipt #:</strong> ${transaction.receiptId || transaction.id}</p>
            <p><strong>Order #:</strong> ${transaction.orderId || 'N/A'}</p>
            <p><strong>Date:</strong> ${transaction.timestamp ? transaction.timestamp.toLocaleString() : 'N/A'}</p>
            <p><strong>Cashier:</strong> ${transaction.cashierName || 'N/A'}</p>
            <p><strong>Customer:</strong> ${transaction.customer || 'N/A'}</p>
          </div>
          
          <div class="items">
            <h3>ITEMS ORDERED:</h3>
            ${(transaction.items || []).map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
                <span>R${(item.total || item.price * item.quantity || 0).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="totals">
            <div class="total-line">
              <span>Subtotal:</span>
              <span>R${(transaction.subtotal || transaction.amount || 0).toFixed(2)}</span>
            </div>
            <div class="total-line">
              <span>Tax (8%):</span>
              <span>R${(transaction.tax || 0).toFixed(2)}</span>
            </div>
            <div class="total-line final-total">
              <span>TOTAL:</span>
              <span>R${(transaction.total || transaction.amount || 0).toFixed(2)}</span>
            </div>
            <div class="total-line">
              <span>Payment:</span>
              <span>${(transaction.paymentMethod || 'N/A').toUpperCase()}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Visit us again soon!</p>
            <p>VAT Reg: 4123456789</p>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading transactions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          {error && (
            <div className="flex items-center space-x-2 mt-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-600">Using demo data - {error}</span>
            </div>
          )}
        </div>
        <button
          onClick={exportTransactions}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">R{totalSales.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{filteredTransactions.length} transactions</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cash Sales</p>
              <p className="text-2xl font-bold text-gray-900">R{cashSales.toFixed(2)}</p>
              <p className="text-xs text-gray-500">
                {filteredTransactions.filter(t => t.paymentMethod === 'cash').length} cash payments
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Card Sales</p>
              <p className="text-2xl font-bold text-gray-900">R{cardSales.toFixed(2)}</p>
              <p className="text-xs text-gray-500">
                {filteredTransactions.filter(t => t.paymentMethod === 'card').length} card payments
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash Only</option>
              <option value="card">Card Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setPaymentFilter('all');
                setDateFilter('today');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cashier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.transactionId || transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{transaction.timestamp ? transaction.timestamp.toLocaleDateString() : 'N/A'}</div>
                      <div className="text-xs text-gray-400">
                        {transaction.timestamp ? transaction.timestamp.toLocaleTimeString() : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-gray-900">
                      R{(transaction.amount || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.paymentMethod === 'cash' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.paymentMethod === 'cash' ? (
                        <DollarSign className="w-3 h-3 mr-1" />
                      ) : (
                        <CreditCard className="w-3 h-3 mr-1" />
                      )}
                      {(transaction.paymentMethod || 'N/A').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.cashierName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs">
                      {(transaction.items || []).map((item, index) => (
                        <div key={index} className="text-xs">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => printReceipt(transaction)}
                        className="text-green-600 hover:text-green-900"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {error ? 'Firebase connection failed. Demo data loaded.' : 'Try adjusting your filters or search terms.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
