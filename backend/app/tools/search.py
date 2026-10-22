from typing import Any

from app.tools.web_search import WebSearch


class SearchTool:
    def __init__(self):
        self.web_search = WebSearch()

    async def search(self, query: str) -> list[dict[str, Any]]:
        return await self.web_search.search(query)