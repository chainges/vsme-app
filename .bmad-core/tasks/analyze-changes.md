<!-- Powered by BMAD™ Core -->

# Analyze Changes for Documentation

## Purpose

Analyze git diff output to determine if architectural documentation (ADR) is needed and create it if the changes are architecturally significant according to BMAD principles.

## Critical Decision Criteria

**CREATE ADR FOR (Architecturally Significant):**
- New services, microservices, or major service modifications
- New caching layers or caching strategies
- Database schema changes, new databases, or data architecture changes
- API design changes or new API endpoints with architectural impact
- New architectural patterns, frameworks, or design patterns
- Integration with new external services or major integration changes
- Security architecture changes or new authentication/authorization patterns
- Performance optimization strategies with architectural implications
- New deployment patterns or infrastructure architecture changes

**SKIP ADR FOR (Non-Architectural):**
- Bug fixes and defect corrections
- Code refactoring without architectural impact
- Documentation updates or comment additions
- Minor configuration changes or environment variables
- Test additions, modifications, or test infrastructure
- UI styling changes without architectural backend impact
- Performance tuning without architectural changes
- Code formatting, linting, or style changes

## Task Instructions

### Step 1: Analyze Git Changes

Execute `git diff main` (or appropriate base branch) to get complete diff of all changes.

**CRITICAL**: Read the COMPLETE diff output to understand the full scope of changes.

### Step 2: Assess Architectural Significance

Review the diff and determine:

1. **What was actually implemented?** (based on code, not assumptions)
2. **What files were changed?** (identify patterns: new services, database changes, etc.)
3. **What dependencies were added?** (new libraries, frameworks, external services)
4. **What architectural patterns were introduced?** (new design patterns, architectural decisions)

**Assessment Questions:**
- Does this introduce new architectural components?
- Does this change how services communicate?
- Does this introduce new data storage or processing patterns?
- Does this add new external dependencies or integrations?
- Does this change security, authentication, or authorization architecture?
- Does this introduce new deployment or infrastructure requirements?

### Step 3: Decision Point

**IF ARCHITECTURALLY SIGNIFICANT:**
1. Execute `*create-adr` command
2. Use actual implementation details from the diff
3. Focus on WHAT was implemented, not hypothetical alternatives
4. Reference specific files, configurations, and code patterns observed

**IF NOT ARCHITECTURALLY SIGNIFICANT:**
1. Document why no ADR is needed (brief note)
2. Exit gracefully with confirmation message
3. Suggest other documentation updates if needed (README updates, code comments, etc.)

### Step 4: Quality Assurance

For any ADR created:

1. **Accuracy Check**: Verify all technical details match actual implementation
2. **Completeness**: Ensure all significant architectural aspects are documented
3. **Clarity**: Confirm explanations are clear and based on evidence
4. **File Organization**: Ensure ADR is properly placed in `docs/adr/` directory
5. **Naming Convention**: Use format `###.descriptive-name.md`

## Success Criteria

- Complete analysis of all git changes performed
- Correct determination of architectural significance based on BMAD criteria
- If ADR created: accurately reflects actual implementation
- If no ADR needed: clear reasoning documented
- All documentation follows BMAD principles of simplicity and correctness

## BMAD Alignment

This task ensures documentation is:
- **Simple**: Only creates documentation when architecturally necessary
- **Correct**: Based on actual implementation, not assumptions  
- **Lean**: Minimal overhead, maximum value
- **Accurate**: Reflects reality of the codebase

## Notes

- This is typically the LAST step before code commit
- Should run after developer implementation and QA validation
- Focus on documenting decisions already made and implemented
- Avoid speculative or hypothetical documentation