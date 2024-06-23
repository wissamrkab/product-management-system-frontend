
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
}

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Fetch products from an API or define them statically
        setProducts([
            { id: 1, name: 'Product 1', price: 100 },
            { id: 2, name: 'Product 2', price: 150 }
        ]);
    }, []);

    return (
        <>
            <h1>Products</h1>
            <DataTable value={products}>
                <Column field="id" header="ID"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="price" header="Price"></Column>
            </DataTable>
        </>
    );
};

export default Products;
