<!-- Powered by BMAD™ Core -->

# Documentation Organizer

## Purpose

Review and organize existing project documentation to ensure consistency, accuracy, and alignment with BMAD principles of lean, correct documentation.

## Task Instructions

### Step 1: Documentation Discovery

**Scan Standard Documentation Locations:**
- `docs/` directory and all subdirectories
- `README.md` files at all levels
- `docs/adr/` for existing Architecture Decision Records
- Project root for additional documentation files
- `.md` files throughout the codebase

**Inventory Documentation Types:**
- Architecture documentation
- API documentation  
- Setup and installation guides
- Development guides
- Existing ADRs
- README files
- Inline code documentation

### Step 2: Quality Assessment

**For Each Document Found:**
1. **Currency Check**: Is information up-to-date with current codebase?
2. **Accuracy Validation**: Do technical details match actual implementation?
3. **Completeness Review**: Are critical sections missing or incomplete?
4. **BMAD Alignment**: Does it follow simplicity, correctness, lean principles?

**Common Issues to Identify:**
- Outdated dependency versions or configurations
- References to files or code that no longer exist
- Incomplete or placeholder sections
- Overly complex explanations where simple ones suffice
- Duplicate information across multiple files
- Missing critical architectural decisions

### Step 3: Organization Analysis

**Documentation Structure Review:**
- Is there a logical documentation hierarchy?
- Are ADRs properly numbered and organized?
- Are there clear entry points for different user types?
- Is navigation between documents clear?

**Suggest Improvements:**
- Consolidation of duplicate content
- Better organization structure
- Index or navigation improvements
- Outdated content removal

### Step 4: Prioritized Recommendations

**Present findings as prioritized action list:**

**HIGH PRIORITY (Critical Issues):**
- Outdated technical information
- Broken references or links
- Missing critical architectural documentation

**MEDIUM PRIORITY (Improvement Opportunities):**
- Organization structure improvements
- Consolidation of duplicate content
- Navigation enhancements

**LOW PRIORITY (Polish Items):**
- Formatting consistency
- Style guide alignment
- Minor content gaps

### Step 5: Action Plan

**For Each Identified Issue:**
1. **Immediate Fixes**: Quick corrections that can be done now
2. **Requires Investigation**: Issues needing code analysis to verify
3. **Future Tasks**: Larger reorganization or documentation projects

## Success Criteria

- Complete inventory of existing documentation
- Accurate assessment of documentation quality and currency
- Prioritized list of improvements aligned with BMAD principles
- Clear action plan for documentation improvements
- Focus on high-impact, low-effort improvements first

## BMAD Alignment

This task ensures documentation organization follows:
- **Simple**: Clear structure, eliminate complexity
- **Correct**: Accurate, up-to-date information
- **Lean**: Remove redundancy, focus on essential content
- **Actionable**: Create clear improvement roadmap

## Notes

- Focus on organizational improvements, not content creation
- Prioritize accuracy and currency over comprehensive coverage
- Suggest consolidation rather than expansion
- Align recommendations with actual development workflow needs
- Consider the documentation maintenance burden in recommendations