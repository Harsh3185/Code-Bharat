const localBackendUrl =
  import.meta.env.VITE_BACKEND_URL_DEV || "http://localhost:8000";

const localCompilerUrl =
  import.meta.env.VITE_COMPILER_URL_DEV || "http://localhost:7000";

export const BACKEND_URL = import.meta.env.DEV
  ? localBackendUrl
  : import.meta.env.VITE_BACKEND_URL || localBackendUrl;

export const COMPILER_URL = import.meta.env.DEV
  ? localCompilerUrl
  : import.meta.env.VITE_COMPILER_URL || localCompilerUrl;
