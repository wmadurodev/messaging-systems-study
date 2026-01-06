package com.study.rabbitmq.controller;

import com.study.rabbitmq.model.*;
import com.study.rabbitmq.service.MessageConsumerService;
import com.study.rabbitmq.service.MessageProducerService;
import com.study.rabbitmq.service.MetricsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageProducerService producerService;
    private final MessageConsumerService consumerService;
    private final MetricsService metricsService;

    @PostMapping("/send")
    public ResponseEntity<MessageSendResponse> sendMessage(@RequestBody Message message) {
        log.info("Received request to send message");
        MessageSendResponse response = producerService.send(message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-bulk")
    public ResponseEntity<BulkMessageResponse> sendBulkMessages(@RequestBody BulkMessageRequest request) {
        log.info("Received request to send bulk messages: count={}", request.getCount());
        BulkMessageResponse response = producerService.sendBulk(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<MessageStats> getStats() {
        MessageStats stats = metricsService.getStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody(required = false) Map<String, String> config) {
        log.info("Consumer subscription request received");
        return ResponseEntity.ok(Map.of(
                "subscribed", true,
                "identifier", "rabbitmq-consumer",
                "message", "Consumer is already listening to the queue"
        ));
    }

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<Map<String, Boolean>> unsubscribe() {
        log.info("Consumer unsubscribe request received");
        return ResponseEntity.ok(Map.of("unsubscribed", true));
    }

    @GetMapping("/received")
    public ResponseEntity<Map<String, Object>> getReceivedMessages(
            @RequestParam(defaultValue = "100") int limit) {
        List<Message> messages = consumerService.getReceivedMessages(limit);
        return ResponseEntity.ok(Map.of(
                "messages", messages,
                "total", messages.size()
        ));
    }

    @DeleteMapping("/received")
    public ResponseEntity<Map<String, Boolean>> clearReceivedMessages() {
        consumerService.clearMessages();
        return ResponseEntity.ok(Map.of("cleared", true));
    }

    @PostMapping("/stats/reset")
    public ResponseEntity<Map<String, String>> resetStats() {
        metricsService.reset();
        consumerService.clearMessages();
        return ResponseEntity.ok(Map.of("status", "Stats reset successfully"));
    }
}
