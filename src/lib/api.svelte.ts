import { getContext, setContext } from "svelte";

class ApiStore {
  constructor(
    private readonly basePath: string,
    private readonly apiBase: string,
  ) {}

  get baseUri() {
    return new URL(this.basePath, document.baseURI || "/").pathname;
  }

  async fetchPatients() {
    const res = await fetch(`${this.apiBase}/patients`);
    const json = await res.json();
  }

  async fetchDoctors() {
    const res = await fetch(`${this.apiBase}/doctors`);
    const json = await res.json();
  }
}

const API_KEY = Symbol("API_CONTEXT");

export function createApiContext(basePath: string, apiBase: string) {
  return setContext(API_KEY, new ApiStore(basePath, apiBase));
}

export function useApiContext() {
  const context = getContext<ApiStore>(API_KEY);
  if (!context) {
    throw new Error("useApiContext must be used after createApiContext");
  }
  return context;
}
