/**
 * Template Page Mapping Configuration
 * Maps the 28 HTML templates to 24 PDF pages
 * 
 * Some templates are combined (e.g., PESTEL split into PES and TEL)
 * Some are dividers between sections
 */

export interface PageMapping {
    pageNumber: number;
    templateFile: string;
    title: string;
    framework?: string;
    isDivider?: boolean;
}

export const PAGE_MAPPINGS: PageMapping[] = [
    // Page 1: Cover
    {
        pageNumber: 1,
        templateFile: '01_cover.html',
        title: 'Cover Page',
    },

    // Page 2: Executive Summary
    {
        pageNumber: 2,
        templateFile: '02_exec_summary.html',
        title: 'Executive Summary',
        framework: 'synthesis',
    },

    // Page 3: Table of Contents
    {
        pageNumber: 3,
        templateFile: '03_toc.html',
        title: 'Table of Contents',
    },

    // Page 4: Divider - Part 1 (Environment)
    {
        pageNumber: 4,
        templateFile: '03a_divider_part1.html',
        title: 'Part 1: Environmental Analysis',
        isDivider: true,
    },

    // Page 5: PESTEL - PES
    {
        pageNumber: 5,
        templateFile: '04a_pestel_pes.html',
        title: 'PESTEL Analysis - Political, Economic, Social',
        framework: 'pestel',
    },

    // Page 6: PESTEL - TEL
    {
        pageNumber: 6,
        templateFile: '04b_pestel_tel.html',
        title: 'PESTEL Analysis - Technological, Environmental, Legal',
        framework: 'pestel',
    },

    // Page 7: Porter's 7 Forces
    {
        pageNumber: 7,
        templateFile: '05a_porter_7forces.html',
        title: "Porter's 7 Forces Analysis",
        framework: 'porter',
    },

    // Page 8: SWOT Analysis
    {
        pageNumber: 8,
        templateFile: '06_swot.html',
        title: 'SWOT Analysis',
        framework: 'swot',
    },

    // Page 9: TAM SAM SOM
    {
        pageNumber: 9,
        templateFile: '07_tam_sam_som.html',
        title: 'Market Sizing - TAM SAM SOM',
        framework: 'tamSamSom',
    },

    // Page 10: Divider - Part 2 (Strategy)
    {
        pageNumber: 10,
        templateFile: '08a_divider_part2.html',
        title: 'Part 2: Strategic Positioning',
        isDivider: true,
    },

    // Page 11: Blue Ocean Strategy
    {
        pageNumber: 11,
        templateFile: '08_ocean.html',
        title: 'Blue Ocean Strategy',
        framework: 'blueOcean',
    },

    // Page 12: Business Model
    {
        pageNumber: 12,
        templateFile: '10_business_model.html',
        title: 'Business Model Canvas',
    },

    // Page 13: Competitive Analysis
    {
        pageNumber: 13,
        templateFile: '11_competitive_analysis.html',
        title: 'Competitive Benchmarking',
        framework: 'benchmarking',
    },

    // Page 14: Divider - Part 3 (Execution)
    {
        pageNumber: 14,
        templateFile: '11a_divider_part3.html',
        title: 'Part 3: Execution Roadmap',
        isDivider: true,
    },

    // Page 15: OKRs Quarterly
    {
        pageNumber: 15,
        templateFile: '12a_okrs_quarterly.html',
        title: 'Strategic OKRs - Quarterly Breakdown',
        framework: 'okrs',
    },

    // Page 16: Financial Projections
    {
        pageNumber: 16,
        templateFile: '12_financial_projections.html',
        title: 'Financial Projections',
        framework: 'bsc',
    },

    // Page 17: Growth Loops
    {
        pageNumber: 17,
        templateFile: '13a_growth_loops.html',
        title: 'Growth Hacking Loops',
        framework: 'growthHacking',
    },

    // Page 18: GTM Strategy
    {
        pageNumber: 18,
        templateFile: '13_gtm_strategy.html',
        title: 'Go-to-Market Strategy',
    },

    // Page 19: Divider - Part 4 (Risk & Planning)
    {
        pageNumber: 19,
        templateFile: '14a_divider_part4.html',
        title: 'Part 4: Risk Assessment & Planning',
        isDivider: true,
    },

    // Page 20: Risk Assessment
    {
        pageNumber: 20,
        templateFile: '14_risk_assessment.html',
        title: 'Risk Assessment Matrix',
        framework: 'decisionMatrix',
    },

    // Page 21: Future Scenarios
    {
        pageNumber: 21,
        templateFile: '15a_scenarios.html',
        title: 'Future Scenarios Analysis',
        framework: 'scenarios',
    },

    // Page 22: Strategic Roadmap
    {
        pageNumber: 22,
        templateFile: '15_roadmap.html',
        title: 'Strategic Roadmap',
    },

    // Page 23: Recommendations Review
    {
        pageNumber: 23,
        templateFile: '16a_recommendations_review.html',
        title: 'Strategic Recommendations',
        framework: 'synthesis',
    },

    // Page 24: Appendix
    {
        pageNumber: 24,
        templateFile: '16_appendix.html',
        title: 'Appendix & Methodology',
    },
];

/**
 * Get page mapping by page number
 */
export function getPageMapping(pageNumber: number): PageMapping | undefined {
    return PAGE_MAPPINGS.find(p => p.pageNumber === pageNumber);
}

/**
 * Get all pages for a specific framework
 */
export function getFrameworkPages(framework: string): PageMapping[] {
    return PAGE_MAPPINGS.filter(p => p.framework === framework);
}

/**
 * Total number of pages in the report
 */
export const TOTAL_PAGES = 24;
