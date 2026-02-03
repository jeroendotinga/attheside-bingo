import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Only allows safe tags and attributes for content display.
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

/**
 * Sanitizes error messages to prevent information leakage.
 * Returns a generic user-friendly message while logging the actual error.
 */
export const sanitizeErrorMessage = (error: unknown, context?: string): string => {
  // Log the full error for debugging (only in development)
  if (import.meta.env.DEV) {
    console.error(`[${context || 'Error'}]:`, error);
  }
  
  // Return generic safe message
  return 'Er is een technische fout opgetreden. Probeer het opnieuw.';
};
