import { useEffect, useMemo, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { reportApi } from "@/app/api/report";

export function ReportsPage() {
  const [options, setOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filters, setFilters] = useState({});

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const [preview, setPreview] = useState(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await reportApi.getOptions();
        const opts = data.options || [];
        setOptions(opts);
        if (opts.length > 0) {
          setSelectedType(opts[0].type);
          setFilters({});
        }
      } catch (e) {
        setError(e?.message || "Failed to load report options");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedOption = useMemo(
    () => options.find((o) => o.type === selectedType),
    [options, selectedType]
  );

  const previewRows = preview?.rows || [];
  const totalPages = Math.max(1, Math.ceil(previewRows.length / ITEMS_PER_PAGE));
  const pagedRows = previewRows.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const onGenerate = async () => {
    try {
      setError("");
      setGenerating(true);
      setPage(1);
      const data = await reportApi.preview({ type: selectedType, filters });
      setPreview(data);
    } catch (e) {
      setError(e?.message || "Failed to generate report preview");
    } finally {
      setGenerating(false);
    }
  };

  const download = async (format) => {
    if (!preview?.reportId) return;
    try {
      setError("");
      const { blob, fileName } = await reportApi.exportFile(preview.reportId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.message || "Export failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p>Loading report options...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Generate Report</h2>
        <p className="text-gray-500 text-sm">
          Select report type, set filters, preview, then export to CSV / Excel / PDF.
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">Report type</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setFilters({});
                  setPreview(null);
                  setPage(1);
                }}
                className="w-full md:w-[320px] border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm"
              >
                {options.map((opt) => (
                  <option key={opt.type} value={opt.type}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onGenerate}
                disabled={!selectedType || generating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Preview
              </button>
              <button
                onClick={() => download("CSV")}
                disabled={!preview?.reportId}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => download("XLSX")}
                disabled={!preview?.reportId}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={() => download("PDF")}
                disabled={!preview?.reportId}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          {selectedOption?.filters?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedOption.filters.map((f) => (
                <div key={f.key} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-800">
                    {f.label} {f.required ? <span className="text-rose-600">*</span> : null}
                  </label>
                  {f.type === "enum" ? (
                    <select
                      value={filters?.[f.key] ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [f.key]: e.target.value || undefined,
                        }))
                      }
                      className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm"
                    >
                      <option value="">All</option>
                      {(f.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === "date" ? "date" : "text"}
                      value={filters?.[f.key] ?? ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [f.key]: e.target.value || undefined,
                        }))
                      }
                      className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          {!preview ? (
            <div className="text-sm text-gray-500">
              Choose a report type and click <span className="font-semibold text-gray-800">Preview</span>.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  Preview rows: <span className="font-semibold text-gray-900">{previewRows.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-gray-600">
                    Page <span className="font-semibold text-gray-900">{page}</span> / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      {preview.columns.map((c) => (
                        <th key={c} className="px-4 py-3 font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row, idx) => (
                      <tr key={idx} className="bg-white border-b border-gray-50 hover:bg-gray-50/50">
                        {preview.columns.map((_, cIdx) => (
                          <td key={cIdx} className="px-4 py-3">
                            {row?.[cIdx] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {pagedRows.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-center text-gray-500" colSpan={preview.columns.length}>
                          No data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}