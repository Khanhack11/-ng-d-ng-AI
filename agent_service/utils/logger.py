import os
import sys
import json
import time
import logging
from logging.handlers import RotatingFileHandler
from typing import Dict, Any, List, Optional
from pathlib import Path

# Thư mục logs
LOGS_DIR = Path(__file__).resolve().parent.parent / "logs"
os.makedirs(LOGS_DIR, exist_ok=True)

APP_LOG_FILE = LOGS_DIR / "multi_agent.log"
AUDIT_LOG_FILE = LOGS_DIR / "audit_trail.jsonl"

class CorrelationFilter(logging.Filter):
    """Filter gắn correlation_id vào mọi log record."""
    def __init__(self, correlation_id: str = "SYS"):
        super().__init__()
        self.correlation_id = correlation_id

    def filter(self, record):
        if not hasattr(record, "correlation_id"):
            record.correlation_id = getattr(self, "correlation_id", "SYS")
        return True

_loggers: Dict[str, logging.Logger] = {}

def get_agent_logger(name: str = "AgentSystem") -> logging.Logger:
    """Khởi tạo logger chuẩn công nghiệp với RotatingFileHandler."""
    global _loggers
    if name in _loggers:
        return _loggers[name]

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    logger.propagate = False

    # Format chuẩn: Thời gian [Level] [Logger] [CorrelationID] Message
    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] [%(name)s] [%(correlation_id)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Handler 1: Rotating File Handler (5MB, 3 backup files)
    file_handler = RotatingFileHandler(
        str(APP_LOG_FILE),
        maxBytes=5 * 1024 * 1024,
        backupCount=3,
        encoding="utf-8"
    )
    file_handler.setFormatter(formatter)
    file_handler.addFilter(CorrelationFilter())
    logger.addHandler(file_handler)

    # Handler 2: Stream Handler (Console) với UTF-8
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.addFilter(CorrelationFilter())
    logger.addHandler(console_handler)

    _loggers[name] = logger
    return logger

def log_audit_event(
    correlation_id: str,
    query: str,
    persona: str,
    agent_chain: List[str],
    retries: int,
    critic_verdict: str,
    latency_ms: float,
    quality_score: float,
    status: str = "SUCCESS",
    extra: Optional[Dict[str, Any]] = None
):
    """Ghi vết Audit Trail JSONL có cấu trúc cho từng lượt tương tác Multi-Agent."""
    try:
        event = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "epoch": time.time(),
            "correlation_id": correlation_id,
            "query": query,
            "persona": persona,
            "agent_chain": agent_chain,
            "reflection_retries": retries,
            "critic_verdict": critic_verdict,
            "quality_score": quality_score,
            "latency_ms": round(latency_ms, 2),
            "status": status,
            "extra": extra or {}
        }
        with open(str(AUDIT_LOG_FILE), "a", encoding="utf-8") as f:
            f.write(json.dumps(event, ensure_ascii=False) + "\n")
    except Exception as e:
        sys.stderr.write(f"[Audit Log Error] {e}\n")

def get_recent_logs(limit: int = 50) -> List[str]:
    """Đọc các dòng log gần nhất phục vụ API giám sát."""
    if not os.path.exists(APP_LOG_FILE):
        return []
    try:
        with open(APP_LOG_FILE, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
            return [line.strip() for line in lines[-limit:]]
    except Exception:
        return []

def get_recent_audit_trail(limit: int = 20) -> List[Dict[str, Any]]:
    """Đọc các bản ghi audit trail JSONL gần nhất."""
    if not os.path.exists(AUDIT_LOG_FILE):
        return []
    try:
        events = []
        with open(AUDIT_LOG_FILE, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                line = line.strip()
                if line:
                    events.append(json.loads(line))
        return events[-limit:]
    except Exception:
        return []
