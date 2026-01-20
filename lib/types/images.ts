export interface ImageMetadata {
    id: string;
    fileName: string;
    url: string;
    category: string;
    uploadedAt: Date;
    size: number;
    description?: string;
    tags?: string[];
}

export interface ImageItem {
    name: string;
    url: string;
    category?: string;
    uploadedAt?: Date;
    id?: string;
}

export const DEFAULT_CATEGORIES = [
    'gallery',
    'prizes',
    'highlights',
    'sponsors',
    'banners',
    'venue',
] as const;

export type DefaultCategory = typeof DEFAULT_CATEGORIES[number];
