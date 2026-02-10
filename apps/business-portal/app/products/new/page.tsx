'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';

function AddProductContent() {
    const searchParams = useSearchParams();
    const storeId = searchParams.get('storeId');
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        stock: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/products', {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                storeId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to create product', error);
            alert('Failed to create product');
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Add New Product
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-6 sm:space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                            Description
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                Price
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
                                Stock
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    name="stock"
                                    id="stock"
                                    required
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="sku" className="block text-sm font-medium leading-6 text-gray-900">
                                SKU
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="sku"
                                    id="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end gap-x-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function AddProduct() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddProductContent />
        </Suspense>
    );
}
