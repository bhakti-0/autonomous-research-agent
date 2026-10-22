import asyncio
from typing import Any

from ddgs import DDGS


class WebSearch:
    def __init__(self):
        self.max_results = 5
        self.max_retries = 3
        self.retry_delay = 2

    async def search(self, query: str) -> list[dict[str, Any]]:
        for attempt in range(1, self.max_retries + 1):
            try:
                results = []

                with DDGS() as ddgs:
                    search_results = ddgs.text(
                        query,
                        max_results=self.max_results,
                    )

                    for result in search_results:
                        results.append(
                            {
                                "title": result.get("title", ""),
                                "url": result.get("href", ""),
                                "snippet": result.get("body", ""),
                            }
                        )

                if results:
                    print(
                        f"Web search successful "
                        f"(attempt {attempt}): {query}"
                    )
                    return results

                print(
                    f"Web search returned no results "
                    f"(attempt {attempt}): {query}"
                )

            except Exception as e:
                print(
                    f"Web search failed "
                    f"(attempt {attempt}): {e}"
                )

            if attempt < self.max_retries:
                await asyncio.sleep(self.retry_delay)

        print(
            f"Web search exhausted all retries: {query}"
        )

        return []