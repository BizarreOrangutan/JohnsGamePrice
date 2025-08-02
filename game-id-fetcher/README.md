# IGDB Game ID Retriever

This project is designed to retrieve game IDs from the Internet Game Database (IGDB) using the IGDB API. It provides a simple interface for fetching game IDs based on specified parameters.

## Project Structure

```
igdb-game-id-retriever/
├── src/
│   ├── igdb_client.py       # Handles connection to the IGDB API
│   ├── game_id_retriever.py  # Retrieves game IDs using IGDBClient
│   └── __init__.py          # Marks the directory as a Python package
├── requirements.txt          # Lists project dependencies
├── .gitignore                # Specifies files to ignore in Git
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd igdb-game-id-retriever
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

To retrieve game IDs, you can use the `retrieve_game_ids` function from the `game_id_retriever` module. Here is a simple example:

```python
from src.game_id_retriever import retrieve_game_ids

game_ids = retrieve_game_ids(parameters)
print(game_ids)
```

## IGDB API

This project interacts with the IGDB API. You will need to obtain an API key from IGDB to use this functionality. Make sure to include your API key in your requests.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.