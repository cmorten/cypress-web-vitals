/// <reference types="cypress" />

declare namespace Cypress {
  interface WebVitalsThresholds {
    /**
     * Largest contentful paint.
     * @see https://web.dev/lcp/
     */
    lcp?: number;

    /**
     * First input delay.
     * @see https://web.dev/fid/
     */
    fid?: number;

    /**
     * Cumulative layout shift.
     * @see https://web.dev/cls/
     */
    cls?: number;

    /**
     * First contentful paint.
     * @see https://web.dev/fcp/
     */
    fcp?: number;

    /**
     * Time to first byte.
     * @see https://web.dev/time-to-first-byte/
     */
    ttfb?: number;
  }

  interface WebVitalsResults {
    /**
     * Largest contentful paint.
     * @see https://web.dev/lcp/
     */
    lcp: number | null;

    /**
     * First input delay.
     * @see https://web.dev/fid/
     */
    fid: number | null;

    /**
     * Cumulative layout shift.
     * @see https://web.dev/cls/
     */
    cls: number | null;

    /**
     * First contentful paint.
     * @see https://web.dev/fcp/
     */
    fcp: number | null;

    /**
     * Time to first byte.
     * @see https://web.dev/time-to-first-byte/
     */
    ttfb: number | null;
  }

  interface WebVitalsReport {
    thresholds: WebVitalsThresholds;
    results: WebVitalsResults;
  }

  interface WebVitalsConfig {
    /**
     * Selector(s) used for capturing FID. The first matching element is
     * used for each provided selector.
     * @default "body"
     */
    firstInputSelector?: string | string[];

    /**
     * Callback for custom handling of the report results, e.g. for
     * sending results to application monitoring platforms.
     */
    onReport?: (report: WebVitalsReport) => void;

    /**
     * Thresholds to compare against captured web-vitals metrics.
     */
    thresholds?: WebVitalsThresholds;

    /**
     * Url of page for auditing web-vitals. If not provided will
     * attempt to discover the current url using `cy.url()`.
     */
    url?: string;

    /**
     * Time in ms to wait for web-vitals to be reported before failing.
     * @default 10000
     */
    vitalsReportedTimeout?: number;
  }

  interface Chainable<Subject> {
    /**
     * Runs a web-vitals audit
     * @example
     * cy.vitals({ thresholds, url, selector });
     * @param {WebVitalsConfig} webVitalsConfig configuration
     */
    vitals(webVitalsConfig?: WebVitalsConfig);
  }
}
