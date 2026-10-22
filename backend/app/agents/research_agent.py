from app.agents.planner import ResearchPlanner
from app.agents.source_processor import SourceProcessor
from app.tools.web_search.web_search import WebSearch
from app.agents.reader.reader import Reader
from app.agents.analysis.analyzer import SourceAnalyzer
from app.agents.report.report_generator import ReportGenerator


class ResearchAgent:

    def __init__(self):
        self.planner = ResearchPlanner()
        self.search_tool = WebSearch()
        self.source_processor = SourceProcessor()
        self.reader = Reader()
        self.analyzer = SourceAnalyzer()
        self.report_generator = ReportGenerator()

    async def run(self, topic: str):

        print(f"Starting research for: {topic}")

        # 1. Planning
        plan = self.planner.create_plan(topic)

        print(f"Research plan created:")
        print(plan)

        # 2. Search + processing + reading
        sources = await self.search_sources(plan)

        print(f"Sources after reading: {len(sources)}")

         # 3. LLM analysis
        findings = await self.analyzer.analyze(sources)

        print(f"Findings generated: {len(findings)}")

# 4. Generate final report
        report = await self.generate_report(
        topic=topic,
        findings=findings,
)

        return {
             "topic": topic,
             "plan": plan,
             "sources": sources,
             "findings": findings,
             "report": report,
}

    def create_plan(self, topic: str):
        return self.planner.create_plan(topic)

    async def search_sources(self, plan: dict):
        raw_sources = []

        for query in plan["queries"]:
            print(f"Searching: {query}")

            results = await self.search_tool.search(query)

            raw_sources.extend(results)

        print(f"Raw sources collected: {len(raw_sources)}")

        sources = self.source_processor.process(raw_sources)

        print(f"Sources after processing: {len(sources)}")

        read_sources = await self.reader.read_sources(sources)

        print(f"Sources after reading: {len(read_sources)}")

        return read_sources

    async def analyze_sources(self, sources: list[dict]) -> list[dict]:

        print("Analyzing sources...")

        findings = await self.analyzer.analyze(sources)

        print(f"Findings generated: {len(findings)}")

        return findings

    async def generate_report(
    self,
    topic: str,
    findings: list,
):
        print("Generating final research report...")

        report = self.report_generator.generate(
        topic=topic,
        findings=findings,
        )

        print(
            f"Final report generated "
            f"with {report['source_count']} sources."
        )

        return report
    