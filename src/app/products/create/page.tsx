'use client';

import ProductForm from "@/components/productForm";
import {useAppContext} from "@/contexts/appContext";
import {TreeSelectSelectionKeysType} from "primereact/treeselect";
import {ProductCreateRequest} from "@/interfaces/product";
import {transformSelectedTreeNodeValuesToCategoryIds} from "@/interfaces/category";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {ProductService} from "@/services/productsService";
import {ServerResponseError} from "@/serverResponseError";

const Page = () => {
    const productService = new ProductService();
    const { showToast, addErrorMessages } = useAppContext();
    const router = useRouter();
    const [ errors, setErrors ] = useState<string[]>();

    const sendForm = async (name: string, isbn: string, price: number, categories: TreeSelectSelectionKeysType) =>
    {
        const product: ProductCreateRequest = {
            name: name,
            isbn: isbn,
            price: price,
            categories: transformSelectedTreeNodeValuesToCategoryIds(categories),
        }

        try{
            const productsData = await productService.createProduct(product);
            console.log(productsData);
            if(productsData != undefined) {
                showToast("success", "Product has been added");
                router.back()
            }
            else{
                showToast("error", "Products Could Not Be created");
            }
        }catch (error)
        {
            showToast("error", "Products Could Not Be created");
            if(error instanceof ServerResponseError)
            {
                addErrorMessages(error.errors.map(e => e.errorMessage));
            }
        }
    }

    return (
        <div>
            <h1 className="mb-5">Create Product</h1>
            {errors?.map((item) => (
                <li key={item}>{item}</li>
            ))}
            <ProductForm onFormSubmit={sendForm} product={undefined}></ProductForm>
        </div>
    )
}

export default Page;