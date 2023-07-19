/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon, ScTag } from '@surecart/components-react';

export default ({ product, updateProduct, loading }) => {
	const variantOptions = product?.variant_options?.data || [];

	const applyDrag = async (oldIndex, newIndex) => {
		const result = arrayMove(variantOptions, oldIndex, newIndex);

		updateProduct({
			...product,
			variant_options: {
				...product.variant_options,
				data: result,
			},
		});
	};

	// sort option?.variant_values?.data by position desc order.
	const getSortedVariantValues = (option) => {
		return (
			option?.variant_values?.data.sort(
				(a, b) => a.position - b.position
			) || []
		);
	};

	return (
		<div style={{ marginBotttom: '2rem' }} loading={loading}>
			<SortableList onSortEnd={applyDrag}>
				{variantOptions.map((option) => (
					<SortableItem key={option.id}>
						<div
							css={css`
								padding-top: var(--sc-spacing-xx-small);
								padding-bottom: var(--sc-spacing-xx-small);
								margin-bottom: var(--sc-spacing-xx-small);
							`}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '1em',
									justifyContent: 'space-between',
									marginBottom: '1em',
									paddingBottom: '1em',
									borderBottom:
										'1px solid var(--sc-color-gray-200)',
								}}
							>
								<div>
									<div
										style={{
											display: 'flex',
											marginBottom: '1rem',
										}}
									>
										<ScIcon
											name="drag"
											slot="prefix"
											style={{
												marginRight: '1rem',
												cursor: 'grab',
											}}
										/>

										<b>{option?.name}</b>
									</div>

									<div>
										{getSortedVariantValues(option).map(
											(optionValue, KeyVariantValue) => {
												return (
													<ScTag
														style={{
															marginRight:
																'0.5em',
															marginLeft:
																KeyVariantValue ===
																0
																	? '2em'
																	: '0',
														}}
														type="primary"
														key={KeyVariantValue}
													>
														{optionValue?.label}
													</ScTag>
												);
											}
										)}
									</div>
								</div>

								<div>
									<ScButton onClick={() => {}}>
										{__('Edit', 'surecart')}
									</ScButton>
								</div>
							</div>
						</div>
					</SortableItem>
				))}
			</SortableList>
		</div>
	);
};
