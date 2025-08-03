import requests

class IGDBClient:
    """
    Client for interacting with the Internet Game Database (IGDB)'s API.

    This client handles OAuth2 authentication with Twitch and provides Game IDs using names.
    
    Attributes:
        client_id (str): IGDB API client ID
        client_secret (str): IGDB API client secret
        base_url (str): Base URL for IGDB API endpoints
        store_categories (dict): Mapping of IGDB category IDs to store names

    Link to IGDB API documentation: https://api-docs.igdb.com/#getting-started
    """
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = "https://api.igdb.com/v4/"
        self._access_token = None 
        self.store_categories = {
            1: "Steam",
            5: "GOG", 
            10: "Apple App Store",
            11: "Epic Games Store",
            13: "Google Play",
            14: "Microsoft Store",
            15: "PlayStation Store",
            16: "Xbox Store",
            17: "Nintendo eShop",
            20: "Amazon",
            22: "Itch.io",
            26: "Origin",
            28: "Ubisoft Connect",
            31: "Battle.net",
            32: "Discord",
            35: "Humble Store"
        }

    def get_game_ids(self, query):
        headers = {
            'Client-ID': self.client_id,
            'Authorization': f'Bearer {self._get_access_token()}',
            'Accept': 'application/json',
            'Content-Type': 'text/plain'
        }

        fields = "id, name, external_games.category, external_games.uid, total_rating_count, cover.url"
        
        query_string = f'where name ~ *"{query}"*; fields {fields}; sort total_rating_count desc; limit 10;'

        response = requests.post(
            f"{self.base_url}games",
            headers=headers,
            data=query_string
        )

        if response.status_code == 200:
            games = []
            for game in response.json():
                store_ids = self._extract_store_ids(game)
                cover_url = self._get_cover_url(game)
                
                games.append({
                    'igdb_id': game['id'],
                    'name': game['name'],
                    'store_ids': store_ids,
                    'popularity_score': game.get('total_rating_count', 0),
                    'cover_url': cover_url
                })
            
            games.sort(key=lambda x: x.get('popularity_score', 0), reverse=True)
            return games
        else:
            print(f"Error: {response.status_code}")
            print(f"Response: {response.text}")
            response.raise_for_status()

    def _extract_store_ids(self, game_data: dict):
        store_ids = {}
        external_games = game_data.get('external_games', [])
        
        for external in external_games:
            category = external.get('category')
            uid = external.get('uid')
            store_name = self.store_categories.get(category, f"Unknown_{category}")
            store_ids[store_name] = uid
            
        return store_ids

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
    
    def _get_cover_url(self, game_data: dict) -> str:
        cover = game_data.get('cover')
        if cover and 'url' in cover:
            # IGDB returns URLs starting with // - add https:
            cover_url = cover['url']
            if cover_url.startswith('//'):
                cover_url = f"https:{cover_url}"
            
            # Convert to high resolution (replace 't_thumb' with 't_cover_big')
            cover_url = cover_url.replace('t_thumb', 't_cover_big')
            return cover_url
        
        return None  # No cover available