package com.swd.aiservice.controller;

import com.swd.aiservice.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép React gọi API không bị lỗi CORS
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping
    public ResponseEntity<?> processChat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng nhập câu hỏi!"));
        }

        try {
            // Gọi AI xử lý và lấy câu trả lời
            String aiResponse = aiChatService.chatWithRag(userMessage);
            return ResponseEntity.ok(Map.of("reply", aiResponse));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi khi xử lý AI: " + e.getMessage()));
        }
    }
}