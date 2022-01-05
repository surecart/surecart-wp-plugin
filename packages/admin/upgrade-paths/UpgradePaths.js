import PriceSelector from '../../../../packages/blocks/blocks/checkout/components/PriceSelector';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import Path from './components/Path';

export default () => {
	const [ value, setValue ] = useState( '' );
	const { paths, loading } = useSelect( ( select ) => {
		const queryArgs = [ 'root', 'upgrade_path', {} ];
		const paths = select( coreStore ).getEntityRecords( ...queryArgs );
		const loading = select( coreStore ).isResolving(
			'getEntityRecord',
			queryArgs
		);
		return {
			paths,
			loading,
		};
	} );

	const { receiveEntityRecords } = useDispatch( coreStore );

	return (
		<div>
			{ JSON.stringify( { paths } ) }

			<PriceSelector
				value={ value }
				open={ false }
				ad_hoc={ false }
				createNew={ true }
				onSelect={ ( id ) => {
					receiveEntityRecords( 'root', 'upgrade_path', {
						id,
						paths: [],
					} );
					setValue( '' );
				} }
			/>
		</div>
	);
};
