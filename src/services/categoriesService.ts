
import {Category, CategoryCreateRequest, CategoryUpdateRequest, CategoryWithProductCount} from "@/interfaces/category";
import { BaseHttpService } from "@/services/baseHttpService";


const URL = "categories";

export class CategoryService extends BaseHttpService {
    async fetchCategories(): Promise<Category[] | undefined> {
        return this.handleResponse(this.sendRequest<Category[]>("Get", URL));
    }

    async fetchCategoriesWithCount(): Promise<CategoryWithProductCount[] | undefined> {
        return this.handleResponse(this.sendRequest<CategoryWithProductCount[]>("Get", URL + "/withProductsCount"));
    }

    async fetchCategoriesWithoutSub(parentId: string|undefined): Promise<Category[] | undefined> {
        let params = "?allCategories=false"
        if(parentId != undefined) params = params + "&parentId=" + parentId;
        return this.handleResponse(this.sendRequest<Category[]>("Get", URL + params));
    }

    async createCategory(category: CategoryCreateRequest): Promise<Category  | undefined> {
        return this.handleResponse(this.sendRequest<Category>("Post", URL, category));
    }

    async updateCategory(category: CategoryUpdateRequest): Promise<Category  | undefined> {
        return this.handleResponse(this.sendRequest<Category>("Put", URL, category));
    }

    async deleteCategory(id: string): Promise<Category  | undefined> {
        return this.handleResponse(this.sendRequest<Category>("Delete", `${URL}/${id}`));
    }
}