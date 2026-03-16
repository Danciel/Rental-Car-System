package com.swd.reportservice.service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.swd.reportservice.domain.ReportFormat;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportExportService {

    public ExportedFile export(String title, List<String> columns, List<List<Object>> rows, ReportFormat format) {
        return switch (format) {
            case CSV -> exportCsv(title, columns, rows);
            case XLSX -> exportXlsx(title, columns, rows);
            case PDF -> exportPdf(title, columns, rows);
        };
    }

    private ExportedFile exportCsv(String title, List<String> columns, List<List<Object>> rows) {
        StringBuilder sb = new StringBuilder();
        sb.append("# ").append(title).append("\n");
        sb.append(String.join(",", columns.stream().map(this::csvEscape).toList())).append("\n");
        for (List<Object> row : rows) {
            sb.append(String.join(",", row.stream().map(v -> csvEscape(v == null ? "" : String.valueOf(v))).toList()));
            sb.append("\n");
        }
        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);
        return new ExportedFile(bytes, "text/csv", fileName(title, "csv"));
    }

    private ExportedFile exportXlsx(String title, List<String> columns, List<List<Object>> rows) {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            XSSFSheet sheet = workbook.createSheet("Report");
            int r = 0;
            Row header = sheet.createRow(r++);
            for (int c = 0; c < columns.size(); c++) {
                Cell cell = header.createCell(c);
                cell.setCellValue(columns.get(c));
            }

            for (List<Object> row : rows) {
                Row rr = sheet.createRow(r++);
                for (int c = 0; c < columns.size(); c++) {
                    Object v = c < row.size() ? row.get(c) : null;
                    Cell cell = rr.createCell(c);
                    if (v instanceof Number n) cell.setCellValue(n.doubleValue());
                    else cell.setCellValue(v == null ? "" : String.valueOf(v));
                }
            }

            for (int c = 0; c < columns.size(); c++) sheet.autoSizeColumn(c);

            workbook.write(baos);
            return new ExportedFile(baos.toByteArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileName(title, "xlsx"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to export XLSX", e);
        }
    }

    private ExportedFile exportPdf(String title, List<String> columns, List<List<Object>> rows) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            document.add(new Paragraph(title, titleFont));
            document.add(new Paragraph("Generated at: " + LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(columns.size());
            table.setWidthPercentage(100);

            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            for (String col : columns) {
                PdfPCell cell = new PdfPCell();
                cell.setPhrase(new com.lowagie.text.Phrase(col, headFont));
                table.addCell(cell);
            }

            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            for (List<Object> row : rows) {
                for (int c = 0; c < columns.size(); c++) {
                    Object v = c < row.size() ? row.get(c) : null;
                    table.addCell(new com.lowagie.text.Phrase(v == null ? "" : String.valueOf(v), bodyFont));
                }
            }

            document.add(table);
            document.close();

            return new ExportedFile(baos.toByteArray(), "application/pdf", fileName(title, "pdf"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to export PDF", e);
        }
    }

    private String csvEscape(String s) {
        if (s == null) return "";
        boolean needsQuotes = s.contains(",") || s.contains("\"") || s.contains("\n") || s.contains("\r");
        String escaped = s.replace("\"", "\"\"");
        return needsQuotes ? ("\"" + escaped + "\"") : escaped;
    }

    private String fileName(String title, String ext) {
        String safe = title.trim().replaceAll("[^a-zA-Z0-9-_ ]", "").replace(' ', '_');
        if (safe.isBlank()) safe = "report";
        return safe + "." + ext;
    }

    public record ExportedFile(byte[] bytes, String contentType, String fileName) {}
}

