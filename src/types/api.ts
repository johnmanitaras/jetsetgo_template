export interface ApiResponse {
  data: any;
  debug: {
    url: string;
    headers: Record<string, string>;
  };
}