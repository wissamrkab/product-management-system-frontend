import {Category} from "@/interfaces/category";

export interface Product {
    name: string
    isbn: string
    price: number
    categories: Category[]
    createdBy: string
    createdDate: string
    updatedBy: string
    updatedDate: string
    id: string
}

export interface ProductCreateRequest {
    name: string
    isbn: string
    price: number
    categories: string[]
}

export interface ProductUpdateRequest {
    id: string,
    name: string
    isbn: string
    price: number
    categories: string[]
}