export enum productSize {
    'size_S' = 'S',
    'size_M' = 'M',
    'size_L' = 'L'
}

export interface Category {
    category_name: string;
    id: number;
}

export interface Product {
    id: number;
    image: string;
    brand: string;
    description: string;
    name: string;
    price: number;
    product_category_id: number;
    quantity: number;
    size: productSize;
}

export interface createProduct {
    id?: number;
    brand: string;
    description: string;
    image: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    product_category_id: number
}