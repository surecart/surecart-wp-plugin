/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon, ScTag } from '@surecart/components-react';

export default ({ product, updateProduct, loading, options, setOptions }) => {
	const { editEntityRecord } = useDispatch(coreStore);

	const applyDrag = async (oldIndex, newIndex) => {
		const result = arrayMove(options, oldIndex, newIndex);
		// edit entity record to update indexes.
		(result || []).forEach((optionValue, index) =>
			editEntityRecord('surecart', 'variant_options', optionValue, {
				position: index,
			})
		);
	};

	return (
		<div style={{ marginBotttom: '2rem' }}>
			<SortableList onSortEnd={applyDrag}>
				{options.map((option, index) => {
					return (
						<SortableItem key={index}>
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
											{(option?.values || []).map(
												(optionValue, index2) => {
													return (
														<ScTag
															style={{
																marginRight:
																	'0.5em',
															}}
															type="primary"
															key={index2}
														>
															{optionValue?.name}
														</ScTag>
													);
												}
											)}
										</div>
									</div>

									<div>
										<ScButton
											css={css``}
											onClick={() => {}}
										>
											{__('Edit', 'surecart')}
										</ScButton>
									</div>
								</div>
							</div>
						</SortableItem>
					);
				})}
			</SortableList>
		</div>
	);
};
