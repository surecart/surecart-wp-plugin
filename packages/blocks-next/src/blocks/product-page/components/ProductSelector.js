/**
 * External dependencies.
 */
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function ProductSelector({
	isVisible,
	post,
	onChoose,
	...popoverProps
}) {
	if (!isVisible) {
		return null;
	}

	const suggestionQuery = {
		type: 'post',
		subtype: 'sc_product',
		perPage: 20,
	};

	return (
		<Popover {...popoverProps}>
			<LinkControl
				value={post?.link}
				onChange={onChoose}
				showInitialSuggestions
				hasTextControl
				searchInputPlaceholder={__('Search for a product', 'surecart')}
				suggestionsQuery={{
					...suggestionQuery,
					initialSuggestionsSearchOptions: suggestionQuery,
				}}
			/>
		</Popover>
	);
}
