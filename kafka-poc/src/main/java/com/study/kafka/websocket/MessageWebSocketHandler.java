package com.study.kafka.websocket;

import com.study.kafka.model.Message;
import com.study.kafka.model.MessageStats;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MessageWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendMessage(Message message) {
        try {
            messagingTemplate.convertAndSend("/topic/messages", message);
            log.debug("Message sent to WebSocket: {}", message.getMessageId());
        } catch (Exception e) {
            log.error("Failed to send message via WebSocket", e);
        }
    }

    public void sendStats(MessageStats stats) {
        try {
            messagingTemplate.convertAndSend("/topic/stats", stats);
        } catch (Exception e) {
            log.error("Failed to send stats via WebSocket", e);
        }
    }

    public void sendEvent(String event) {
        try {
            messagingTemplate.convertAndSend("/topic/events", event);
        } catch (Exception e) {
            log.error("Failed to send event via WebSocket", e);
        }
    }
}
