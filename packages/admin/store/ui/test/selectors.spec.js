/**
 * Internal dependencies
 */
import { selectValidationErrors, selectErrors } from '../selectors';

const ERROR_STATE = {
	errors: [
		{
			index: 0,
			key: 'prices',
			error: {
				code: 'price.invalid',
				message: 'Failed to save price',
				data: {
					status: 422,
					type: 'invalid',
					http_status: 'unprocessable_entity',
				},
				additional_errors: [
					{
						code: 'price.recurring_interval_count.max_interval',
						message: 'Repeat payment is too high.',
						data: {
							attribute: 'recurring_interval_count',
							type: 'max_interval',
							options: [],
						},
					},
				],
			},
		},
		{
			index: 1,
			key: 'prices',
			error: {
				code: 'price.invalid',
				message: 'Failed to save price',
				data: {
					status: 422,
					type: 'invalid',
					http_status: 'unprocessable_entity',
				},
				additional_errors: [
					{
						code: 'price.recurring_interval_count.max_interval',
						message: 'Repeat payment is too high!',
						data: {
							attribute: 'recurring_interval_count',
							type: 'max_interval',
							options: [],
						},
					},
				],
			},
		},
		{
			index: 1,
			key: 'products',
			error: {
				code: 'price.invalid',
				message: 'Failed to save price',
				data: {
					status: 422,
					type: 'invalid',
					http_status: 'unprocessable_entity',
				},
				additional_errors: [
					{
						code: 'price.recurring_interval_count.max_interval',
						message: 'Test Message',
						data: {
							attribute: 'test_attribute',
							type: 'test_type',
							options: [],
						},
					},
				],
			},
		},
	],
};

describe('selectors', () => {
	describe('selectErrors', () => {
		it('Can select all errors', () => {
			expect(selectErrors(ERROR_STATE)).toEqual(ERROR_STATE.errors);
		});
		it('Can filter errors by key', () => {
			expect(selectErrors(ERROR_STATE, 'prices')).toEqual([
				...[ERROR_STATE.errors[0]],
				...[ERROR_STATE.errors[1]],
			]);
		});
		it('Can filter errors by key and index', () => {
			expect(selectErrors(ERROR_STATE, 'prices', 0)).toEqual([
				ERROR_STATE.errors[0],
			]);
		});
	});
	describe('selectValidationErrors', () => {
		it('Can select all validation errors', () => {
			expect(selectValidationErrors(ERROR_STATE)).toEqual([
				...ERROR_STATE.errors[0].error.additional_errors,
				...ERROR_STATE.errors[1].error.additional_errors,
				...ERROR_STATE.errors[2].error.additional_errors,
			]);
		});
		it('should select validation errors by key', () => {
			expect(selectValidationErrors(ERROR_STATE, 'prices')).toEqual([
				...ERROR_STATE.errors[0].error.additional_errors,
				...ERROR_STATE.errors[1].error.additional_errors,
			]);
		});
		it('should select validation errors by key and index', () => {
			expect(selectValidationErrors(ERROR_STATE, 'prices', 1)).toEqual([
				...ERROR_STATE.errors[1].error.additional_errors,
			]);
		});
		it('should select validation errors by key, index and attribute', () => {
			expect(
				selectValidationErrors(
					ERROR_STATE,
					'prices',
					1,
					'recurring_interval_count'
				)
			).toEqual([...ERROR_STATE.errors[1].error.additional_errors]);
		});
	});
});
