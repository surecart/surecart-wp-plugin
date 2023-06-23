/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { slugify } from '../slug';

test.describe('slug generation', () => {
    test('should convert a string to a slug', () => {
        expect(slugify('Hello World')).toBe('hello-world');
        expect(slugify('   Hello  _  World  ')).toBe('hello-world');
        expect(slugify('123$#@Title')).toBe('123title');
    });

    test('should handle empty string', () => {
        expect(slugify('')).toBe('');
    });

    test('should handle null and undefined values', () => {
        expect(slugify(null)).toBe('');
        expect(slugify(undefined)).toBe('');
    });
});
