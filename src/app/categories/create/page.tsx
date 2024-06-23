'use client';

import CategoryForm from "@/components/categoryForm";
import {useAppContext} from "@/contexts/appContext";
import {TreeSelectSelectionKeysType} from "primereact/treeselect";
import {CategoryCreateRequest} from "@/interfaces/category";
import {transformSelectedTreeNodeValuesToCategoryIds} from "@/interfaces/category";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useState} from "react";
import {CategoryService} from "@/services/categoriesService";
import {ServerResponseError} from "@/serverResponseError";

const Page = () => {
    const categoryService = new CategoryService();
    const router = useRouter();
    const searchParams = useSearchParams()
    const parentId = searchParams.get('parentId') ?? null
    const { showToast, addErrorMessages } = useAppContext();
    const [ errors, setErrors ] = useState<string[]>();

    const sendForm = async (nameEn: string, nameAr: string) =>
    {
        const category: CategoryCreateRequest = {
            nameEn: nameEn,
            nameAr: nameAr,
            parentId: parentId ?? null,
        }

        try{
            console.log(category)
            const categoriesData = await categoryService.createCategory(category);
            console.log(categoriesData);
            if(categoriesData != undefined) {
                showToast("success", "Category has been added");
                router.back()
            }
            else{
                showToast("error", "Categorys Could Not Be created");
            }
        }catch (error)
        {
            showToast("error", "Categorys Could Not Be created");
            if(error instanceof ServerResponseError)
            {
                addErrorMessages(error.errors.map(e => e.errorMessage));
            }
        }
    }

    return (
        <div className="p-5">
            <h1 className="mb-5">Create Category</h1>
            {errors?.map((item) => (
                <li key={item}>{item}</li>
            ))}
            <CategoryForm onFormSubmit={sendForm} category={undefined}></CategoryForm>
        </div>
    )
}

export default Page;