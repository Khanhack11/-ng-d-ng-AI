import time
import uuid
from enum import Enum
from typing import Dict, Any, List, Callable, Optional

class MessageChannel(str, Enum):
    ORCHESTRATOR = "channel.orchestrator"
    ANALYST = "channel.analyst"
    DATABASE = "channel.database"
    RAG = "channel.rag"
    RECOMMENDATION = "channel.recommendation"
    REASONING = "channel.reasoning"
    CRITIC = "channel.critic"
    RESPONSE = "channel.response"
    BROADCAST = "channel.broadcast"

class AgentMessage:
    def __init__(
        self,
        sender: str,
        recipient: str,
        channel: MessageChannel,
        payload: Dict[str, Any],
        correlation_id: Optional[str] = None
    ):
        self.message_id = str(uuid.uuid4())
        self.sender = sender
        self.recipient = recipient
        self.channel = channel
        self.payload = payload
        self.timestamp = time.time()
        self.correlation_id = correlation_id or str(uuid.uuid4())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "message_id": self.message_id,
            "sender": self.sender,
            "recipient": self.recipient,
            "channel": self.channel.value if isinstance(self.channel, MessageChannel) else self.channel,
            "payload": self.payload,
            "timestamp": self.timestamp,
            "correlation_id": self.correlation_id
        }

class StructuredMessageBus:
    """
    Structured Message Bus: Trục trao đổi thông điệp có cấu trúc giữa các Agent.
    Hỗ trợ mô hình Pub/Sub và lưu vết toàn bộ thông điệp trong phiên xử lý.
    """
    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[AgentMessage], None]]] = {}
        self._message_history: List[AgentMessage] = []

    def subscribe(self, channel: MessageChannel, handler: Callable[[AgentMessage], None]):
        ch_key = channel.value if isinstance(channel, MessageChannel) else channel
        if ch_key not in self._subscribers:
            self._subscribers[ch_key] = []
        self._subscribers[ch_key].append(handler)

    def publish(self, message: AgentMessage):
        self._message_history.append(message)
        ch_key = message.channel.value if isinstance(message.channel, MessageChannel) else message.channel
        
        # Gửi đến các subscribers của channel cụ thể
        if ch_key in self._subscribers:
            for handler in self._subscribers[ch_key]:
                try:
                    handler(message)
                except Exception as e:
                    print(f"[MessageBus Error] Handler failed for {ch_key}: {e}")

        # Gửi broadcast nếu có
        broadcast_key = MessageChannel.BROADCAST.value
        if broadcast_key in self._subscribers and ch_key != broadcast_key:
            for handler in self._subscribers[broadcast_key]:
                try:
                    handler(message)
                except Exception as e:
                    print(f"[MessageBus Error] Broadcast handler failed: {e}")

    def get_history(self, correlation_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if correlation_id:
            filtered = [m for m in self._message_history if m.correlation_id == correlation_id]
            return [m.to_dict() for m in filtered]
        return [m.to_dict() for m in self._message_history]

    def clear_history(self):
        self._message_history.clear()
