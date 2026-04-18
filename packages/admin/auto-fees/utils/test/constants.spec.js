import {
	ATTRIBUTE_REGISTRY,
	ATTRIBUTE_TYPE_MAP,
	attributeLabels,
	UUID_ENTITY_MAP,
} from '../constants';

describe( 'ATTRIBUTE_REGISTRY & derived maps', () => {
	describe( 'ATTRIBUTE_TYPE_MAP', () => {
		it( 'maps all uuid attributes to type "uuid"', () => {
			const uuidKeys = Object.keys( ATTRIBUTE_REGISTRY.uuid );
			for ( const key of uuidKeys ) {
				expect( ATTRIBUTE_TYPE_MAP[ key ] ).toBe( 'uuid' );
			}
		} );
	} );

	describe( 'UUID_ENTITY_MAP', () => {
		it( 'keys cover all ATTRIBUTE_REGISTRY.uuid keys', () => {
			const registryUuidKeys = Object.keys( ATTRIBUTE_REGISTRY.uuid );
			const entityMapKeys = Object.keys( UUID_ENTITY_MAP );

			for ( const key of registryUuidKeys ) {
				expect( entityMapKeys ).toContain( key );
			}
		} );

		it( 'has no orphan keys missing from ATTRIBUTE_REGISTRY.uuid', () => {
			const registryUuidKeys = Object.keys( ATTRIBUTE_REGISTRY.uuid );
			const entityMapKeys = Object.keys( UUID_ENTITY_MAP );

			for ( const key of entityMapKeys ) {
				expect( registryUuidKeys ).toContain( key );
			}
		} );

		it( 'values are valid non-empty entity name strings', () => {
			for ( const [ key, value ] of Object.entries( UUID_ENTITY_MAP ) ) {
				expect( typeof value ).toBe( 'string' );
				expect( value.length ).toBeGreaterThan( 0 );
			}
		} );
	} );

	describe( 'attributeLabels', () => {
		it( 'has an entry for every attribute across all registry types', () => {
			for ( const [ type, attrs ] of Object.entries(
				ATTRIBUTE_REGISTRY
			) ) {
				for ( const key of Object.keys( attrs ) ) {
					expect( key in attributeLabels ).toBe( true );
					expect( attributeLabels[ key ] ).toBeTruthy();
				}
			}
		} );
	} );

	describe( 'no key collisions across ATTRIBUTE_REGISTRY types', () => {
		it( 'no attribute key appears in more than one type', () => {
			const seen = {};
			for ( const [ type, attrs ] of Object.entries(
				ATTRIBUTE_REGISTRY
			) ) {
				for ( const key of Object.keys( attrs ) ) {
					expect( seen[ key ] ).toBeUndefined();
					seen[ key ] = type;
				}
			}
		} );
	} );

	describe( 'renamed labels', () => {
		it( 'product.product_group.metadata label contains "Upgrade Group"', () => {
			expect(
				attributeLabels[ 'product.product_group.metadata' ]
			).toContain( 'Upgrade Group' );
			expect(
				attributeLabels[ 'product.product_group.metadata' ]
			).not.toContain( 'Product Group' );
		} );
	} );
} );
