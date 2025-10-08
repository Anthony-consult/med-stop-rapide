/**
 * Email formatting utilities
 */

/**
 * Masks sensitive fields like NIR or social security numbers
 * Keeps first 3 and last 2 characters, replaces middle with asterisks
 */
export function maskSensitive(value: string): string {
  if (!value || typeof value !== 'string') return '';
  
  // If value is too short, return as is
  if (value.length <= 5) return value;
  
  const start = value.slice(0, 3);
  const end = value.slice(-2);
  const middle = '*'.repeat(Math.max(0, value.length - 5));
  
  return `${start}${middle}${end}`;
}

/**
 * Formats a date to French locale format
 */
export function formatDateISO(date?: string | Date): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';
    
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris'
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Formats a key to human-readable label
 * Replaces underscores with spaces and capitalizes
 */
export function formatKey(key: string): string {
  if (!key || typeof key !== 'string') return '';
  
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Checks if a field should be masked based on its key name
 */
export function shouldMaskField(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  
  const lowerKey = key.toLowerCase();
  return lowerKey.includes('nir') || lowerKey.includes('securite_sociale');
}

/**
 * Formats a value for display, applying masking if needed
 */
export function formatValue(key: string, value: any): string {
  if (value === null || value === undefined || value === '') return '';
  
  const stringValue = String(value);
  
  // Apply masking for sensitive fields
  if (shouldMaskField(key)) {
    return maskSensitive(stringValue);
  }
  
  return stringValue;
}
