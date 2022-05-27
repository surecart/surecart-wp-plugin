/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import Header from './Header';

// hocs
import useEntity from '../../../../hooks/useEntity';

// components
import Tax from '../../../components/price/parts/Tax';
import Subscription from '../../../components/price/Subscription';
import Multiple from '../../../components/price/Multiple';
import OneTime from '../../../components/price/OneTime';

export default ({ id, prices, product }) => {
	// are the price details open?
	const [isOpen, setIsOpen] = useState(true);

	// use the price entity.
	const {
		price,
		editPrice,
		deletePrice,
		savePrice,
		savingPrice,
		deletingPrice,
	} = useEntity('price', id);

	// toggle the archive.
	const toggleArchive = async (archived) => {
		try {
			await savePrice({ archived }, { throwOnError: true });
		} catch (e) {
			console.error(e);
		}
	};

	// get the price type.
	const getPriceType = () => {
		if (price?.recurring_interval) {
			if (price?.recurring_period_count) {
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
				onArchive={() => toggleArchive(!price?.archived)}
				onDelete={() => deletePrice(price)}
				collapsible={prices?.length > 1}
			/>

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
