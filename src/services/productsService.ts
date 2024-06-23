import { Product, ProductCreateRequest, ProductUpdateRequest } from "@/interfaces/product";
import { BaseHttpService } from "@/services/baseHttpService";
import {Paginated} from "@/interfaces/paginated";

const URL = "products";

export class ProductService extends BaseHttpService {

    async fetchProducts(page:number, rows:number,searchCriteria: string, selectedCategories: string[]): Promise<Paginated<Product[]>  | undefined> {
        let params = "";
        selectedCategories.forEach(value => {
           params = params + "&categoryIds=" + value;
        });
        params += "&page=" + page;
        params += "&pageSize=" + rows;

        return this.handleResponse(this.sendRequest<Paginated<Product[]> >("Get", URL + "?searchCriteria=" + searchCriteria + params));
    }

    async createProduct(product: ProductCreateRequest): Promise<Product  | undefined> {
        return this.handleResponse(this.sendRequest<Product>("Post", URL, product));
    }

    async updateProduct(product: ProductUpdateRequest): Promise<Product  | undefined> {
        return this.handleResponse(this.sendRequest<Product>("Put", URL, product));
    }

    async deleteProduct(id: string): Promise<Product  | undefined> {
        return this.handleResponse(this.sendRequest<Product>("Delete", `${URL}/${id}`));
    }
}
