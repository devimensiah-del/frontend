# Template Integration Guide

## Overview

Successfully integrated the backend HTML templates into the frontend React preview system. The SWOT page is now rendering with real data as a proof of concept.

## What's Been Done

### ✅ Completed

1. **Copied Templates** - All 28 HTML templates from `backend_v3/templates/report_v2` to frontend
2. **Created Page Mapping** - `pageMapping.ts` maps 28 templates to 24 PDF pages
3. **Built SWOT Component** - `SwotPage.tsx` converts the SWOT HTML template to React
4. **Updated Preview** - `ReportPreview.tsx` now uses the mapping system

### 📁 File Structure

```
app/admin/analise/[id]/_components/v3/templates/
├── pageMapping.ts           # Configuration: 28 templates → 24 pages
├── SwotPage.tsx            # ✅ SWOT template (WORKING)
├── 01_cover.html           # HTML templates (28 files)
├── 02_exec_summary.html
├── ... (26 more HTML files)
└── _base_style.html
```

## Page Mapping (24 Pages)

| Page | Template File | Framework | Status |
|------|--------------|-----------|--------|
| 1 | 01_cover.html | - | ⏳ TODO |
| 2 | 02_exec_summary.html | synthesis | ⏳ TODO |
| 3 | 03_toc.html | - | ⏳ TODO |
| 4 | 03a_divider_part1.html | - | ⏳ Divider |
| 5 | 04a_pestel_pes.html | pestel | ⏳ TODO |
| 6 | 04b_pestel_tel.html | pestel | ⏳ TODO |
| 7 | 05a_porter_7forces.html | porter | ⏳ TODO |
| 8 | 06_swot.html | swot | ✅ **DONE** |
| 9 | 07_tam_sam_som.html | tamSamSom | ⏳ TODO |
| 10 | 08a_divider_part2.html | - | ⏳ Divider |
| 11 | 08_ocean.html | blueOcean | ⏳ TODO |
| 12 | 10_business_model.html | - | ⏳ TODO |
| 13 | 11_competitive_analysis.html | benchmarking | ⏳ TODO |
| 14 | 11a_divider_part3.html | - | ⏳ Divider |
| 15 | 12a_okrs_quarterly.html | okrs | ⏳ TODO |
| 16 | 12_financial_projections.html | bsc | ⏳ TODO |
| 17 | 13a_growth_loops.html | growthHacking | ⏳ TODO |
| 18 | 13_gtm_strategy.html | - | ⏳ TODO |
| 19 | 14a_divider_part4.html | - | ⏳ Divider |
| 20 | 14_risk_assessment.html | decisionMatrix | ⏳ TODO |
| 21 | 15a_scenarios.html | scenarios | ⏳ TODO |
| 22 | 15_roadmap.html | - | ⏳ TODO |
| 23 | 16a_recommendations_review.html | synthesis | ⏳ TODO |
| 24 | 16_appendix.html | - | ⏳ TODO |

## How to Add a New Template

### Step 1: Create the React Component

Example: Converting `07_tam_sam_som.html` to React

```tsx
// File: templates/TamSamSomPage.tsx
import type { TamSamSomAnalysis } from "@/types";

interface TamSamSomPageProps {
  data: TamSamSomAnalysis;
  companyName: string;
  date: string;
}

export function TamSamSomPage({ data, companyName, date }: TamSamSomPageProps) {
  return (
    <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
      {/* Copy styles from HTML template */}
      <style jsx>{`
        /* Paste CSS from the HTML template here */
      `}</style>

      {/* Header */}
      <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
        <div className="text-[10px] font-semibold text-[#B89E68]">09</div>
        <div className="text-[10px] text-[#71717A]">{companyName}</div>
      </div>

      {/* Content - Convert Go template syntax to JSX */}
      <h1 className="text-[22px] font-light text-[#0A101D] mb-1">
        TAM SAM SOM
      </h1>
      
      {/* Example: {{ .TAM }} becomes {data.tam} */}
      <div className="tam-value">{data.tam}</div>
      <div className="sam-value">{data.sam}</div>
      <div className="som-value">{data.som}</div>

      {/* Example: {{ range .Assumptions }} becomes data.assumptions.map() */}
      <ul>
        {data.assumptions?.map((assumption, idx) => (
          <li key={idx}>{assumption}</li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A] mt-auto">
        <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
        <div>{date}</div>
      </div>
    </div>
  );
}
```

### Step 2: Update ReportPreview

Add the new component to `ReportPreview.tsx`:

```tsx
import { TamSamSomPage } from "./templates/TamSamSomPage";

// Inside renderPage function:
if (mapping?.framework === 'tamSamSom' && data.tamSamSom) {
  return (
    <TamSamSomPage 
      data={data.tamSamSom} 
      companyName="Company Name"
      date={currentDate}
    />
  );
}
```

## Go Template → React Conversion Guide

### Variable Substitution

| Go Template | React/JSX |
|------------|-----------|
| `{{ .CompanyName }}` | `{companyName}` |
| `{{ .Date }}` | `{date}` |
| `{{ .SWOT.Strengths }}` | `{data.strengths}` |

### Loops

**Go Template:**
```html
{{ range .SWOT.Strengths }}
  <li>{{ .Content }}</li>
{{ end }}
```

**React:**
```tsx
{data.strengths?.map((item, idx) => (
  <li key={idx}>{item.content}</li>
))}
```

### Conditionals

**Go Template:**
```html
{{ if .HasData }}
  <div>Content</div>
{{ end }}
```

**React:**
```tsx
{data.hasData && (
  <div>Content</div>
)}
```

### Filters

**Go Template:**
```html
{{ .Confidence | lower }}
```

**React:**
```tsx
{item.confidence?.toLowerCase()}
```

## Styling Approach

### Option 1: Inline Styles (Current - SWOT)
```tsx
<style jsx>{`
  .swot-grid { display: grid; }
`}</style>
```

**Pros:** Scoped, matches HTML exactly
**Cons:** Verbose, not reusable

### Option 2: Tailwind Classes
```tsx
<div className="grid grid-cols-2 gap-4">
```

**Pros:** Concise, consistent
**Cons:** May not match exact pixel values

### Option 3: CSS Modules
```tsx
import styles from './SwotPage.module.css';
<div className={styles.swotGrid}>
```

**Pros:** Scoped, clean separation
**Cons:** Extra file, harder to match exact HTML

**Recommendation:** Use inline `<style jsx>` for exact HTML matching, then optionally refactor to Tailwind.

## Priority Order for Implementation

### High Priority (Core Frameworks)
1. ✅ **SWOT** - Done
2. **Porter** (Page 7) - `05a_porter_7forces.html`
3. **PESTEL** (Pages 5-6) - `04a_pestel_pes.html`, `04b_pestel_tel.html`
4. **Executive Summary** (Page 2) - `02_exec_summary.html`

### Medium Priority (Strategy)
5. **TAM SAM SOM** (Page 9)
6. **Blue Ocean** (Page 11)
7. **OKRs** (Page 15)
8. **Scenarios** (Page 21)

### Low Priority (Supporting)
9. **Cover** (Page 1)
10. **TOC** (Page 3)
11. **Dividers** (Pages 4, 10, 14, 19)
12. **Appendix** (Page 24)

## Testing Strategy

### 1. Visual Comparison
- Open HTML template in browser (A4 landscape)
- Open React component in preview
- Compare side-by-side

### 2. Data Validation
```tsx
// Add console.log to check data structure
console.log('SWOT Data:', data.swot);
```

### 3. Edge Cases
- Empty data arrays
- Missing optional fields
- Long text overflow
- Special characters

## Common Issues & Solutions

### Issue: Styles Not Applying
**Solution:** Check that `<style jsx>` is inside the component return

### Issue: Data Not Showing
**Solution:** Verify data structure matches TypeScript types
```tsx
// Check in browser console
console.log('Analysis Data:', data);
```

### Issue: Layout Breaking
**Solution:** Ensure container has exact dimensions
```tsx
className="w-[842px] h-[595px] max-w-[842px] max-h-[595px]"
```

### Issue: Portuguese Characters
**Solution:** Ensure UTF-8 encoding
```tsx
<meta charSet="UTF-8" />
```

## Next Steps

1. **Implement Porter Template** (Page 7)
   - Most complex template with 7 forces
   - Good test of nested data handling

2. **Implement PESTEL Templates** (Pages 5-6)
   - Split across 2 pages (PES and TEL)
   - Test multi-page framework rendering

3. **Add Company Name** to Analysis type
   - Currently hardcoded as "Company Name"
   - Should come from submission data

4. **Optimize Performance**
   - Lazy load page components
   - Virtualize preview (only render visible pages)

5. **Add Export Functionality**
   - Generate PDF from React components
   - Use libraries like `react-pdf` or `puppeteer`

## Resources

- **HTML Templates:** `app/admin/analise/[id]/_components/v3/templates/*.html`
- **Type Definitions:** `lib/types/index.ts`
- **Page Mapping:** `templates/pageMapping.ts`
- **Example Component:** `templates/SwotPage.tsx`

---

**Status:** 1/24 pages implemented (4% complete)
**Next:** Implement Porter's 7 Forces template
**Blockers:** None
