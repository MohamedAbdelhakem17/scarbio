declare type ErrorResponse = {
  status: 'error' | 'fail';
  message: {
    [key: string]: string[];
  };
  stack?: string;
};

declare type SuccessResponse<T> = {
  status: 'success';
  message: string;
  data: T;
};

declare type ApiResponse<T> = ErrorResponse | SuccessResponse<T>;
