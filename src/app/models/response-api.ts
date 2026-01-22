export interface Response<T> {
  flag: boolean;
  message: string;
  data: T;
}