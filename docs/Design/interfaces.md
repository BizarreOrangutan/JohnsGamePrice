+------------------+----------------+-------------+-----------------------+-----------------------+
|                  |                |             |                       |                       |
+==================+================+=============+=======================+=======================+
| Interface        | Operation      | Input       | Output                | Exceptions            |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IGameSearch      | searchGame     | :string     | :array\[Game\]        | InputDataException    |
|                  |                |             |                       |                       |
|                  |                |             |                       | TimeoutException      |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IUserAccount     | login          | :string,    | :JWT                  | InputDataException    |
|                  |                | string      |                       |                       |
|                  |                |             |                       | TimeoutException      |
|                  |                |             |                       |                       |
|                  |                |             |                       | UnauthorisedException |
+------------------+----------------+-------------+-----------------------+-----------------------+
| loginOAuth       | :id_token      | :JWT        | InputDataException    |                       |
|                  |                |             |                       |                       |
|                  |                |             | TimeoutException      |                       |
|                  |                |             |                       |                       |
|                  |                |             | UnauthorisedException |                       |
+------------------+----------------+-------------+-----------------------+-----------------------+
| register         | :string,       | :JWT        | InputDataException    |                       |
|                  | string, string |             |                       |                       |
|                  |                |             | TimeoutException      |                       |
+------------------+----------------+-------------+-----------------------+-----------------------+
| changeEmail      | :string        | :boolean    | InputDataException    |                       |
|                  |                |             |                       |                       |
|                  |                |             | TimeoutException      |                       |
|                  |                |             |                       |                       |
|                  |                |             | UnauthorisedException |                       |
+------------------+----------------+-------------+-----------------------+-----------------------+
| changePassword   | :string,       | :boolean    | InputDataException    |                       |
|                  | string         |             |                       |                       |
|                  |                |             | TimeoutException      |                       |
|                  |                |             |                       |                       |
|                  |                |             | UnauthorisedException |                       |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IGamePrice       | getPrices      | :int        | :list\[(string,       | InputDataException    |
|                  |                |             | float)\]              |                       |
|                  |                |             |                       | TimeoutException      |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IWatchlist       | getWatchlist   | :void       | :list\[(int, string,  | TimeoutException      |
|                  |                |             | float)\]              |                       |
|                  |                |             |                       | UnauthorisedException |
+------------------+----------------+-------------+-----------------------+-----------------------+
| INotify          | priceDrop      | :int,       | :void                 | InputDataException    |
|                  |                | string      |                       |                       |
|                  |                |             |                       | TimeoutException      |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IAdminAccount    | login          | :string,    | :JWT                  | InputDataException    |
|                  |                | string      |                       |                       |
|                  |                |             |                       | TimeoutException      |
|                  |                |             |                       |                       |
|                  |                |             |                       | UnauthorisedException |
+------------------+----------------+-------------+-----------------------+-----------------------+
| ILinkManagement  | getWebsiteList | :void       | :list\[strings\]      | InputDataException    |
|                  |                |             |                       |                       |
|                  |                |             |                       | TimeoutException      |
|                  |                |             |                       |                       |
|                  |                |             |                       | UnauthorisedException |
+------------------+----------------+-------------+-----------------------+-----------------------+
| addWebsite       | :string        | :boolean    | InputDataException    |                       |
|                  |                |             |                       |                       |
|                  |                |             | TimeoutException      |                       |
|                  |                |             |                       |                       |
|                  |                |             | UnauthorisedException |                       |
+------------------+----------------+-------------+-----------------------+-----------------------+
| deleteWebsite    | :string        | :boolean    | InputDataException    |                       |
|                  |                |             |                       |                       |
|                  |                |             | TimeoutException      |                       |
|                  |                |             |                       |                       |
|                  |                |             | UnauthorisedException |                       |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IUserManagement  | getUserList    | :void       | :list\[(int,          | TimeoutException      |
|                  |                |             | string)\]             |                       |
|                  |                |             |                       | UnauthorisedException |
+------------------+----------------+-------------+-----------------------+-----------------------+
|                  | deleteUser     | :int        | :boolean              | InputDataException    |
|                  |                |             |                       |                       |
|                  |                |             |                       | TimeoutException      |
|                  |                |             |                       |                       |
|                  |                |             |                       | UnauthorisedException |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IUserRepository  | getWatchlist   | :int        | :list\[(int, string,  | InputDataException    |
|                  |                |             | float)\]              |                       |
|                  |                |             |                       | TimeoutException      |
|                  |                |             |                       |                       |
|                  |                |             |                       | UnauthorisedException |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IAdminRepository |                |             |                       |                       |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IGameRepository  |                |             |                       |                       |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IUserVerify      |                | :string,    | :boolean              | InputDataException    |
|                  |                | string      |                       |                       |
|                  |                |             |                       | TimeoutException      |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IAdminVerify     |                | :string,    | :boolean              | InputDataException    |
|                  |                | string      |                       |                       |
|                  |                |             |                       | TimeoutException      |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IFetchPrice      | getPrices      | :int        | :list\[(string,       | InputDataException    |
|                  |                |             | float)\]              |                       |
|                  |                |             |                       | TimeoutException      |
+------------------+----------------+-------------+-----------------------+-----------------------+
| IGameId          | getID          | :string     | :int                  | InputDataException    |
|                  |                |             |                       |                       |
|                  |                |             |                       | TimeoutException      |
+------------------+----------------+-------------+-----------------------+-----------------------+
