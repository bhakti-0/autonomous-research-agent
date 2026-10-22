from typing import Any


class ReportGenerator:
    """
    Converts analyzed research findings into a structured research report.
    """

    def generate(
        self,
        topic: str,
        findings: list[dict[str, Any]],
    ) -> dict[str, Any]:

        report = {
            "topic": topic,
            "summary": self._build_summary(findings),
            "key_findings": self._extract_key_findings(findings),
            "claims": self._extract_claims(findings),
            "limitations": self._extract_limitations(findings),
            "sources": self._extract_sources(findings),
            "source_count": len(findings),
        }

        return report

    def _build_summary(
        self,
        findings: list[dict[str, Any]],
    ) -> str:

        if not findings:
            return "No research findings were generated."

        summaries = []

        for finding in findings:
            summary = finding.get("summary", "").strip()

            if summary:
                summaries.append(summary)

        return " ".join(summaries)

    def _extract_key_findings(
        self,
        findings: list[dict[str, Any]],
    ) -> list[str]:

        key_findings = []

        for finding in findings:
            points = finding.get("key_points", [])

            for point in points:
                if point and point not in key_findings:
                    key_findings.append(point)

        return key_findings

    def _extract_claims(
        self,
        findings: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:

        claims = []

        for finding in findings:
            source_title = finding.get("title", "Unknown source")

            for claim in finding.get("claims", []):

                claims.append({
                    "source": source_title,
                    "claim": claim.get("claim", ""),
                    "evidence": claim.get("evidence", ""),
                    "confidence": claim.get("confidence", "unknown"),
                })

        return claims

    
    def _extract_limitations(
        self,
        findings: list[dict[str, Any]],
    ) -> list[dict[str, str]]:

        limitations = []
        seen = set()

        for finding in findings:
            source_title = finding.get("title", "Unknown source")
            source_url = finding.get("url", "")

            for item in finding.get("limitations", []):
                # Support both the old string format and the new object format.
                if isinstance(item, str):
                    limitation_text = item.strip()
                    reason = ""
                    limitation_type = "unspecified"

                elif isinstance(item, dict):
                    limitation_text = str(
                        item.get("limitation", "")
                    ).strip()
                    reason = str(item.get("reason", "")).strip()
                    limitation_type = str(
                        item.get("type", "unspecified")
                    ).strip()

                else:
                    continue

                if not limitation_text:
                    continue

                # Remove exact duplicates, ignoring case and whitespace.
                dedup_key = " ".join(
                    limitation_text.casefold().split()
                )

                if dedup_key in seen:
                    continue

                seen.add(dedup_key)

                limitations.append({
                    "limitation": limitation_text,
                    "reason": reason,
                    "type": limitation_type,
                    "source": source_title,
                    "url": source_url,
                })

        return limitations


    def _extract_sources(
        self,
        findings: list[dict[str, Any]],
    ) -> list[dict[str, str]]:

        sources = []

        for finding in findings:

            sources.append({
                "title": finding.get("title", ""),
                "url": finding.get("url", ""),
            })

        return sources