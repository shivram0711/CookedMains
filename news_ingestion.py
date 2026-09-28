# news_ingestion.py - Automated UPSC Mains Current Affairs Ingestion Engine
import os
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List, Dict, Any
from storage import save_current_affairs_articles, get_recent_current_affairs, search_current_affairs

RSS_FEEDS = [
    {
        "source": "The Hindu - Editorial",
        "url": "https://www.thehindu.com/opinion/editorial/feeder/default.rss",
        "category": "editorial",
        "priority": 1
    },
    {
        "source": "The Hindu - Lead Op-Ed",
        "url": "https://www.thehindu.com/opinion/lead/feeder/default.rss",
        "category": "opinion",
        "priority": 1
    },
    {
        "source": "The Indian Express - Explained",
        "url": "https://indianexpress.com/section/explained/feed/",
        "category": "explained",
        "priority": 1
    },
    {
        "source": "The Indian Express - Editorials",
        "url": "https://indianexpress.com/section/opinion/editorials/feed/",
        "category": "editorial",
        "priority": 1
    },
    {
        "source": "The Hindu - Economy & Policy",
        "url": "https://www.thehindu.com/business/Economy/feeder/default.rss",
        "category": "economy",
        "priority": 1
    },
    {
        "source": "The Hindu - Environment & Sci-Tech",
        "url": "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss",
        "category": "environment",
        "priority": 1
    }
]

UPSC_KEYWORDS = [
    # GS 1
    "heritage", "culture", "monument", "temple", "tribal", "women", "urbanization", 
    "cyclone", "monsoon", "earthquake", "water crisis", "glacier", "heatwave", "population",
    "drought", "landslide", "depression", "western disturbance", "freedom struggle",
    # GS 2
    "constitution", "supreme court", "high court", "governor", "parliament", "bill", "act",
    "ordinance", "election commission", "eci", "electoral roll", "rti", "privacy", "dpdp", "fundamental right",
    "judicial", "panchayat", "federalism", "brics", "g20", "quad", "sco", "asean", "fta",
    "unsc", "united nations", "foreign policy", "diplomacy", "bilateral", "welfare", "poverty",
    "citizenship", "secular", "reservation", "lokpal", "civil services", "ngo", "fcra",
    # GS 3
    "economy", "gdp", "inflation", "rbi", "monetary policy", "fiscal deficit", "make in india", "manufacturing",
    "semiconductor", "chip", "green hydrogen", "renewable energy", "solar", "blue bond", "upi",
    "climate change", "cop", "kasturirangan", "western ghats", "pollution", "biodiversity", "wildlife", "forest",
    "msp", "agriculture", "farmer", "irrigation", "crop", "artificial intelligence", "ai safety",
    "space", "isro", "defence", "drdo", "cyber security", "border management", "disaster management",
    "infrastructure", "logistics", "supply chain",
    # GS 4
    "ethics", "corruption", "integrity", "probity", "whistleblower", "accountability", "governance",
    "moral", "compassion", "empathy", "conflict of interest", "fiduciary", "trusteeship"
]

NOISE_KEYWORDS = [
    "cricket", "ipl", "scorecard", "table tennis", "bronze medal", "olympics", "football", "wrestler",
    "box office", "bollywood", "hollywood", "cinema", "saxophone", "jazz", "photography exhibition",
    "gold rate", "silver price", "horoscope", "astrology", "burglary", "theft", "arrested for murder",
    "accident killed", "building collapse", "bjp vs congress", "rally speech", "election campaign slur",
    "fashion", "bypolls", "years ago", "lottery", "parking rules", "cockroach"
]

def clean_html(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'&nbsp;|&amp;|&quot;|&#39;|&lt;|&gt;', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def is_upsc_relevant(title: str, summary: str) -> bool:
    combined = f"{title} {summary}".lower()
    for noise in NOISE_KEYWORDS:
        if noise in combined:
            return False
    for kw in UPSC_KEYWORDS:
        if kw in combined:
            return True
    return False

def fetch_rss_feed(feed_info: Dict[str, Any]) -> List[Dict[str, Any]]:
    articles = []
    url = feed_info["url"]
    source = feed_info["source"]
    category = feed_info["category"]
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_content = response.read()
            root = ET.fromstring(xml_content)
            items = root.findall(".//item")
            for item in items[:30]:
                t_elem = item.find("title")
                l_elem = item.find("link")
                d_elem = item.find("description")
                p_elem = item.find("pubDate")
                title = clean_html(t_elem.text) if t_elem is not None and t_elem.text else ""
                link = l_elem.text.strip() if l_elem is not None and l_elem.text else ""
                summary = clean_html(d_elem.text) if d_elem is not None and d_elem.text else ""
                pub_date = p_elem.text.strip() if p_elem is not None and p_elem.text else ""
                if not title or not link:
                    continue
                if is_upsc_relevant(title, summary):
                    articles.append({
                        "title": title,
                        "source": source,
                        "url": link,
                        "published_date": pub_date,
                        "summary": summary[:600],
                        "category": category
                    })
    except Exception as e:
        print(f"Error fetching {source}: {e}")
    return articles

def ingest_all_feeds() -> Dict[str, Any]:
    """Fetches live feeds from The Hindu, Indian Express, and LiveMint, and stores relevant articles."""
    all_articles = []
    for feed in RSS_FEEDS:
        arts = fetch_rss_feed(feed)
        all_articles.extend(arts)
    inserted_count = save_current_affairs_articles(all_articles)
    return {
        "total_fetched": len(all_articles),
        "newly_saved": inserted_count,
        "status": "success"
    }

def get_top_editorial_articles(limit: int = 15) -> List[Dict[str, Any]]:
    """Retrieves top UPSC current affairs articles, auto-ingesting if cache is empty."""
    recent = get_recent_current_affairs(limit=40)
    if not recent:
        ingest_all_feeds()
        recent = get_recent_current_affairs(limit=40)
    return recent[:limit]
