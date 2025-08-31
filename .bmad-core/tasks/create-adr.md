<!-- Powered by BMAD™ Core -->

# Create Architecture Decision Record (ADR)

## Purpose

Create a comprehensive Architecture Decision Record based on actual code implementation analysis, following BMAD principles of accuracy, simplicity, and lean documentation.

## Critical Prerequisites

**BEFORE EXECUTING THIS TASK:**
- Git diff analysis has been completed
- Architectural significance has been confirmed
- Actual implementation details have been identified
- Specific files, configurations, and patterns have been noted

## Task Instructions

### Step 1: Gather Implementation Evidence

**MANDATORY**: Load the ADR template using `*create-doc` with the `adr-tmpl.yaml` template.

**Before drafting content, investigate additional files as needed:**
1. Read key implementation files identified in the git diff
2. Examine configuration files for actual values and settings
3. Check package.json, requirements.txt, or similar for new dependencies
4. Review any architectural or design comments in the code
5. Look for related tests that might reveal architectural intent

**Create Investigation TODO List** if the diff doesn't provide enough context:
- [ ] Read `src/services/newService.js` to understand service architecture
- [ ] Check `config/database.js` for new database configuration
- [ ] Examine `package.json` for new architectural dependencies
- [ ] Review `tests/integration/` for architectural test patterns
- (Add more as needed based on diff analysis)

### Step 2: Execute Template-Driven Creation

Use the `create-doc` task with `adr-tmpl.yaml` template. Follow the template's elicitation process exactly.

**Critical Content Guidelines:**

**Context Section:**
- Base on actual problem solved (evident from code)
- Include specific technical constraints found in implementation
- Reference actual files and configurations observed

**Decision Section:**
- Document what was ACTUALLY implemented
- Include specific library versions, configuration values
- Reference actual file locations and code patterns
- Use exact technical terminology found in the code

**Technical Approach:**
- List actual technologies, frameworks, libraries used
- Include real configuration parameters and their values
- Document actual data structures and algorithms implemented
- Reference specific design patterns observed in code

**Consequences:**
- Base positive/negative outcomes on implementation analysis
- Identify risks from actual code review (performance, security, maintainability)
- Include evidence from code comments or architectural decisions observed

**Implementation Details:**
- List EXACT dependencies added (with versions)
- Document ACTUAL configuration parameters found
- Include performance characteristics if observable in code
- Reference all key files modified or created

### Step 3: File Organization and Naming

**ADR Placement:**
1. Create `docs/adr/` directory if it doesn't exist
2. Generate sequential ADR number (check existing ADRs)
3. Use naming format: `001.semantic-caching.md` (descriptive slug based on decision)

**Content Structure:**
- Follow template exactly
- Include front matter with metadata
- Ensure all sections have actual content (no placeholders)
- Add proper markdown formatting

### Step 4: Quality Validation

**Accuracy Checklist:**
- [ ] All technical details match actual implementation
- [ ] Configuration values are exact (not approximated)
- [ ] File references are accurate and exist
- [ ] Dependencies list matches package files
- [ ] No hypothetical or speculative content included

**BMAD Principles Checklist:**
- [ ] **Simple**: Clear, concise language without unnecessary complexity
- [ ] **Correct**: All information verified against actual code
- [ ] **Lean**: Only essential information included
- [ ] **Actionable**: Decisions are clearly stated and implementable

### Step 5: Final Integration

1. **Link Integration**: Update any relevant documentation index
2. **Cross-References**: Link to related ADRs if they exist
3. **Git Preparation**: Ensure ADR is ready to be committed with code changes
4. **Notification**: Inform user that ADR is ready for review and commit

## Success Criteria

- ADR accurately reflects actual implementation
- All technical details are precise and verifiable
- Document follows BMAD principles consistently
- File is properly organized and named
- Content is complete and ready for commit with implementation

## Error Handling

**If Template Loading Fails:**
- Verify `adr-tmpl.yaml` exists in `.bmad-core/templates/`
- Fall back to manual ADR creation using markdown template structure
- Inform user of template issue

**If Investigation Reveals Insufficient Context:**
- Document what additional files need review
- Request user guidance on accessing additional context
- Prioritize most critical architectural components first

## Notes

- This task creates documentation based on REALITY, not ideal architecture
- Focus on architectural decisions already made and implemented
- Avoid creating aspirational or future-state documentation
- Ensure ADR will help future developers understand the decision context
- Remember: documentation should serve the code, not the other way around