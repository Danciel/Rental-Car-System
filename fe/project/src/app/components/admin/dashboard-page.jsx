import { useEffect, useMemo, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { carApi } from "@/app/api/api";
import { reportApi } from "@/app/api/report";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#ec4899", "#eab308", "#0ea5e9"];

// ✅ VND formatter
const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";

function formatDateISO(d) {
  return d.toISOString().slice(0, 10);
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [revenueDaily, setRevenueDaily] = useState([]);
  const [bookingsDaily, setBookingsDaily] = useState([]);
  const [carStatus, setCarStatus] = useState([]);
  const [popularCars, setPopularCars] = useState([]);
  const [revenueByBrand, setRevenueByBrand] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const today = new Date();
        const fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 29);
        const dateFrom = formatDateISO(fromDate);
        const dateTo = formatDateISO(today);

        const token = localStorage.getItem("ACCESS_TOKEN");
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

        const [cars, revenuePreview, popularPreview, bookingsManage] = await Promise.all([
          carApi.getAll(),
          reportApi.preview({ type: "REVENUE_REPORT", filters: { dateFrom, dateTo } }),
          reportApi.preview({ type: "POPULAR_CAR_REPORT", filters: { dateFrom, dateTo, topN: 10 } }),
          fetch("http://localhost:8080/api/bookings/manage", { headers: authHeaders }).then((r) => r.json()),
        ]);

        // 1) Revenue per day
        const revRows = (revenuePreview.rows || []).filter((row) => row[0] !== "TOTAL");
        setRevenueDaily(
          revRows.map((row) => ({
            date: row[0],
            revenue: Number(row[1]) || 0,
          }))
        );

        // 2) Bookings per day
        const bookingsData = (bookingsManage.data || []).reduce((acc, b) => {
          const created = (b.createdAt || "").slice(0, 10);
          if (!created) return acc;
          acc[created] = (acc[created] || 0) + 1;
          return acc;
        }, {});
        setBookingsDaily(
          Object.entries(bookingsData)
            .map(([date, count]) => ({ date, bookings: count }))
            .sort((a, b) => (a.date < b.date ? -1 : 1))
        );

        // 3) Car status
        const statusCounts = cars.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, {});
        setCarStatus(
          Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
          }))
        );

        // 4) Popular cars
        const popRows = (popularPreview.rows || []).filter((row) => row[0] !== "TOTAL");
        const popular = popRows.map((row) => ({
          carId: String(row[0]),
          carName: row[1],
          bookings: Number(row[2]) || 0,
          revenue: Number(row[3]) || 0,
        }));
        setPopularCars(popular);

        // ✅ FIX: normalize ID type
        const carById = new Map(cars.map((c) => [String(c.id), c]));

        // 5) ✅ Revenue by brand from ALL bookings (correct)
        const byBrand = (bookingsManage.data || []).reduce((acc, b) => {
          const car = carById.get(String(b.carId));
          const brand = car?.brandName || "Unknown";
          const revenue = Number(b.totalPrice) || 0;

          acc[brand] = (acc[brand] || 0) + revenue;
          return acc;
        }, {});

        setRevenueByBrand(
          Object.entries(byBrand)
            .map(([brand, revenue]) => ({ brand, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
        );
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartConfig = useMemo(
    () => ({
      revenue: { label: "Revenue", color: "hsl(221, 83%, 53%)" },
      bookings: { label: "Bookings", color: "hsl(142, 71%, 45%)" },
    }),
    []
  );

  if (loading) {
    return (
      <Card className="p-10 text-center">
        <p>Loading dashboard...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && <Card className="p-4 text-red-600">{error}</Card>}

      {/* Revenue + Bookings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="mb-2">Daily Revenue</h3>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={revenueDaily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatVND} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="revenue" stroke="var(--color-revenue)" dot={false} />
            </LineChart>
          </ChartContainer>
        </Card>

        <Card className="p-4">
          <h3 className="mb-2">Daily Bookings</h3>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={bookingsDaily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="bookings" stroke="var(--color-bookings)" dot={false} />
            </LineChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Pie + Top Cars */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3>Fleet Status</h3>
          <ResponsiveContainer height={250}>
            <PieChart>
              <Pie data={carStatus} dataKey="count" nameKey="status">
                {carStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3>Top Cars</h3>
          <ResponsiveContainer height={250}>
            <BarChart
              data={popularCars.map((c) => ({
                name: c.carName,
                revenue: c.revenue,
              }))}
              layout="vertical"
            >
              <XAxis type="number" tickFormatter={formatVND} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(v) => formatVND(v)} />
              <Bar dataKey="revenue">
                {popularCars.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue by Brand */}
      <Card className="p-4">
        <h3>Revenue by Brand</h3>
        <ResponsiveContainer height={250}>
         <BarChart
  data={revenueByBrand}
  margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
>
            <XAxis dataKey="brand" />
<YAxis
  tickFormatter={formatVND}
  width={100}
/>            <Tooltip formatter={(v) => formatVND(v)} />
            <Bar dataKey="revenue">
              {revenueByBrand.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}