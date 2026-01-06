package com.study.rabbitmq.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageStats {
    private long totalSent;
    private long totalReceived;
    private double averageLatencyMs;
    private double throughput;
    private long lastMessageTimestamp;
}
