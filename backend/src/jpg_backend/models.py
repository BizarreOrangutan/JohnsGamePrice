from typing import Optional

from pydantic import BaseModel, Field


class PriceRequest(BaseModel):
    game_id: str = Field(..., example="12345", description="Game ID")
    country: str = Field(..., example="US", description="Country code")
    shops: Optional[list[int]] = Field(None, example=[1, 2], description="Shop IDs")


class HistoryRequest(BaseModel):
    game_id: str = Field(..., example="12345", description="Game ID")
    country: str = Field(..., example="US", description="Country code")
    shops: Optional[list[int]] = Field(None, example=[1, 2], description="Shop IDs")
    since: Optional[str] = Field(
        None, example="2022-12-27T11:21:08+01:00", description="ISO-8601 date string"
    )
