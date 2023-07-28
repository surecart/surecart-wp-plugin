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

export default ({ productCollection, updateProductCollection, loading }) => {
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
		if (productCollection?.slug) {
			tag.classList.remove('hidden');
			link.href = `${scData?.home_url}/${scData?.collection_page_slug}/${productCollection?.slug}`;
		} else {
			tag.classList.add('hidden');
		}
	}, [productCollection]);

	return (
		<Box
			loading={loading}
			title={<div>{__('Publishing', 'surecart')}</div>}
		>
			<Url
				collection={productCollection}
				updateCollection={updateProductCollection}
			/>
		</Box>
	);
};
