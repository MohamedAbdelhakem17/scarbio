import sys
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta

site_url = sys.argv[1]

# load stored creds json
with open("creds.json") as f:
    tokens = json.load(f)

creds = Credentials.from_authorized_user_info(tokens)

service = build("searchconsole", "v1", credentials=creds)

end_date = datetime.now().date()
start_date = end_date - timedelta(days=90)

request = {
    "startDate": str(start_date),
    "endDate": str(end_date),
    "dimensions": ["page", "query"],
    "rowLimit": 10000
}

response = service.searchanalytics().query(
    siteUrl=site_url,
    body=request
).execute()

print(json.dumps(response))
