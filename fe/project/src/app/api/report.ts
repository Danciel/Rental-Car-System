const REPORT_SERVICE_URL = "http://localhost:8080/api/reports";

export type ReportFormat = "CSV" | "XLSX" | "PDF";

export interface ReportFilterField {
  key: string;
  label: string;
  type: "enum" | "text" | "date";
  required: boolean;
  options?: string[];
}

export interface ReportOption {
  type: string;
  label: string;
  filters: ReportFilterField[];
}

export interface ReportOptionsResponse {
  options: ReportOption[];
}

export interface ReportPreviewRequest {
  type: string;
  filters?: Record<string, any>;
}

export interface ReportPreviewResponse {
  reportId: number;
  type: string;
  columns: string[];
  rows: any[][];
}

async function getWithAuth<T>(url: string): Promise<T> {
  const token = localStorage.getItem("ACCESS_TOKEN");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json.data as T;
}

async function postWithAuth<T>(url: string, body: unknown): Promise<T> {
  const token = localStorage.getItem("ACCESS_TOKEN");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json.data as T;
}

export const reportApi = {
  getOptions: () => getWithAuth<ReportOptionsResponse>(`${REPORT_SERVICE_URL}/options`),

  preview: (req: ReportPreviewRequest) =>
    postWithAuth<ReportPreviewResponse>(`${REPORT_SERVICE_URL}/preview`, req),

  exportFile: async (reportId: number, format: ReportFormat) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${REPORT_SERVICE_URL}/${reportId}/export?format=${format}`, { headers });
    if (!res.ok) {
      let msg = "Export failed";
      try {
        const json = await res.json();
        msg = json.message || msg;
      } catch {
        // ignore
      }
      throw new Error(msg);
    }

    const blob = await res.blob();
    const disposition = res.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="([^"]+)"/i);
    const fileName = match?.[1] || `report.${format.toLowerCase()}`;
    return { blob, fileName };
  },
};

