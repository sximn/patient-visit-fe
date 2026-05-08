import { getContext, setContext } from "svelte";
import createClient, { type Client } from "openapi-fetch";
import type { components, paths } from "./api-schema";

class ApiStore {
  private readonly client: Client<paths, `${string}/${string}`>;

  constructor(
    private readonly basePath: string,
    private readonly apiBase: string,
  ) {
    this.client = createClient<paths>({ baseUrl: this.apiBase });
  }

  get baseUri() {
    return new URL(this.basePath, document.baseURI || "/").pathname;
  }

  async fetchPatients() {
    return await this.client.GET("/patients");
  }

  async fetchDoctors() {
    return await this.client.GET("/doctors");
  }

  async fetchAllVisits() {
    return await this.client.GET("/patient-visits");
  }
  async fetchPatientVisits(id: string) {
    return await this.client.GET("/patients/{id}/visits", {
      params: { path: { id } },
    });
  }
  async fetchDoctorVisits(id: string) {
    return await this.client.GET("/doctors/{id}/visits", {
      params: { path: { id } },
    });
  }

  async createPatientVisit(
    visit: components["schemas"]["PatientVisitCreateUpdate"],
  ) {
    return await this.client.POST("/patient-visits", { body: visit });
  }
  async updatePatientVisit(
    id: string,
    visit: components["schemas"]["PatientVisitCreateUpdate"],
  ) {
    return await this.client.PUT("/patient-visits/{id}", {
      params: { path: { id } },
      body: visit,
    });
  }
  async deletePatientVisit(id: string) {
    return await this.client.DELETE("/patient-visits/{id}", {
      params: { path: { id } },
    });
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
