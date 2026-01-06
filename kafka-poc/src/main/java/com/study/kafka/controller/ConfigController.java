package com.study.kafka.controller;

import com.study.kafka.config.KafkaConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
public class ConfigController {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("bootstrapServers", bootstrapServers);
        config.put("topics", Arrays.asList(KafkaConfig.TOPIC_NAME));
        config.put("consumerGroup", "kafka-poc-group");

        return ResponseEntity.ok(config);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> updateConfig(@RequestBody Map<String, Object> config) {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Configuration update not implemented in POC",
                "receivedConfig", config
        ));
    }
}
