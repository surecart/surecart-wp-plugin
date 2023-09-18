/** @jsx jsx */
import { jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Url from '../components/Url';
import SelectTemplate from '../components/SelectTemplate';
import SelectTemplatePart from '../components/SelectTemplatePart';
import Products from '../components/Products';

export default ({ collection, updateCollection, loading }) => {
	const tag = document.querySelector(
		'#wp-admin-bar-view-product-collection-page'
	);
	const link = document.querySelector(
		'#wp-admin-bar-view-product-collection-page a'
	);

	// keep the admin bar page link in sync with url.
	useEffect(() => {
		if (!link || !tag) {
			return;
		}
		if (collection?.slug) {
			tag.classList.remove('hidden');
			link.href = collection.permalink;
		} else {
			tag.classList.add('hidden');
		}
	}, [collection]);

	return (
		<Box
			loading={loading}
			title={<div>{__('Publishing', 'surecart')}</div>}
		>
			<Url collection={collection} updateCollection={updateCollection} />

			{scData?.is_block_theme ? (
				<SelectTemplate
					collection={collection}
					updateCollection={updateCollection}
				/>
			) : (
				<SelectTemplatePart
					collection={collection}
					updateCollection={updateCollection}
				/>
			)}

			<Products collection={collection} />
		</Box>
	);
};
