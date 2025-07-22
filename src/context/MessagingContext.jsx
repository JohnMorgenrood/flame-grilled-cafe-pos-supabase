import React, { createContext, useContext, useState } from 'react';

const MessagingContext = createContext();

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

export const MessagingProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [customerContacts, setCustomerContacts] = useState([]);

  // Add message to history
  const addMessage = (messageData) => {
    const newMessage = {
      id: Date.now().toString(),
      ...messageData,
      createdAt: new Date().toISOString(),
      status: 'sent', // sent, delivered, failed
      deliveredCount: messageData.recipients?.length || 0,
      failedCount: 0
    };
    
    setMessages(prev => [newMessage, ...prev]);
    return newMessage;
  };

  // Send bulk message (Firebase integration ready)
  const sendBulkMessage = async (messageData) => {
    try {
      // This will be replaced with Firebase Cloud Messaging
      console.log('Sending bulk message:', messageData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const message = addMessage(messageData);
      
      // In Firebase: Send to FCM, store in Firestore
      // await firebase.messaging().sendToTopic(messageData.topic, messageData);
      // await firebase.firestore().collection('messages').add(messageData);
      
      return { success: true, messageId: message.id };
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: error.message };
    }
  };

  // Create campaign (Firebase ready)
  const createCampaign = async (campaignData) => {
    const newCampaign = {
      id: Date.now().toString(),
      ...campaignData,
      createdAt: new Date().toISOString(),
      status: 'active', // active, paused, completed
      messagesSent: 0,
      openRate: 0,
      clickRate: 0
    };
    
    setCampaigns(prev => [newCampaign, ...prev]);
    
    // Firebase: Store campaign in Firestore
    // await firebase.firestore().collection('campaigns').add(newCampaign);
    
    return newCampaign;
  };

  // Get customer contacts (from orders)
  const updateCustomerContacts = (orders) => {
    const contacts = orders.reduce((acc, order) => {
      const existing = acc.find(c => c.phone === order.customer.phone);
      if (!existing) {
        acc.push({
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email,
          lastOrder: order.createdAt,
          totalOrders: 1,
          totalSpent: order.total,
          customerSince: order.createdAt
        });
      } else {
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        if (new Date(order.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = order.createdAt;
        }
      }
      return acc;
    }, []);
    
    setCustomerContacts(contacts);
    return contacts;
  };

  const value = {
    messages,
    campaigns,
    customerContacts,
    sendBulkMessage,
    createCampaign,
    updateCustomerContacts,
    addMessage
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};
