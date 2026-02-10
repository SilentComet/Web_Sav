import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:3001/api';
let TOKEN = '';
let STORE_ID = '';
let PRODUCT_ID = '';
let ORDER_ID = '';

const testClient = axios.create({
    baseURL: API_URL,
    validateStatus: () => true, // Don't throw on error status
});

async function runTests() {
    console.log('🚀 Starting Backend Verification...\n');

    // 1. Auth
    console.log('--- Authentication ---');
    const uniqueUser = `user_${Date.now()}`;
    const email = `${uniqueUser}@example.com`;
    const password = 'password123';

    // Register
    let res = await testClient.post('/auth/register', { email, password, role: 'RESELLER' });
    console.log(`Register: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);
    if (res.status !== 201) process.exit(1);

    // Login
    res = await testClient.post('/auth/login', { email, password });
    console.log(`Login: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);
    if (res.status !== 200) process.exit(1);
    TOKEN = res.data.token;
    testClient.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;

    // 2. Stores
    console.log('\n--- Stores ---');
    res = await testClient.post('/stores', { name: `Store ${uniqueUser}`, subdomain: uniqueUser });
    console.log(`Create Store: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);
    if (res.status === 201) STORE_ID = res.data.id;

    res = await testClient.get('/stores');
    console.log(`List Stores: ${res.status} ${res.status === 200 && res.data.length > 0 ? '✅' : '❌'}`);

    // 3. Uploads
    console.log('\n--- Uploads ---');
    // Create a dummy file
    const dummyFilePath = path.join(__dirname, 'test-image.jpg');
    // Just write text, multer checks mimetype content-type header mostly or extension? 
    // Our middleware checks mimetype. We need to mock it properly in form-data.
    fs.writeFileSync(dummyFilePath, 'fake image content');

    const form = new FormData();
    form.append('file', fs.createReadStream(dummyFilePath), { contentType: 'image/jpeg' });

    res = await testClient.post('/upload', form, { headers: form.getHeaders() });
    console.log(`Upload File: ${res.status} ${res.status === 201 ? '✅' : '❌'} URL: ${res.data?.url}`);
    const uploadedImageUrl = res.data?.url;

    // Cleanup
    if (fs.existsSync(dummyFilePath)) fs.unlinkSync(dummyFilePath);

    // 4. Products
    console.log('\n--- Products ---');
    res = await testClient.post('/products', {
        name: 'Test Product',
        description: 'A verified product',
        price: 99.99,
        stock: 10,
        storeId: STORE_ID,
        images: uploadedImageUrl ? [uploadedImageUrl] : []
    });
    console.log(`Create Product: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);
    if (res.status === 201) PRODUCT_ID = res.data.id;

    res = await testClient.get(`/products?storeId=${STORE_ID}`);
    console.log(`List Products (Cache Miss): ${res.status} ${res.status === 200 && res.data.length > 0 ? '✅' : '❌'}`);

    res = await testClient.get(`/products?storeId=${STORE_ID}`);
    console.log(`List Products (Cache Hit?): ${res.status} ${res.status === 200 ? '✅' : '❌'}`);

    // 5. Servers
    console.log('\n--- Infrastructure ---');
    res = await testClient.post('/servers', {
        name: 'Test Node 1',
        ipAddress: '192.168.1.1',
        type: 'VPS',
        cost: 5.00,
        capacity: 100,
        endpoint: 'http://192.168.1.1'
    });
    // Note: Only admins might be allowed? We didn't enforce roles strictly in controller yet or we are owner.
    console.log(`Create Server: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);

    res = await testClient.get('/servers');
    console.log(`List Servers: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);

    // 6. Pages (Website Builder)
    console.log('\n--- Website Builder ---');
    res = await testClient.post('/pages', {
        name: 'Home',
        slug: 'home',
        storeId: STORE_ID,
        content: { blocks: [{ type: 'header', data: 'Welcome' }] }
    });
    console.log(`Create Page: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);

    res = await testClient.get(`/pages?storeId=${STORE_ID}`);
    console.log(`List Pages: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);

    // 7. Orders
    console.log('\n--- Orders ---');
    res = await testClient.post('/orders', {
        storeId: STORE_ID,
        totalAmount: 99.99,
        items: [{ productId: PRODUCT_ID, quantity: 1, price: 99.99 }]
    });
    console.log(`Create Order: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);
    if (res.status === 201) ORDER_ID = res.data.id;

    res = await testClient.get(`/orders?storeId=${STORE_ID}`);
    console.log(`List Orders: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);

    // 8. Payments
    console.log('\n--- Payments ---');
    res = await testClient.post('/payments/create-intent', { orderId: ORDER_ID });
    console.log(`Create Payment Intent: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);
    const intentId = res.data?.clientSecret?.split('_secret')[0];

    res = await testClient.post('/payments/webhook', {
        type: 'payment_intent.succeeded',
        data: { object: { id: intentId } }
    });
    console.log(`Webhook Trigger: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);

    res = await testClient.get('/payments');
    console.log(`List Payments: ${res.status} ${res.status === 200 && res.data.length > 0 ? '✅' : '❌'} Status: ${res.data[0]?.status}`);

    console.log('\n✅ VERIFICATION COMPLETE');
}

runTests().catch(e => console.error(e));
