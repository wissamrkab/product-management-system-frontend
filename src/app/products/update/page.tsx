'use client';

import ProductForm from "@/components/productForm";
import {ProductService} from "@/services/productsService";
import {useAppContext} from "@/contexts/appContext";
import {TreeSelectSelectionKeysType} from "primereact/treeselect";
import {Product, ProductCreateRequest, ProductUpdateRequest} from "@/interfaces/product";
import {transformSelectedTreeNodeValuesToCategoryIds} from "@/interfaces/category";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {ServerResponseError} from "@/serverResponseError";

const Page = () => {
    const productService = new ProductService();
    const { showToast, addErrorMessages, product } = useAppContext();
    const router = useRouter();
    const [localProduct, setLocalProduct] = useState<Product | undefined>(product ?? undefined);

    const sendForm = async (name: string, isbn: string, price: number, categories: TreeSelectSelectionKeysType) =>
    {
        const product: ProductUpdateRequest = {
            id: localProduct?.id!,
            name: name,
            isbn: isbn,
            price: price,
            categories: transformSelectedTreeNodeValuesToCategoryIds(categories),
        }

        try{
            const productsData = await productService.updateProduct(product);
            if(productsData != undefined) {
                showToast("success", "Product has been updated");
                router.back()
            }
            else{
                showToast("error", "Products Could Not Be updated");
            }
        }
        catch (error)
        {
            showToast("error", "Products Could Not Be created");
            if(error instanceof ServerResponseError)
            {
                addErrorMessages(error.errors.map(e => e.errorMessage));
            }
        }
    }

    return (
        <div className="px-5 py-3">
            <h1 className="mb-5">Update Product</h1>
            <ProductForm onFormSubmit={sendForm} product={localProduct}></ProductForm>
        </div>
    )
}

export default Page;