'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, {useEffect, useState} from 'react';
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {Category} from "@/interfaces/category";
import {CategoryService} from "@/services/categoriesService";
import {useAppContext} from "@/contexts/appContext";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {BreadCrumb} from "primereact/breadcrumb";
import {MenuItem} from "primereact/menuitem";

const Page = () => {
    const categoryService = new CategoryService();
    const router = useRouter();
    const { showToast,setCategory } = useAppContext();
    const [categories, setCategories] = useState<Category[]>();

    const startToolbarTemplate = () => {
        return (
            <h1 className="m-0">Categories</h1>
        );
    };

    const [parentId, setParentId] = useState<string>();

    const endToolbarTemplate = () => {
        if(parentId)
        return (
            <Link href={{
                pathname:"/categories/create",
                query: {
                    parentId: parentId
                }
            }} rel="noopener noreferrer" className="p-button font-bold no-underline">
                Create New
            </Link>);

        else return (
            <Link href={{
                pathname:"/categories/create",
            }} rel="noopener noreferrer" className="p-button font-bold no-underline">
                Create New
            </Link>);
    };

    const [breadcrumbItems, setBreadcrumbItems] = useState<MenuItem[]>([]);
    const breadcrumbHome: MenuItem = { icon: 'pi pi-home', command:event => {
            setParentId(undefined);
            setBreadcrumbItems([])
        }
    }

    const actionBodyTemplate = (rowData: Category) => {
        return (
            <>
                <Button icon="pi pi-align-justify" severity="help" className="mr-2" onClick={
                    () => {
                        setBreadcrumbItems([...breadcrumbItems,
                            { label: rowData.nameEn, data: rowData.id}]);
                        setParentId(rowData.id)
                    }}
                />
                <Button icon="pi pi-pencil" severity="info" className="mr-2" onClick={
                    () => {
                        setCategory(rowData);
                        router.push('/categories/update');
                    }}
                />
                <Button icon="pi pi-trash" severity="danger" onClick={
                    () => {
                        categoryService.deleteCategory(rowData.id).then(
                           value => {
                               showToast("success", "Category has been deleted");
                               fetchCategoriesData()
                           }
                       )
                    }}
                />
            </>
        );
    };

    const fetchCategoriesData = async () => {
        const categoriesData = await categoryService.fetchCategoriesWithoutSub(parentId);
        if(categoriesData != undefined) {
            setCategories(prevState => categoriesData);
        }
        else{
            showToast("error", "Categories Could Not Be Fetched");
        }
    };


    useEffect(() => {
        fetchCategoriesData();
    }, [parentId]);

    return (
        <div className="flex flex-column px-5 pt-5" style={{height:"100vh"}}>
            <div className="flex-shrink-0 ">
                <Toolbar className="mb-4" start={startToolbarTemplate} end={endToolbarTemplate} ></Toolbar>
                <BreadCrumb model={breadcrumbItems.map((item, index) => ({
                    label: item.label,
                    command: () => {
                        setParentId(item.data)
                        const newItems = breadcrumbItems.slice(0, index + 1);
                        setBreadcrumbItems(newItems)
                    }
                }))} home={breadcrumbHome} />
            </div>
             <div className="flex-grow-1">
                <DataTable scrollable scrollHeight="flex" value={categories} stripedRows showGridlines  size={"normal"}>
                    <Column field="nameEn" header="Name EN"></Column>
                    <Column field="nameAr" header="Name AR"></Column>
                    <Column body={actionBodyTemplate} style={{ width: '15rem' }}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Page;
