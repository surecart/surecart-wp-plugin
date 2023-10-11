/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { generateValueCombinations, generateVariants } from '../utils';

test.describe('generateValueCombinations', () => {
	test('should generate value combinations', () => {
		const options = [
			{
				name: 'Color',
				values: ['Red', 'Blue'],
			},
			{
				name: 'Size',
				values: ['Small', 'Large'],
			},
			{
				name: 'Material',
				values: ['Gold', 'Silver'],
			},
		];
		const combos = generateValueCombinations(options);
		expect(combos).toEqual([
			['Red', 'Small', 'Gold'],
			['Red', 'Small', 'Silver'],
			['Red', 'Large', 'Gold'],
			['Red', 'Large', 'Silver'],
			['Blue', 'Small', 'Gold'],
			['Blue', 'Small', 'Silver'],
			['Blue', 'Large', 'Gold'],
			['Blue', 'Large', 'Silver'],
		]);
	});
});

test.describe('generateVariants', () => {
	test('should generate 1 option variants', () => {
		const options = [
			{
				name: 'Color',
				values: ['Red', 'Blue'],
			},
		];

		const variants = generateVariants(options, options);

		// Check if variants are generated correctly
		expect(variants).toEqual([
			{ option_1: 'Red', position: 0 },
			{ option_1: 'Blue', position: 1 },
		]);
	});

	test('should generate 2 option variants with previous values', () => {
		const previousOptions = [
			{
				name: 'Color',
				values: ['Red', 'Blue'],
			},
			{
				name: 'Size',
				values: [''],
			},
		];
		const options = [
			{
				name: 'Color',
				values: ['Red', 'Blue'],
			},
			{
				name: 'Size',
				values: ['Small'],
			},
		];

		const previousVariants = [
			{
				option_1: 'Red',
				option_2: null,
				option_3: null,
				position: 0,
				sku: 'red',
			},
			{
				option_1: 'Blue',
				option_2: null,
				option_3: null,
				position: 1,
				sku: 'blue',
			},
		];

		const variants = generateVariants(
			options,
			previousOptions,
			previousVariants
		);

		// Check if variants are generated correctly
		expect(variants).toEqual([
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: null,
				sku: 'red',
				position: 0,
			},
			{
				option_1: 'Blue',
				option_2: 'Small',
				option_3: null,
				sku: 'blue',
				position: 1,
			},
		]);
	});

	test('should generate 3 option variants with previous values', () => {
		const previousOptions = [
			{
				name: 'Color',
				values: ['Red', 'Blue'],
			},
			{
				name: 'Size',
				values: ['Small'],
			},
			{
				name: 'Material',
				values: [''],
			},
		];
		const options = [
			{
				name: 'Color',
				values: ['Red', 'Blue'],
			},
			{
				name: 'Size',
				values: ['Small'],
			},
			{
				name: 'Material',
				values: ['Rubber'],
			},
		];

		const previousVariants = [
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: null,
				sku: 'red',
				position: 0,
			},
			{
				option_1: 'Blue',
				option_2: 'Small',
				option_3: null,
				sku: 'blue',
				position: 1,
			},
		];

		const variants = generateVariants(
			options,
			previousOptions,
			previousVariants
		);

		// Check if variants are generated correctly
		expect(variants).toEqual([
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: 'Rubber',
				sku: 'red',
				position: 0,
			},
			{
				option_1: 'Blue',
				option_2: 'Small',
				option_3: 'Rubber',
				sku: 'blue',
				position: 1,
			},
		]);
	});
});
