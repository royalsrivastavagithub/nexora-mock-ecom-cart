const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Helper to manage cookies for guest sessions
const cookieJar = {};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Resolve only if status is in this range
  },
});

// Interceptor to send cookies with requests
axiosInstance.interceptors.request.use(config => {
  const cookies = Object.values(cookieJar).join('; ');
  if (cookies) {
    config.headers.Cookie = cookies;
  }
  return config;
});

// Interceptor to save cookies from responses
axiosInstance.interceptors.response.use(response => {
  const setCookie = response.headers['set-cookie'];
  if (setCookie) {
    setCookie.forEach(cookie => {
      const [name, value] = cookie.split(';')[0].split('=');
      cookieJar[name] = `${name}=${value}`;
    });
  }
  return response;
});

async function runManualTests() {
  let userToken = '';
  let productIds = []; // Array to store IDs of seeded products
  let guestCartItemId = '';
  let userCartItemId = '';
  const uniqueId = Date.now(); // Simple unique identifier for test data

  console.log('\n--- Starting Comprehensive Manual API Tests ---');

  // --- Helper function for logging ---
  const logStep = (step, message) => console.log(`\n${step}. ${message}`);
  const logResult = (message) => console.log(`   ${message}`);
  const logError = (message, error) => console.error(`   ERROR: ${message}`, error.response ? error.response.data : error.message);

  // --- 1. Seed 10 Stationary Products ---
  try {
    logStep(1, 'Seeding 10 stationary products...');
    const productNames = [
      'Pen', 'Notebook', 'Eraser', 'Stapler', 'Highlighter',
      'Ruler', 'Sticky Notes', 'Paper Clips', 'Scissors', 'Calculator'
    ];
    for (let i = 0; i < productNames.length; i++) {
      const productRes = await axiosInstance.post('/products', {
        name: productNames[i],
        description: `A ${productNames[i].toLowerCase()} for your daily needs.`,
        price: (i + 1) * 100, // Prices like 100, 200, ..., 1000 (in cents)
        currency: 'INR',
        imageUrl: `http://example.com/images/${productNames[i].toLowerCase()}.jpg`,
        stock: 100
      });
      productIds.push(productRes.data._id);
      logResult(`Product seeded: ${productRes.data.name} (ID: ${productRes.data._id})`);
    }
  } catch (error) {
    logError('Error seeding products', error);
    logResult('(Product seeding might fail if /api/products POST is not implemented or requires auth. Proceeding...)');
  }

  // --- 2. Fetch Products to verify seeding ---
  try {
    logStep(2, 'Fetching products to verify seeding...');
    const productsRes = await axiosInstance.get('/products');
    logResult(`Fetched ${productsRes.data.length} products. First product: ${productsRes.data[0].name}, Price: ${productsRes.data[0].price}`);
    if (productsRes.data.length < 10) {
      logError('Expected 10 products, but fetched less. Some seeding might have failed.');
      // Attempt to populate productIds from fetched products if seeding failed
      if (productIds.length === 0 && productsRes.data.length > 0) {
        productIds = productsRes.data.map(p => p._id);
        logResult(`Populated productIds from fetched products: ${productIds.length} IDs.`);
      }
    }
    if (productIds.length === 0) {
      logError('No product IDs available to proceed with cart tests. Exiting.');
      return;
    }
  } catch (error) {
    logError('Error fetching products', error);
    return;
  }

  // --- 3. Guest Cart: Add Item ---
  try {
    logStep(3, 'Guest Cart: Adding item...');
    const addGuestCartRes = await axiosInstance.post('/cart', { productId: productIds[0], qty: 1 });
    guestCartItemId = addGuestCartRes.data.items[0]._id;
    logResult(`Guest cart item added: ${addGuestCartRes.data.items[0].productId.name}, Qty: ${addGuestCartRes.data.items[0].qty}. Cart Total: ${addGuestCartRes.data.total}`);
  } catch (error) {
    logError('Error adding to guest cart', error);
    return;
  }

  // --- 4. Guest Cart: Get Cart ---
  try {
    logStep(4, 'Guest Cart: Getting cart...');
    const getGuestCartRes = await axiosInstance.get('/cart');
    logResult(`Guest cart has ${getGuestCartRes.data.items.length} item(s). Item: ${getGuestCartRes.data.items[0].productId.name}, Qty: ${getGuestCartRes.data.items[0].qty}. Cart Total: ${getGuestCartRes.data.total}`);
  } catch (error) {
    logError('Error getting guest cart', error);
    return;
  }

  // --- 5. Register User ---
  const registerUsername = `manualtester${uniqueId}`;
  const registerEmail = `manual${uniqueId}@example.com`;
  try {
    logStep(5, 'Registering a new user...');
    const registerRes = await axiosInstance.post('/auth/register', {
      username: registerUsername,
      email: registerEmail,
      password: 'Password123!',
    });
    userToken = registerRes.data.token;
    logResult(`User registered: ${registerUsername} (${registerEmail}). Token received.`);
  } catch (error) {
    logError('Error registering user', error);
    return;
  }

  // --- 6. Login User (to get fresh token and merge cart) ---
  try {
    logStep(6, 'Logging in user (to trigger cart merge)...');
    const loginRes = await axiosInstance.post('/auth/login', {
      email: registerEmail,
      password: 'Password123!',
    });
    userToken = loginRes.data.token;
    logResult('User logged in. Token received.');
  } catch (error) {
    logError('Error logging in user', error);
    return;
  }

  // --- 7. Authenticated User Cart: Get Cart (after merge) ---
  try {
    logStep(7, 'Authenticated User Cart: Getting cart after merge...');
    const getUserCartRes = await axiosInstance.get('/cart', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logResult(`User cart has ${getUserCartRes.data.items.length} item(s). Item: ${getUserCartRes.data.items[0].productId.name}, Qty: ${getUserCartRes.data.items[0].qty}. Cart Total: ${getUserCartRes.data.total}`);
    if (getUserCartRes.data.items.length > 0) {
      userCartItemId = getUserCartRes.data.items[0]._id;
    }
  } catch (error) {
    logError('Error getting user cart after merge', error);
    return;
  }

  // --- 8. Authenticated User Cart: Add another item ---
  try {
    logStep(8, 'Authenticated User Cart: Adding another item...');
    const addAnotherItemRes = await axiosInstance.post('/cart', {
      productId: productIds[1], // Add a different product
      qty: 2,
    }, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logResult(`User cart updated. Added: ${addAnotherItemRes.data.items[1].productId.name}, Qty: ${addAnotherItemRes.data.items[1].qty}. New Cart Total: ${addAnotherItemRes.data.total}`);
  } catch (error) {
    logError('Error adding another item to user cart', error);
    return;
  }

  // --- 9. Authenticated User Cart: Remove Item ---
  // Assuming userCartItemId is the first item added (from guest cart merge)
  if (userCartItemId) {
    try {
      logStep(9, 'Authenticated User Cart: Removing item...');
      const removeUserCartRes = await axiosInstance.delete(`/cart/${userCartItemId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      logResult(`User cart item removed. Remaining items: ${removeUserCartRes.data.items.length}. New Cart Total: ${removeUserCartRes.data.total}`);
    } catch (error) {
      logError('Error removing item from user cart', error);
      return;
    }
  }

  // --- 10. Checkout ---
  try {
    logStep(10, 'Processing checkout...');
    const checkoutRes = await axiosInstance.post('/checkout', {
      buyerName: 'Test Buyer',
      buyerEmail: registerEmail,
      shippingAddress: '123 Test Street, Test City, Test State, 12345, Test Country', // Added shippingAddress
    }, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logResult(`Checkout successful! Order ID: ${checkoutRes.data.orderId}, Total: ${checkoutRes.data.total}, Timestamp: ${checkoutRes.data.timestamp}`);
    logResult(`Full checkout response data: ${JSON.stringify(checkoutRes.data, null, 2)}`);
  } catch (error) {
    logError('Error during checkout', error);
    return;
  }

  // --- 11. Verify Cart is Empty after Checkout ---
  try {
    logStep(11, 'Verifying cart is empty after checkout...');
    const finalCartRes = await axiosInstance.get('/cart', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logResult(`Cart items after checkout: ${finalCartRes.data.items.length}`);
    if (finalCartRes.data.items.length === 0) {
      logResult('Cart is empty as expected.');
    } else {
      logError('Cart is NOT empty after checkout!', finalCartRes.data);
    }
  } catch (error) {
    logError('Error verifying empty cart after checkout', error);
    return;
  }

  console.log('\n--- Comprehensive Manual API Tests Complete ---');
}

runManualTests();
