import React from 'react';
import { ModelType } from '../types';
import { IconSearch } from './Icon';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterModel: ModelType | 'all';
    setFilterModel: (model: ModelType | 'all') => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, filterModel, setFilterModel }) => {
    return (
        <div className="mb-6 bg-secondary p-4 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-2/3">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by prompt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-accent border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-highlight"
                />
            </div>
            <div className="w-full sm:w-1/3">
                <select
                    value={filterModel}
                    onChange={(e) => setFilterModel(e.target.value as ModelType | 'all')}
                    className="w-full bg-accent border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-highlight"
                >
                    <option value="all">All Models</option>
                    <option value={ModelType.IMAGEN}>Imagen</option>
                    <option value={ModelType.IMAGEN_FAST}>Imagen Fast</option>
                    <option value={ModelType.NANOBANANA}>Nanobanana</option>
                </select>
            </div>
        </div>
    );
};