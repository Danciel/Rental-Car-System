package com.swd.reportservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swd.reportservice.client.DownstreamApiClient;
import com.swd.reportservice.domain.ReportType;
import com.swb.common.dtos.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class ReportDataService {

    private final DownstreamApiClient downstreamApiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ReportTable fetchReport(ReportType type, Map<String, Object> filters) {
        return switch (type) {
            case CAR_LIST -> fetchCarList(filters);
            case USER_LIST -> fetchUserList();
            case REVENUE_REPORT -> fetchRevenueReport(filters);
            case POPULAR_CAR_REPORT -> fetchPopularCarReport(filters);
        };
    }

    private ReportTable fetchCarList(Map<String, Object> filters) {
        String status = filters == null ? null : asString(filters.get("status"));
        String query = (status == null || status.isBlank()) ? "" : ("?status=" + status);

        ApiResponse<?> resp = downstreamApiClient.getCars(ApiResponse.class, query);
        List<Map<String, Object>> items = coerceListOfMaps(resp == null ? null : resp.getData());

        List<String> columns = List.of("ID", "Car Name", "License Plate", "Status", "Price/Day", "Deposit");
        List<List<Object>> rows = new ArrayList<>();
        for (Map<String, Object> item : items) {
            Object id = item.get("id");
            String brandName = asString(item.get("brandName"));
            String modelName = extractNestedString(item, "carModelId", "name");
            String carName = (brandName + " " + modelName).trim();
            if (carName.isBlank()) carName = "N/A";
            rows.add(List.of(
                    id,
                    carName,
                    defaultString(item.get("licensePlate"), "N/A"),
                    defaultString(item.get("status"), "N/A"),
                    defaultNumber(item.get("basePricePerDay"), 0),
                    defaultNumber(item.get("depositAmount"), 0)
            ));
        }
        return new ReportTable(columns, rows);
    }

    private ReportTable fetchUserList() {
        ApiResponse<?> resp = downstreamApiClient.getUsers(ApiResponse.class);
        List<Map<String, Object>> items = coerceListOfMaps(resp == null ? null : resp.getData());

        List<String> columns = List.of("ID", "Full Name", "Email", "Roles", "Wallet Balance", "Status");
        List<List<Object>> rows = new ArrayList<>();
        for (Map<String, Object> item : items) {
            Object id = item.get("id");
            Object rolesObj = item.get("roles");
            String roles = rolesObj instanceof List<?> list ? String.join(", ", list.stream().map(String::valueOf).toList())
                    : defaultString(rolesObj, "N/A");
            rows.add(List.of(
                    id,
                    defaultString(item.get("fullName"), "N/A"),
                    defaultString(item.get("email"), "N/A"),
                    roles == null || roles.isBlank() ? "N/A" : roles,
                    defaultNumber(item.get("walletBalance"), 0),
                    defaultString(item.get("status"), "ACTIVE")
            ));
        }
        return new ReportTable(columns, rows);
    }

    private ReportTable fetchRevenueReport(Map<String, Object> filters) {
        LocalDate from = parseDate(filters == null ? null : filters.get("dateFrom"));
        LocalDate to = parseDate(filters == null ? null : filters.get("dateTo"));

        // Pull successful PAYMENT transactions, then filter by date window
        Map<YearMonth, BigDecimal> revenueByMonth = new TreeMap<>();
        BigDecimal total = BigDecimal.ZERO;

        int page = 0;
        int size = 200;
        int maxPages = 100; // safety cap
        while (page < maxPages) {
            String qs = String.format("?type=PAYMENT&status=SUCCESS&page=%d&size=%d&sort=createdAt,desc", page, size);
            ApiResponse<?> resp = downstreamApiClient.getAllTransactions(ApiResponse.class, qs);
            Map<String, Object> pageObj = coerceMap(resp == null ? null : resp.getData());
            List<Map<String, Object>> content = coerceListOfMaps(pageObj.get("content"));

            if (content.isEmpty()) break;

            for (Map<String, Object> tx : content) {
                LocalDate created = parseLocalDateTimeToDate(tx.get("createdAt"));
                if (created == null) continue;
                if (from != null && created.isBefore(from)) continue;
                if (to != null && created.isAfter(to)) continue;

                BigDecimal amount = parseBigDecimal(tx.get("amount"));
                if (amount == null) amount = BigDecimal.ZERO;
                revenueByMonth.merge(YearMonth.from(created), amount, BigDecimal::add);
                total = total.add(amount);
            }

            // stop early if we already passed "from" and data is sorted desc
            if (from != null) {
                LocalDate lastCreated = parseLocalDateTimeToDate(content.get(content.size() - 1).get("createdAt"));
                if (lastCreated != null && lastCreated.isBefore(from)) break;
            }

            page++;
        }

        List<String> columns = List.of("Month", "Revenue");
        List<List<Object>> rows = new ArrayList<>();
        for (Map.Entry<YearMonth, BigDecimal> e : revenueByMonth.entrySet()) {
            rows.add(List.of(e.getKey().toString(), e.getValue()));
        }
        rows.add(List.of("TOTAL", total));

        return new ReportTable(columns, rows);
    }

    private ReportTable fetchPopularCarReport(Map<String, Object> filters) {
        LocalDate from = parseDate(filters == null ? null : filters.get("dateFrom"));
        LocalDate to = parseDate(filters == null ? null : filters.get("dateTo"));
        Integer topN = parseInt(filters == null ? null : filters.get("topN"));
        if (topN == null || topN <= 0) topN = 10;
        if (topN > 100) topN = 100;

        ApiResponse<?> resp = downstreamApiClient.getBookingsManage(ApiResponse.class);
        List<Map<String, Object>> bookings = coerceListOfMaps(resp == null ? null : resp.getData());

        // Aggregate by carId
        Map<Long, PopularAgg> agg = new HashMap<>();
        for (Map<String, Object> b : bookings) {
            LocalDate created = parseLocalDateTimeToDate(b.get("createdAt"));
            if (created == null) continue;
            if (from != null && created.isBefore(from)) continue;
            if (to != null && created.isAfter(to)) continue;

            Long carId = parseLong(b.get("carId"));
            if (carId == null) continue;

            BigDecimal totalPrice = parseBigDecimal(b.get("totalPrice"));
            if (totalPrice == null) totalPrice = BigDecimal.ZERO;

            PopularAgg a = agg.computeIfAbsent(carId, k -> new PopularAgg());
            a.count++;
            a.revenue = a.revenue.add(totalPrice);
        }

        // Map carId -> car name by fetching car list once
        ApiResponse<?> carsResp = downstreamApiClient.getCars(ApiResponse.class, "");
        List<Map<String, Object>> cars = coerceListOfMaps(carsResp == null ? null : carsResp.getData());
        Map<Long, String> carNameById = new HashMap<>();
        for (Map<String, Object> car : cars) {
            Long id = parseLong(car.get("id"));
            if (id == null) continue;
            String brandName = asString(car.get("brandName"));
            String modelName = extractNestedString(car, "carModelId", "name");
            String carName = (brandName + " " + modelName).trim();
            if (carName.isBlank()) carName = "N/A";
            carNameById.put(id, carName);
        }

        List<Map.Entry<Long, PopularAgg>> sorted = agg.entrySet().stream()
                .sorted(Comparator
                        .<Map.Entry<Long, PopularAgg>>comparingInt(e -> e.getValue().count).reversed()
                        .thenComparing(e -> e.getValue().revenue, Comparator.reverseOrder())
                        .thenComparingLong(Map.Entry::getKey))
                .limit(topN)
                .toList();

        List<String> columns = List.of("Car ID", "Car Name", "Bookings", "Revenue");
        List<List<Object>> rows = new ArrayList<>();
        for (Map.Entry<Long, PopularAgg> e : sorted) {
            Long carId = e.getKey();
            PopularAgg a = e.getValue();
            rows.add(List.of(carId, carNameById.getOrDefault(carId, "N/A"), a.count, a.revenue));
        }

        return new ReportTable(columns, rows);
    }

    private List<Map<String, Object>> coerceListOfMaps(Object data) {
        if (data == null) return List.of();
        if (data instanceof List<?> list) {
            List<Map<String, Object>> out = new ArrayList<>();
            for (Object o : list) out.add(coerceMap(o));
            return out;
        }
        return List.of();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> coerceMap(Object obj) {
        if (obj instanceof Map<?, ?> map) {
            Map<String, Object> out = new LinkedHashMap<>();
            for (Map.Entry<?, ?> e : map.entrySet()) out.put(String.valueOf(e.getKey()), e.getValue());
            return out;
        }
        return objectMapper.convertValue(obj, Map.class);
    }

    private String extractNestedString(Map<String, Object> item, String nestedKey, String key) {
        Object nested = item.get(nestedKey);
        if (nested instanceof Map<?, ?> map) {
            Object v = map.get(key);
            return asString(v);
        }
        return null;
    }

    private String asString(Object v) {
        return v == null ? null : String.valueOf(v);
    }

    private String defaultString(Object v, String dflt) {
        String s = asString(v);
        return s == null || s.isBlank() ? dflt : s;
    }

    private Number defaultNumber(Object v, Number dflt) {
        if (v == null) return dflt;
        if (v instanceof Number n) return n;
        try {
            return Double.parseDouble(String.valueOf(v));
        } catch (Exception ignored) {
            return dflt;
        }
    }

    private LocalDate parseDate(Object v) {
        String s = asString(v);
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s.trim());
        } catch (Exception ignored) {
            return null;
        }
    }

    private LocalDate parseLocalDateTimeToDate(Object v) {
        String s = asString(v);
        if (s == null || s.isBlank()) return null;
        try {
            // common Jackson serialization: 2026-03-16T12:34:56.123
            if (s.length() >= 10) return LocalDate.parse(s.substring(0, 10));
        } catch (Exception ignored) {
        }
        try {
            return OffsetDateTime.parse(s).toLocalDate();
        } catch (Exception ignored) {
            return null;
        }
    }

    private BigDecimal parseBigDecimal(Object v) {
        if (v == null) return null;
        if (v instanceof BigDecimal bd) return bd;
        if (v instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        try {
            return new BigDecimal(String.valueOf(v));
        } catch (Exception ignored) {
            return null;
        }
    }

    private Long parseLong(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.longValue();
        try {
            return Long.parseLong(String.valueOf(v));
        } catch (Exception ignored) {
            return null;
        }
    }

    private Integer parseInt(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.intValue();
        try {
            String s = String.valueOf(v).trim();
            if (s.isBlank()) return null;
            return Integer.parseInt(s);
        } catch (Exception ignored) {
            return null;
        }
    }

    private static class PopularAgg {
        int count = 0;
        BigDecimal revenue = BigDecimal.ZERO;
    }

    public record ReportTable(List<String> columns, List<List<Object>> rows) {}
}

