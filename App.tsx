import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { GeneratedImage, ModelType } from './types';
import { generateWithImagen, editWithNanoBanana } from './services/geminiService';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
    const [images, setImages] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterModel, setFilterModel] = useState<ModelType | 'all'>('all');

    useEffect(() => {
        try {
            const storedImages = localStorage.getItem('generatedImages');
            if (storedImages) {
                setImages(JSON.parse(storedImages));
            }
        } catch (e) {
            console.error("Failed to load images from localStorage", e);
            setError("Could not load saved images.");
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('generatedImages', JSON.stringify(images));
        } catch (e) {
            console.error("Failed to save images to localStorage", e);
            setError("Could not save new images.");
        }
    }, [images]);
    
    const handleGenerate = useCallback(async (
        prompt: string,
        model: ModelType,
        aspectRatio: string,
        resolution: number,
        quality: number,
        numberOfResults: number,
        sourceImageFile?: File
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            if (model === ModelType.IMAGEN || model === ModelType.IMAGEN_FAST) {
                const newImageSrcs = await generateWithImagen(prompt, aspectRatio, numberOfResults);
                const newImages: GeneratedImage[] = newImageSrcs.map((src, index) => ({
                    id: `${Date.now()}-${index}`,
                    src: src,
                    prompt: prompt,
                    model: model,
                    timestamp: new Date().toISOString(),
                    isFavorite: false,
                    aspectRatio: aspectRatio,
                    resolution: resolution,
                    quality: quality,
                }));
                setImages(prev => [...newImages, ...prev]);
            } else if (model === ModelType.NANOBANANA && sourceImageFile) {
                const newImageSrc = await editWithNanoBanana(sourceImageFile, prompt);
                const newImage: GeneratedImage = {
                    id: Date.now().toString(),
                    src: newImageSrc,
                    prompt: prompt,
                    model: model,
                    timestamp: new Date().toISOString(),
                    isFavorite: false,
                    aspectRatio: '1:1', // Default for edited images
                };
                setImages(prev => [newImage, ...prev]);
            } else {
                throw new Error("Invalid generation parameters provided.");
            }
            
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleFavorite = (id: string) => {
        setImages(images.map(img => img.id === id ? { ...img, isFavorite: !img.isFavorite } : img));
    };
    
    const deleteImage = (id: string) => {
        setImages(images.filter(img => img.id !== id));
    };

    const filteredImages = useMemo(() => {
        return images
            .filter(img => filterModel === 'all' || img.model === filterModel)
            .filter(img => img.prompt.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [images, filterModel, searchTerm]);

    return (
        <div className="min-h-screen bg-primary font-sans">
            <Header />
            <main className="container mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                    <ControlPanel onGenerate={handleGenerate} isLoading={isLoading} />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterModel={filterModel}
                        setFilterModel={setFilterModel}
                    />
                     {error && (
                        <div className="bg-red-900 border border-highlight text-white px-4 py-3 rounded-lg relative mb-4" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {isLoading && <Spinner />}
                    <Gallery 
                        images={filteredImages} 
                        toggleFavorite={toggleFavorite}
                        deleteImage={deleteImage}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;