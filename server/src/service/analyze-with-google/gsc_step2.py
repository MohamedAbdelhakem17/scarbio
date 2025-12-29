import sys
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

def get_gsc_data(service, site_url, start_date, end_date):
    """Get GSC data for specific property"""
    request = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['page', 'query'],
        'rowLimit': 25000
    }
    
    response = service.searchanalytics().query(siteUrl=site_url, body=request).execute()
    
    # Convert to list of dicts
    data = []
    for row in response.get('rows', []):
        page = row['keys'][0]
        query = row['keys'][1]
        clicks = row['clicks']
        impressions = row['impressions']
        ctr = row['ctr']
        position = row['position']
        
        data.append({
            'Page': page,
            'Query': query,
            'Clicks': clicks,
            'Impressions': impressions,
            'CTR': round(ctr * 100, 2),
            'Position': round(position, 2)
        })
    
    return data

# Read input from Express (tokens + parameters)
input_data = json.loads(sys.stdin.read())

CLIENT_ID = "816118067676-0ril5bauojsupkedd6jgok9t90628ts3.apps.googleusercontent.com"
CLIENT_SECRET = "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"

# Create credentials
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

# Build service
service = build("searchconsole", "v1", credentials=creds)

# Get parameters from input
site_url = input_data.get("site_url")
start_date = input_data.get("start_date")
end_date = input_data.get("end_date")

# Fetch GSC data
try:
    gsc_data = get_gsc_data(service, site_url, start_date, end_date)
    print(json.dumps({
        "success": True,
        "data": gsc_data,
        "count": len(gsc_data)
    }))
except Exception as e:
    print(json.dumps({
        "success": False,
        "error": str(e)
    }))