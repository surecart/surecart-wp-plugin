/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner, Placeholder } from '@wordpress/components';

import Empty from './components/Empty';
import Edit from './components/Edit';
import StyleProvider from '../../components/StyleProvider';

export default ({ attributes, setAttributes }) => {
	// TODO: Let's store a unique hash in both meta and attribute to find.
	const { id, loading } = attributes;

	if (loading) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

	if (!id) {
		return (
			<StyleProvider>
				<Empty attributes={attributes} setAttributes={setAttributes} />
			</StyleProvider>
		);
	}

	return (
		<StyleProvider>
			<Edit attributes={attributes} setAttributes={setAttributes} />
		</StyleProvider>
	);
};
