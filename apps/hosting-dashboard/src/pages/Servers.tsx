import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface Server {
    id: string;
    name: string;
    type: string;
    endpoint: string;
    status: string;
}

export default function Servers() {
    const [servers, setServers] = useState<Server[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newServer, setNewServer] = useState({
        name: '',
        type: 'VPS',
        endpoint: '',
        capacity: '100', // Default
        cost: '10.00'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await api.get('/servers');
                setServers(response.data);
            } catch (error: any) {
                console.error('Failed to fetch servers', error);
                // Optionally handle navigation to login if unauthorized
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchServers();
    }, [navigate]);

    const handleCreateServer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/servers', newServer);
            setShowCreateModal(false);
            setNewServer({ name: '', type: 'VPS', endpoint: '', capacity: '100', cost: '10.00' }); // Reset form
            // Refresh list
            const response = await api.get('/servers');
            setServers(response.data);
        } catch (error) {
            console.error('Failed to create server', error);
            alert('Failed to create server');
        }
    };

    if (servers.length === 0 && !showCreateModal) return <div className="p-10 text-center">Loading servers or no servers found...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-indigo-600">Hosting Provider</h1>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a href="/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                                <a href="/servers" className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Servers</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Server Infrastructure
                            </h2>
                        </div>
                        <div className="mt-4 flex md:ml-4 md:mt-0">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Add Server
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
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Type
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Endpoint
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Status
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {servers.map((server) => (
                                                <tr key={server.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {server.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{server.type}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{server.endpoint}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${server.status === 'ONLINE' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'}`}>
                                                            {server.status}
                                                        </span>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                            Config<span className="sr-only">, {server.name}</span>
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
            </main>

            {/* Create Server Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>

                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <form onSubmit={handleCreateServer}>
                                <div>
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Add New Server</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Server Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                                value={newServer.name}
                                                onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Type</label>
                                            <select
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                                value={newServer.type}
                                                onChange={(e) => setNewServer({ ...newServer, type: e.target.value })}
                                            >
                                                <option value="VPS">VPS</option>
                                                <option value="DEDICATED">Dedicated</option>
                                                <option value="DATABASE">Database</option>
                                                <option value="STORAGE">Storage</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Endpoint (IP/URL)</label>
                                            <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                                value={newServer.endpoint}
                                                onChange={(e) => setNewServer({ ...newServer, endpoint: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Capacity (GB/Slots)</label>
                                            <input
                                                type="number"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                                value={newServer.capacity}
                                                onChange={(e) => setNewServer({ ...newServer, capacity: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
