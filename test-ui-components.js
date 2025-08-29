#!/usr/bin/env node

/**
 * UI Component Testing Script
 * Tests the VSME Guru application UI components and functionality
 */

const fs = require('fs')
const path = require('path')

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
}

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL'
  console.log(`${status}: ${name}`)
  if (details) console.log(`   ${details}`)

  testResults.tests.push({ name, passed, details })
  if (passed) testResults.passed++
  else testResults.failed++
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath)
  logTest(`File exists: ${description}`, exists, filePath)
  return exists
}

function checkComponentStructure(filePath, requiredElements, description) {
  if (!fs.existsSync(filePath)) {
    logTest(`Component structure: ${description}`, false, `File not found: ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const missingElements = requiredElements.filter((element) => !content.includes(element))

  if (missingElements.length === 0) {
    logTest(`Component structure: ${description}`, true, 'All required elements found')
    return true
  }
  logTest(`Component structure: ${description}`, false, `Missing: ${missingElements.join(', ')}`)
  return false
}

function checkAccessibilityFeatures(filePath, description) {
  if (!fs.existsSync(filePath)) {
    logTest(`Accessibility: ${description}`, false, `File not found: ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const accessibilityFeatures = [
    'aria-label',
    'aria-expanded',
    'aria-hidden',
    'role=',
    'aria-describedby',
  ]

  const foundFeatures = accessibilityFeatures.filter((feature) => content.includes(feature))
  const hasAccessibility = foundFeatures.length >= 2 // At least 2 accessibility features

  logTest(
    `Accessibility: ${description}`,
    hasAccessibility,
    `Found ${foundFeatures.length} accessibility features: ${foundFeatures.join(', ')}`
  )
  return hasAccessibility
}

function checkResponsiveDesign(filePath, description) {
  if (!fs.existsSync(filePath)) {
    logTest(`Responsive design: ${description}`, false, `File not found: ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const responsiveClasses = ['sm:', 'md:', 'lg:', 'xl:', 'min-h-\\[44px\\]', 'isMobile']

  const foundClasses = responsiveClasses.filter((cls) => content.includes(cls))
  const hasResponsive = foundClasses.length >= 2

  logTest(
    `Responsive design: ${description}`,
    hasResponsive,
    `Found responsive features: ${foundClasses.join(', ')}`
  )
  return hasResponsive
}

function checkThemeSupport(filePath, description) {
  if (!fs.existsSync(filePath)) {
    logTest(`Theme support: ${description}`, false, `File not found: ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const themeFeatures = ['dark:', 'ModeToggle', 'useTheme', 'ThemeProvider']

  const foundFeatures = themeFeatures.filter((feature) => content.includes(feature))
  const hasTheme = foundFeatures.length >= 1

  logTest(
    `Theme support: ${description}`,
    hasTheme,
    `Found theme features: ${foundFeatures.join(', ')}`
  )
  return hasTheme
}

console.log('🧪 Starting UI Component Testing...\n')

// Test 1: Core Layout Components
console.log('📋 Testing Core Layout Components')
checkFileExists('apps/web/src/app/layout.tsx', 'Root layout')
checkFileExists('apps/web/src/components/layout/app-layout.tsx', 'App layout')
checkFileExists('apps/web/src/components/layout/header.tsx', 'Header component')

// Test 2: Navigation Components
console.log('\n🧭 Testing Navigation Components')
checkFileExists('apps/web/src/components/navigation/app-sidebar.tsx', 'App sidebar')
checkFileExists('apps/web/src/components/navigation/nav-main.tsx', 'Main navigation')
checkFileExists('apps/web/src/components/navigation/nav-user.tsx', 'User navigation')
checkFileExists('apps/web/src/components/navigation/nav-projects.tsx', 'Projects navigation')
checkFileExists('apps/web/src/components/navigation/team-switcher.tsx', 'Team switcher')

// Test 3: Page Components
console.log('\n📄 Testing Page Components')
checkFileExists('apps/web/src/app/(LandingPages)/page.tsx', 'Landing page')
checkFileExists('apps/web/src/app/(SignedIn)/dashboard/page.tsx', 'Dashboard page')
checkFileExists('apps/web/src/app/(SignedIn)/projects/page.tsx', 'Projects page')
checkFileExists('apps/web/src/app/(SignedIn)/settings/page.tsx', 'Settings page')

// Test 4: Authentication Components
console.log('\n🔐 Testing Authentication Components')
checkFileExists('apps/web/src/contexts/mock-auth-context.tsx', 'Mock auth context')
checkFileExists('apps/web/src/hooks/use-auth.ts', 'Auth hook')

// Test 5: Component Structure Tests
console.log('\n🏗️ Testing Component Structure')
checkComponentStructure(
  'apps/web/src/components/navigation/app-sidebar.tsx',
  ['Sidebar', 'SidebarContent', 'SidebarHeader', 'SidebarFooter', 'NavMain', 'NavUser'],
  'App sidebar structure'
)

checkComponentStructure(
  'apps/web/src/components/navigation/nav-main.tsx',
  ['SidebarMenu', 'SidebarMenuItem', 'Collapsible', 'Link'],
  'Main navigation structure'
)

checkComponentStructure(
  'apps/web/src/components/layout/header.tsx',
  ['Breadcrumb', 'SidebarTrigger', 'ModeToggle'],
  'Header structure'
)

// Test 6: Accessibility Features
console.log('\n♿ Testing Accessibility Features')
checkAccessibilityFeatures('apps/web/src/components/navigation/nav-main.tsx', 'Main navigation')
checkAccessibilityFeatures('apps/web/src/components/navigation/nav-user.tsx', 'User navigation')
checkAccessibilityFeatures('apps/web/src/app/(LandingPages)/page.tsx', 'Landing page')

// Test 7: Responsive Design
console.log('\n📱 Testing Responsive Design')
checkResponsiveDesign('apps/web/src/components/navigation/nav-main.tsx', 'Main navigation')
checkResponsiveDesign('apps/web/src/components/navigation/nav-user.tsx', 'User navigation')
checkResponsiveDesign('apps/web/src/app/(LandingPages)/page.tsx', 'Landing page')
checkResponsiveDesign('apps/web/src/components/layout/header.tsx', 'Header')

// Test 8: Theme Support
console.log('\n🎨 Testing Theme Support')
checkThemeSupport('apps/web/src/components/layout/header.tsx', 'Header')
checkThemeSupport('apps/web/src/components/layout/providers.tsx', 'Providers')
checkThemeSupport('apps/web/src/app/(SignedIn)/settings/page.tsx', 'Settings page')

// Test 9: Error Handling
console.log('\n🚨 Testing Error Handling')
checkComponentStructure(
  'apps/web/src/components/navigation/app-sidebar.tsx',
  ['ErrorBoundary'],
  'Sidebar error boundaries'
)

checkFileExists('apps/web/src/components/common/error-boundary.tsx', 'Error boundary component')
checkFileExists('apps/web/src/app/error.tsx', 'Global error page')
checkFileExists('apps/web/src/app/not-found.tsx', 'Not found page')

// Test 10: UI Components
console.log('\n🎛️ Testing UI Components')
const uiComponents = [
  'button.tsx',
  'card.tsx',
  'input.tsx',
  'sidebar.tsx',
  'dropdown-menu.tsx',
  'avatar.tsx',
  'breadcrumb.tsx',
]

uiComponents.forEach((component) => {
  checkFileExists(`apps/web/src/components/ui/${component}`, `UI component: ${component}`)
})

// Test Results Summary
console.log('\n📊 Test Results Summary')
console.log('='.repeat(50))
console.log(`✅ Passed: ${testResults.passed}`)
console.log(`❌ Failed: ${testResults.failed}`)
console.log(
  `📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`
)

// Save detailed results
const detailedResults = {
  timestamp: new Date().toISOString(),
  summary: {
    passed: testResults.passed,
    failed: testResults.failed,
    successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(
      1
    ),
  },
  tests: testResults.tests,
}

fs.writeFileSync('test-results-10.1.json', JSON.stringify(detailedResults, null, 2))
console.log('\n💾 Detailed results saved to test-results-10.1.json')

// Exit with appropriate code
process.exit(testResults.failed > 0 ? 1 : 0)
