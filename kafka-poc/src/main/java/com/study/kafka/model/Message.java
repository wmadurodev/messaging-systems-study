package com.study.kafka.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String messageId;
    private String content;
    private MessageFormat format;
    private String topic;
    private long timestamp;
    private Long receivedAt;

    public Message(String content, MessageFormat format) {
        this.content = content;
        this.format = format;
        this.timestamp = Instant.now().toEpochMilli();
    }
}
