#!/usr/bin/env node

/**
 * UI Functionality Testing Script
 * Tests the VSME Guru application UI functionality and behavior
 */

const fs = require('fs')
const { execSync } = require('child_process')

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

function testHttpEndpoint(url, expectedStatus = 200, description) {
  try {
    const result = execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`, {
      encoding: 'utf8',
    })
    const statusCode = Number.parseInt(result.trim())
    const passed = statusCode === expectedStatus
    logTest(`HTTP endpoint: ${description}`, passed, `${url} returned ${statusCode}`)
    return passed
  } catch (error) {
    logTest(`HTTP endpoint: ${description}`, false, `Error: ${error.message}`)
    return false
  }
}

function testComponentIntegrity(filePath, requiredPatterns, description) {
  if (!fs.existsSync(filePath)) {
    logTest(`Component integrity: ${description}`, false, `File not found: ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const missingPatterns = requiredPatterns.filter((pattern) => {
    const regex = new RegExp(pattern)
    return !regex.test(content)
  })

  if (missingPatterns.length === 0) {
    logTest(`Component integrity: ${description}`, true, 'All required patterns found')
    return true
  }
  logTest(
    `Component integrity: ${description}`,
    false,
    `Missing patterns: ${missingPatterns.join(', ')}`
  )
  return false
}

function testResponsiveFeatures(filePath, description) {
  if (!fs.existsSync(filePath)) {
    logTest(`Responsive features: ${description}`, false, `File not found: ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const responsivePatterns = [
    'sm:',
    'md:',
    'lg:',
    'xl:',
    'isMobile',
    'useSidebar',
    'setOpenMobile',
    'min-h-\\[44px\\]',
    'min-h-\\[48px\\]',
    'min-w-\\[44px\\]',
  ]

  const foundPatterns = responsivePatterns.filter((pattern) => {
    const regex = new RegExp(pattern)
    return regex.test(content)
  })

  const hasResponsive = foundPatterns.length >= 1
  logTest(
    `Responsive features: ${description}`,
    hasResponsive,
    `Found ${foundPatterns.length} responsive patterns: ${foundPatterns.join(', ')}`
  )
  return hasResponsive
}

function testAccessibilityCompliance(filePath, description) {
  if (!fs.existsSync(filePath)) {
    logTest(`Accessibility compliance: ${description}`, false, `File not found: ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const a11yPatterns = [
    'aria-label',
    'aria-expanded',
    'aria-hidden',
    'aria-describedby',
    'role=',
    'alt=',
    'htmlFor',
    'aria-live',
  ]

  const foundPatterns = a11yPatterns.filter((pattern) => {
    const regex = new RegExp(pattern)
    return regex.test(content)
  })

  const hasA11y = foundPatterns.length >= 2
  logTest(
    `Accessibility compliance: ${description}`,
    hasA11y,
    `Found ${foundPatterns.length} accessibility features: ${foundPatterns.join(', ')}`
  )
  return hasA11y
}

function testThemeImplementation(filePath, description) {
  if (!fs.existsSync(filePath)) {
    logTest(`Theme implementation: ${description}`, false, `File not found: ${filePath}`)
    return false
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const themePatterns = ['dark:', 'ModeToggle', 'useTheme', 'ThemeProvider', 'next-themes']

  const foundPatterns = themePatterns.filter((pattern) => {
    const regex = new RegExp(pattern)
    return regex.test(content)
  })

  const hasTheme = foundPatterns.length >= 1
  logTest(
    `Theme implementation: ${description}`,
    hasTheme,
    `Found ${foundPatterns.length} theme features: ${foundPatterns.join(', ')}`
  )
  return hasTheme
}

console.log('🧪 Starting UI Functionality Testing...\n')

// Test 1: HTTP Endpoints and Routing
console.log('🌐 Testing HTTP Endpoints and Routing')
testHttpEndpoint('http://localhost:3001/', 200, 'Home page')
testHttpEndpoint('http://localhost:3001/dashboard', 200, 'Dashboard page')
testHttpEndpoint('http://localhost:3001/projects', 200, 'Projects page')
testHttpEndpoint('http://localhost:3001/settings', 200, 'Settings page')
testHttpEndpoint('http://localhost:3001/nonexistent', 404, 'Non-existent page (should 404)')

// Test 2: Navigation Component Functionality
console.log('\n🧭 Testing Navigation Component Functionality')
testComponentIntegrity(
  'apps/web/src/components/navigation/nav-main.tsx',
  ['handleNavigation', 'setOpenMobile', 'Link.*href', 'onClick.*handleNavigation'],
  'Main navigation click handling'
)

testComponentIntegrity(
  'apps/web/src/components/navigation/nav-user.tsx',
  ['handleSignOut', 'signOut', 'DropdownMenu', 'DropdownMenuItem'],
  'User navigation dropdown functionality'
)

testComponentIntegrity(
  'apps/web/src/components/navigation/app-sidebar.tsx',
  ['NavMain', 'NavUser', 'NavProjects', 'TeamSwitcher', 'ErrorBoundary'],
  'Sidebar component integration'
)

// Test 3: Authentication Flow
console.log('\n🔐 Testing Authentication Flow')
testComponentIntegrity(
  'apps/web/src/contexts/mock-auth-context.tsx',
  ['signIn', 'signOut', 'isAuthenticated', 'localStorage', 'useEffect'],
  'Mock authentication state management'
)

testComponentIntegrity(
  'apps/web/src/components/layout/app-layout.tsx',
  ['isAuthenticated', 'isLoading', 'useEffect.*window\\.location', 'Access Denied'],
  'Authentication-based layout switching'
)

// Test 4: Responsive Design Implementation
console.log('\n📱 Testing Responsive Design Implementation')
testResponsiveFeatures('apps/web/src/components/navigation/nav-main.tsx', 'Main navigation')
testResponsiveFeatures('apps/web/src/components/navigation/nav-user.tsx', 'User navigation')
testResponsiveFeatures('apps/web/src/components/layout/header.tsx', 'Header component')
testResponsiveFeatures('apps/web/src/app/(LandingPages)/page.tsx', 'Landing page')

// Test 5: Accessibility Implementation
console.log('\n♿ Testing Accessibility Implementation')
testAccessibilityCompliance('apps/web/src/components/navigation/nav-main.tsx', 'Main navigation')
testAccessibilityCompliance('apps/web/src/components/navigation/nav-user.tsx', 'User navigation')
testAccessibilityCompliance('apps/web/src/app/(LandingPages)/page.tsx', 'Landing page')
testAccessibilityCompliance('apps/web/src/app/layout.tsx', 'Root layout')

// Test 6: Theme System Implementation
console.log('\n🎨 Testing Theme System Implementation')
testThemeImplementation('apps/web/src/components/layout/providers.tsx', 'Theme providers')
testThemeImplementation('apps/web/src/components/common/mode-toggle.tsx', 'Theme toggle')
testThemeImplementation('apps/web/src/components/layout/header.tsx', 'Header theme integration')

// Test 7: Error Handling Implementation
console.log('\n🚨 Testing Error Handling Implementation')
testComponentIntegrity(
  'apps/web/src/components/common/error-boundary.tsx',
  ['class.*extends.*Component', 'componentDidCatch', 'getDerivedStateFromError'],
  'Error boundary implementation'
)

testComponentIntegrity(
  'apps/web/src/app/error.tsx',
  ['useEffect', 'reset', 'ErrorDisplay'],
  'Global error page functionality'
)

// Test 8: URL and Browser History
console.log('\n🔗 Testing URL and Browser History')
testComponentIntegrity(
  'apps/web/src/components/layout/header.tsx',
  ['usePathname', 'generateBreadcrumbs', 'BreadcrumbLink.*href'],
  'Breadcrumb URL generation'
)

testComponentIntegrity(
  'apps/web/src/components/navigation/nav-main.tsx',
  ['Link.*href.*item\\.url', 'Link.*href.*subItem\\.url'],
  'Navigation URL linking'
)

// Test 9: Component Styling and CSS Classes
console.log('\n🎨 Testing Component Styling and CSS Classes')
testComponentIntegrity(
  'apps/web/src/app/(LandingPages)/page.tsx',
  ['className.*bg-gradient', 'className.*text-', 'className.*flex', 'className.*grid'],
  'Landing page styling classes'
)

testComponentIntegrity(
  'apps/web/src/components/navigation/app-sidebar.tsx',
  ['className', 'Sidebar.*collapsible'],
  'Sidebar styling and behavior'
)

// Test 10: Mock Authentication Integration
console.log('\n🔄 Testing Mock Authentication Integration')
testComponentIntegrity(
  'apps/web/src/app/(LandingPages)/page.tsx',
  ['useAuth', 'isAuthenticated', 'signIn', 'useRouter.*push.*dashboard'],
  'Landing page auth integration'
)

testComponentIntegrity(
  'apps/web/src/app/(SignedIn)/dashboard/page.tsx',
  ['useMockAuth', 'user\\?\\.name'],
  'Dashboard auth integration'
)

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

fs.writeFileSync('test-results-functionality.json', JSON.stringify(detailedResults, null, 2))
console.log('\n💾 Detailed results saved to test-results-functionality.json')

// Exit with appropriate code
process.exit(testResults.failed > 0 ? 1 : 0)
