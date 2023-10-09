export class ApiError extends Error {
  response?: {
    data: string;
    status: number;
  };
}
