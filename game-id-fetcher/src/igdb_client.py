import requests

class IGDBClient:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = "https://api.igdb.com/v4/"
        self._access_token = None 

    def get_game_ids(self, query):
        headers = {
            'Client-ID': self.client_id,
            'Authorization': f'Bearer {self._get_access_token()}',
        }

        response = requests.post(
            f"{self.base_url}games",
            headers=headers,
            data=f'search "{query}"; fields id, name; limit 10;'
        )

        if response.status_code == 200:
            # Return a list of (id, name) tuples
            return [(game['id'], game['name']) for game in response.json()]
        else:
            response.raise_for_status()

    def _get_access_token(self):
        if self._access_token:
            return self._access_token
        
        url = "https://id.twitch.tv/oauth2/token"
        params = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'client_credentials'
        }
        response = requests.post(url, params=params)
        response.raise_for_status()
        self._access_token = response.json()['access_token']
        return self._access_token