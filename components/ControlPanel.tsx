import React, { useState } from 'react';
import { ModelType } from '../types';
import { IconSparkles, IconUpload, IconChevronDown, IconBulb } from './Icon';

interface ControlPanelProps {
    onGenerate: (
        prompt: string,
        model: ModelType,
        aspectRatio: string,
        resolution: number,
        quality: number,
        numberOfResults: number,
        sourceImageFile?: File
    ) => void;
    isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading }) => {
    const [prompt, setPrompt] = useState<string>('');
    const [model, setModel] = useState<ModelType>(ModelType.IMAGEN);
    const [aspectRatio, setAspectRatio] = useState<string>('1:1');
    const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const [resolution, setResolution] = useState<number>(1024);
    const [quality, setQuality] = useState<number>(75);
    const [numberOfResults, setNumberOfResults] = useState<number>(1);
    const [isGuideVisible, setIsGuideVisible] = useState<boolean>(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!prompt.trim()) {
            setError('Prompt cannot be empty.');
            return;
        }
        if (model === ModelType.NANOBANANA && !sourceImageFile) {
            setError('Please upload an image to edit.');
            return;
        }
        onGenerate(prompt, model, aspectRatio, resolution, quality, numberOfResults, sourceImageFile || undefined);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSourceImageFile(file);
            setFileName(file.name);
        }
    };

    const isImagenModel = model === ModelType.IMAGEN || model === ModelType.IMAGEN_FAST;

    return (
        <div className="bg-secondary p-6 rounded-xl shadow-2xl sticky top-8">
            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => setIsGuideVisible(!isGuideVisible)}
                    className="w-full flex justify-between items-center text-left text-sm font-medium text-gray-300 p-3 rounded-lg bg-accent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-highlight"
                >
                    <span className="flex items-center">
                        <IconBulb className="w-5 h-5 mr-2 text-yellow-400" />
                        Prompting Guide
                    </span>
                    <IconChevronDown className={`w-5 h-5 transition-transform ${isGuideVisible ? 'transform rotate-180' : ''}`} />
                </button>
                {isGuideVisible && (
                    <div className="mt-3 p-4 bg-primary rounded-lg text-xs text-gray-400 space-y-2 animate-fade-in">
                        <p className="font-bold text-gray-300">Tips for Great Prompts:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Be Specific:</strong> Instead of "a car", try "a vintage red sports car driving on a coastal road at sunset".</li>
                            <li><strong>Use Descriptive Adjectives:</strong> Words like "vibrant", "surreal", "minimalist", "photorealistic" guide the style.</li>
                            <li><strong>Avoid Ambiguity:</strong> If your prompt is blocked by safety filters, try rephrasing with different words.</li>
                            <li><strong>Stay Safe:</strong> Avoid prompts that are harmful, unethical, or violate safety policies.</li>
                        </ul>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                    <select
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value as ModelType)}
                        className="w-full bg-accent border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-highlight"
                    >
                        <option value={ModelType.IMAGEN}>Generate (Imagen)</option>
                        <option value={ModelType.IMAGEN_FAST}>Generate (Imagen Fast)</option>
                        <option value={ModelType.NANOBANANA}>Edit (Nanobanana)</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                        {isImagenModel ? 'Prompt' : 'Edit Instruction'}
                    </label>
                    <textarea
                        id="prompt"
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={
                            isImagenModel 
                            ? "e.g., A vibrant synthwave cityscape at sunset..."
                            : "e.g., Make the sky a starry night..."
                        }
                        className="w-full bg-accent border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-highlight placeholder-gray-500"
                    />
                </div>

                {model === ModelType.NANOBANANA && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Source Image</label>
                        <label htmlFor="file-upload" className="w-full flex items-center justify-center px-3 py-2 bg-accent border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 hover:border-gray-500 transition-colors">
                            <IconUpload className="w-5 h-5 mr-2" />
                            <span className="text-sm truncate">{fileName || 'Click to upload'}</span>
                        </label>
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                    </div>
                )}
                
                {isImagenModel && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                            <select
                                id="aspectRatio"
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-full bg-accent border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-highlight"
                            >
                                <option value="1:1">Square (1:1)</option>
                                <option value="16:9">Landscape (16:9)</option>
                                <option value="9:16">Portrait (9:16)</option>
                                <option value="4:3">Standard (4:3)</option>
                                <option value="3:4">Tall (3:4)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="resolution" className="flex justify-between text-sm font-medium text-gray-300 mb-1">
                                <span>Resolution</span>
                                <span className="font-mono">{resolution}px</span>
                            </label>
                            <input
                                id="resolution"
                                type="range"
                                min="512"
                                max="2048"
                                step="64"
                                value={resolution}
                                onChange={(e) => setResolution(Number(e.target.value))}
                                className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="quality" className="flex justify-between text-sm font-medium text-gray-300 mb-1">
                                <span>Quality</span>
                                <span className="font-mono">{quality}</span>
                            </label>
                            <input
                                id="quality"
                                type="range"
                                min="1"
                                max="100"
                                step="1"
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label htmlFor="numberOfResults" className="flex justify-between text-sm font-medium text-gray-300 mb-1">
                                <span>Number of Results</span>
                                <span className="font-mono">{numberOfResults}</span>
                            </label>
                            <input
                                id="numberOfResults"
                                type="range"
                                min="1"
                                max="4"
                                step="1"
                                value={numberOfResults}
                                onChange={(e) => setNumberOfResults(Number(e.target.value))}
                                className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                )}
                
                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-highlight text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-highlight transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                          <IconSparkles className="w-5 h-5 mr-2" />
                          Generate
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};