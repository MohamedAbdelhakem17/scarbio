import sys, json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# Read creds from Express
tokens = json.loads(sys.stdin.read())

creds = Credentials(
    token=tokens.get("access_token"),
    refresh_token=tokens.get("refresh_token"),
    token_uri="https://oauth2.googleapis.com/token",
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    scopes=[
        "https://www.googleapis.com/auth/webmasters",
        "https://www.googleapis.com/auth/webmasters.readonly"
    ]
)

service = build("searchconsole", "v1", credentials=creds)

sites = service.sites().list().execute()
verified = []

for site in sites.get("siteEntry", []):
    if site.get("permissionLevel") in [
        "siteOwner",
        "siteFullUser",
        "siteRestrictedUser",
    ]:
        verified.append({
            "url": site["siteUrl"],
            "permission": site["permissionLevel"]
        })

print(json.dumps(verified))
