/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import {
	generateVariants,
	getDiffingVariants,
	getExlcudedVariants,
	getNestedVariantLength,
} from '../utils';

test.describe('generateVariants', () => {
	test('should generate 1 option variants', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '1', label: 'Red', id: '1' },
					{ index: '2', label: 'Blue', id: '2' },
				],
			},
		];

		const variants = generateVariants(options, []);

		// Check if variants are generated correctly
		expect(variants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Red',
					option_1_id: '1',
					option_2: null,
					option_3: null,
					position: 0,
					index: 0,
				},
				{
					option_1: 'Blue',
					option_1_id: '2',
					option_2: null,
					option_3: null,
					position: 1,
					index: 1,
				},
			])
		);
	});

	test('should generate 2 option variants with previous values', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '1', label: 'Red', id: '1' },
					{ index: '2', label: 'Blue', id: '2' },
				],
			},
			{
				name: 'Size',
				values: [
					{ index: '3', label: 'Small', id: '3' },
					{ index: '4', label: 'Large', id: '4' },
				],
			},
		];

		const previousVariants = [
			{
				option_1: 'Red',
				option_1_id: '1',
				option_2: 'Small',
				option_2_id: '3',
				option_3: null,
				position: 0,
				sku: '123',
				amount: 100,
			},
			{
				option_1: 'Red',
				option_1_id: '1',
				option_2: 'Large',
				option_2_id: '4',
				option_3: null,
				position: 1,
				sku: '1234',
			},
			{
				option_1: 'Blue',
				option_1_id: '2',
				option_2: 'Small',
				option_2_id: '3',
				option_3: null,
				position: 2,
			},
			{
				option_1: 'Blue',
				option_1_id: '2',
				option_2: 'Large',
				option_2_id: '4',
				option_3: null,
				position: 3,
			},
		];

		const variants = generateVariants(options, previousVariants);

		// Check if variants are generated correctly
		expect(variants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Red',
					option_2: 'Small',
					option_1_id: '1',
					option_2_id: '3',
					option_3: null,
					position: 0,
					sku: '123',
					amount: 100,
					index: 0,
				},
				{
					option_1: 'Red',
					option_1_id: '1',
					option_2: 'Large',
					option_2_id: '4',
					option_3: null,
					position: 1,
					sku: '1234',
					index: 1,
				},
				{
					option_1: 'Blue',
					option_1_id: '2',
					option_2: 'Small',
					option_2_id: '3',
					option_3: null,
					position: 2,
					index: 2,
				},
				{
					option_1: 'Blue',
					option_1_id: '2',
					option_2: 'Large',
					option_2_id: '4',
					option_3: null,
					position: 3,
					index: 3,
				},
			])
		);
	});

	test('should generate 3 option variants with previous values', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '0', label: 'Red', id: '1' },
					{ index: '1', label: 'Blue', id: '2' },
				],
			},
			{
				name: 'Size',
				values: [
					{ index: '0', label: 'Small', id: '3' },
					{ index: '1', label: 'Large', id: '4' },
				],
			},
			{
				name: 'Material',
				values: [
					{ index: '0', label: 'Gold', id: '5' },
					{ index: '1', label: 'Silver', id: '6' },
				],
			},
		];

		const previousVariants = [
			{
				option_1: 'Red',
				option_1_id: '1',
				option_2: 'Small',
				option_2_id: '3',
				option_3: 'Gold',
				option_3_id: '5',
				position: 0,
				sku: '123',
				amount: 100,
			},
			{
				option_1: 'Red',
				option_1_id: '1',
				option_2: 'Small',
				option_2_id: '3',
				option_3: 'Silver',
				option_3_id: '6',
				position: 1,
				sku: '1234',
			},
		];

		const variants = generateVariants(options, previousVariants);

		// Check if variants are generated correctly
		expect(variants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Red',
					option_1_id: '1',
					option_2: 'Small',
					option_2_id: '3',
					option_3: 'Gold',
					option_3_id: '5',
					position: 0,
					index: 0,
					sku: '123',
					amount: 100,
				},
				{
					option_1: 'Red',
					option_1_id: '1',
					option_2: 'Small',
					option_2_id: '3',
					option_3: 'Silver',
					option_3_id: '6',
					position: 1,
					index: 1,
					sku: '1234',
				},
				{
					option_1: 'Red',
					option_1_id: '1',
					option_2: 'Large',
					option_2_id: '4',
					option_3: 'Gold',
					option_3_id: '5',
					position: 2,
					index: 2,
				},
				{
					option_1: 'Red',
					option_1_id: '1',
					option_2: 'Large',
					option_2_id: '4',
					option_3: 'Silver',
					option_3_id: '6',
					position: 3,
					index: 3,
				},
				{
					option_1: 'Blue',
					option_1_id: '2',
					option_2: 'Small',
					option_2_id: '3',
					option_3: 'Gold',
					option_3_id: '5',
					position: 4,
					index: 4,
				},
				{
					option_1: 'Blue',
					option_1_id: '2',
					option_2: 'Small',
					option_2_id: '3',
					option_3: 'Silver',
					option_3_id: '6',
					position: 5,
					index: 5,
				},
				{
					option_1: 'Blue',
					option_1_id: '2',
					option_2: 'Large',
					option_2_id: '4',
					option_3: 'Gold',
					option_3_id: '5',
					position: 6,
					index: 6,
				},
				{
					option_1: 'Blue',
					option_1_id: '2',
					option_2: 'Large',
					option_2_id: '4',
					option_3: 'Silver',
					option_3_id: '6',
					position: 7,
					index: 7,
				},
			])
		);
	});
});

test.describe('getDiffingVariants', () => {
	test('should return diffing variants for option 1', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '1', label: 'Red' },
					{ index: '2', label: 'Blue' },
				],
			},
		];

		const variants = generateVariants(options, []);

		const diffingVariants = getDiffingVariants(variants, [
			{
				option_1: 'Blue',
				position: 1,
				index: 1,
			},
		]);

		// Check if variants are generated correctly
		expect(diffingVariants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Red',
				},
			])
		);
	});

	test('should return diffing variants for option 2', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '0', label: 'Red' },
					{ index: '1', label: 'Blue' },
					{ index: '2', label: 'Green' },
				],
			},
			{
				name: 'Size',
				values: [
					{ index: '0', label: 'Small' },
					{ index: '1', label: 'Large' },
				],
			},
		];

		const variants = generateVariants(options, []);

		const diffingVariants = getDiffingVariants(variants, [
			{
				option_1: 'Red',
				option_2: 'Small',
				position: 0,
				index: 0,
			},
			{
				option_1: 'Red',
				option_2: 'Large',
				position: 1,
				index: 1,
			},
			{
				option_1: 'Blue',
				option_2: 'Large',
				position: 2,
				index: 2,
			},
		]);

		// Check if variants are generated correctly - Blue, Small should be missing
		expect(diffingVariants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Blue',
					option_2: 'Small',
				},
				{
					option_1: 'Green',
					option_2: 'Small',
				},
				{
					option_1: 'Green',
					option_2: 'Large',
				},
			])
		);
	});

	test('should return diffing variants for option 3 - 3-2-2', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '0', label: 'Red' },
					{ index: '1', label: 'Blue' },
					{ index: '2', label: 'Green' },
				],
			},
			{
				name: 'Size',
				values: [
					{ index: '0', label: 'Small' },
					{ index: '1', label: 'Large' },
				],
			},
			{
				name: 'Material',
				values: [
					{ index: '0', label: 'Gold' },
					{ index: '1', label: 'Silver' },
				],
			},
		];

		const variants = generateVariants(options, []);

		const diffingVariants = getDiffingVariants(variants, [
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: 'Gold',
				position: 0,
				index: 0,
			},
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: 'Silver',
				position: 1,
				index: 1,
			},
			{
				option_1: 'Red',
				option_2: 'Large',
				option_3: 'Gold',
				position: 2,
				index: 2,
			},
			{
				option_1: 'Red',
				option_2: 'Large',
				option_3: 'Silver',
				position: 3,
				index: 3,
			},
			{
				option_1: 'Blue',
				option_2: 'Small',
				option_3: 'Gold',
				position: 4,
				index: 4,
			},
			{
				option_1: 'Blue',
				option_2: 'Small',
				option_3: 'Silver',
				position: 5,
				index: 5,
			},
			{
				option_1: 'Blue',
				option_2: 'Large',
				option_3: 'Gold',
				position: 6,
				index: 6,
			},
			{
				option_1: 'Blue',
				option_2: 'Large',
				option_3: 'Silver',
				position: 7,
				index: 7,
			},
		]);

		// Check if variants are generated correctly - Blue, Small, Gold should be missing
		expect(diffingVariants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Green',
					option_2: 'Small',
					option_3: 'Gold',
				},
				{
					option_1: 'Green',
					option_2: 'Small',
					option_3: 'Silver',
				},
				{
					option_1: 'Green',
					option_2: 'Large',
					option_3: 'Gold',
				},
				{
					option_1: 'Green',
					option_2: 'Large',
					option_3: 'Silver',
				},
			])
		);
	});

	test('should return diffing variants for option 3 - 2-1-1', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '0', label: 'Red' },
					{ index: '1', label: 'Blue' },
				],
			},
			{
				name: 'Size',
				values: [{ index: '0', label: 'Small' }],
			},
			{
				name: 'Material',
				values: [{ index: '0', label: 'Gold' }],
			},
		];

		const variants = generateVariants(options, []);

		const diffingVariants = getDiffingVariants(variants, [
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: 'Gold',
				position: 0,
				index: 0,
			},
			{
				option_1: 'Blue',
				option_2: 'Small',
				option_3: 'Gold',
				position: 1,
				index: 1,
			},
		]);

		// Check if variants are generated correctly - Nothing missing
		expect(diffingVariants).toEqual(expect.arrayContaining([]));
	});
});

test.describe('getNestedVariantLength', () => {
	test('should return 1 for 1 option variants', () => {
		const variants = [
			{
				option_1: 'Red',
			},
			{
				option_1: 'Blue',
			},
		];

		// Check if variants are generated correctly
		expect(getNestedVariantLength(variants)).toEqual(1);
	});

	test('should return 2 for 2 option variants', () => {
		const variants = [
			{
				option_1: 'Red',
				option_2: 'Small',
			},
			{
				option_1: 'Red',
				option_2: 'Large',
			},
		];

		expect(getNestedVariantLength(variants)).toEqual(2);
	});

	test('should return 3 for 3 option variants', () => {
		const variants = [
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: 'Gold',
			},
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: 'Silver',
			},
		];

		expect(getNestedVariantLength(variants)).toEqual(3);
	});
});

test.describe('getExcludeVariants', () => {
	test('should return exclude variants for option 1', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '0', label: 'Red' },
					{ index: '1', label: 'Blue' },
				],
			},
		];

		const variants = generateVariants(options, []);

		const excludeVariants = getExlcudedVariants(variants, [
			{ option_1: 'Red' },
		]);

		// Check if variants are generated correctly
		expect(excludeVariants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Blue',
					option_2: null,
					option_3: null,
					index: 0,
					position: 0,
				},
			])
		);
	});

	test('should return exclude variants for option 2', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '0', label: 'Red' },
					{ index: '1', label: 'Blue' },
				],
			},
			{
				name: 'Size',
				values: [
					{ index: '0', label: 'Small' },
					{ index: '1', label: 'Large' },
				],
			},
		];

		const variants = generateVariants(options, []);

		const excludeVariants = getExlcudedVariants(variants, [
			{ option_1: 'Red', option_2: 'Small' },
		]);

		// Check if variants are generated correctly
		expect(excludeVariants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Red',
					option_2: 'Large',
					option_3: null,
					index: 0,
					position: 0,
				},
				{
					option_1: 'Blue',
					option_2: 'Small',
					option_3: null,
					index: 1,
					position: 1,
				},
				{
					option_1: 'Blue',
					option_2: 'Large',
					option_3: null,
					index: 2,
					position: 2,
				},
			])
		);
	});

	test('should return exclude variants for option 3', () => {
		const options = [
			{
				name: 'Color',
				values: [
					{ index: '0', label: 'Red' },
					{ index: '1', label: 'Blue' },
				],
			},
			{
				name: 'Size',
				values: [
					{ index: '0', label: 'Small' },
					{ index: '1', label: 'Large' },
				],
			},
			{
				name: 'Material',
				values: [
					{ index: '0', label: 'Cotton' },
					{ index: '1', label: 'Polyester' },
				],
			},
		];

		const variants = generateVariants(options, []);

		const excludeVariants = getExlcudedVariants(variants, [
			{ option_1: 'Red', option_2: 'Small', option_3: 'Cotton' },
		]);

		// Check if variants are generated correctly
		expect(excludeVariants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Red',
					option_2: 'Small',
					option_3: 'Polyester',
					index: 0,
					position: 0,
				},
				{
					option_1: 'Red',
					option_2: 'Large',
					option_3: 'Cotton',
					index: 1,
					position: 1,
				},
				{
					option_1: 'Red',
					option_2: 'Large',
					option_3: 'Polyester',
					index: 2,
					position: 2,
				},
				{
					option_1: 'Blue',
					option_2: 'Small',
					option_3: 'Cotton',
					index: 3,
					position: 3,
				},
				{
					option_1: 'Blue',
					option_2: 'Small',
					option_3: 'Polyester',
					index: 4,
					position: 4,
				},
				{
					option_1: 'Blue',
					option_2: 'Large',
					option_3: 'Cotton',
					index: 5,
					position: 5,
				},
				{
					option_1: 'Blue',
					option_2: 'Large',
					option_3: 'Polyester',
					index: 6,
					position: 6,
				},
			])
		);
	});
});
