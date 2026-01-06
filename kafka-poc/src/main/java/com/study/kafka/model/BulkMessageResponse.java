package com.study.kafka.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkMessageResponse {
    private int totalSent;
    private int successCount;
    private int failCount;
    private long durationMs;
    private double throughput;
}
