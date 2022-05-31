/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../../../components/Error';
// hocs
import useEntity from '../../../../hooks/useEntity';
import Multiple from '../../../components/price/Multiple';
import OneTime from '../../../components/price/OneTime';
// components
import Tax from '../../../components/price/parts/Tax';
import Subscription from '../../../components/price/Subscription';
import Header from './Header';

export default ({ id, prices, product }) => {
	// are the price details open?
	const [isOpen, setIsOpen] = useState(true);
	const [error, setError] = useState(null);

	// use the price entity.
	const {
		price,
		editPrice,
		deletePrice,
		savePrice,
		savingPrice,
		deletingPrice,
		savePriceError,
	} = useEntity('price', id);

	// toggle the archive.
	const toggleArchive = async () => {
		const r = confirm(
			price?.archived
				? __(
						'Un-Archive this price? This will make the product purchaseable again.',
						'surecart'
				  )
				: __(
						'Archive this price? This product will not be purchaseable and all unsaved changes will be lost.',
						'surecart'
				  )
		);
		if (!r) return;

		try {
			await savePrice(
				{ archived: !price?.archived },
				{ throwOnError: true }
			);
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Toggle product delete.
	 */
	const onDelete = async () => {
		const r = confirm(
			__(
				'Permanently delete this price? You cannot undo this action.',
				'surecart'
			)
		);
		if (!r) return;

		try {
			setError(null);
			await deletePrice({ throwOnError: true });
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	// get the price type.
	const getPriceType = () => {
		if (price?.recurring_interval) {
			if (price?.recurring_period_count !== null) {
				return 'multiple';
			}
			return 'subscription';
		}
		return 'once';
	};

	return (
		<div
			css={css`
				padding: var(--sc-spacing-large);
				border: 1px solid var(--sc-color-gray-300);
				border-radius: var(--sc-border-radius-medium);
				box-shadow: var(--sc-shadow-small);
				display: grid;
				gap: 1em;
			`}
		>
			<Header
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				price={price}
				onArchive={toggleArchive}
				onDelete={onDelete}
				collapsible={prices?.length > 1}
			/>

			<Error error={savePriceError || error} setError={setError} />

			<div
				css={css`
					gap: var(--sc-form-row-spacing);
					display: ${isOpen ? 'grid' : 'none'};
				`}
			>
				{getPriceType() === 'subscription' && (
					<Subscription price={price} updatePrice={editPrice} />
				)}

				{getPriceType() === 'multiple' && (
					<Multiple price={price} updatePrice={editPrice} />
				)}

				{getPriceType() === 'once' && (
					<OneTime price={price} updatePrice={editPrice} />
				)}

				<Tax
					style={{
						marginTop: '0.5em',
						display: 'inline-block',
					}}
					price={price}
					product={product}
					updatePrice={editPrice}
				/>
			</div>

			{(savingPrice || deletingPrice) && (
				<sc-block-ui spinner></sc-block-ui>
			)}
		</div>
	);
};
