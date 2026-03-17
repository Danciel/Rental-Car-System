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
        const data = await reportApi.getOptions();
        const opts = data.options || [];
        setOptions(opts);
        if (opts.length > 0) {
          setSelectedType(opts[0].type);
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
      setGenerating(true);
      setError("");
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
      const { blob, fileName } = await reportApi.exportFile(preview.reportId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.message || "Export failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
        <p className="text-sm">Loading report system...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <p className="text-sm text-gray-500">
          Generate insights, preview results, and export data.
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
          {error}
        </div>
      )}

      <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
        {/* CONTROLS */}
        <div className="p-6 border-b border-gray-100 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Report Type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase text-gray-500">
                Report Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setFilters({});
                  setPreview(null);
                }}
                className="w-full lg:w-[300px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {options.map((opt) => (
                  <option key={opt.type} value={opt.type}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onGenerate}
                disabled={!selectedType || generating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Generate
              </button>

              {["CSV", "XLSX", "PDF"].map((format) => (
                <button
                  key={format}
                  onClick={() => download(format)}
                  disabled={!preview?.reportId}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* FILTERS */}
          {selectedOption?.filters?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedOption.filters.map((f) => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">
                    {f.label}
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
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">All</option>
                      {(f.options || []).map((opt) => (
                        <option key={opt}>{opt}</option>
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
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="p-6">
          {!preview ? (
            <div className="text-sm text-gray-500 text-center py-10">
              No preview yet. Click <span className="font-semibold">Generate</span>.
            </div>
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-gray-600">
                  {previewRows.length} rows
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span>
                    {page} / {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-auto border rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      {preview.columns.map((c) => (
                        <th key={c} className="px-4 py-3 text-left font-semibold text-gray-700">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {pagedRows.map((row, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        {row.map((cell, i) => (
                          <td key={i} className="px-4 py-3">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {pagedRows.length === 0 && (
                      <tr>
                        <td colSpan={preview.columns.length} className="text-center py-8 text-gray-500">
                          No data available
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