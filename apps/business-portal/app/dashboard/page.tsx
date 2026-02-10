'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';

interface Store {
    id: string;
    name: string;
    slug: string;
}

interface Product {
    id: string;
    name: string;
    price: string;
    stock: number;
}

export default function Dashboard() {
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchStores();
    }, []);

    useEffect(() => {
        if (selectedStore) {
            fetchProducts(selectedStore.id);
        }
    }, [selectedStore]);

    const fetchStores = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Axios interceptor would be better, but doing manual header for now
            const response = await api.get('/stores', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStores(response.data);
            if (response.data.length > 0) {
                setSelectedStore(response.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch stores', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (storeId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/products?storeId=${storeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <h1 className="text-xl font-bold text-indigo-600">Business Portal</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {stores.length === 0 ? (
                        <div className="text-center">
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No stores found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new store.</p>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Create Store
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="md:flex md:items-center md:justify-between">
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                        {selectedStore?.name} Products
                                    </h2>
                                </div>
                                <div className="mt-4 flex md:ml-4 md:mt-0">
                                    <Link
                                        href={`/products/new?storeId=${selectedStore?.id}`}
                                        className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Add Product
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                            Name
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                            Price
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                            Stock
                                                        </th>
                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                            <span className="sr-only">Edit</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {products.map((product) => (
                                                        <tr key={product.id}>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                {product.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.stock}</td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                                    Edit<span className="sr-only">, {product.name}</span>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
