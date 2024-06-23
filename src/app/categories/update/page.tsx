'use client';

import CategoryForm from "@/components/categoryForm";
import {CategoryService} from "@/services/categoriesService";
import {useAppContext} from "@/contexts/appContext";
import {TreeSelectSelectionKeysType} from "primereact/treeselect";
import {Category, CategoryCreateRequest, CategoryUpdateRequest} from "@/interfaces/category";
import {transformSelectedTreeNodeValuesToCategoryIds} from "@/interfaces/category";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {ServerResponseError} from "@/serverResponseError";

const Page = () => {
    const categoryService = new CategoryService();
    const { showToast, addErrorMessages, category } = useAppContext();
    const router = useRouter();
    const [localCategory, setLocalCategory] = useState<Category | undefined>(category ?? undefined);

    const sendForm = async (nameEn: string, nameAr: string) =>
    {
        const category: CategoryUpdateRequest = {
            id: localCategory?.id!,
            nameEn: nameEn,
            nameAr: nameAr,
            parentId: localCategory?.parentId ?? null
        }

        try{
            const categoriesData = await categoryService.updateCategory(category);
            if(categoriesData != undefined) {
                showToast("success", "Category has been updated");
                router.back()
            }
            else{
                showToast("error", "Categorys Could Not Be updated");
            }
        }
        catch (error)
        {
            showToast("error", "Categorys Could Not Be created");
            if(error instanceof ServerResponseError)
            {
                addErrorMessages(error.errors.map(e => e.errorMessage));
            }
        }
    }

    return (
        <div className="px-5 py-3">
            <h1 className="mb-5">Update Category</h1>
            <CategoryForm onFormSubmit={sendForm} category={localCategory}></CategoryForm>
        </div>
    )
}

export default Page;