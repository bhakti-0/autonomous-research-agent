from typing import Any
import asyncio
import json
import os

from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv()


class SourceAnalyzer:
    """
    Analyzes successfully read research sources using an LLM.

    Responsibilities:
    - Summarize each source
    - Extract meaningful key points
    - Extract important claims
    - Identify limitations
    - Preserve source metadata
    """

    def __init__(
        self,
        model: str = "openai/gpt-oss-120b",
    ):
        self.model = model

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError(
                "GROQ_API_KEY is not set. "
                "Add it to your environment before running the analyzer."
            )

        self.client = AsyncGroq(api_key=api_key)

        # Keep requests comfortably below the free-tier TPM limit.
        self.max_content_chars = 6000

        # Maximum number of generated tokens per source.
        self.max_output_tokens = 900

        # Small delay between requests.
        self.request_delay = 3

    async def analyze(
        self,
        sources: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """
        Analyze successfully read sources and extract structured findings.
        """

        findings = []

        for index, source in enumerate(sources, start=1):

            if source.get("read_status") != "success":
                continue

            content = source.get("content", "").strip()

            if not content:
                continue

            title = source.get("title", "Untitled source")

            print(
                f"Analyzing source {index}/{len(sources)}: {title}"
            )

            try:
                analysis = await self._analyze_source(source)

                finding = {
                    "title": title,
                    "url": source.get("url", ""),
                    "summary": analysis.get("summary", ""),
                    "key_points": analysis.get("key_points", []),
                    "claims": analysis.get("claims", []),
                    "limitations": analysis.get("limitations", []),
                    "source": source,
                }

                findings.append(finding)

                print(
                    f"Analysis successful: {title}"
                )

                # Prevent rapid accumulation of TPM usage.
                if index < len(sources):
                    await asyncio.sleep(self.request_delay)

            except Exception as e:

                error_message = str(e)

                print(
                    f"Analysis failed for '{title}': {error_message}"
                )

                # Do not stop the entire research pipeline
                # because one source failed.
                continue

        print(
            f"Analyzed sources: {len(findings)}/{len(sources)}"
        )

        return findings

    async def _analyze_source(
        self,
        source: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Send one source to the LLM and request structured analysis.
        """

        title = source.get("title", "Untitled source")
        url = source.get("url", "")
        snippet = source.get("snippet", "")
        content = source.get("content", "")

        # IMPORTANT:
        # Limit the amount of source text sent to the LLM.
        content = content[:self.max_content_chars]

        
        prompt = f"""
You are a precise research source analysis agent.

Analyze ONE research source objectively.

Use only information supported by the provided source.
Do not invent facts, results, or limitations.

SOURCE TITLE:
{title}

SOURCE URL:
{url}

SOURCE SNIPPET:
{snippet}

SOURCE CONTENT:
{content}

Return ONLY valid JSON using exactly this structure:

{{
    "summary": "A concise 2-4 sentence summary.",
    "key_points": [
        "Important research point"
    ],
    "claims": [
        {{
            "claim": "A specific factual claim supported by the source.",
            "evidence": "Evidence or explanation provided by the source.",
            "confidence": "high"
        }}
    ],
    "limitations": [
        {{
            "limitation": "A specific source limitation or evidence gap.",
            "reason": "Why this limits interpretation of the source.",
            "type": "missing_evidence"
        }}
    ]
}}

Rules:

1. Summarize the actual source, not the general topic.
2. Extract only meaningful, relevant research findings.
3. Claims must be traceable to evidence in the source.
4. Confidence must be "high", "medium", or "low".
5. Limitation type must be one of:
   - "missing_evidence": evidence or evaluation is absent.
   - "source_scope": the source covers only a narrow scope.
   - "source_bias": a clearly supported potential bias.
   - "uncertainty": the source explicitly leaves a question unresolved.
   - "methodology": a limitation of the stated research method.
6. Identify a limitation only when the source content supports it.
7. Do not assume that a source lacks evidence simply because the
   provided text does not mention it. If the available text is
   insufficient to judge, do not invent a limitation.
8. Avoid duplicate limitations. Combine closely related gaps into
   one specific observation.
9. Distinguish the source's own limitations from your inability
   to access or interpret its content. Never describe an extraction
   failure as a research limitation.
10. Do not treat promotional language as independently verified
    empirical evidence.
11. If the source explicitly reports conflicting findings or
    uncertainty, preserve that distinction.
12. If a category has no supported information, return an empty
    list.
13. Keep the output concise and return valid JSON only.
"""


        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a precise research analyst. "
                        "Extract only information supported by "
                        "the provided source."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.1,
            max_completion_tokens=self.max_output_tokens,
            reasoning_effort="low",
            include_reasoning=False,
            response_format={"type": "json_object"},
        )

        raw_output = response.choices[0].message.content

        if not raw_output:
            raise ValueError(
                "LLM returned an empty response."
            )

        return json.loads(raw_output)