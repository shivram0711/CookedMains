"""
Cooked Mains — Instagram Comment-to-DM Automation Engine
Automates sending direct messages with website links, PDFs, and model answers
when aspirants comment on your Instagram Reels or Posts.
"""

import os
import json
import requests
from typing import Dict, Any, Optional

RULES_FILE = os.path.join(os.path.dirname(__file__), "instagram_dm_rules.json")

DEFAULT_RULES = {
    "enabled": True,
    "trigger_keywords": ["MAINS", "EVALUATE", "PDF", "CHECK", "COOKED"],
    "match_any_comment": False,  # If True, triggers on any comment regardless of keyword
    "dm_message": (
        "Hey Aspirant! 🚀 Here is your instant access to Cooked Mains:\n\n"
        "👉 Website (15 Free Daily Evaluations): https://cookedmains.com\n"
        "📄 Free Daily The Hindu Model Blueprint PDF: https://cookedmains.com/static/blueprint.pdf\n\n"
        "Upload any handwritten answer copy in under 30 seconds and let our AI examiner audit your margins! Let me know what score you get 🔥"
    ),
    "public_reply_enabled": True,
    "public_reply_templates": [
        "Sent the evaluation link & PDF to your DM! Check your requests 📩🔥",
        "Just DMed you the link + model answer blueprint! Best of luck with Mains 🚀",
        "Check your DMs! Your 15 free evaluations link is waiting ✍️"
    ],
    "logs": []
}

def load_rules() -> Dict[str, Any]:
    """Loads active Comment-to-DM automation rules."""
    if os.path.exists(RULES_FILE):
        try:
            with open(RULES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT_RULES

def save_rules(rules: Dict[str, Any]) -> bool:
    """Saves updated automation rules."""
    try:
        with open(RULES_FILE, "w", encoding="utf-8") as f:
            json.dump(rules, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"[IG-BOT] Failed to save rules: {e}")
        return False

def check_comment_match(comment_text: str, rules: Dict[str, Any]) -> bool:
    """Checks if a user comment triggers the automation."""
    if not rules.get("enabled", True):
        return False
    if rules.get("match_any_comment", False):
        return True
    
    clean_text = (comment_text or "").strip().upper()
    keywords = [k.strip().upper() for k in rules.get("trigger_keywords", []) if k.strip()]
    
    for kw in keywords:
        if kw in clean_text:
            return True
    return False

def send_private_reply_to_comment(
    comment_id: str,
    message_text: str,
    access_token: Optional[str] = None,
    account_id: Optional[str] = None,
    api_version: str = "v19.0"
) -> Dict[str, Any]:
    """
    Official Meta Send API for Instagram Private Replies.
    Allows sending a DM directly to a commenter within 7 days of their comment on your Reel.
    """
    token = access_token or os.getenv("INSTAGRAM_ACCESS_TOKEN", "")
    acct = account_id or os.getenv("INSTAGRAM_ACCOUNT_ID", "17841425940719242")
    if not token:
        return {"error": "Missing INSTAGRAM_ACCESS_TOKEN in environment."}

    # Meta Graph API endpoint for replying to a comment via DM
    url = f"https://graph.facebook.com/{api_version}/{acct}/messages"
    payload = {
        "recipient": {"comment_id": comment_id},
        "message": {"text": message_text}
    }
    headers = {"Content-Type": "application/json"}
    params = {"access_token": token}

    try:
        res = requests.post(url, json=payload, headers=headers, params=params, timeout=10)
        data = res.json()
        return data
    except Exception as e:
        return {"error": str(e)}

def send_public_reply_to_comment(
    comment_id: str,
    reply_text: str,
    access_token: Optional[str] = None,
    api_version: str = "v19.0"
) -> Dict[str, Any]:
    """Posts a public reply under the user's comment to boost Reel engagement algorithmically."""
    token = access_token or os.getenv("INSTAGRAM_ACCESS_TOKEN", "")
    if not token:
        return {"error": "Missing INSTAGRAM_ACCESS_TOKEN in environment."}

    url = f"https://graph.facebook.com/{api_version}/{comment_id}/replies"
    payload = {"message": reply_text}
    params = {"access_token": token}

    try:
        res = requests.post(url, data=payload, params=params, timeout=10)
        return res.json()
    except Exception as e:
        return {"error": str(e)}

def process_incoming_comment_webhook(webhook_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Processes real-time webhook payload sent by Meta when someone comments on an Instagram Reel or Post.
    """
    rules = load_rules()
    if not rules.get("enabled", True):
        return {"status": "skipped", "reason": "Automation is paused"}

    entries = webhook_data.get("entry", [])
    dispatched_count = 0
    logs = rules.get("logs", [])

    for entry in entries:
        changes = entry.get("changes", [])
        for change in changes:
            field = change.get("field")
            val = change.get("value", {})
            
            # Instagram sends comment changes under 'comments' or 'feed'
            if field in ["comments", "feed", "live_comments"]:
                comment_id = val.get("id") or val.get("comment_id")
                comment_text = val.get("text", "")
                from_user = val.get("from", {})
                username = from_user.get("username", "aspirant")
                media_id = val.get("media", {}).get("id")

                if comment_id and check_comment_match(comment_text, rules):
                    # Prepare DM text
                    dm_text = rules.get("dm_message", "").replace("{username}", username)
                    dm_res = send_private_reply_to_comment(comment_id, dm_text)
                    
                    # Prepare Public Reply
                    public_res = {}
                    if rules.get("public_reply_enabled", True):
                        templates = rules.get("public_reply_templates", [])
                        import random
                        reply_text = random.choice(templates) if templates else "Sent link to your DM! 📩"
                        public_res = send_public_reply_to_comment(comment_id, reply_text)

                    # Log dispatch
                    import datetime
                    log_item = {
                        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "username": username,
                        "comment_id": comment_id,
                        "comment_text": comment_text,
                        "dm_status": "sent" if "error" not in dm_res else f"failed: {dm_res.get('error')}",
                        "media_id": media_id
                    }
                    logs.insert(0, log_item)
                    dispatched_count += 1

    # Keep latest 50 logs
    rules["logs"] = logs[:50]
    save_rules(rules)

    return {
        "status": "success",
        "dispatched": dispatched_count,
        "total_logs": len(rules["logs"])
    }
