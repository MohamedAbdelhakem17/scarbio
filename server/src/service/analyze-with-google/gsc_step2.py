import sys
import json
import os
import pandas as pd
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request


def get_gsc_data(service, site_url, start_date, end_date):
    """Get GSC data with page and query dimensions"""
    request = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["page", "query"],
        "rowLimit": 25000
    }

    response = service.searchanalytics().query(
        siteUrl=site_url,
        body=request
    ).execute()

    data = []
    for row in response.get("rows", []):
        data.append({
            "Page": row["keys"][0],
            "Query": row["keys"][1],
            "Clicks": row["clicks"],
            "Impressions": row["impressions"],
            "CTR": round(row["ctr"] * 100, 2),
            "Position": round(row["position"], 2)
        })

    return data


def save_to_csv(data, file_path):
    """Save data to CSV file"""
    df = pd.DataFrame(data)
    df.to_csv(file_path, index=False, encoding="utf-8-sig")
    return file_path


# =========================
# Read input from Node.js
# =========================
try:
    input_data = json.loads(sys.stdin.read())
except json.JSONDecodeError as e:
    print(json.dumps({
        "success": False,
        "error": f"Invalid JSON input: {str(e)}"
    }))
    sys.exit(1)


CLIENT_ID = "816118067676-0ril5bauojsupkedd6jgok9t90628ts3.apps.googleusercontent.com"
CLIENT_SECRET = "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"


# =========================
# Create credentials
# =========================
try:
    creds = Credentials(
        token=input_data.get("access_token"),
        refresh_token=input_data.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=[
            "https://www.googleapis.com/auth/webmasters",
            "https://www.googleapis.com/auth/webmasters.readonly"
        ]
    )

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())

except Exception as e:
    print(json.dumps({
        "success": False,
        "error": f"Credentials error: {str(e)}"
    }))
    sys.exit(1)


# =========================
# Build GSC service
# =========================
try:
    service = build("searchconsole", "v1", credentials=creds)
except Exception as e:
    print(json.dumps({
        "success": False,
        "error": f"Service build error: {str(e)}"
    }))
    sys.exit(1)


# =========================
# Parameters
# =========================
site_url = input_data.get("site_url")
start_date = input_data.get("start_date")
end_date = input_data.get("end_date")

if not all([site_url, start_date, end_date]):
    print(json.dumps({
        "success": False,
        "error": "Missing required parameters: site_url, start_date, or end_date"
    }))
    sys.exit(1)


# =========================
# Uploads directory
# =========================
BASE_DIR = os.getcwd()  # server/
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)


# =========================
# Fetch data and save CSV
# =========================
try:
    gsc_data = get_gsc_data(service, site_url, start_date, end_date)

    if not gsc_data:
        print(json.dumps({
            "success": True,
            "count": 0,
            "message": "No data found for the specified period",
            "filename": None
        }))
        sys.exit(0)

    filename = f"gsc_data_{start_date}_to_{end_date}.csv"
    file_path = os.path.join(UPLOADS_DIR, filename)

    save_to_csv(gsc_data, file_path)

    print(json.dumps({
        "success": True,
        "count": len(gsc_data),
        "filename": filename,
        "path": "uploads",
        "message": "Data saved successfully"
    }))

except Exception as e:
    print(json.dumps({
        "success": False,
        "error": str(e)
    }))
    sys.exit(1)
