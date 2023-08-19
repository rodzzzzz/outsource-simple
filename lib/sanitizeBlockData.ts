import { SanitizerConfig } from "@editorjs/editorjs"
import DOMPurify from "isomorphic-dompurify"

/**
 * Cleans string from unwanted tags
 * Method allows to use default config
 *
 * @param {string} taintString - taint string
 * @param {SanitizerConfig} customConfig - allowed tags
 * @returns {string} clean HTML
 */
export function sanitizeBlocks(
  taintString: string,
  customConfig: SanitizerConfig = {} as SanitizerConfig
): string {
  const sanitizerConfig = {
    ALLOWED_TAGS: Object.keys(customConfig),
  }

  /**
   * API client can use custom config to manage sanitize process
   */
  // return sanitizeHtml(taintString, sanitizerConfig);
  return DOMPurify.sanitize(taintString, sanitizerConfig)
}
