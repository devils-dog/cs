# CS2 Nades Telegram Mini App - Subagents Guidelines

## Overview
This document defines how the OpenCode subagent system should be used for the CS2 Nades Telegram Mini App project.

## Core Principles
- Plan_update.md is the primary implementation specification.
- PLAN_UPDATE_AUDIT.md is the current audit.
- Use specialized subagents for backend/frontend/telegram/review.
- Do not trust *_COMPLETE.md as proof of implementation.
- Do not add secrets.
- Do not push to Git.
- Do not invent APIs.
- Do not create fake production functionality.
- Always run relevant tests after changes.

## Subagent Roles

### Explorer
- Analyze the current repository 
- Find file dependencies and architecture
- Identify the exact files that need changes for P0 tasks
- Prepare change plans
- Do not modify files

### Backend
- Focus on Express, TypeScript backend implementation
- Work with PostgreSQL, migration scripts, database layer
- Handle API routes and Zod validation
- Address pagination issues
- Implement proper error handling

### Frontend
- Handle React, Vite, TypeScript frontend
- Work with UI components and state management
- Ensure API client usage is correct
- Focus on UI states and responsive design

### Telegram
- Handle Telegram Mini App SDK integration
- Address Telegram Channel video architecture
- Manage Telegram API assumptions
- Be careful about using only existing APIs

### Reviewer
- Perform code reviews
- Check for architecture violations
- Verify security compliance
- Review against plan_update.md and PLAN_UPDATE_AUDIT.md

## Execution Workflow

For any major task, follow this flow:
1. explorer - Analyze and identify files
2. specialist agent - Work on specific area
3. tester (if needed) - Run appropriate tests
4. reviewer - Review changes
5. fixes (if needed) - Make necessary corrections
6. final tests - Verify everything works

## Key Requirements
- No automatic git pushes or commits
- No insecure practices (secrets in code, etc.)
- All changes must be verified through proper tests
- Every agent must respond with structured task results