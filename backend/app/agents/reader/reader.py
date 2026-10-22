import time

import requests
from bs4 import BeautifulSoup


class Reader:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout

    async def read(self, source: dict) -> dict:
        url = source.get("url")

        if not url:
            return {
                **source,
                "content": "",
                "read_status": "failed",
                "error": "Missing URL",
            }

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/150.0.0.0 Safari/537.36"
            ),
            "Accept": (
                "text/html,application/xhtml+xml,"
                "application/xml;q=0.9,image/avif,"
                "image/webp,*/*;q=0.8"
            ),
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
        }

        try:
            response = None

            for attempt in range(3):
                response = requests.get(
                    url,
                    headers=headers,
                    timeout=self.timeout,
                )

                if response.status_code == 429:
                    wait_time = 2 ** attempt
                    print(
                        f"Rate limited: {url} "
                        f"-> retrying in {wait_time}s"
                    )
                    time.sleep(wait_time)
                    continue

                if response.status_code >= 500:
                    wait_time = 2 ** attempt
                    print(
                        f"Server error {response.status_code}: {url} "
                        f"-> retrying in {wait_time}s"
                    )
                    time.sleep(wait_time)
                    continue

                break

            response.raise_for_status()

            soup = BeautifulSoup(
                response.text,
                "html.parser",
            )

            for element in soup(
                [
                    "script",
                    "style",
                    "nav",
                    "footer",
                    "header",
                    "aside",
                    "noscript",
                ]
            ):
                element.decompose()

            text = soup.get_text(
                separator=" ",
                strip=True,
            )

            if not text:
                return {
                    **source,
                    "content": "",
                    "read_status": "failed",
                    "error": "No readable text found",
                }

            return {
                **source,
                "content": text[:20000],
                "read_status": "success",
                "error": None,
            }

        except requests.exceptions.HTTPError as e:
            return {
                **source,
                "content": "",
                "read_status": "failed",
                "error": str(e),
            }

        except requests.exceptions.RequestException as e:
            return {
                **source,
                "content": "",
                "read_status": "failed",
                "error": str(e),
            }

        except Exception as e:
            return {
                **source,
                "content": "",
                "read_status": "failed",
                "error": str(e),
            }

    async def read_sources(
        self,
        sources: list[dict],
    ) -> list[dict]:

        results = []

        for source in sources:
            print(
                f"Reading: "
                f"{source.get('title', source.get('url'))}"
            )

            result = await self.read(source)

            if result["read_status"] == "success":
                results.append(result)

            else:
                print(
                    f"READ FAILED: "
                    f"{result.get('title', result.get('url'))} "
                    f"-> {result.get('error')}"
                )

        print(
            f"Successfully read: "
            f"{len(results)}/{len(sources)} sources"
        )

        return results