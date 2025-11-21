/**
 * Test Data Fixtures
 * Reusable test data for E2E tests
 */

/**
 * Test user credentials
 */
export const TEST_USERS = {
  user: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
    fullName: 'Test User',
    companyName: 'Test Company',
    role: 'user',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'AdminPassword123!',
    fullName: 'Admin User',
    companyName: 'Imensiah Admin',
    role: 'admin',
  },
};

/**
 * Sample submission data templates
 */
export const SUBMISSION_TEMPLATES = {
  technology: {
    companyName: 'Tech Innovators Inc',
    industry: 'Technology',
    challenge: 'We need to scale our cloud infrastructure to handle 10x user growth while maintaining 99.9% uptime and reducing costs by 30%.',
    email: 'contact@techinnovators.com',
    phone: '+1-555-0100',
  },
  healthcare: {
    companyName: 'HealthCare Solutions',
    industry: 'Healthcare',
    challenge: 'Looking to implement a secure patient data management system compliant with HIPAA regulations and integrate with existing EHR systems.',
    email: 'info@healthcaresolutions.com',
    phone: '+1-555-0200',
  },
  finance: {
    companyName: 'FinTech Group',
    industry: 'Finance',
    challenge: 'Need to develop a real-time fraud detection system using machine learning that can process millions of transactions per day.',
    email: 'contact@fintechgroup.com',
    phone: '+1-555-0300',
  },
  ecommerce: {
    companyName: 'E-Commerce Plus',
    industry: 'E-Commerce',
    challenge: 'Want to implement personalized product recommendations and optimize our checkout flow to reduce cart abandonment by 25%.',
    email: 'hello@ecommerceplus.com',
    phone: '+1-555-0400',
  },
  manufacturing: {
    companyName: 'Smart Manufacturing Co',
    industry: 'Manufacturing',
    challenge: 'Seeking IoT and AI solutions to optimize production line efficiency and implement predictive maintenance to reduce downtime.',
    email: 'contact@smartmanufacturing.com',
    phone: '+1-555-0500',
  },
};

/**
 * Sample SWOT analysis data
 */
export const SWOT_TEMPLATES = {
  technology: {
    strengths: 'Strong technical team, proven track record, scalable infrastructure',
    weaknesses: 'Limited market presence, budget constraints, competitive market',
    opportunities: 'Growing market demand, emerging technologies, strategic partnerships',
    threats: 'Rapid technology changes, security concerns, regulatory compliance',
  },
  default: {
    strengths: 'Experienced leadership, solid financial position, innovative approach',
    weaknesses: 'Resource limitations, market competition, operational challenges',
    opportunities: 'Market expansion, digital transformation, customer base growth',
    threats: 'Economic uncertainty, disruptive technologies, changing regulations',
  },
};

/**
 * Sample PESTEL analysis data
 */
export const PESTEL_TEMPLATES = {
  technology: {
    political: 'Data privacy regulations, government tech initiatives, international trade policies',
    economic: 'Digital economy growth, venture capital availability, economic recession risks',
    social: 'Remote work trends, digital literacy, social media influence',
    technological: 'Cloud computing advancement, AI/ML adoption, cybersecurity threats',
    environmental: 'Green technology demand, carbon footprint concerns, sustainable practices',
    legal: 'GDPR compliance, intellectual property rights, employment regulations',
  },
  default: {
    political: 'Government policies, political stability, regulatory environment',
    economic: 'Market conditions, inflation rates, economic growth trends',
    social: 'Demographics, consumer behavior, cultural factors',
    technological: 'Innovation pace, automation trends, digital transformation',
    environmental: 'Sustainability requirements, environmental regulations, climate change',
    legal: 'Industry regulations, compliance requirements, legal frameworks',
  },
};

/**
 * Sample status badges
 */
export const SUBMISSION_STATUSES = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  IN_PROGRESS: 'in_progress',
  DRAFT: 'draft',
  COMPLETED: 'completed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SENT: 'sent',
};

/**
 * Test form validation data
 */
export const VALIDATION_TESTS = {
  invalidEmails: [
    'invalid-email',
    'test@',
    '@example.com',
    'test..test@example.com',
    'test@example',
  ],
  validEmails: [
    'test@example.com',
    'user+tag@company.co.uk',
    'first.last@sub.domain.com',
  ],
  weakPasswords: [
    'short',
    'nouppercas1!',
    'NOLOWERCASE1!',
    'NoNumbers!!',
    'NoSpecial123',
  ],
  strongPasswords: [
    'StrongPass123!',
    'SecureP@ssw0rd',
    'MyP@ssw0rd2025',
  ],
  invalidPhones: [
    '123',
    'abc-def-ghij',
    '555-0100', // Too short
  ],
  validPhones: [
    '+1-555-0100',
    '(555) 555-0100',
    '555-555-0100',
    '+44 20 7946 0958',
  ],
};

/**
 * Mock API responses
 */
export const MOCK_RESPONSES = {
  successfulLogin: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'user',
      fullName: 'Test User',
    },
    session: {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    },
  },
  emptySubmissions: {
    data: [],
    count: 0,
  },
  sampleSubmissions: {
    data: [
      {
        id: 'sub-1',
        company_name: 'Test Company 1',
        industry: 'Technology',
        status: 'pending',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sub-2',
        company_name: 'Test Company 2',
        industry: 'Finance',
        status: 'in_progress',
        created_at: new Date().toISOString(),
      },
    ],
    count: 2,
  },
  submissionDetail: {
    id: 'sub-1',
    company_name: 'Test Company',
    industry: 'Technology',
    challenge: 'Test business challenge',
    status: 'pending',
    user_id: 'test-user-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

/**
 * UI element selectors
 */
export const SELECTORS = {
  auth: {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    nameInput: '[data-testid="name-input"]',
    companyInput: '[data-testid="company-input"]',
    loginButton: '[data-testid="login-button"]',
    signupButton: '[data-testid="signup-button"]',
    logoutButton: '[data-testid="logout-button"]',
    forgotPassword: '[data-testid="forgot-password"]',
  },
  submission: {
    form: '[data-testid="submission-form"]',
    companyNameInput: '[data-testid="company-name-input"]',
    industryInput: '[data-testid="industry-input"]',
    challengeInput: '[data-testid="challenge-input"]',
    submitButton: '[data-testid="submit-button"]',
    statusBadge: '[data-testid="status-badge"]',
  },
  dashboard: {
    header: '[data-testid="dashboard-header"]',
    userMenu: '[data-testid="user-menu"]',
    submissionsList: '[data-testid="submissions-list"]',
    createButton: '[data-testid="create-submission-button"]',
  },
  admin: {
    submissionsTable: '[data-testid="submissions-table"]',
    warRoomButton: '[data-testid="war-room-button"]',
    saveDraftButton: '[data-testid="save-draft-button"]',
    generatePdfButton: '[data-testid="generate-pdf-button"]',
    sendEmailButton: '[data-testid="send-email-button"]',
  },
  common: {
    toast: '[data-testid="toast"]',
    errorMessage: '[data-testid="error-message"]',
    loadingSpinner: '[data-testid="loading-spinner"]',
  },
};

/**
 * Test timeouts
 */
export const TIMEOUTS = {
  short: 3000,    // For fast UI updates
  medium: 5000,   // For API calls
  long: 10000,    // For page navigation
  veryLong: 30000, // For slow operations (PDF generation, etc.)
};

/**
 * Generate random test data
 */
export function generateRandomData() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);

  return {
    email: `test-${timestamp}-${random}@test.com`,
    companyName: `Test Company ${timestamp}`,
    fullName: `Test User ${random}`,
    phone: `+1-555-${String(random).padStart(4, '0')}`,
  };
}
