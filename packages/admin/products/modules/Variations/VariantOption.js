/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useRef } from '@wordpress/element';
import { SortableKnob } from 'react-easy-sort';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScFormControl,
	ScIcon,
	ScForm,
	ScInput,
	ScTag,
	ScSelect,
} from '@surecart/components-react';
import VariantOptionValues from './VariantOptionValues';
import { hasDuplicate } from './utils';

export default ({
	index,
	product,
	option,
	updateProduct,
	updateOption,
	onDelete,
	canAddValue,
}) => {
	const input = useRef(null);

	// If pass editing from option, then take that value, by default, it's undefined.
	// otherwise we'll automatically editing if we don't yet have an option name (it's new)
	const open =
		option?.editing !== undefined ? option?.editing : !option?.name;

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				input.current.triggerFocus();
			}, 50);
		}
	}, [open]);

	const handleChange = (data) =>
		updateOption({
			...(data.name ? { name: data.name } : {}),
			...(data.display_type ? { display_type: data.display_type } : {}),
		});

	const onChangeValues = (values) =>
		updateProduct({
			variant_options: product?.variant_options?.map(
				(option, optionIndex) => {
					if (optionIndex === index) {
						return {
							...option,
							values,
						};
					}
					return option;
				}
			),
		});

	return (
		<div
			css={css`
				padding: 28px;
				background: white;
				border-bottom: 1px solid var(--sc-color-gray-200);
			`}
		>
			{open ? (
				<ScForm
					onScFormSubmit={(e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
						updateOption({
							editing: false,
						});
					}}
				>
					<div
						css={css`
							display: grid;
							gap: 24px;
						`}
					>
						<div>
							<ScFormControl
								css={css`
									margin-left: 1.6rem;
									display: inline-block;
								`}
								label={__('Option Name', 'surecart')}
							/>
							<div
								css={css`
									display: flex;
									gap: 1em;
									justify-content: flex-start;
									align-items: center;
								`}
							>
								<SortableKnob>
									<ScIcon
										name="drag"
										style={{
											cursor: 'grab',
										}}
									/>
								</SortableKnob>
								<ScInput
									type="text"
									label={__('Option Name', 'surecart')}
									showLabel={false}
									placeholder={__('Option Name', 'surecart')}
									required
									value={option?.name}
									autofocus
									ref={input}
									css={css`
										width: 50%;
									`}
									onScInput={(e) =>
										handleChange({
											name: e.target.value,
										})
									}
									onScChange={(e) => {
										e.target.setCustomValidity(
											hasDuplicate(
												product?.variant_options,
												'name'
											)
												? sprintf(
														__(
															'You have already used the same option name "%s".',
															'surecart'
														),
														e.target.value
												  )
												: ''
										);
									}}
								/>
								<ScSelect
									slot="suffix"
									unselect={false}
									value={option?.display_type || 'radio'}
									css={css`
										min-width: 125px;
									`}
									onScChange={(e) =>
										handleChange({
											display_type: e.target.value,
										})
									}
									choices={[
										{
											label: __('Radio', 'surecart'),
											value: 'radio',
										},
										{
											label: __('Dropdown', 'surecart'),
											value: 'dropdown',
										},
									]}
									placeholder={__('Option Type', 'surecart')}
								/>
								<ScIcon
									name="trash"
									tabindex="0"
									onClick={onDelete}
									aria-label={sprintf(
										__('Delete %s', 'surecart'),
										option?.name
									)}
									css={css`
										cursor: pointer;
										transition: color
											var(--sc-transition-medium)
											ease-in-out;
										color: var(--sc-color-gray-600);
										&:hover {
											color: var(--sc-color-danger-500);
										}
									`}
								/>
							</div>
						</div>

						<div
							css={css`
								margin-left: 1.6rem;
								display: grid;
								gap: 1em;
							`}
						>
							<div>
								<ScFormControl
									css={css`
										margin-left: 1.6rem;
										display: inline-block;
									`}
									label={__('Option Values', 'surecart')}
									required
								/>
								<VariantOptionValues
									values={option?.values || []}
									onChange={onChangeValues}
									canAddValue={canAddValue}
								/>
							</div>
							<div
								css={css`
									margin-left: 1.6rem;
								`}
							>
								<ScButton submit>
									{__('Done', 'surecart')}
								</ScButton>
							</div>
						</div>
					</div>
				</ScForm>
			) : (
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 1em;
					`}
				>
					<div>
						<div
							css={css`
								display: flex;
								margin-bottom: 1rem;
								align-items: center;
								gap: 1rem;
							`}
						>
							<SortableKnob>
								<ScIcon
									name="drag"
									slot="prefix"
									style={{
										cursor: 'grab',
									}}
								/>
							</SortableKnob>

							<strong>{option?.name}</strong>
						</div>

						<div
							css={css`
								display: flex;
								gap: 0.5em;
								flex-wrap: wrap;
							`}
						>
							{(option?.values || [])
								.filter(
									(optionValue) => optionValue?.length > 0
								)
								.map((value, keyValue) => {
									return (
										<ScTag key={keyValue}>{value}</ScTag>
									);
								})}
						</div>
					</div>

					<div>
						<ScButton
							aria-label={sprintf(
								__('Edit %s', 'surecart'),
								option?.name
							)}
							onClick={() =>
								updateOption({
									editing: true,
								})
							}
						>
							{__('Edit', 'surecart')}
						</ScButton>
					</div>
				</div>
			)}
		</div>
	);
};
