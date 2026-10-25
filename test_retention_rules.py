import unittest
import sqlite3
import datetime
import os
import json
from storage import cleanup_expired_guest_sessions, get_db

class TestTelemetryRetentionRules(unittest.TestCase):
    def setUp(self):
        self.conn = get_db()
        self.cursor = self.conn.cursor()
        self.ist_now = datetime.datetime.utcnow() + datetime.timedelta(hours=5, minutes=30)
        self.time_13h_ago = (self.ist_now - datetime.timedelta(hours=13)).strftime("%Y-%m-%d %H:%M:%S")
        self.time_2h_ago = (self.ist_now - datetime.timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")

    def tearDown(self):
        # Clean up any test fixtures created
        test_ids = [
            "test_sid_bounce_old", "test_sid_bounce_recent", "test_sid_auth_old",
            "test_sid_eval_count_old", "test_sid_user_email_old", "test_sid_eval_link_old",
            "test_sid_feedback_old", "test_sid_action_eval_old"
        ]
        placeholders = ",".join(["?"] * len(test_ids))
        self.cursor.execute(f"DELETE FROM user_sessions WHERE id IN ({placeholders})", test_ids)
        self.cursor.execute("DELETE FROM users WHERE email = 'test_registered_aspirant@gmail.com'")
        self.cursor.execute("DELETE FROM evaluations WHERE id = 'test_eval_retention_123'")
        self.cursor.execute("DELETE FROM feedback WHERE user_email = 'test_feedback_aspirant@gmail.com'")
        self.conn.commit()
        self.conn.close()

    def test_unauthenticated_old_bounce_is_deleted(self):
        """Guests who just land on landing page and leave must be deleted after 12h."""
        self.cursor.execute("""
            INSERT OR REPLACE INTO user_sessions (
                id, user_email, user_name, is_authenticated, started_at, last_active_at,
                duration_seconds, current_view, evaluations_count, actions_count, recent_actions
            ) VALUES (
                'test_sid_bounce_old', 'Guest Aspirant', 'Guest Aspirant', 0, ?, ?,
                0, 'Landing Page', 0, 1, '[{"action": "Landing Page"}]'
            )
        """, (self.time_13h_ago, self.time_13h_ago))
        self.conn.commit()

        res = cleanup_expired_guest_sessions(12.0)
        self.assertEqual(res["status"], "success")

        self.cursor.execute("SELECT id FROM user_sessions WHERE id = 'test_sid_bounce_old'")
        row = self.cursor.fetchone()
        self.assertIsNone(row, "Old unauthenticated landing page bounce session must be deleted")

    def test_unauthenticated_recent_bounce_is_retained(self):
        """Guests who visited recently (< 12h) must NOT be deleted yet."""
        self.cursor.execute("""
            INSERT OR REPLACE INTO user_sessions (
                id, user_email, user_name, is_authenticated, started_at, last_active_at,
                duration_seconds, current_view, evaluations_count, actions_count, recent_actions
            ) VALUES (
                'test_sid_bounce_recent', 'Guest Aspirant', 'Guest Aspirant', 0, ?, ?,
                10, 'Landing Page', 0, 1, '[{"action": "Landing Page"}]'
            )
        """, (self.time_2h_ago, self.time_2h_ago))
        self.conn.commit()

        cleanup_expired_guest_sessions(12.0)

        self.cursor.execute("SELECT id FROM user_sessions WHERE id = 'test_sid_bounce_recent'")
        row = self.cursor.fetchone()
        self.assertIsNotNone(row, "Recent bounce session (< 12h) must remain active for founder live traffic")

    def test_authenticated_user_session_is_never_deleted(self):
        """Logged-in aspirants must be kept permanently and never deleted."""
        self.cursor.execute("""
            INSERT OR REPLACE INTO user_sessions (
                id, user_email, user_name, is_authenticated, started_at, last_active_at,
                duration_seconds, current_view, evaluations_count, actions_count, recent_actions
            ) VALUES (
                'test_sid_auth_old', 'aspirant.topper@gmail.com', 'Aspirant Topper', 1, ?, ?,
                1200, 'Viewing Evaluation Studio', 0, 10, '[{"action": "Viewing Evaluation Studio"}]'
            )
        """, (self.time_13h_ago, self.time_13h_ago))
        self.conn.commit()

        cleanup_expired_guest_sessions(12.0)

        self.cursor.execute("SELECT id FROM user_sessions WHERE id = 'test_sid_auth_old'")
        row = self.cursor.fetchone()
        self.assertIsNotNone(row, "Authenticated aspirant session must NEVER be deleted")

    def test_aspirant_registered_in_users_table_is_never_deleted(self):
        """Aspirants with accounts in users table must have their sessions permanently preserved."""
        self.cursor.execute("""
            INSERT OR IGNORE INTO users (id, email, name, free_credits, is_pro, created_at)
            VALUES ('usr_retention_test', 'test_registered_aspirant@gmail.com', 'Registered Cadet', 5, 1, ?)
        """, (self.time_13h_ago,))
        self.cursor.execute("""
            INSERT OR REPLACE INTO user_sessions (
                id, user_email, user_name, is_authenticated, started_at, last_active_at,
                duration_seconds, current_view, evaluations_count, actions_count, recent_actions
            ) VALUES (
                'test_sid_user_email_old', 'test_registered_aspirant@gmail.com', 'Registered Cadet', 0, ?, ?,
                300, 'Home / Intake Deck', 0, 5, '[]'
            )
        """, (self.time_13h_ago, self.time_13h_ago))
        self.conn.commit()

        cleanup_expired_guest_sessions(12.0)

        self.cursor.execute("SELECT id FROM user_sessions WHERE id = 'test_sid_user_email_old'")
        row = self.cursor.fetchone()
        self.assertIsNotNone(row, "Session of an aspirant registered in users table must NEVER be deleted")

    def test_aspirant_with_evaluated_copies_is_never_deleted(self):
        """Aspirants who have evaluated copies must be preserved permanently."""
        # 1. Via evaluations_count > 0 in session
        self.cursor.execute("""
            INSERT OR REPLACE INTO user_sessions (
                id, user_email, user_name, is_authenticated, started_at, last_active_at,
                duration_seconds, current_view, evaluations_count, actions_count, recent_actions
            ) VALUES (
                'test_sid_eval_count_old', 'cadet.eval@gmail.com', 'Evaluated Cadet', 0, ?, ?,
                900, 'Viewing Deep Evaluation', 1, 8, '[]'
            )
        """, (self.time_13h_ago, self.time_13h_ago))

        # 2. Via evaluations table link
        self.cursor.execute("""
            INSERT OR REPLACE INTO evaluations (
                id, user_id, user_email, created_at, paper, max_marks, question,
                overall_score, percentage, evaluation_json, pages_json
            ) VALUES (
                'test_eval_retention_123', 'u123', 'eval_linked_cadet@gmail.com', ?, 'GS1', 15, 'Discuss Plassey',
                7.5, 50.0, '{}', '[]'
            )
        """, (self.time_13h_ago,))
        self.cursor.execute("""
            INSERT OR REPLACE INTO user_sessions (
                id, user_email, user_name, is_authenticated, started_at, last_active_at,
                duration_seconds, current_view, evaluations_count, actions_count, recent_actions
            ) VALUES (
                'test_sid_eval_link_old', 'eval_linked_cadet@gmail.com', 'Linked Cadet', 0, ?, ?,
                900, 'Intake Deck', 0, 8, '[]'
            )
        """, (self.time_13h_ago, self.time_13h_ago))

        # 3. Via recent_actions containing eval_id
        self.cursor.execute("""
            INSERT OR REPLACE INTO user_sessions (
                id, user_email, user_name, is_authenticated, started_at, last_active_at,
                duration_seconds, current_view, evaluations_count, actions_count, recent_actions
            ) VALUES (
                'test_sid_action_eval_old', 'Guest Aspirant', 'Guest Aspirant', 0, ?, ?,
                900, 'Viewing Evaluation', 0, 8, '[{"action": "Evaluated GS1", "eval_id": "eval_12345", "is_eval": true}]'
            )
        """, (self.time_13h_ago, self.time_13h_ago))
        self.conn.commit()

        cleanup_expired_guest_sessions(12.0)

        for sid in ['test_sid_eval_count_old', 'test_sid_eval_link_old', 'test_sid_action_eval_old']:
            self.cursor.execute("SELECT id FROM user_sessions WHERE id = ?", (sid,))
            row = self.cursor.fetchone()
            self.assertIsNotNone(row, f"Session with evaluated copies ({sid}) must NEVER be deleted")

    def test_aspirant_who_submitted_feedback_is_never_deleted(self):
        """Aspirants who submitted feedback must be permanently preserved."""
        self.cursor.execute("""
            INSERT OR REPLACE INTO feedback (
                id, user_email, user_name, category, rating, message, created_at
            ) VALUES (
                'fb_test_123', 'test_feedback_aspirant@gmail.com', 'Feedback Aspirant', 'Evaluation Quality', 5,
                'Loved the feedback depth and handwritten matrix.', ?
            )
        """, (self.time_13h_ago,))
        self.cursor.execute("""
            INSERT OR REPLACE INTO user_sessions (
                id, user_email, user_name, is_authenticated, started_at, last_active_at,
                duration_seconds, current_view, evaluations_count, actions_count, recent_actions
            ) VALUES (
                'test_sid_feedback_old', 'test_feedback_aspirant@gmail.com', 'Feedback Aspirant', 0, ?, ?,
                400, 'Home', 0, 3, '[]'
            )
        """, (self.time_13h_ago, self.time_13h_ago))
        self.conn.commit()

        cleanup_expired_guest_sessions(12.0)

        self.cursor.execute("SELECT id FROM user_sessions WHERE id = 'test_sid_feedback_old'")
        row = self.cursor.fetchone()
        self.assertIsNotNone(row, "Session of an aspirant who submitted feedback must NEVER be deleted")

if __name__ == "__main__":
    unittest.main()
