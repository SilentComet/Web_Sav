'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';

interface Order {
    orderNumber: string;
}

interface Payment {
    id: string;
    amount: string;
    currency: string;
    status: string;
    provider: string;
    createdAt: string;
    order: Order;
}

export default function Payments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/payments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(response.data);
        } catch (error) {
            console.error('Failed to fetch payments', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <h1 className="text-xl font-bold text-indigo-600">Business Portal</h1>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">Dashboard</Link>
                            <Link href="/orders" className="text-sm font-medium text-gray-500 hover:text-gray-900">Orders</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Payments
                            </h2>
                        </div>
                    </div>

                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Order #</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Provider</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {payments.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{payment.order?.orderNumber || 'N/A'}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${payment.amount} {payment.currency}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${payment.status === 'COMPLETED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                                'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                                            }`}>
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{payment.provider}</td>
                                                </tr>
                                            ))}
                                            {payments.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="py-10 text-center text-sm text-gray-500">No payments found.</td>
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
