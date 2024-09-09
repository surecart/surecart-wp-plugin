/**
 * WordPress dependencies
 */
import { FormTokenField } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

/**
 * Base query for the products to include in the list.
 */
const BASE_QUERY = {
	order: 'asc',
	_fields: 'id,title',
	context: 'view',
};

/**
 * Helper function to get the post id based on user input in posts `FormTokenField`.
 */
const getPostIdByPostValue = (posts, postValue) => {
	/**
	 * First we check for exact match by `post.id` or case sensitive `post.title` match.
	 */
	const postId =
		postValue?.id ||
		posts?.find((post) => post?.title?.rendered === postValue)?.id;
	if (postId) {
		return postId;
	}

	/**
	 * Here we make an extra check for entered posts in a non case sensitive way,
	 * to match user expectations, due to `FormTokenField` behaviour that shows
	 * suggestions which are case insensitive.
	 *
	 * Although WP tries to discourage users to add posts with the same name (case insensitive),
	 * it's still possible if you manually change the name, as long as the posts have different slugs.
	 * In this edge case we always apply the first match from the posts list.
	 */
	const postValueLower = postValue.toLocaleLowerCase();
	return posts?.find(
		(post) => post?.title?.rendered.toLocaleLowerCase() === postValueLower
	)?.id;
};

/**
 * Renders a `FormTokenField` for a the products to include in the list.
 */
export default function IncludeControls({ query: { include }, onChange }) {
	const [search, setSearch] = useState('');
	const [value, setValue] = useState([]);
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
					exclude: include,
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
		[search, include]
	);

	/**
	 * Fetch suggestions when the input is focused.
	 */
	const fetchSuggestions = () => {
		debouncedSearch(search);
	};

	/**
	 * `existingProducts` are the ones fetched from the API and their type is `{ id: number; name: string }`.
	 * They are used to extract the products' names to populate the `FormTokenField` properly
	 * and to sanitize the provided `include`, by setting only the ones that exist.
	 */
	const existingProducts = useSelect(
		(select) => {
			if (!include?.length) {
				return [];
			}
			const { getEntityRecords } = select(coreStore);
			return getEntityRecords('postType', 'sc_product', {
				...BASE_QUERY,
				include: include,
				per_page: include.length,
			});
		},
		[include]
	);

	/**
	 * Update the `value` state only after the selectors are resolved
	 * to avoid emptying the input when we're changing posts.
	 */
	useEffect(() => {
		/**
		 * If there are no include products, we don't need to sanitize the value.
		 */
		if (!include?.length) {
			setValue([]);
		}

		/**
		 * If there are no existing products, we don't need to sanitize the value.
		 */
		if (!existingProducts?.length) {
			return;
		}

		/**
		 * Returns only the existing entity ids. This prevents the component
		 * from crashing in the editor, when non existing ids are provided.
		 */
		const sanitizedValue = include.reduce((accumulator, id) => {
			const entity = existingProducts.find((post) => post.id === id);
			if (entity) {
				accumulator.push({
					id,
					value: entity?.title?.rendered,
				});
			}
			return accumulator;
		}, []);

		setValue(sanitizedValue);
	}, [include, existingProducts]);

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
		setSuggestions(searchResults.map((result) => result?.title?.rendered));
	}, [searchResults, searchHasResolved]);

	/**
	 * Update the `include` state with the new product ids.
	 */
	const onPostsChange = (newPostValues) => {
		const newProductIds = new Set();
		for (const postValue of newPostValues) {
			const postId = getPostIdByPostValue(searchResults, postValue);
			if (postId) {
				newProductIds.add(postId);
			}
		}
		setSuggestions([]);
		onChange({ include: Array.from(newProductIds) });
	};

	return (
		<FormTokenField
			label={__('Products', 'surecart')}
			value={value}
			onFocus={fetchSuggestions}
			onInputChange={debouncedSearch}
			suggestions={suggestions}
			placeholder={__('Search for a product', 'surecart')}
			displayTransform={decodeEntities}
			onChange={onPostsChange}
			__experimentalShowHowTo={false}
			__nextHasNoMarginBottom
			__experimentalExpandOnFocus={true}
			__next40pxDefaultSize
		/>
	);
}
