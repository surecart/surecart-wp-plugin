/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { Button } from '@wordpress/components';
import { Icon } from '@wordpress/components';
import { arrowRight } from '@wordpress/icons';

/**
 * Base query for the products to include in the list.
 */
const BASE_QUERY = {
	order: 'asc',
	_fields: 'id,title',
	context: 'view',
};

/**
 * Renders a `FormTokenField` for a the products to include in the list.
 */
export default function SelectProduct({
	attributes,
	setAttributes,
	onChoose,
	showSelectButtons = true,
}) {
	const [search, setSearch] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const debouncedSearch = useDebounce(setSearch, 250);
	const { searchResults, searchHasResolved } = useSelect(
		(select) => {
			const { getEntityRecords, hasFinishedResolution } =
				select(coreStore);
			const selectorArgs = [
				'postType',
				'sc_product',
				{
					...BASE_QUERY,
					search,
					orderby: 'title',
					per_page: 20,
				},
			];
			return {
				searchResults: getEntityRecords(...selectorArgs),
				searchHasResolved: hasFinishedResolution(
					'getEntityRecords',
					selectorArgs
				),
			};
		},
		[search]
	);

	/**
	 * Fetch suggestions when the input is focused.
	 */
	const fetchSuggestions = () => {
		debouncedSearch(search);
	};

	/**
	 * Update suggestions only when the query has resolved.
	 */
	useEffect(() => {
		if (!searchHasResolved) {
			return;
		}

		/**
		 * Update suggestions only when the query has resolved.
		 */
		setSuggestions(
			searchResults.map((result) => ({
				label: result?.title?.rendered,
				value: result?.id,
				id: result?.id,
			}))
		);
	}, [searchResults, searchHasResolved]);

	/**
	 * Update the
	 */
	// const onPostsChange = (postValue) => {
	// 	const postId = getPostIdByPostValue(searchResults, postValue);
	// 	console.log('postId', postId);
	// 	if (postId) {
	// 		setValue((prevValue) => [
	// 			...prevValue,
	// 			{
	// 				id: postId,
	// 				value: postValue,
	// 			},
	// 		]);
	// 		onChange({
	// 			id: postId,
	// 			value: postValue,
	// 		});
	// 		setSuggestions([]);
	// 	}
	// };

	const post = useSelect(
		(select) => {
			const { getEntityRecord } = select(coreStore);
			const postId = attributes?.product_post_id;
			if (!postId) {
				return null;
			}
			return getEntityRecord('postType', 'sc_product', postId);
		},
		[attributes?.product_post_id]
	);

	return (
		<>
			<SelectControl
				label={__('Choose Product', 'surecart')}
				value={attributes?.product_post_id}
				onFocus={fetchSuggestions}
				onInputChange={debouncedSearch}
				suggestions={suggestions}
				placeholder={__('Search for a product', 'surecart')}
				displayTransform={decodeEntities}
				onChange={(postId) => {
					setAttributes({
						product_post_id: parseInt(postId),
					});
					// setSuggestions([]);
				}}
				__experimentalShowHowTo={false}
				__nextHasNoMarginBottom
				__experimentalExpandOnFocus={true}
				__next40pxDefaultSize
				options={suggestions}
			/>

			{showSelectButtons && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: '0.5em',
					}}
				>
					<Button
						variant="primary"
						// isBusy={busy}
						onClick={() => {
							if (!post?.id) {
								return;
							}

							// Go to next step.
							if (onChoose) {
								onChoose(post);
							}
						}}
						style={{
							marginTop: '1em',
						}}
						disabled={!post?.id}
					>
						{__('Select Product', 'surecart')}

						{!!post?.id && (
							<Icon
								icon={arrowRight}
								style={{ marginLeft: '0.5em' }}
							/>
						)}
					</Button>
				</div>
			)}
		</>
	);
}
