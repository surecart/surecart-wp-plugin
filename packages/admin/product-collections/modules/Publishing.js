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
import { ScAlert } from '@surecart/components-react';

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

	// possibly convert "0" to false
	const wp_template_id =
		collection?.metadata?.wp_template_id &&
		collection?.metadata?.wp_template_id !== '0'
			? collection?.metadata?.wp_template_id
			: false;

	return (
		<>
			<Box
				loading={loading}
				title={<div>{__('Publishing', 'surecart')}</div>}
			>
				<Url
					collection={collection}
					updateCollection={updateCollection}
				/>
				<Products collection={collection} />

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
			</Box>
			{!scData?.is_block_theme && !wp_template_id && (
				<ScAlert open type="info">
					<span slot="title">
						{__('Not displaying right?', 'surecart')}
					</span>
					{__(
						'Some themes may need custom support for displaying SureCart collections. Try selecting the "SureCart Layout" template.',
						'surecart'
					)}
				</ScAlert>
			)}
		</>
	);
};
