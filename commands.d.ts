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

    /**
     * Interaction to next paint.
     * @see https://web.dev/inp/
     */
    inp?: number | null;
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

    /**
     * Interaction to next paint.
     * @see https://web.dev/inp/
     */
    inp: number | null;
  }

  interface WebVitalsReport {
    strict: boolean;
    thresholds: WebVitalsThresholds;
    results: WebVitalsResults;
  }

  interface StartWebVitalsCaptureConfig {
    /**
     * Url of page for auditing Web Vitals. If not provided will
     * attempt to discover the current url using `cy.url()`.
     */
    url?: string;

    /**
     * Additional parameters to pass to internal cy.visit() command when visit
     * the url.
     */
    [visitKey: string]: unknown;
  }

  interface ReportWebVitalsConfig {
    /**
     * Callback for custom handling of the report results, e.g. for
     * sending results to application monitoring platforms.
     */
    onReport?: (report: WebVitalsReport) => void;

    /**
     * Enables strict mode in which tests will fail if metrics with
     * specified thresholds cannot be calculated.
     * @default false
     */
    strict?: boolean;

    /**
     * Thresholds to compare against captured Web Vitals metrics.
     */
    thresholds?: WebVitalsThresholds;

    /**
     * Time in ms to wait for Web Vitals to be reported before failing.
     * @default 10000
     */
    vitalsReportedTimeout?: number;
  }

  interface WebVitalsConfig
    extends StartWebVitalsCaptureConfig,
      ReportWebVitalsConfig {
    /**
     * Selector(s) used for capturing FID. The first matching element is
     * used for each provided selector.
     * @default "body"
     */
    firstInputSelector?: string | string[];
  }

  interface Chainable<Subject> {
    /**
     * Runs a Web Vitals audit
     * @example
     * cy.vitals({ thresholds, url, selector });
     * @param {WebVitalsConfig} webVitalsConfig configuration
     */
    vitals(webVitalsConfig?: WebVitalsConfig);

    /**
     * Starts a Web Vitals audit. Use with `cy.reportVitals()`.
     * @example
     * cy.startVitalsCapture({ url });
     * @param {StartWebVitalsCaptureConfig} startWebVitalsCaptureConfig configuration
     */
    startVitalsCapture(
      startWebVitalsCaptureConfig: StartWebVitalsCaptureConfig
    );

    /**
     * Reports on a Web Vitals audit. Use with `cy.startVitalsCapture()`.
     * @example
     * cy.reportVitals({ thresholds });
     * @param {ReportWebVitalsConfig} reportWebVitalsConfig configuration
     */
    reportVitals(reportWebVitalsConfig: ReportWebVitalsConfig);
  }
}
