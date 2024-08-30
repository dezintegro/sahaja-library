export type Nullable<T> = T | null

export interface IPaginatedResponse<T> {
  count: number
  next: Nullable<string>
  previous: Nullable<string>
  results: T[]
}
