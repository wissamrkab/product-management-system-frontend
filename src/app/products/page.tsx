'use client';

import {DataTable, DataTableStateEvent} from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, {useEffect, useState} from 'react';
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {Chip} from "primereact/chip";
import {Product} from "@/interfaces/product";
import {ProductService} from "@/services/productsService";
import {useAppContext} from "@/contexts/appContext";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {InputText} from "primereact/inputtext";
import {
    transformCategoriesToTreeNodes,
    transformSelectedTreeNodeValuesToCategoryIds,
    TreeNodeCategory
} from "@/interfaces/category";
import {CategoryService} from "@/services/categoriesService";
import {TreeSelect} from "primereact/treeselect";
import {base} from "next/dist/build/webpack/config/blocks/base";
import {Paginator, PaginatorPageChangeEvent} from "primereact/paginator";

const Page = () => {
    const productService = new ProductService();
    const categoryService = new CategoryService();
    const router = useRouter();
    const { showToast,setProduct } = useAppContext();
    const [products, setProducts] = useState<Product[]>();
    const [searchCriteria, setSearchCriteria] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchCriteriaInput, setSearchCriteriaInput] = useState('');
    const [selectedCategoriesInput, setSelectedCategoriesInput] = useState();

    const [categories, setCategories] = useState<TreeNodeCategory[]>();

    const [page, setPage] = useState(1); // First row offset
    const [rows, setRows] = useState(5); // Number of rows per page
    const [totalRecords, setTotalRecords] = useState(0); // Total number of records
    const [totalPages, setTotalPages] = useState(0); // Total number of records

    useEffect(() => {
        const fetchCategoriesData = async () => {
            const categoriesData = await categoryService.fetchCategories();

            if(categoriesData != undefined) {
                setCategories(() => transformCategoriesToTreeNodes(categoriesData));
            }
            else{
                showToast("error", "Categories Could Not Be Fetched");
            }
        };

        fetchCategoriesData();
    }, []);

    const startToolbarTemplate = () => {
        return (
            <h1 className="m-0">Products</h1>
        );
    };

    const startFilterToolbarTemplate = () => {
        return (
            <>
                <InputText className="mr-2" placeholder="search" value={searchCriteriaInput} onChange={(e) => setSearchCriteriaInput(e.target.value)} />
                <TreeSelect id="categories" name="categories" value={selectedCategoriesInput}
                            onChange={(e) => setSelectedCategoriesInput(e.value)} options={categories} selectionMode={"multiple"}
                />
            </>
        );
    };

    const endFilterToolbarTemplate = () => {
        return (
            <>
                <Button label="clear filters" severity="danger" className="mr-2" onClick={
                    () => {
                        setSearchCriteriaInput('')
                        setSearchCriteria('')

                        setSelectedCategoriesInput(undefined)
                        setSelectedCategories([])
                    }}
                />
                <Button label="search" severity="info" className="mr-2" onClick={
                    () => {
                        setSearchCriteria(searchCriteriaInput)
                        setSelectedCategories(transformSelectedTreeNodeValuesToCategoryIds(selectedCategoriesInput!))
                    }}
                />
            </>

        );
    };

    const endToolbarTemplate = () => {
        return (
            <Link href="/products/create" rel="noopener noreferrer" className="p-button font-bold no-underline">
                Create New
            </Link>
        );
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD' });
    };

    const priceBodyTemplate = (rowData: Product) => {
        return formatCurrency(rowData.price);
    };

    const categoryBodyTemplate = (rowData: Product) => {
        return (
            <>
                {rowData.categories.map((item) => (
                    <Chip key={item.id} label={item.nameEn} className="mr-2"></Chip>
                ))}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="info" className="mr-2" onClick={
                    () => {
                        setProduct(rowData);
                        router.push('/products/update');
                    }}
                />
                <Button icon="pi pi-trash" severity="danger" onClick={
                    () => {
                        productService.deleteProduct(rowData.id).then(
                           value => {
                               showToast("success", "Product has been deleted");
                               fetchProductsData()
                           }
                       )
                    }}
                />
            </>
        );
    };

    const fetchProductsData = async () => {
        const productsData = await productService.fetchProducts(page, rows,searchCriteria,selectedCategories);
        if(productsData != undefined) {
            console.log(productsData)
            setProducts(productsData.data);
            setTotalRecords(productsData.totalRecords);
            setPage(productsData.currentPage);
            setRows(productsData.pageSize);
            setTotalPages(productsData.totalPages)
        }
        else{
            showToast("error", "Products Could Not Be Fetched");
        }
    };


    useEffect(() => {
        fetchProductsData();
    }, [searchCriteria,selectedCategories,page,rows]);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setPage(event.page! + 1);
        setRows(event.rows);
    };

    return (
        <div className="flex flex-column py-5" style={{height:"100vh"}}>
            <Toolbar className="flex-shrink-0 mb-4" start={startToolbarTemplate} end={endToolbarTemplate} ></Toolbar>
            <Toolbar className="flex-shrink-0 mb-4" start={startFilterToolbarTemplate} end={endFilterToolbarTemplate} ></Toolbar>
            <div className="flex-grow-1">
                <DataTable rows={rows}
                           scrollable scrollHeight="flex" value={products} stripedRows showGridlines  size={"normal"}>
                    <Column field="name" header="Name"></Column>
                    <Column field="isbn" header="ISBN"></Column>
                    <Column field="categories" header="Category" body={categoryBodyTemplate}></Column>
                    <Column field="price" header="Price" body={priceBodyTemplate}></Column>
                    <Column body={actionBodyTemplate} style={{ width: '12rem' }}></Column>
                </DataTable>

              </div>
            <Paginator first={(page - 1) * rows} rows={rows} totalRecords={totalRecords} pageLinkSize={totalPages} rowsPerPageOptions={[1,5,10, 20, 30]}  onPageChange={onPageChange}  />
        </div>
    );
};

export default Page;
