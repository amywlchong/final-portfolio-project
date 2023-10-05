type ServiceResponse<T> = {
  success: boolean;
  data?: T;
};

type ServiceFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

interface LoadingHandlers {
  startLoading: () => void;
  endLoading: () => void;
}

export const createServiceHandler = <T, Args extends any[]>(
  serviceFunction: ServiceFunction<T, Args>,
  { startLoading, endLoading }: LoadingHandlers
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
      console.error("Error:", error?.response?.data || "An error occurred.");
      return {
        success: false,
      };
    } finally {
      endLoading();
    }
  };
};
