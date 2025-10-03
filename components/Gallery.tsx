
import React from 'react';
import { GeneratedImage } from '../types';
import { ImageCard } from './ImageCard';
import { IconPhotoOff } from './Icon';

interface GalleryProps {
    images: GeneratedImage[];
    toggleFavorite: (id: string) => void;
    deleteImage: (id: string) => void;
    isLoading: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ images, toggleFavorite, deleteImage, isLoading }) => {
    if (images.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-gray-400 bg-secondary p-10 rounded-xl">
                <IconPhotoOff className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold">Gallery is Empty</h3>
                <p>Start creating images to see them here.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {images.map(image => (
                <ImageCard 
                    key={image.id} 
                    image={image} 
                    toggleFavorite={toggleFavorite} 
                    deleteImage={deleteImage}
                />
            ))}
        </div>
    );
};
