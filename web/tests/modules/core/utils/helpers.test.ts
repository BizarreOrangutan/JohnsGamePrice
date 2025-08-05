// @ts-ignore
import { describe, test, expect } from 'bun:test';

// Example utility functions you might have
describe('Utility Helpers', () => {
  test('should format game titles correctly', () => {
    const formatTitle = (title: string) => title.trim().toLowerCase();
    
    expect(formatTitle('  Portal 2  ')).toBe('portal 2');
    expect(formatTitle('Half-Life')).toBe('half-life');
  });

  test('should validate search queries', () => {
    const isValidQuery = (query: string) => {
      return query.trim().length >= 2;
    };
    
    expect(isValidQuery('a')).toBe(false);
    expect(isValidQuery('ab')).toBe(true);
    expect(isValidQuery('  portal  ')).toBe(true);
    expect(isValidQuery('')).toBe(false);
  });

  test('should encode URLs safely', () => {
    const encodeQuery = (query: string) => encodeURIComponent(query);
    
    expect(encodeQuery('portal & half life')).toBe('portal%20%26%20half%20life');
    expect(encodeQuery('call of duty: modern warfare')).toBe('call%20of%20duty%3A%20modern%20warfare');
  });

  test('should handle error messages', () => {
    const formatError = (error: Error) => {
      return error.message || 'Unknown error';
    };
    
    expect(formatError(new Error('API Error'))).toBe('API Error');
    expect(formatError(new Error(''))).toBe('Unknown error');
  });
});