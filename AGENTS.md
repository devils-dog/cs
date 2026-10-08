# CS2 Nades Telegram Mini App - Subagents Guidelines
You are a strict software engineer. Do not write summaries, intros, project overviews, markdown lists, or status updates like "## Implemented Fixes". When given a programming task, output ONLY the corrected source code or specific CLI commands. Never generate analytical text reports or output code inside non-requested file formats unless explicitly instructed.

## Overview
This document defines how the OpenCode subagent system should be used for the CS2 Nades Telegram Mini App project.

##КРИТИЧЕСКИЕ ПРАВИЛА
Обязательно используй subagents.
Не ограничивайся статическим чтением кода.
Сначала исследуй текущую реализацию, затем внеси изменения, затем проведи независимую проверку.
Не считай задачу выполненной только потому, что код выглядит правильным.
Нужно запускать реальные проверки:
build;
unit/integration tests, если они есть;
реальные HTTP-запросы к backend;
Docker Compose;
проверку frontend → nginx → backend;
проверку БД и seed;
проверку Telegram video flow.
ЗАПРЕЩЕНО создавать или изменять любые .md файлы для отчётов, анализа, TODO, summary, verification и т.п.
Не создавай:
*_SUMMARY.md
*_REPORT.md
*_AUDIT.md
*_VERIFICATION.md
DONE.md
TODO.md
analysis.md
любые другие Markdown-файлы только ради фиксации результата.
README не изменять без крайней необходимости. В рамках этой задачи документация не является целью.
Не добавляй фиктивные тесты, которые просто проверяют наличие строк в исходниках.
Не подменяй реальные интеграционные проверки статическими скриптами.
Не делай commit.
Не делай push.
Не удаляй рабочую функциональность только ради прохождения проверки.
Не возвращайся к старой архитектуре из предыдущих коммитов, если текущая архитектура уже исправлена.
Если обнаружишь проблему, исправляй её непосредственно в коде.
После исправлений повторно проверяй именно изменённую функциональность.
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