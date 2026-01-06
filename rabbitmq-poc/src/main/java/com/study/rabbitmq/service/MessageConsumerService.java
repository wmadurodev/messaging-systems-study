package com.study.rabbitmq.service;

import com.study.rabbitmq.config.RabbitMQConfig;
import com.study.rabbitmq.model.Message;
import com.study.rabbitmq.websocket.MessageWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageConsumerService {

    private final MetricsService metricsService;
    private final MessageWebSocketHandler webSocketHandler;
    private final ConcurrentLinkedQueue<Message> receivedMessages = new ConcurrentLinkedQueue<>();
    private static final int MAX_STORED_MESSAGES = 1000;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void consumeMessage(Message message) {
        try {
            long receivedAt = Instant.now().toEpochMilli();
            message.setReceivedAt(receivedAt);

            log.debug("Message received: {}", message.getMessageId());

            metricsService.recordMessageReceived(message.getMessageId(), receivedAt);

            receivedMessages.add(message);
            if (receivedMessages.size() > MAX_STORED_MESSAGES) {
                receivedMessages.poll();
            }

            webSocketHandler.sendMessage(message);
            webSocketHandler.sendStats(metricsService.getStats());
        } catch (Exception e) {
            log.error("Error processing message: {}", message.getMessageId(), e);
        }
    }

    public List<Message> getReceivedMessages(int limit) {
        return receivedMessages.stream()
                .limit(limit)
                .toList();
    }

    public void clearMessages() {
        receivedMessages.clear();
    }
}
