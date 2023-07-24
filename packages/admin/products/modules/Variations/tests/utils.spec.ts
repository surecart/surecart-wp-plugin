import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { generateVariants } from '../utils';

// generateVariants tests
test.describe('generateVariants', () => {
	test('should generate 1 option variants', () => {
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

		// Check if variants are generated correctly
		expect(variants).toEqual(
			expect.arrayContaining([
				{
					option_1: 'Red',
					position: 0,
					index: 0,
				},
				{
					option_1: 'Blue',
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
					{ index: '1', label: 'Red' },
					{ index: '2', label: 'Blue' },
				],
			},
			{
				name: 'Size',
				values: [
					{ index: '3', label: 'Small' },
					{ index: '4', label: 'Large' },
				],
			},
		];

		const previousVariants = [
			{
				option_1: 'Red',
				option_2: 'Small',
				position: 0,
				sku: '123',
				amount: 100,
			},
			{
				option_1: 'Red',
				option_2: 'Large',
				position: 1,
				sku: '1234',
			},
			{
				option_1: 'Blue',
				option_2: 'Small',
				position: 2,
			},
			{
				option_1: 'Blue',
				option_2: 'Large',
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
					position: 0,
					index: 0,
					sku: '123',
					amount: 100,
				},
				{
					option_1: 'Red',
					option_2: 'Large',
					position: 1,
					index: 1,
					sku: '1234',
				},
				{
					option_1: 'Blue',
					option_2: 'Small',
					position: 2,
					index: 2,
				},
				{
					option_1: 'Blue',
					option_2: 'Large',
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
					{ index: '0', label: 'Gold' },
					{ index: '1', label: 'Silver' },
				],
			},
		];

		const previousVariants = [
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: 'Gold',
				position: 0,
				sku: '123',
				amount: 100,
			},
			{
				option_1: 'Red',
				option_2: 'Small',
				option_3: 'Silver',
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
					option_2: 'Small',
					option_3: 'Gold',
					position: 0,
					index: 0,
					sku: '123',
					amount: 100,
				},
				{
					option_1: 'Red',
					option_2: 'Small',
					option_3: 'Silver',
					position: 1,
					index: 1,
					sku: '1234',
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
			])
		);
	});
});
