"use client";

// Frontend Test Mode utilities and mock data
// Enables viewing all pages without real auth or backend

import type {
  ApiResponse,
  PaginatedResponse,
  Submission,
  SubmissionsFilters,
  DashboardStats,
  AdminAnalytics,
  Report,
  ReportShare,
} from "@/types";

export function isTestMode(): boolean {
  // Must be NEXT_PUBLIC_ to be available on client
  return (process.env.NEXT_PUBLIC_TEST_MODE || "").toLowerCase() === "true";
}

type TestRole = "admin" | "user";

const TEST_ROLE_STORAGE_KEY = "__TEST_ROLE";

export function getTestRole(): TestRole {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(TEST_ROLE_STORAGE_KEY) as TestRole | null;
    if (stored === "admin" || stored === "user") return stored;
  }
  const envRole = (process.env.NEXT_PUBLIC_TEST_ROLE || "user").toLowerCase();
  return envRole === "admin" ? "admin" : "user";
}

export function setTestRole(role: TestRole) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TEST_ROLE_STORAGE_KEY, role);
    window.dispatchEvent(new StorageEvent("storage", { key: TEST_ROLE_STORAGE_KEY, newValue: role }));
  }
}

// Minimal mock of a Supabase user-like object used in the app
export function getMockUser() {
  const role = getTestRole();
  const now = new Date().toISOString();
  return {
    id: role === "admin" ? "test-admin-id" : "test-user-id",
    email: role === "admin" ? "admin@test.local" : "user@test.local",
    app_metadata: {},
    user_metadata: { role, name: role === "admin" ? "Test Admin" : "Test User" },
    created_at: now,
    updated_at: now,
    aud: "authenticated",
  } as any;
}

export function getMockSession() {
  const now = new Date();
  const exp = Math.floor((now.getTime() + 60 * 60 * 1000) / 1000); // +1h
  return {
    access_token: "test-access-token",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: exp,
    refresh_token: "test-refresh-token",
    user: getMockUser(),
  } as any;
}

// -----------------------------
// Mock API implementation
// -----------------------------

function buildMockSubmissions(): Submission[] {
  const base: Omit<Submission, "id"> = {
    website_url: "https://example.com",
    email: "contact@example.com",
    company_name: "Empresa Exemplo",
    industry: "tecnologia",
    main_challenge: "Aquisição de clientes",
    payment_status: "paid",
    status: "approved",
    ai_status: "complete",
    review_status: "approved",
    data_completeness_score: 18,
    confidence_score: 0.92,
    report_version: 1,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  };

  return [
    { id: "subm_1", ...base, company_name: "Tech Alpha" },
    { id: "subm_2", ...base, status: "in_review", review_status: "in_review", company_name: "Beta Retail" },
    { id: "subm_3", ...base, status: "failed", ai_status: "failed", company_name: "Gamma Health" },
  ];
}

function buildMockDashboard(role: TestRole): DashboardStats {
  return {
    total_submissions: 12,
    pending_payment: role === "admin" ? 2 : 0,
    in_progress: 3,
    completed: 7,
    failed: 0,
    total_revenue: role === "admin" ? 12000 : 0,
    revenue_this_month: role === "admin" ? 3400 : 0,
    avg_completion_time_hours: 26,
  };
}

function buildMockAnalytics(): AdminAnalytics {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  return {
    submissions_over_time: days.map((date, i) => ({ date, value: 5 + i })),
    revenue_over_time: days.map((date, i) => ({ date, value: 800 + i * 50 })),
    completion_rate: 0.82,
    avg_analysis_time_hours: 18,
    top_industries: [
      { industry: "tecnologia", count: 8, percentage: 40 },
      { industry: "saude", count: 6, percentage: 30 },
    ],
    conversion_funnel: {
      visits: 1000,
      form_started: 420,
      form_submitted: 210,
      payment_completed: 160,
      report_delivered: 155,
    },
    enrichment_performance: [
      { source: "web", success_rate: 0.96, avg_latency_ms: 850, total_cost: 12.4, total_calls: 320, last_used_at: new Date().toISOString() },
    ],
  };
}

function ok<T>(data: T): ApiResponse<T> { return { success: true, data }; }
function err(message: string): ApiResponse<any> { return { success: false, error: message }; }

export async function mockApiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || "GET").toUpperCase();
  const role = getTestRole();
  const submissions = buildMockSubmissions();

  // Auth endpoints
  if (endpoint.startsWith("/api/auth/")) {
    if (endpoint.includes("login") || endpoint.includes("signup") || endpoint.includes("verify")) {
      return ok<any>({ user: { id: "mock", email: `${role}@test.local`, name: `Test ${role}`, role }, token: "mock-token" });
    }
    return ok<any>({});
  }

  // Dashboard
  if (endpoint === "/api/dashboard/user") {
    return ok<DashboardStats>(buildMockDashboard("user"));
  }
  if (endpoint === "/api/dashboard/admin") {
    return ok<DashboardStats>(buildMockDashboard("admin"));
  }

  // Submissions list/detail
  if (endpoint.startsWith("/api/submissions")) {
    const parts = endpoint.split("?")[0].split("/");
    if (parts.length === 3) {
      // list
      const page: PaginatedResponse<Submission> = {
        data: submissions,
        total: submissions.length,
        page: 1,
        per_page: 10,
        total_pages: 1,
      };
      if (method === "POST") {
        return ok<{ submission: Submission; checkout_url: string }>({ submission: { ...submissions[0], id: "new_subm" }, checkout_url: "https://checkout.example/xyz" } as any);
      }
      return ok(page as any);
    } else if (parts.length === 4) {
      // detail
      const id = parts[3];
      const item = submissions.find((s) => s.id === id) || submissions[0];
      return ok(item as any);
    } else if (endpoint.endsWith("/status")) {
      return ok(submissions[0] as any);
    }
  }

  // Reports
  if (endpoint.startsWith("/api/reports/")) {
    if (endpoint.includes("/pdf")) {
      return ok<{ pdf_url: string }>({ pdf_url: "/mock/report.pdf" } as any);
    }
    if (endpoint.includes("/markdown")) {
      return ok<any>({ report: { markdown: "# Mock Report\n\nConteúdo de teste." } });
    }
    if (endpoint.includes("/share")) {
      if (method === "POST") return ok<ReportShare>({
        id: "share_1",
        submission_id: "subm_1",
        token: "share-token",
        shared_by: "test-admin-id",
        shared_with: ["client@example.com"],
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        created_at: new Date().toISOString(),
        accessed_count: 0,
      });
      if (method === "GET") return ok<ReportShare[]>([]);
    }
    if (endpoint.includes("/shared/")) {
      return ok<any>({ submission: buildMockSubmissions()[0], report: { id: "rep_1", markdown: "# Relatório Compartilhado" } as any });
    }
    return ok<Report>({ id: "rep_1", markdown: "# Mock Report" } as any);
  }

  // Admin analytics/enrichment
  if (endpoint.startsWith("/api/admin/analytics")) {
    return ok<AdminAnalytics>(buildMockAnalytics());
  }
  if (endpoint.startsWith("/api/admin/submissions") && method === "POST") {
    return ok<any>({});
  }

  // Payments
  if (endpoint.startsWith("/api/payments/")) {
    if (endpoint.includes("/checkout/")) return ok<{ checkout_url: string }>({ checkout_url: "https://checkout.example/session" } as any);
    if (endpoint.includes("/verify/")) return ok<any>({ submission: buildMockSubmissions()[0] });
  }

  // Fallback
  return ok<any>({});
}

