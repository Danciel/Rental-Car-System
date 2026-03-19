package com.swd.aiservice.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiChatService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    // Sử dụng ChatClient.Builder theo chuẩn Spring AI 1.1.2
    public AiChatService(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
        this.vectorStore = vectorStore;
        // System Prompt: "Tẩy não" và định hình nhân cách cho AI
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        Bạn là trợ lý ảo chuyên gia tư vấn của hệ thống Auto Share. 
                        Nhiệm vụ: Phân tích nhu cầu khách hàng và gợi ý xe dựa trên [NGỮ CẢNH].
                        
                        QUY TẮC TRÌNH BÀY (QUAN TRỌNG):
                        1. PHÂN ĐOẠN: Sử dụng 2 lần xuống dòng (Double Line Break) giữa các đoạn văn để tránh dính chữ.
                        2. ĐỊNH DẠNG XE: 
                           - Tên xe phải **In Đậm** kèm icon 🚗.
                           - Sử dụng Bullet Point (dấu *) cho các đặc điểm. Mỗi đặc điểm một dòng riêng.
                        3. ĐỊNH DẠNG LINK: 
                           - Chỉ chèn DUY NHẤT một link cho mỗi dòng xe.
                           - Link phải nằm ở một dòng riêng biệt, cách đoạn văn trên 1 dòng.
                           - Cấu trúc: [👉 Xem chi tiết và đặt xe ngay tại đây](/car/{id}) (Thay {id} bằng carId thực tế).
                        
                        LOGIC TƯ VẤN:
                        1. GỘP XE: Nếu có nhiều xe cùng model, chỉ tư vấn 1 lần cho dòng xe đó. KHÔNG liệt kê biển số.
                        2. TRƯỜNG HỢP CÓ XE PHÙ HỢP: 
                           Bắt đầu bằng: "Chào bạn, Auto Share đã tìm thấy lựa chọn hoàn hảo cho chuyến đi của bạn:"
                        3. TRƯỜNG HỢP KHÔNG ĐỦ SỐ GHẾ:
                           Bắt đầu bằng: "Rất tiếc, hiện tại Auto Share chưa có xe [Số chỗ] phù hợp. Tuy nhiên, bạn có thể tham khảo dòng xe nhỏ hơn sau đây:"
                        4. PHẠM VI DỮ LIỆU: Chỉ dùng thông tin trong [NGỮ CẢNH]. Nếu không có thông tin, hãy lịch sự từ chối và hướng khách về việc thuê xe. Không trả lời chuyện ngoài lề.
                        
                        VÍ DỤ MẪU KẾT QUẢ:
                        Chào bạn, Auto Share đã tìm thấy lựa chọn hoàn hảo cho chuyến đi của bạn:
                        
                        **🚗 Toyota Fortuner (2023)**
                        * Đặc điểm: Xe SUV 7 chỗ mạnh mẽ, phù hợp đường đèo dốc.
                        * Giá thuê: 1,050,000 VNĐ/ngày.
                        
                        [👉 Xem chi tiết và đặt xe ngay tại đây](/car/15)
                        """)
                .build();
    }

    public String chatWithRag(String userMessage) {

        System.out.println("🤖 Đang gọi Embedding để dịch câu hỏi...");

        // TẠM THỜI TẮT FILTER ĐỂ DEBUG XEM QDRANT CÓ NHẢ DATA KHÔNG
        SearchRequest searchRequest = SearchRequest.builder()
                .query(userMessage)
                .topK(5) // Lấy thẳng 5 chiếc sát nghĩa nhất
                // .filterExpression("status == 'AVAILABLE'") // <-- COMMENT DÒNG NÀY LẠI
                .build();

        List<Document> foundDocs = vectorStore.similaritySearch(searchRequest);
        System.out.println("AI tìm thấy " + foundDocs.size() + " tài liệu.");
        foundDocs.forEach(d -> System.out.println("Context: " + d.getText()));

        // IN RA CONSOLE ĐỂ BẮT BỆNH
        System.out.println("==== 🎯 SỐ LƯỢNG XE TÌM THẤY TỪ QDRANT: " + foundDocs.size() + " ====");


        // Trong AiChatService.java
        // Trong AiChatService.java
        String context = foundDocs.stream()
                .collect(Collectors.groupingBy(
                        doc -> {
                            // Kiểm tra an toàn: Nếu không có carModelName thì đặt tên nhóm là "Xe khác"
                            Object modelName = doc.getMetadata().get("carModelName");
                            return modelName != null ? modelName.toString() : "Dòng xe chưa xác định";
                        },
                        Collectors.toList()
                ))
                .entrySet().stream()
                // Sửa lại đoạn map trong stream
                .map(entry -> {
                    String modelName = entry.getKey();
                    List<Document> group = entry.getValue();
                    Document firstCar = group.get(0);

                    // Lấy carId
                    Object carId = firstCar.getMetadata().get("carId");

                    // TRUYỀN DỮ LIỆU SẠCH:
                    // Chỉ đưa thông tin xe và cái ID thô để AI tự lắp vào template của nó
                    return String.format(
                            "DÒNG XE: %s\n" +
                                    "Mô tả kỹ thuật: %s\n" +
                                    "Số lượng sẵn có: %d chiếc\n" +
                                    "ID_LIEN_KET: %s", // Đặt tên biến rõ ràng cho AI dễ thấy
                            modelName,
                            firstCar.getText(),
                            group.size(),
                            carId != null ? carId.toString() : "0"
                    );
                })
                .collect(Collectors.joining("\n---\n"));

        if (context.isBlank()) {
            return "Hiện tại hệ thống không tìm thấy chiếc xe nào trống lịch phù hợp với yêu cầu của bạn. Bạn có muốn đổi tiêu chí tìm kiếm không?";
        }

        System.out.println("🤖 Đã có Data, đang gọi Gemini Chat...");

        return chatClient.prompt()
                .user(u -> u.text("""
                                Câu hỏi của khách: {query}
                                
                                [NGỮ CẢNH - DANH SÁCH 5 XE PHÙ HỢP NHẤT]:
                                {context}
                                """)
                        .param("query", userMessage)
                        .param("context", context))
                .call()
                .content();
    }
}