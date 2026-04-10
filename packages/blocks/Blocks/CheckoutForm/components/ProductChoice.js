/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { Icon, external, moreHorizontal, close } from '@wordpress/icons';

import apiFetch from '@wordpress/api-fetch';
import dotProp from 'dot-prop-immutable';

import {
	ScButton,
	ScFormatNumber,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';

import { __experimentalNumberControl as NumberControl } from '@wordpress/components';

export default ({ attributes, setAttributes, choice }) => {
	// styles
	const border = '--sc-color-gray-200';
	const bg = '--sc-color-white';
	const bgHover = '--sc-color-gray-50';
	const color = '--sc-color-gray-900';
	const muted = '--sc-color-gray-500';

	const { prices } = attributes;
	const [isLoading, setIsLoading] = useState(false);
	const [pricesData, setPricesData] = useState([]);

	useEffect(() => {
		if (choice?.id) {
			fetchProduct(choice?.id);
		}
	}, [choice]);

	const fetchProduct = async (id) => {
		setIsLoading(true);
		try {
			const prices = await apiFetch({
				path: addQueryArgs('/surecart/v1/prices', {
					ids: [id],
				}),
			});
			const choices = prices.map((price) => {
				return {
					id: price.id,
					product_id: price.product_id,
					quantity: 1,
				};
			});
			setAttributes({
				prices: [...prices, ...choices],
			});
			setPricesData([...pricesData, ...prices]);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	};

	const removeChoice = () => {
		const r = confirm(
			__(
				'Are you sure you want to remove this product from the form?',
				'surecart'
			)
		);
		if (r) {
			setAttributes({
				prices: prices.filter((p) => p.product_id !== id),
			});
		}
	};

	if (isLoading) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1em',
					marginBottom: '1em',
				}}
			>
				<div>
					<sc-skeleton
						style={{
							width: '120px',
							display: 'inline-block',
						}}
					></sc-skeleton>
				</div>
				<div>
					<sc-skeleton
						style={{
							width: '300px',
							display: 'inline-block',
						}}
					></sc-skeleton>
				</div>
			</div>
		);
	}

	const navigateToEditProduct = () => {
		window.location.href = addQueryArgs('admin.php', {
			page: 'sc-products',
			action: 'edit',
			id,
		});
	};

	const buttons = (
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-end',
				flex: '0 1 50px',
			}}
		>
			<ScDropdown slot="suffix" position="bottom-right">
				<ScButton type="text" slot="trigger" circle>
					<Icon icon={moreHorizontal} size={24} />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={navigateToEditProduct}>
						<Icon
							slot="prefix"
							style={{
								opacity: 0.5,
								marginRight: '8px',
							}}
							icon={external}
							size={16}
						/>
						{__('Edit', 'surecart')}
					</ScMenuItem>
					<ScMenuItem onClick={removeChoice}>
						<Icon
							slot="prefix"
							style={{
								opacity: 0.5,
								marginRight: '8px',
							}}
							icon={close}
							size={16}
						/>
						{__('Remove', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</div>
	);

	return (
		<div className="sc-product-choice-editor">
			<style>{`
				.sc-product-choice-editor .product-choice__icon {
					opacity: 0;
					visibility: hidden;
					transition: opacity 0.35s ease;
				}
				.sc-product-choice-editor:hover .product-choice__icon {
					opacity: 1;
					visibility: visible;
				}
				.sc-product-choice-editor .sc-product-choice-item:hover {
					background: var(${bgHover});
				}
			`}</style>
			<div
				style={{
					margin: '1em auto',
				}}
			>
				{(prices || []).map((choice, index) => {
					const price = pricesData.find((p) => p.id === choice.id);
					if (!price?.id) return;
					return (
						<div
							key={price?.id}
							className="sc-product-choice-item"
							style={{
								background: `var(${bg})`,
								color: `var(${color})`,
								boxShadow: `inset 0 0 0 1px var(${border})`,
								display: 'grid',
								marginTop: '-1px',
								padding: '1.2em',
								gridTemplateColumns:
									'repeat(3, minmax(0, 1fr))',
								justifyContent: 'space-between',
								alignContent: 'center',
								gap: '1em',
								transition: 'background-color 0.35s ease',
							}}
						>
							<div
								style={{
									display: 'flex',
									gap: '1em',
									color: `var(${color})`,
									alignItems: 'center',
								}}
							>
								<div>
									{
										pricesData.find(
											(data) => data.id === price.id
										)?.name
									}
								</div>
								<NumberControl
									__next40pxDefaultSize
									label={__('Qty:', 'surecart')}
									labelPosition="side"
									onChange={(number) => {
										setAttributes({
											prices: dotProp.set(
												prices,
												`${index}.quanity`,
												parseInt(number)
											),
										});
									}}
									shiftStep={10}
									value={choice?.quantity}
								/>
							</div>
							<span
								style={{
									textAlign: 'center',
								}}
							>
								<ScFormatNumber
									type="currency"
									currency={price.currency}
									value={price.amount}
								/>{' '}
								<span
									style={{
										color: `var(${muted})`,
									}}
								>
									{price.recurring_interval
										? `/ ${price.recurring_interval}`
										: __('once', 'surecart')}
								</span>
							</span>
							{buttons}
						</div>
					);
				})}
			</div>
		</div>
	);
};
