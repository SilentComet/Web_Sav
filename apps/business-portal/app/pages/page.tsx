'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';

interface Page {
    id: string;
    name: string;
    slug: string;
    updatedAt: string;
}

export default function Pages() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const token = localStorage.getItem('token');
            // In a real app we'd get the store ID from context/selector. 
            // Fetching first store's ID for PoC.
            const storesRes = await api.get('/stores', { headers: { Authorization: `Bearer ${token}` } });
            if (storesRes.data.length === 0) return;

            const storeId = storesRes.data[0].id;

            const response = await api.get(`/pages?storeId=${storeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPages(response.data);
        } catch (error) {
            console.error('Failed to fetch pages', error);
            // router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePage = async () => {
        // Ideally open a modal, hardcoding for PoC
        const name = prompt('Enter page name:');
        if (!name) return;
        const slug = prompt('Enter page slug (e.g., about-us):');
        if (!slug) return;

        try {
            const token = localStorage.getItem('token');
            const storesRes = await api.get('/stores', { headers: { Authorization: `Bearer ${token}` } });
            const storeId = storesRes.data[0].id;

            await api.post('/pages', { name, slug, storeId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPages();
        } catch (error) {
            alert('Failed to create page');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <h1 className="text-xl font-bold text-indigo-600">Website Builder</h1>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">Dashboard</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Pages
                            </h2>
                        </div>
                        <div className="mt-4 flex md:ml-4 md:mt-0">
                            <button
                                onClick={handleCreatePage}
                                className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                            >
                                New Page
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
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Slug</th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Edit</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {pages.map((page) => (
                                                <tr key={page.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{page.name}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{page.slug}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <Link href={`/pages/${page.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                                                            Edit Design
                                                        </Link>
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
            </main>
        </div>
    );
}
