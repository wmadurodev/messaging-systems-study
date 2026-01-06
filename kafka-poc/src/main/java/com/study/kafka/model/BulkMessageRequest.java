package com.study.kafka.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkMessageRequest {
    private int count;
    private String messageTemplate;
    private MessageFormat format;
    private long delayMs;

    public BulkMessageRequest(int count, String messageTemplate) {
        this.count = count;
        this.messageTemplate = messageTemplate;
        this.format = MessageFormat.TEXT;
        this.delayMs = 0;
    }
}
