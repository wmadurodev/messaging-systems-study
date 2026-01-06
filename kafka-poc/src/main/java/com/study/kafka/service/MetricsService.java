package com.study.kafka.service;

import com.study.kafka.model.MessageStats;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MetricsService {

    private final AtomicLong totalSent = new AtomicLong(0);
    private final AtomicLong totalReceived = new AtomicLong(0);
    private final ConcurrentLinkedQueue<Long> latencies = new ConcurrentLinkedQueue<>();
    private final Map<String, Long> messageTimestamps = new ConcurrentHashMap<>();
    private volatile long startTime = Instant.now().toEpochMilli();
    private volatile long lastMessageTimestamp = 0;

    public void recordMessageSent(String messageId, long timestamp) {
        totalSent.incrementAndGet();
        messageTimestamps.put(messageId, timestamp);
        lastMessageTimestamp = timestamp;
    }

    public void recordMessageReceived(String messageId, long timestamp) {
        totalReceived.incrementAndGet();
        Long sentTime = messageTimestamps.get(messageId);
        if (sentTime != null) {
            long latency = timestamp - sentTime;
            latencies.add(latency);
            messageTimestamps.remove(messageId);

            // Keep only last 1000 latencies to prevent memory issues
            if (latencies.size() > 1000) {
                latencies.poll();
            }
        }
        lastMessageTimestamp = timestamp;
    }

    public MessageStats getStats() {
        return MessageStats.builder()
                .totalSent(totalSent.get())
                .totalReceived(totalReceived.get())
                .averageLatencyMs(calculateAverageLatency())
                .throughput(calculateThroughput())
                .lastMessageTimestamp(lastMessageTimestamp)
                .build();
    }

    public void reset() {
        totalSent.set(0);
        totalReceived.set(0);
        latencies.clear();
        messageTimestamps.clear();
        startTime = Instant.now().toEpochMilli();
        lastMessageTimestamp = 0;
    }

    private double calculateAverageLatency() {
        if (latencies.isEmpty()) {
            return 0.0;
        }
        return latencies.stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0.0);
    }

    private double calculateThroughput() {
        long currentTime = Instant.now().toEpochMilli();
        long elapsedSeconds = (currentTime - startTime) / 1000;
        if (elapsedSeconds == 0) {
            return 0.0;
        }
        return (double) totalReceived.get() / elapsedSeconds;
    }
}
