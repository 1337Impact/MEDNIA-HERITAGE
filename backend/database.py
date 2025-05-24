# database.py
import sqlite3
import asyncio
from datetime import datetime
from typing import List, Dict, Optional


class DatabaseManager:
    def __init__(self, db_path: str = "chat_messages.db"):
        self.db_path = db_path
        self.init_db()

    def init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    user_message TEXT NOT NULL,
                    ai_response TEXT NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()

    async def save_message(self, user_id: int, user_message: str, ai_response: str):
        def _save():
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("""
                    INSERT INTO messages (user_id, user_message, ai_response)
                    VALUES (?, ?, ?)
                """, (user_id, user_message, ai_response))
                conn.commit()

        await asyncio.to_thread(_save)

    async def get_messages(self, user_id: int, limit: int = 50, offset: int = 0) -> List[Dict]:
        def _get():
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.execute("""
                    SELECT * FROM messages 
                    WHERE user_id = ?
                    ORDER BY timestamp DESC 
                    LIMIT ? OFFSET ?
                """, (user_id, limit, offset))
                return [dict(row) for row in cursor.fetchall()]

        return await asyncio.to_thread(_get)

    async def get_message_by_id(self, message_id: int) -> Optional[Dict]:
        def _get():
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.execute(
                    "SELECT * FROM messages WHERE id = ?", (message_id,))
                row = cursor.fetchone()
                return dict(row) if row else None

        return await asyncio.to_thread(_get)

    async def delete_message(self, message_id: int) -> bool:
        def _delete():
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.execute(
                    "DELETE FROM messages WHERE id = ?", (message_id,))
                conn.commit()
                return cursor.rowcount > 0

        return await asyncio.to_thread(_delete)
