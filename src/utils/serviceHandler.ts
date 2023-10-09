import { ApiError } from "./ApiError";

type ServiceResponse<T> = {
  success: boolean;
  data?: T;
};

type ServiceFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

interface LoadingHandlers {
  startLoading: () => void;
  endLoading: () => void;
}

interface ErrorHandler {
  handle: (error: ApiError) => void;
}

export const createServiceHandler = <T, Args extends any[]>(
  serviceFunction: ServiceFunction<T, Args>,
  { startLoading, endLoading }: LoadingHandlers,
  errorHandler?: ErrorHandler
) => {
  return async (...args: Args): Promise<ServiceResponse<T>> => {
    startLoading();

    try {
      const data = await serviceFunction(...args);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      // Cast error to ApiError
      const apiError: ApiError = error instanceof ApiError ? error : new ApiError("An error occurred.");

      if (error.response) {
        apiError.response = {
          data: error.response.data,
          status: error.response.status
        };
      }

      console.error("Error:", apiError.response?.data || apiError.message);
      errorHandler?.handle(apiError);
      return {
        success: false,
      };
    } finally {
      endLoading();
    }
  };
};
