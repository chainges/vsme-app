<!-- Powered by BMAD™ Core -->

# Analyze Story Implementation for Documentation

## Purpose

Analyze the implementation of a specific story to determine if architectural documentation (ADR) is needed and create it with proper story references if the changes are architecturally significant according to BMAD principles.

## Usage

`*analyze-story-docs <story-number>`

Example: `*analyze-story-docs 42` will analyze story-042.md or similar naming pattern.

## Task Instructions

### Step 1: Validate Story Input

**Parameter Validation:**
- Ensure story number/identifier is provided
- Validate story number format (numeric, alphanumeric, etc.)

**Story Discovery:**
- Look in `docs/stories` directory (configured in core-config.yaml: `devStoryLocation`)
- Search for story files matching patterns:
  - `story-<number>.md`
  - `<number>-*.md` 
  - `story<number>.md`
  - Case-insensitive matching

**If story not found:**
- List available stories in the directory
- Provide clear error message with available options
- Exit gracefully

### Step 2: Extract Story Context

**Read Story File:**
- Parse story content to understand requirements
- Extract key information:
  - Story title/summary
  - Acceptance criteria
  - Technical requirements
  - Dependencies mentioned

**Story Metadata:**
- Capture story identifier
- Note creation/modification dates if available
- Identify any architectural hints in the story

### Step 3: Find Related Implementation

**Git Analysis Strategy:**
- Search commit messages for story references:
  - `git log --grep="<story-number>"`
  - `git log --grep="story.*<story-number>"`
  - `git log --grep="#<story-number>"`
- Look for commits since story creation date
- Search for file changes in relevant timeframe

**Commit Correlation:**
- Identify commits that likely implement this story
- If multiple commits found, analyze the range
- If no commits found, check for uncommitted changes related to story

### Step 4: Analyze Implementation Changes

**Execute Git Diff Analysis:**
- For committed changes: `git diff <commit-range>`
- For recent implementation: `git diff main`
- Focus on changes related to story implementation

**Apply Existing Analysis Logic:**
- Use the same architectural significance criteria from `analyze-changes.md`
- Assess if changes meet ADR creation threshold
- Consider story context when evaluating architectural impact

### Step 5: Story-Aware ADR Creation

**IF ARCHITECTURALLY SIGNIFICANT:**

1. **Execute `*create-adr` with story context**
2. **Enhance ADR with story information:**
   - **Story Reference Section**: Add story number and title
   - **Requirements Context**: Reference original story requirements
   - **Implementation Mapping**: Show how implementation addresses story needs
   - **Story Link**: Include path to story file

3. **ADR Enhancement Format:**
   ```yaml
   story_reference:
     story_id: "<story-number>"
     story_title: "<extracted from story file>"
     story_file: "docs/stories/<story-filename>"
     implementation_commits: 
       - "<commit-hash>: <commit-message>"
   ```

**IF NOT ARCHITECTURALLY SIGNIFICANT:**
1. Document why no ADR is needed (brief note)
2. Reference the story for context
3. Suggest other documentation updates if needed

### Step 6: Cross-Reference Documentation

**Story-to-ADR Linking:**
- Update story file with ADR reference if created
- Add comment or section linking to created ADR
- Maintain bidirectional references

**Documentation Organization:**
- Ensure ADR follows naming convention with story reference
- Format: `###-story-<story-number>-<descriptive-name>.md`
- Place in appropriate `docs/adr/` directory

## Success Criteria

- Story successfully identified and parsed
- Related implementation commits accurately found
- Correct determination of architectural significance with story context
- If ADR created: properly references original story and requirements
- If no ADR needed: clear reasoning with story context
- Bidirectional linking between story and ADR maintained

## Error Handling

**Story Not Found:**
- List available stories in configured directory
- Provide suggestions for similar story numbers
- Clear guidance on expected story file naming

**No Implementation Found:**
- Check if story is planned but not implemented
- Suggest checking different time ranges
- Provide option to analyze uncommitted changes

**Multiple Implementation Ranges:**
- Present options to user for commit range selection
- Allow analysis of specific commit ranges
- Support incremental implementation analysis

## BMAD Alignment

This task ensures story-driven documentation is:
- **Simple**: Links stories directly to architectural decisions
- **Correct**: Based on actual implementation tied to requirements
- **Lean**: Only creates ADRs when architecturally necessary for stories
- **Accurate**: Reflects story implementation reality
- **Traceable**: Maintains clear story-to-decision linkage

## Integration with Existing Tasks

- Leverages `analyze-changes.md` for core analysis logic
- Uses `create-adr.md` for ADR generation
- Enhances with story-specific context and references
- Maintains consistency with existing documentation workflow