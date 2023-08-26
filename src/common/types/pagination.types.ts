export type PaginatedResponse<T> = {
  items: T[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}
