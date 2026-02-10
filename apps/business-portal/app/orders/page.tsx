'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';

interface OrderItem {
    id: string;
    product: {
        name: string;
    };
    quantity: number;
    price: string;
}

interface Order {
    id: string;
    orderNumber: string;
    totalAmount: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            // Fetching first store's ID for PoC.
            const storesRes = await api.get('/stores', { headers: { Authorization: `Bearer ${token}` } });
            if (storesRes.data.length === 0) return;

            const storeId = storesRes.data[0].id;

            const response = await api.get(`/orders?storeId=${storeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(`/orders/${orderId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Failed to update status');
        }
    }

    // Simulation function to create a dummy order for testing
    const createTestOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const storesRes = await api.get('/stores', { headers: { Authorization: `Bearer ${token}` } });
            const storeId = storesRes.data[0].id;

            // simple payload
            await api.post('/orders', {
                storeId,
                totalAmount: 100.50,
                items: []
            });
            fetchOrders();
        } catch (error) {
            alert('Failed to create test order');
        }
    }

    const handlePay = async (orderId: string) => {
        try {
            const token = localStorage.getItem('token');
            // 1. Create intent
            const intentRes = await api.post('/payments/create-intent', { orderId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 2. Simulate success webhook trigger via frontend for demo simplicity
            // In real app, Stripe calls webhook.
            await api.post('/payments/webhook', {
                type: 'payment_intent.succeeded',
                data: { object: { id: intentRes.data.clientSecret.split('_secret')[0] } } // Hacky ID extraction for mock
            });

            alert('Payment successful!');
            fetchOrders(); // Refresh to see status change if logic updates order
        } catch (error) {
            console.error(error);
            alert('Payment failed');
        }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <h1 className="text-xl font-bold text-indigo-600">Business Portal</h1>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">Dashboard</Link>
                            <Link href="/pages" className="text-sm font-medium text-gray-500 hover:text-gray-900">Website</Link>
                            <Link href="/payments" className="text-sm font-medium text-gray-500 hover:text-gray-900">Payments</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Orders
                            </h2>
                        </div>
                        <div className="mt-4 flex md:ml-4 md:mt-0">
                            <button
                                onClick={createTestOrder}
                                className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Simulate New Order
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order #</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{order.orderNumber}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${order.totalAmount}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                                            order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                                                order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                                    'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                        {order.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handlePay(order.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 text-xs border border-indigo-600 rounded px-2 py-1"
                                                            >
                                                                Pay (Simulate)
                                                            </button>
                                                        )}
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                                            className="inline-block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
                                                        >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="PROCESSING">Processing</option>
                                                            <option value="SHIPPED">Shipped</option>
                                                            <option value="DELIVERED">Delivered</option>
                                                            <option value="CANCELLED">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="py-10 text-center text-sm text-gray-500">No orders found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
