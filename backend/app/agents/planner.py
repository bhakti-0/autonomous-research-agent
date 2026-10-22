class ResearchPlanner:

    def create_plan(self, topic: str) -> dict:
        topic = topic.strip()

        return {
            "topic": topic,
            "queries": [
        f"{topic} overview",
        f"{topic} applications use cases",
        f"{topic} recent research developments",
        f"{topic} benefits opportunities",
        f"{topic} challenges limitations",
        f"{topic} future trends",
        ],
        }