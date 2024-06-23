import { ServerResponse } from "@/interfaces/serverResponse";
import { ServerResponseError } from "@/serverResponseError"
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class BaseHttpService {
    protected async handleResponse<T>(responsePromise: Promise<ServerResponse<T> | undefined>): Promise<T | undefined> {
        try {
            const response = await responsePromise;
            if (response !== undefined) {
                if(response.isSuccess)
                {
                    return response.data;
                }else{
                    throw new ServerResponseError(response.errors);
                }
            }
            return undefined;
        } catch (error) {
            if (error instanceof ServerResponseError) {
                throw error;
            } else {
                console.error('Error handling response:', error);
                throw error;
            }
        }
    }

    protected async sendRequest<T>(method: "Get" | "Post" | "Put" | "Delete", url: string, data?: any): Promise<ServerResponse<T> | undefined> {
        try {
            let response;
            switch (method) {
                case "Get":
                    response = await axios.get<ServerResponse<T>>(`${API_URL}/${url}`);
                    break;
                case "Post":
                    response = await axios.post<ServerResponse<T>>(`${API_URL}/${url}`, data);
                    break;
                case "Put":
                    response = await axios.put<ServerResponse<T>>(`${API_URL}/${url}`, data);
                    break;
                case "Delete":
                    response = await axios.delete<ServerResponse<T>>(`${API_URL}/${url}`);
                    break;
                default:
                    throw new Error("Invalid method");
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 400) {
                        console.error(`Error ${method} data (Bad Request):`, error.response.data);

                        return error.response.data;
                    } else {
                        console.error(`Error ${method} data (Server Error):`, error.response.data);
                    }
                } else if (error.request) {
                    console.error(`No response received for ${method} request:`, error.request);
                } else {
                    console.error(`Error in ${method} request:`, error.message);
                }
            } else {
                console.error(`Unknown error in ${method} request:`, error);
            }
            return undefined;
        }
    }
}
