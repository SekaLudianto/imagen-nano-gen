import React, { useState } from 'react';
import { GeneratedImage, ModelType } from '../types';
import { IconDownload, IconHeart, IconHeartFilled, IconTrash, IconInfoCircle } from './Icon';

interface ImageCardProps {
    image: GeneratedImage;
    toggleFavorite: (id: string) => void;
    deleteImage: (id: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, toggleFavorite, deleteImage }) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `ai-image-${image.id}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const cardAspectRatioClass = {
        '1:1': 'aspect-square',
        '16:9': 'aspect-video',
        '9:16': 'aspect-[9/16]',
        '4:3': 'aspect-[4/3]',
        '3:4': 'aspect-[3/4]',
    }[image.aspectRatio] || 'aspect-square';

    return (
        <div className={`group relative overflow-hidden rounded-xl shadow-lg bg-secondary ${cardAspectRatioClass}`}>
            <img src={image.src} alt={image.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            
            <div 
                className={`absolute inset-0 bg-black/70 flex flex-col justify-between p-4 transition-opacity duration-300 ${isInfoVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                onMouseLeave={() => setIsInfoVisible(false)}
            >
                <div className="text-sm text-gray-200 overflow-y-auto max-h-[calc(100%-80px)] pr-2">
                    <p className="font-bold mb-1">Prompt:</p>
                    <p className="mb-2 break-words">{image.prompt}</p>
                    
                    {image.model !== ModelType.NANOBANANA &&
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-300 mb-2 font-mono">
                           {image.resolution && <span>Res: {image.resolution}px</span>}
                           {image.quality && <span>Quality: {image.quality}</span>}
                           {image.aspectRatio && <span>Ratio: {image.aspectRatio}</span>}
                        </div>
                    }

                    <p className="text-xs text-gray-400 border-t border-gray-600 pt-2 mt-2">
                        {image.model} - {new Date(image.timestamp).toLocaleString()}
                    </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                     {/* Buttons are hidden in info view to prevent overlap */}
                </div>
            </div>

            {/* Action buttons always visible on hover unless info is shown */}
            <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isInfoVisible ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                <button onClick={() => toggleFavorite(image.id)} className="p-2 bg-black/50 rounded-full text-white hover:bg-highlight hover:text-white transition-colors">
                    {image.isFavorite ? <IconHeartFilled className="w-5 h-5 text-highlight" /> : <IconHeart className="w-5 h-5" />}
                </button>
                <button onClick={handleDownload} className="p-2 bg-black/50 rounded-full text-white hover:bg-blue-500 transition-colors">
                    <IconDownload className="w-5 h-5" />
                </button>
                 <button onClick={() => deleteImage(image.id)} className="p-2 bg-black/50 rounded-full text-white hover:bg-red-700 transition-colors">
                    <IconTrash className="w-5 h-5" />
                </button>
            </div>
            
            {/* Info toggle button */}
             <button 
                onClick={() => setIsInfoVisible(!isInfoVisible)}
                className={`absolute bottom-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-gray-600 transition-colors ${isInfoVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                <IconInfoCircle className="w-5 h-5" />
            </button>
        </div>
    );
};