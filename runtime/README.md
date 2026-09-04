# Blogspage AI Website Factory — Runtime

**Status:** M1 Implementation (Project Initialization)  
**Factory Version:** 0.2.0  
**Implementation Date:** 2026-09-02

## Overview

Runtime foundation for the Blogspage AI Website Factory. M1 establishes project initialization, workspace isolation, and state management.

## Installation

```bash
npm install
npm run build
```

## Usage

### Initialize Project

```bash
npm run dev init ../07-TEST-BUSINESSES/benchmark-001-dental
```

### Show Status

```bash
npm run dev status <project-id>
```

## Development

```bash
npm run build    # Compile TypeScript
npm test         # Run tests
npm run lint     # Type check
npm run dev      # Run CLI in dev mode
```

## Milestone Progress

- [x] M0: Pre-implementation (artifact-envelope.schema.json verified)
- [x] M1: Project Initialization (IN PROGRESS)
- [ ] M2: State Transitions + Artifacts
- [ ] M3: Schema Validation
- [ ] M4: Gate Evaluation
- [ ] M5: Human Approval
- [ ] M6: Failure Routing
- [ ] M7: Agent Framework
- [ ] M8: Research Agent

## M1 Scope

**Implemented:**
- CLI framework (Commander)
- Init command (load benchmark, create workspace, persist state=NEW)
- Status command (display current state)
- Workspace isolation
- Basic input validation
- UUID project ID generation
- State persistence
- Structured logging (Winston)

**Not Implemented (Future Milestones):**
- State transitions (M2)
- Artifact persistence (M2)
- Schema validation (M3)
- Model provider / AI agents (M7-M8)
- Gates, approval, failure routing (M4-M6)

## Project Structure

```
runtime/
├── cli/              # Command-line interface
├── workspace/        # Workspace management
├── state/            # State machine and persistence
├── config/           # Configuration management
├── logging/          # Structured logging
└── tests/            # Test suites
```

## Acceptance Criteria (M1)

- [x] Initialize project from benchmark
- [x] Create isolated workspace
- [x] Persist state=NEW
- [x] Status command works
- [x] Invalid input fails safely
- [x] No workspace corruption

## Canonical Sources

- State machine: `02-CONTROL-PLANE/state-machine.md`
- Artifact contracts: `02-CONTROL-PLANE/artifact-contracts.md`
- Workspace isolation: `artifact-contracts.md §1 rule 7`
- State persistence: `state-machine.md §1 rule 1`
