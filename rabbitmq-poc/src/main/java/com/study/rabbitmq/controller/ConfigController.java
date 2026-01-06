package com.study.rabbitmq.controller;

import com.study.rabbitmq.config.RabbitMQConfig;
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

    @Value("${spring.rabbitmq.host:localhost}")
    private String host;

    @Value("${spring.rabbitmq.port:5672}")
    private int port;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("host", host);
        config.put("port", port);
        config.put("queues", Arrays.asList(RabbitMQConfig.QUEUE_NAME));
        config.put("exchanges", Arrays.asList(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.TOPIC_EXCHANGE_NAME,
                RabbitMQConfig.FANOUT_EXCHANGE_NAME
        ));
        config.put("exchangeType", "direct");
        config.put("routingKey", RabbitMQConfig.ROUTING_KEY);

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
