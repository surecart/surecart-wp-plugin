/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Spinner, Placeholder } from '@wordpress/components';

import Empty from './components/Empty';
import Edit from './components/Edit';

export default ( { attributes, setAttributes } ) => {
	// TODO: Let's store a unique hash in both meta and attribute to find.
	const { id, loading } = attributes;
	const blockProps = useBlockProps();

	if ( loading ) {
		return (
			<div { ...blockProps }>
				<Placeholder>
					<Spinner />
				</Placeholder>
			</div>
		);
	}

	if ( ! id ) {
		return (
			<Empty attributes={ attributes } setAttributes={ setAttributes } />
		);
	}

	return <Edit attributes={ attributes } setAttributes={ setAttributes } />;
};
