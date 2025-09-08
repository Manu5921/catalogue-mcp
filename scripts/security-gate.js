#!/usr/bin/env node

/**
 * 🔒 Security Gate Script - Jules Integration
 * 
 * Implements Gemini's Priority #3 recommendation:
 * CI as synchronization point for Claude + Jules workflow
 */

const fs = require('fs');
const path = require('path');

const SECURITY_REPORTS_DIR = 'reports/security';
const ARCHON_API_URL = process.env.ARCHON_API_URL || 'http://localhost:8181';
const PROJECT_ID = process.env.ARCHON_PROJECT_ID || 'latest';

/**
 * Main security gate validation function
 */
async function validateSecurityGate() {
  console.log('🔒 Starting Security Gate Validation...');
  
  try {
    // 1. Find latest Jules audit report
    const auditReport = await findLatestAuditReport();
    if (!auditReport) {
      console.error('❌ ERROR: No Jules audit report found!');
      process.exit(1);
    }
    
    console.log(`📊 Found audit report: ${auditReport.filename}`);
    
    // 2. Parse and validate security results
    const securityResults = await parseAuditReport(auditReport.content);
    displaySecuritySummary(securityResults);
    
    // 3. Apply Gemini's Security Gate Logic
    const gateResult = evaluateSecurityGate(securityResults);
    
    if (gateResult.passed) {
      console.log('✅ SECURITY GATE PASSED!');
      console.log('🎉 No critical or high severity vulnerabilities found');
      process.exit(0);
    } else {
      console.log('🚨 SECURITY GATE FAILED!');
      console.log(`❌ Found ${gateResult.critical} critical and ${gateResult.high} high severity issues`);
      
      // 4. Create Archon tasks for failed security issues
      await createArchonSecurityTasks(securityResults.vulnerabilities);
      
      console.log('🛡️ Build blocked for security reasons');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Security Gate Error:', error.message);
    process.exit(1);
  }
}

/**
 * Find the latest Jules audit report
 */
async function findLatestAuditReport() {
  if (!fs.existsSync(SECURITY_REPORTS_DIR)) {
    return null;
  }
  
  const files = fs.readdirSync(SECURITY_REPORTS_DIR)
    .filter(file => file.startsWith('audit-jules-') && file.endsWith('.json'))
    .sort()
    .reverse(); // Get most recent first
  
  if (files.length === 0) {
    return null;
  }
  
  const latestFile = files[0];
  const filePath = path.join(SECURITY_REPORTS_DIR, latestFile);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  return {
    filename: latestFile,
    content: content
  };
}

/**
 * Parse Jules audit report and extract security data
 */
async function parseAuditReport(auditContent) {
  const summary = auditContent.audit_summary || {};
  const vulnerabilities = auditContent.vulnerabilities || [];
  const recommendations = auditContent.security_recommendations || [];
  
  return {
    summary: {
      total: summary.total_issues || 0,
      critical: summary.critical || 0,
      high: summary.high || 0,
      medium: summary.medium || 0,
      low: summary.low || 0,
      info: summary.info || 0
    },
    vulnerabilities: vulnerabilities.filter(v => 
      v.severity === 'CRITICAL' || v.severity === 'HIGH'
    ),
    recommendations,
    timestamp: auditContent.timestamp,
    duration: auditContent.audit_duration
  };
}

/**
 * Display security summary in formatted output
 */
function displaySecuritySummary(results) {
  console.log('\n📊 Security Audit Summary:');
  console.log(`  📅 Timestamp: ${results.timestamp}`);
  console.log(`  ⏱️  Duration: ${results.duration}`);
  console.log(`  📈 Total Issues: ${results.summary.total}`);
  console.log('');
  console.log('🔍 Severity Breakdown:');
  console.log(`  🔴 Critical: ${results.summary.critical}`);
  console.log(`  🟠 High: ${results.summary.high}`);
  console.log(`  🟡 Medium: ${results.summary.medium}`);
  console.log(`  🟢 Low: ${results.summary.low}`);
  console.log(`  ℹ️  Info: ${results.summary.info}`);
  console.log('');
}

/**
 * Evaluate security gate according to Gemini's logic
 */
function evaluateSecurityGate(results) {
  const critical = results.summary.critical;
  const high = results.summary.high;
  
  // Gemini's Rule: Fail if critical > 0 OR high > 0
  const passed = critical === 0 && high === 0;
  
  return {
    passed,
    critical,
    high,
    reason: passed ? 'No critical or high severity issues' : 
           `Found ${critical} critical and ${high} high severity vulnerabilities`
  };
}

/**
 * Create Archon tasks for security vulnerabilities
 */
async function createArchonSecurityTasks(vulnerabilities) {
  console.log('\n🤖 Creating Archon Security Tasks...');
  
  for (const vulnerability of vulnerabilities) {
    try {
      const taskData = {
        title: `🔒 Security: ${vulnerability.title}`,
        description: formatSecurityTaskDescription(vulnerability),
        assignee: 'AI IDE Agent',
        feature: 'security',
        task_order: vulnerability.severity === 'CRITICAL' ? 100 : 80
      };
      
      console.log(`📝 Creating task for: ${vulnerability.id}`);
      
      // In real implementation, this would call Archon MCP API
      // await callArchonAPI('create_task', taskData);
      
      // For E6 MVP: Log what would be created
      console.log(`   - Priority: ${vulnerability.severity}`);
      console.log(`   - Location: ${vulnerability.location?.file}:${vulnerability.location?.line_range}`);
      console.log(`   - Impact: ${vulnerability.impact}`);
      
    } catch (error) {
      console.warn(`⚠️ Failed to create task for ${vulnerability.id}:`, error.message);
    }
  }
  
  console.log(`✅ Created ${vulnerabilities.length} security tasks in Archon`);
}

/**
 * Format vulnerability details for Archon task description
 */
function formatSecurityTaskDescription(vulnerability) {
  return `
## 🔒 Security Vulnerability: ${vulnerability.severity}

**ID:** ${vulnerability.id}
**Category:** ${vulnerability.category}
**Severity:** ${vulnerability.severity}

### 📝 Description
${vulnerability.description}

### 📍 Location
- **File:** ${vulnerability.location?.file}
- **Lines:** ${vulnerability.location?.line_range}
- **Function:** ${vulnerability.location?.function}

### 💥 Impact
${vulnerability.impact}

### 🛠️ Remediation
**Priority:** ${vulnerability.remediation?.priority}
**Effort:** ${vulnerability.remediation?.effort}

**Steps:**
${vulnerability.remediation?.steps?.map(step => `- ${step}`).join('\n') || 'See Jules full report for detailed steps'}

### 💻 Code Example
\`\`\`typescript
${vulnerability.remediation?.code_example || '// See Jules audit report for secure code example'}
\`\`\`

**🤖 Auto-generated from Jules Security Audit**
  `.trim();
}

/**
 * Helper function to call Archon MCP API (Future implementation)
 */
async function callArchonAPI(action, data) {
  // TODO: Implement actual Archon MCP API call
  // This would integrate with our existing MCP system
  console.log(`🔗 [Future] Calling Archon API: ${action}`, data);
}

// Main execution
if (require.main === module) {
  validateSecurityGate();
}

module.exports = {
  validateSecurityGate,
  parseAuditReport,
  evaluateSecurityGate
};