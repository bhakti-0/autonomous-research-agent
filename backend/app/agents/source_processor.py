from typing import Any


class SourceProcessor:

    def process(
        self,
        sources: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:

        processed = []
        seen_urls = set()

        print(f"PROCESSOR INPUT: {len(sources)} sources")

        if sources:
            print(f"FIRST RAW SOURCE: {sources[0]}")

        for source in sources:

            title = source.get("title", "").strip()
            url = source.get("url", "").strip()
            snippet = source.get("snippet", "").strip()

            print(
                f"PROCESSING -> title={repr(title)}, "
                f"url={repr(url)}"
            )

            if not title or not url:
                print("SKIPPED: missing title or URL")
                continue

            if url in seen_urls:
                print("SKIPPED: duplicate URL")
                continue

            seen_urls.add(url)

            processed.append(
                {
                    "title": title,
                    "url": url,
                    "snippet": snippet,
                }
            )

        print(f"PROCESSOR OUTPUT: {len(processed)} sources")

        return processed