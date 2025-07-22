
import { db } from '../config/supabase';

class PaymentService {
  constructor() {
    this.settings = null;
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const settingsDoc = await getDoc(doc(db, 'admin', 'settings'));
      if (settingsDoc.exists()) {
        this.settings = settingsDoc.data();
      } else {
        // Initialize with empty settings if document doesn't exist
        this.settings = {};
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      // Initialize with empty settings on error
      this.settings = {};
    }
  }

  // PayFast Integration
  async processPayFastPayment(orderData, amount) {
    if (!this.settings?.payfast) {
      throw new Error('PayFast not configured');
    }

    const { merchantId, merchantKey, passphrase, sandbox } = this.settings.payfast;
    const baseUrl = sandbox ? 'https://sandbox.payfast.co.za' : 'https://www.payfast.co.za';

    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`,
      notify_url: `${window.location.origin}/api/payfast/notify`,
      amount: amount.toFixed(2),
      item_name: `Order #${orderData.id}`,
      item_description: `Food order from Flame Grilled Cafe`,
      email_address: orderData.customer.email,
      cell_number: orderData.customer.phone || '',
      m_payment_id: orderData.id,
      custom_str1: JSON.stringify(orderData),
    };

    // Generate signature
    const signature = this.generatePayFastSignature(paymentData, passphrase);
    paymentData.signature = signature;

    // Create form and submit
    this.submitPayFastForm(baseUrl + '/eng/process', paymentData);
  }

  generatePayFastSignature(data, passphrase) {
    // Sort parameters
    const sortedParams = Object.keys(data)
      .filter(key => data[key] !== '')
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');

    const stringToSign = passphrase ? `${sortedParams}&passphrase=${passphrase}` : sortedParams;
    
    // In real implementation, use crypto library for MD5 hash
    // For now, return a placeholder
    return 'generated_signature_hash';
  }

  submitPayFastForm(url, data) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;

    Object.keys(data).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  // PayPal Integration
  async processPayPalPayment(orderData, amount) {
    if (!this.settings?.paypal) {
      throw new Error('PayPal not configured');
    }

    const { clientId, sandbox } = this.settings.paypal;
    
    // Load PayPal SDK if not already loaded
    if (!window.paypal) {
      await this.loadPayPalSDK(clientId, sandbox);
    }

    return new Promise((resolve, reject) => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2),
                currency_code: 'ZAR'
              },
              description: `Order #${orderData.id} - Flame Grilled Cafe`
            }]
          });
        },
        onApprove: async (data, actions) => {
          try {
            const order = await actions.order.capture();
            resolve({
              success: true,
              transactionId: order.id,
              paymentMethod: 'paypal',
              details: order
            });
          } catch (error) {
            reject(error);
          }
        },
        onError: (err) => {
          reject(err);
        },
        onCancel: () => {
          reject(new Error('Payment cancelled by user'));
        }
      }).render('#paypal-button-container');
    });
  }

  async loadPayPalSDK(clientId, sandbox) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="paypal"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=ZAR${sandbox ? '&intent=capture' : ''}`;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Stripe Integration
  async processStripePayment(orderData, amount) {
    if (!this.settings?.stripe) {
      throw new Error('Stripe not configured');
    }

    const { publishableKey } = this.settings.stripe;

    // Load Stripe SDK if not already loaded
    if (!window.Stripe) {
      await this.loadStripeSDK();
    }

    const stripe = window.Stripe(publishableKey);

    // Create payment intent on backend (you'll need to implement this endpoint)
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'zar',
        orderId: orderData.id
      })
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: {
          // Card element will be created in component
        },
        billing_details: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
        },
      }
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      success: true,
      transactionId: result.paymentIntent.id,
      paymentMethod: 'stripe',
      details: result.paymentIntent
    };
  }

  async loadStripeSDK() {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="stripe"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Yoco Integration
  async processYocoPayment(orderData, amount) {
    if (!this.settings?.yoco) {
      throw new Error('Yoco not configured');
    }

    const { publicKey } = this.settings.yoco;

    // Load Yoco SDK
    if (!window.Yoco) {
      await this.loadYocoSDK();
    }

    const yoco = new window.Yoco.YocoSDK({
      publicKey: publicKey
    });

    return new Promise((resolve, reject) => {
      yoco.showPopup({
        amountInCents: Math.round(amount * 100),
        currency: 'ZAR',
        name: 'Flame Grilled Cafe',
        description: `Order #${orderData.id}`,
        callback: function(result) {
          if (result.error) {
            reject(new Error(result.error.message));
          } else {
            resolve({
              success: true,
              transactionId: result.id,
              paymentMethod: 'yoco',
              details: result
            });
          }
        }
      });
    });
  }

  async loadYocoSDK() {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="yoco"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Google Pay Integration
  async processGooglePay(orderData, amount) {
    if (!window.google?.payments?.api) {
      await this.loadGooglePaySDK();
    }

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST' // Change to 'PRODUCTION' for live
    });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId'
          }
        }
      }],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: amount.toFixed(2),
        currencyCode: 'ZAR'
      },
      merchantInfo: {
        merchantName: 'Flame Grilled Cafe'
      }
    };

    try {
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      return {
        success: true,
        transactionId: `gp_${Date.now()}`,
        paymentMethod: 'googlepay',
        details: paymentData
      };
    } catch (error) {
      throw new Error('Google Pay payment failed');
    }
  }

  async loadGooglePaySDK() {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="pay.google.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Get available payment methods
  getAvailablePaymentMethods() {
    const methods = [];

    // Ensure settings is initialized
    if (!this.settings) {
      this.settings = {};
    }

    if (this.settings?.payfast?.merchantId) {
      methods.push({
        id: 'payfast',
        name: 'PayFast',
        description: 'Pay with your bank card via PayFast',
        icon: '💳',
        local: true
      });
    }

    if (this.settings?.paypal?.clientId) {
      methods.push({
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with PayPal',
        icon: '🅿️',
        local: false
      });
    }

    if (this.settings?.stripe?.publishableKey) {
      methods.push({
        id: 'stripe',
        name: 'Credit Card',
        description: 'Pay with Visa, Mastercard, etc.',
        icon: '💳',
        local: false
      });
    }

    if (this.settings?.yoco?.publicKey) {
      methods.push({
        id: 'yoco',
        name: 'Yoco',
        description: 'Pay with Yoco',
        icon: '💳',
        local: true
      });
    }

    // Always show these as they don't require backend config
    methods.push(
      {
        id: 'googlepay',
        name: 'Google Pay',
        description: 'Pay with Google Pay',
        icon: '🅶',
        local: false
      },
      {
        id: 'qr',
        name: 'QR Code',
        description: 'Scan QR code to pay',
        icon: '📱',
        local: true
      }
    );

    return methods;
  }

  // Process payment based on selected method
  async processPayment(method, orderData, amount) {
    await this.loadSettings(); // Ensure settings are loaded

    switch (method) {
      case 'payfast':
        return this.processPayFastPayment(orderData, amount);
      case 'paypal':
        return this.processPayPalPayment(orderData, amount);
      case 'stripe':
        return this.processStripePayment(orderData, amount);
      case 'yoco':
        return this.processYocoPayment(orderData, amount);
      case 'googlepay':
        return this.processGooglePay(orderData, amount);
      case 'qr':
        return this.processQRPayment(orderData, amount);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  async processQRPayment(orderData, amount) {
    // For QR payments, we just return success and let the admin verify manually
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `qr_${Date.now()}`,
          paymentMethod: 'qr',
          details: {
            amount,
            orderId: orderData.id,
            requiresManualVerification: true
          }
        });
      }, 2000);
    });
  }
}

export const paymentService = new PaymentService();
export default PaymentService;
