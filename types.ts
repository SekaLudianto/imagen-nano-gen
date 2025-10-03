export enum ModelType {
    IMAGEN = 'Imagen',
    IMAGEN_FAST = 'Imagen Fast',
    NANOBANANA = 'Nanobanana',
}

export interface GeneratedImage {
    id: string;
    src: string;
    prompt: string;
    model: ModelType;
    timestamp: string;
    isFavorite: boolean;
    aspectRatio: string;
    resolution?: number;
    quality?: number;
}