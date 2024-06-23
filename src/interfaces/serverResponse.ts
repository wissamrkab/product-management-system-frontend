export interface ServerResponse<T> {
    isSuccess: boolean
    data: T
    errors: ResponseError[]
}

export interface ResponseError {
    errorMessage: string
    errorCode: string
}