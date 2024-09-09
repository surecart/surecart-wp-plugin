/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components';
import { useCallback, useState, useEffect } from '@wordpress/element';
import { debounce } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

/**
 * Keyword controls for the product list block.
 */
export default function KeywordControls({ onChange, query }) {
	const [querySearch, setQuerySearch] = useState(query.search);
	const onChangeDebounced = useCallback(
		debounce(() => {
			if (query.search !== querySearch) {
				onChange({ search: querySearch });
			}
		}, 250),
		[querySearch, query.search]
	);

	useEffect(() => {
		onChangeDebounced();
		return onChangeDebounced.cancel;
	}, [querySearch, onChangeDebounced]);

	return (
		<TextControl
			label={__('Keyword', 'surecart')}
			value={querySearch}
			onChange={setQuerySearch}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>
	);
}
