'use client';

import { useEffect, useState, } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';

interface Block {
    id: string;
    type: 'heading' | 'text' | 'image';
    content: string;
}

export default function Editor() {
    const { id } = useParams();
    const [page, setPage] = useState<any>(null);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (id) fetchPage();
    }, [id]);

    const fetchPage = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/pages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPage(response.data);
            if (response.data.content && response.data.content.blocks) {
                setBlocks(response.data.content.blocks);
            }
        } catch (error) {
            console.error('Failed to fetch page', error);
        }
    };

    const addBlock = (type: 'heading' | 'text' | 'image') => {
        const newBlock: Block = {
            id: Date.now().toString(),
            type,
            content: type === 'heading' ? 'New Heading' : 'New text block',
        };
        setBlocks([...blocks, newBlock]);
    };

    const updateBlock = (blockId: string, content: string) => {
        setBlocks(blocks.map(b => b.id === blockId ? { ...b, content } : b));
    };

    const deleteBlock = (blockId: string) => {
        setBlocks(blocks.filter(b => b.id !== blockId));
    }

    const savePage = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/pages/${id}`, {
                ...page,
                content: { blocks },
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Saved successfully!');
        } catch (error) {
            alert('Failed to save');
        }
    };

    if (!page) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow p-4 flex justify-between items-center z-10">
                <h1 className="text-xl font-bold text-gray-900">Editing: {page.name}</h1>
                <div className="space-x-4">
                    <button onClick={() => router.push('/pages')} className="text-gray-500 hover:text-gray-900">Back</button>
                    <button onClick={savePage} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
                        Save Changes
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r p-4 overflow-y-auto">
                    <h3 className="font-semibold mb-4">Components</h3>
                    <div className="space-y-2">
                        <button onClick={() => addBlock('heading')} className="w-full text-left p-2 border rounded hover:bg-gray-50">
                            Heading
                        </button>
                        <button onClick={() => addBlock('text')} className="w-full text-left p-2 border rounded hover:bg-gray-50">
                            Text Paragraph
                        </button>
                        <button onClick={() => addBlock('image')} className="w-full text-left p-2 border rounded hover:bg-gray-50">
                            Image Placeholder
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="bg-white min-h-[500px] shadow rounded max-w-4xl mx-auto p-8">
                        {blocks.map((block) => (
                            <div key={block.id} className="group relative mb-4 border border-transparent hover:border-blue-300 p-2 rounded">
                                <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex space-x-2 bg-white shadow p-1 rounded">
                                    <button onClick={() => deleteBlock(block.id)} className="text-red-500 text-xs">Delete</button>
                                </div>
                                {block.type === 'heading' && (
                                    <input
                                        className="text-3xl font-bold w-full border-none focus:ring-0"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                    />
                                )}
                                {block.type === 'text' && (
                                    <textarea
                                        className="w-full border-none focus:ring-0 resize-none text-gray-700"
                                        rows={3}
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                    />
                                )}
                                {block.type === 'image' && (
                                    <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-500">
                                        {block.content || 'Image Placeholder'}
                                    </div>
                                )}
                            </div>
                        ))}
                        {blocks.length === 0 && (
                            <p className="text-center text-gray-400 mt-20">Drag components here (or click to add)</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
