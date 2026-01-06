package com.study.kafka.service;

import com.study.kafka.config.KafkaConfig;
import com.study.kafka.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageProducerService {

    private final KafkaTemplate<String, Message> kafkaTemplate;
    private final MetricsService metricsService;

    public MessageSendResponse send(Message message) {
        try {
            String messageId = UUID.randomUUID().toString();
            message.setMessageId(messageId);
            message.setTimestamp(Instant.now().toEpochMilli());

            String topic = message.getTopic() != null ?
                    message.getTopic() : KafkaConfig.TOPIC_NAME;

            kafkaTemplate.send(topic, messageId, message);

            metricsService.recordMessageSent(messageId, message.getTimestamp());

            log.debug("Message sent successfully: {}", messageId);

            return MessageSendResponse.builder()
                    .messageId(messageId)
                    .timestamp(message.getTimestamp())
                    .success(true)
                    .build();
        } catch (Exception e) {
            log.error("Failed to send message: {}", message.getContent(), e);
            return MessageSendResponse.builder()
                    .success(false)
                    .build();
        }
    }

    public BulkMessageResponse sendBulk(BulkMessageRequest request) {
        long startTime = Instant.now().toEpochMilli();
        int successCount = 0;
        int failCount = 0;

        log.info("Starting bulk send: {} messages", request.getCount());

        for (int i = 0; i < request.getCount(); i++) {
            String content = request.getMessageTemplate().replace("{index}", String.valueOf(i));
            Message message = Message.builder()
                    .content(content)
                    .format(request.getFormat())
                    .build();

            MessageSendResponse response = send(message);
            if (response.isSuccess()) {
                successCount++;
            } else {
                failCount++;
            }

            if (request.getDelayMs() > 0) {
                try {
                    Thread.sleep(request.getDelayMs());
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }

        long endTime = Instant.now().toEpochMilli();
        long durationMs = endTime - startTime;
        double throughput = durationMs > 0 ? (successCount * 1000.0) / durationMs : 0;

        log.info("Bulk send completed: {} success, {} failed, duration: {}ms, throughput: {:.2f} msg/s",
                successCount, failCount, durationMs, throughput);

        return BulkMessageResponse.builder()
                .totalSent(request.getCount())
                .successCount(successCount)
                .failCount(failCount)
                .durationMs(durationMs)
                .throughput(throughput)
                .build();
    }
}
