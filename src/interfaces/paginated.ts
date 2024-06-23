export interface Paginated<T> {
    totalRecords: number
    pageSize: number
    currentPage: number
    totalPages: number
    data: T
}