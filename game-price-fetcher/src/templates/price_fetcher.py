from abc import ABC, abstractmethod

class PriceFetcher(ABC):
    def fetch(self, game_id, currency="GBP"):
        """
        Fetch the price of a game by its ID.
        
        :param game_id: The ID of the game to fetch the price for.
        :param currency: The currency code to fetch the price for.
        :return: The price of the game.
        """
        raw_data = self._get_raw_data(game_id, currency)
        return self._parse_price(raw_data)

    @abstractmethod
    def _get_raw_data(self, game_id, currency="GBP"):
        """
        Fetch raw data from the source.
        
        :param game_id: The ID of the game to fetch data for.
        :param currency: The currency code to fetch data for.
        :return: Raw data from the source.
        """
        pass

    @abstractmethod
    def _parse_price(self, raw_data):
        """
        Parse the raw data to extract the price.
        
        :param raw_data: The raw data fetched from the source.
        :return: The parsed price.
        """
        pass