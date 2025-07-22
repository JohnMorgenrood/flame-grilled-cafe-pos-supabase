import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/supabase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  FaShoppingBag, 
  FaUser, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaBell,
  FaMotorcycle,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const ordersQuery = query(
      collection(db, 'orders'),
      where('customerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      toast.error("Could not fetch your orders.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'preparing':
        return { label: 'Preparing', icon: FaClock, color: 'text-orange-500' };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', icon: FaMotorcycle, color: 'text-blue-500' };
      case 'delivered':
        return { label: 'Delivered', icon: FaCheckCircle, color: 'text-green-500' };
      default:
        return { label: 'Order Placed', icon: FaClock, color: 'text-yellow-500' };
    }
  };

  const formatOrderTime = (timestamp) => {
    if (!timestamp?.toDate) return 'N/A';
    return timestamp.toDate().toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  if (loading) {
    return <div className="text-center py-20">Loading your dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {userProfile?.name || 'Customer'}!</h1>
          <p className="text-gray-600">Here's your order summary and profile information.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <div className="flex items-center space-x-4 mb-6">
                <img src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.name}&background=random`} alt="Profile" className="w-16 h-16 rounded-full" />
                <div>
                  <h2 className="font-bold text-lg">{userProfile?.name}</h2>
                  <p className="text-sm text-gray-500">{userProfile?.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                {[
                  { id: 'orders', label: 'My Orders', icon: FaShoppingBag },
                  { id: 'profile', label: 'My Profile', icon: FaUser },
                  { id: 'addresses', label: 'My Addresses', icon: FaMapMarkerAlt },
                  { id: 'favorites', label: 'Favorites', icon: FaHeart },
                ].map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left font-medium ${activeTab === item.id ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="space-y-8">
                {/* Active Orders */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
                  {activeOrders.length > 0 ? (
                    <div className="space-y-4">
                      {activeOrders.map(order => {
                        const statusInfo = getStatusInfo(order.status);
                        return (
                          <div key={order.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold">Order #{order.id.substring(0, 6)}</h3>
                                <p className="text-sm text-gray-500">{formatOrderTime(order.createdAt)}</p>
                                <div className="mt-4 flex items-center space-x-2">
                                  <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
                                  <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">R{order.total.toFixed(2)}</p>
                                <button onClick={() => navigate(`/track/${order.id}`)} className="mt-2 text-sm text-red-600 font-semibold">Track Order</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">You have no active orders.</p>
                  )}
                </div>

                {/* Past Orders */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Past Orders</h2>
                  {pastOrders.length > 0 ? (
                    <div className="space-y-4">
                      {pastOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-lg shadow p-6 opacity-70">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold">Order #{order.id.substring(0, 6)}</h3>
                              <p className="text-sm text-gray-500">{formatOrderTime(order.createdAt)}</p>
                              <div className="mt-4 flex items-center space-x-2 text-green-600">
                                <FaCheckCircle />
                                <span>Delivered</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">R{order.total.toFixed(2)}</p>
                              <button className="mt-2 text-sm text-red-600 font-semibold">Reorder</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">You have no past orders.</p>
                  )}
                </div>
              </div>
            )}
            {/* Placeholder for other tabs */}
            {activeTab === 'profile' && <div className="bg-white rounded-lg shadow p-6"><h2 className="text-2xl font-bold">My Profile</h2><p>Profile editing coming soon.</p></div>}
            {activeTab === 'addresses' && <div className="bg-white rounded-lg shadow p-6"><h2 className="text-2xl font-bold">My Addresses</h2><p>Address management coming soon.</p></div>}
            {activeTab === 'favorites' && <div className="bg-white rounded-lg shadow p-6"><h2 className="text-2xl font-bold">Favorites</h2><p>Favorite items coming soon.</p></div>}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
