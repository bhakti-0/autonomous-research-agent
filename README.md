# Autonomous Research Agent

A full-stack research application with a React and TypeScript frontend and
a Python FastAPI backend. The application submits research jobs, tracks their
execution, maintains research history, and presents structured research reports.

## Features

- Submit research topics through a web interface.
- Track research job status.
- Browse research history.
- View generated research reports.
- Organize report content into findings, claims, limitations, and source references.
- Use a modular Python backend for research processing and report generation.

## Technology Stack

### Frontend

- React 19
- TypeScript
- TanStack Start and TanStack Router
- TanStack Query
- Vite
- Tailwind CSS 4
- Vitest and Testing Library

### Backend

- Python
- FastAPI
- SQLAlchemy/Alembic-based database components
- Modular research agents and services

## Repository Structure

```text
autonomous-research-agent/
├── backend/          # FastAPI backend and research processing
├── frontend/         # React/TypeScript web application
├── docs/             # Project documentation
├── docker/           # Docker-related resources
├── scripts/          # Project scripts
├── tests/             # Test suites
└── README.md

```
