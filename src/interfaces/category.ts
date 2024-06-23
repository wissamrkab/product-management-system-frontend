import {TreeSelectSelectionKeysType} from "primereact/treeselect";
import {it} from "node:test";

export interface Category {
    id: string
    nameEn: string
    nameAr: string
    parentId: string
    createdBy: string
    createdDate: string
    updatedBy: string
    updatedDate: string
}
export interface CategoryWithProductCount {
    name: string
    count: number
}

export interface CategoryCreateRequest {
    nameEn: string
    nameAr: string
    parentId: string|null
}

export interface CategoryUpdateRequest {
    id: string,
    nameEn: string
    nameAr: string
    parentId: string | null
}

export interface TreeNodeCategory {
    key: string;
    label: string;
    selectable?: boolean;
    children?: TreeNodeCategory[];
}

export const transformCategoriesToTreeNodes = (categories: Category[]): TreeNodeCategory[] => {
    const categoriesMap: Record<string, TreeNodeCategory> = {};

    categories.forEach(category => {
        const transformedCategory: TreeNodeCategory = {
            key: category.id,
            label: category.nameEn,
        };

        if (category.parentId === null) {
            transformedCategory.selectable = false;

            categoriesMap[category.id] = transformedCategory;
        } else {
            const parentCategory = categoriesMap[category.parentId];

            if (parentCategory) {
                if (!parentCategory.children) {
                    parentCategory.children = [];
                }

                parentCategory.children.push(transformedCategory);
            }
        }
    });

    const transformedCategories = Object.values(categoriesMap);

    return transformedCategories;
};

export const transformCategoriesToSelectedTreeNodeValues = (categories: Category[]): TreeSelectSelectionKeysType => {
    let categoriesMap: TreeSelectSelectionKeysType = {}

    categories.forEach(category => {
        categoriesMap = {
            ...categoriesMap,
            [category.id]: true
        }
    });

    return categoriesMap;
};

export const transformSelectedTreeNodeValuesToCategoryIds = (treeSelectSelectionKeysTypes: TreeSelectSelectionKeysType): string[] => {
    if(treeSelectSelectionKeysTypes == null) return [];
    const categoriesMap: string[] = Object.keys(treeSelectSelectionKeysTypes)

    const transformedCategories = Object.values(categoriesMap);

    return transformedCategories;
};