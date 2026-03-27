import { getInputType, getCurrencyCode, getAppliesWhileRule } from '../helper';

describe( 'getInputType', () => {
	it( 'returns "uuid" for uuid-type attributes', () => {
		expect( getInputType( 'customer.id' ) ).toBe( 'uuid' );
		expect( getInputType( 'product.id' ) ).toBe( 'uuid' );
		expect( getInputType( 'price.id' ) ).toBe( 'uuid' );
	} );

	it( 'returns "text" for text-type attributes', () => {
		expect( getInputType( 'product.name' ) ).toBe( 'text' );
		expect( getInputType( 'note' ) ).toBe( 'text' );
	} );

	it( 'returns "text" when operator is a STRING_OPERATOR', () => {
		expect( getInputType( 'product.name', 'contains' ) ).toBe( 'text' );
		expect( getInputType( 'product.name', 'start_with' ) ).toBe( 'text' );
		expect( getInputType( 'product.name', 'end_with' ) ).toBe( 'text' );
	} );

	it( 'returns "text" when a uuid attribute has a STRING_OPERATOR', () => {
		expect( getInputType( 'product.id', 'contains' ) ).toBe( 'text' );
		expect( getInputType( 'product.id', 'start_with' ) ).toBe( 'text' );
		expect( getInputType( 'product.id', 'end_with' ) ).toBe( 'text' );
	} );

	it( 'returns "text" for unknown attributes', () => {
		expect( getInputType( 'nonexistent.attribute' ) ).toBe( 'text' );
	} );

	it( 'returns correct types for all registry types', () => {
		expect( getInputType( 'customer.created_at' ) ).toBe( 'date' );
		expect( getInputType( 'subtotal_amount' ) ).toBe( 'price' );
		expect( getInputType( 'email' ) ).toBe( 'email' );
		expect( getInputType( 'quantity' ) ).toBe( 'number' );
		expect( getInputType( 'wp_user_role' ) ).toBe( 'user_role' );
	} );
} );

describe( 'getCurrencyCode', () => {
	afterEach( () => {
		delete window.scData;
	} );

	it( 'returns autoFee currency when present', () => {
		expect( getCurrencyCode( { currency: 'EUR' } ) ).toBe( 'EUR' );
	} );

	it( 'falls back to window.scData.currency_code', () => {
		window.scData = { currency_code: 'GBP' };
		expect( getCurrencyCode( {} ) ).toBe( 'GBP' );
		expect( getCurrencyCode( null ) ).toBe( 'GBP' );
	} );

	it( 'falls back to "USD" when no currency available', () => {
		delete window.scData;
		expect( getCurrencyCode( {} ) ).toBe( 'USD' );
		expect( getCurrencyCode( null ) ).toBe( 'USD' );
		expect( getCurrencyCode( undefined ) ).toBe( 'USD' );
	} );
} );

describe( 'getAppliesWhileRule', () => {
	it( 'returns false for "both"', () => {
		expect( getAppliesWhileRule( 'both', 'line_item' ) ).toBe( false );
		expect( getAppliesWhileRule( 'both', 'checkout' ) ).toBe( false );
	} );

	it( 'returns checkout.order_type rule for "initial" with line_item target', () => {
		const rule = getAppliesWhileRule( 'initial', 'line_item' );
		expect( rule ).toEqual( {
			type: 'condition',
			attribute_name: 'checkout.order_type',
			operator_label: 'is',
			comparison_value: 'checkout',
		} );
	} );

	it( 'returns order_type rule for "initial" with non-line_item target', () => {
		const rule = getAppliesWhileRule( 'initial', 'checkout' );
		expect( rule ).toEqual( {
			type: 'condition',
			attribute_name: 'order_type',
			operator_label: 'is',
			comparison_value: 'checkout',
		} );
	} );

	it( 'returns subscription rule for "renewal"', () => {
		const rule = getAppliesWhileRule( 'renewal', 'line_item' );
		expect( rule ).toEqual( {
			type: 'condition',
			attribute_name: 'checkout.order_type',
			operator_label: 'is',
			comparison_value: 'subscription',
		} );
	} );
} );
