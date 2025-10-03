
import React from 'react';
import { IconPhotoBolt } from './Icon';

export const Header: React.FC = () => {
    return (
        <header className="bg-secondary shadow-lg">
            <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center gap-4">
                 <IconPhotoBolt className="w-8 h-8 text-highlight" />
                <h1 className="text-2xl lg:text-3xl font-bold text-light tracking-wider">
                    AI Image Gen Studio
                </h1>
            </div>
        </header>
    );
};
