"""
Cooked Mains — Instagram Graph API Growth & Analytics Engine
Connects directly to Meta's official Instagram Graph API to:
1. Fetch latest post analytics (reach, impressions, saves, shares, comments, profile visits).
2. Calculate UPSC Niche Virality KPIs (Save Rate, Share Rate, Profile Conversion).
3. Generate automated AI growth diagnosis and actionable next steps.
"""

import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load local environment variables
load_dotenv()

INSTAGRAM_ACCOUNT_ID = os.getenv("INSTAGRAM_ACCOUNT_ID", "")
INSTAGRAM_ACCESS_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN", "")
GRAPH_API_VERSION = "v19.0"
BASE_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

class InstagramGrowthEngine:
    def __init__(self, account_id=None, access_token=None):
        self.account_id = account_id or INSTAGRAM_ACCOUNT_ID
        self.access_token = access_token or INSTAGRAM_ACCESS_TOKEN

    def is_configured(self):
        return bool(self.account_id and self.access_token)

    def get_account_overview(self):
        """Fetch general account metrics: followers, follows, media count, bio."""
        if not self.is_configured():
            return {"error": "Missing INSTAGRAM_ACCOUNT_ID or INSTAGRAM_ACCESS_TOKEN in .env"}

        url = f"{BASE_URL}/{self.account_id}"
        params = {
            "fields": "id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website",
            "access_token": self.access_token
        }
        res = requests.get(url, params=params)
        return res.json()

    def get_recent_posts(self, limit=10):
        """Fetch recent posts and their core metadata."""
        if not self.is_configured():
            return {"error": "Missing INSTAGRAM_ACCOUNT_ID or INSTAGRAM_ACCESS_TOKEN in .env"}

        url = f"{BASE_URL}/{self.account_id}/media"
        params = {
            "fields": "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,thumbnail_url,media_url",
            "limit": limit,
            "access_token": self.access_token
        }
        res = requests.get(url, params=params)
        data = res.json()

        if "data" not in data:
            return data

        posts = data["data"]
        enriched_posts = []

        for p in posts:
            insights = self.get_media_insights(p["id"], p.get("media_product_type", "FEED"))
            p["insights"] = insights
            p["kpis"] = self.calculate_kpis(p, insights)
            enriched_posts.append(p)

        return {"posts": enriched_posts}

    def get_media_insights(self, media_id, product_type="FEED"):
        """Fetch detailed engagement insights: reach, saved, shares, impressions."""
        url = f"{BASE_URL}/{media_id}/insights"

        # Different media types support different metrics
        if product_type == "REELS":
            metrics = "reach,saved,shares,total_interactions,plays"
        else:
            # Feed posts & carousels
            metrics = "reach,impressions,saved,shares,total_interactions"

        params = {
            "metric": metrics,
            "access_token": self.access_token
        }
        res = requests.get(url, params=params)
        raw_insights = res.json()

        insights_dict = {}
        if "data" in raw_insights:
            for item in raw_insights["data"]:
                name = item.get("name")
                val = item.get("values", [{}])[0].get("value", 0)
                insights_dict[name] = val

        return insights_dict

    def calculate_kpis(self, post, insights):
        """
        Calculate UPSC niche growth indicators:
        - Save Rate: Essential for educational virality (Target: > 3%)
        - Share Rate: Peer group accountability sharing (Target: > 1.5%)
        - Total Engagement: Interactions / Reach
        """
        reach = insights.get("reach", 0)
        saved = insights.get("saved", 0)
        shares = insights.get("shares", 0)
        likes = post.get("like_count", 0)
        comments = post.get("comments_count", 0)

        if reach > 0:
            save_rate = round((saved / reach) * 100, 2)
            share_rate = round((shares / reach) * 100, 2)
            engagement_rate = round(((likes + comments + saved + shares) / reach) * 100, 2)
        else:
            save_rate = 0.0
            share_rate = 0.0
            engagement_rate = 0.0

        return {
            "reach": reach,
            "saved": saved,
            "shares": shares,
            "save_rate_pct": save_rate,
            "share_rate_pct": share_rate,
            "engagement_rate_pct": engagement_rate,
            "status": "🔥 Viral Potential" if save_rate >= 3.0 or share_rate >= 1.5 else "Needs Hook/CTA Optimization"
        }

    def generate_growth_report(self):
        """Analyze recent posts and produce an executive growth diagnosis."""
        overview = self.get_account_overview()
        if "error" in overview:
            return overview

        posts_data = self.get_recent_posts(limit=6)
        posts = posts_data.get("posts", [])

        if not posts:
            return {
                "account": overview,
                "diagnosis": "No recent posts detected on this Instagram account. Ready for first campaign publish."
            }

        total_reach = sum(p["kpis"]["reach"] for p in posts)
        total_saves = sum(p["kpis"]["saved"] for p in posts)
        total_shares = sum(p["kpis"]["shares"] for p in posts)
        avg_save_rate = round(sum(p["kpis"]["save_rate_pct"] for p in posts) / len(posts), 2)
        avg_share_rate = round(sum(p["kpis"]["share_rate_pct"] for p in posts) / len(posts), 2)

        recommendations = []
        if avg_save_rate < 3.0:
            recommendations.append("Increase tactical value: Add copy-ready Supreme Court citations or model answer blueprints on Slide 3 to boost Saves.")
        else:
            recommendations.append("Strong Save Rate: Audience finds your UPSC framework highly bookmarkable. Double down on this format.")

        if avg_share_rate < 1.0:
            recommendations.append("Low Sharing: Add relatable study-partner challenges (e.g. 'Lowest score on today's Hindu editorial buys chai').")
        else:
            recommendations.append("High Peer Sharing: Posts are circulating in Telegram/WhatsApp UPSC groups.")

        return {
            "account": {
                "username": overview.get("username"),
                "followers": overview.get("followers_count"),
                "media_count": overview.get("media_count"),
            },
            "summary_metrics": {
                "total_reach_analyzed": total_reach,
                "total_saves": total_saves,
                "total_shares": total_shares,
                "avg_save_rate_pct": avg_save_rate,
                "avg_share_rate_pct": avg_share_rate
            },
            "recent_posts": posts,
            "actionable_recommendations": recommendations
        }


if __name__ == "__main__":
    engine = InstagramGrowthEngine()
    print("=" * 60)
    print("📊 Cooked Mains — Instagram Growth Engine Diagnostic")
    print("=" * 60)

    if not engine.is_configured():
        print("\n⚠️  STATUS: API credentials not yet configured.")
        print("Please follow the setup instructions to add:")
        print("1. INSTAGRAM_ACCOUNT_ID")
        print("2. INSTAGRAM_ACCESS_TOKEN")
        print("into your .env file.\n")
    else:
        print("\nFetching live account overview...")
        res = engine.generate_growth_report()
        print(json.dumps(res, indent=2))
