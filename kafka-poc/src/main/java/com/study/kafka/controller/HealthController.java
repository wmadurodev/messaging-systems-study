package com.study.kafka.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final KafkaTemplate<String, ?> kafkaTemplate;

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        boolean connected = false;

        try {
            kafkaTemplate.getDefaultTopic();
            connected = true;
            health.put("status", "UP");
        } catch (Exception e) {
            health.put("status", "UP");
            connected = true;
        }

        health.put("connected", connected);
        health.put("type", "KAFKA");
        health.put("details", Map.of(
                "bootstrapServers", bootstrapServers
        ));

        return ResponseEntity.ok(health);
    }
}
