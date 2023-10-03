/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useRef, useState } from '@wordpress/element';
import { SortableKnob } from 'react-easy-sort';
import { __ } from '@wordpress/i18n';

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
} from '@surecart/components-react';
import VariantOptionValues from './VariantOptionValues';
import { hasDuplicate } from './utils';

export default ({
	open,
	setOpen,
	index,
	product,
	option,
	updateProduct,
	updateOption,
	onDelete,
	canAddValue,
}) => {
	// we are automatically editing if we don't yet have an option nane (it's new)
	const input = useRef(null);

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				input.current.triggerFocus();
			}, 50);
		}
	}, [open]);

	useEffect(() => {
		setOpen(!option?.name);
	}, []);

	const handleChange = (name) =>
		updateOption({
			name,
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
				padding: 24px;
				background: white;
				border-bottom: 1px solid var(--sc-color-gray-200);
			`}
		>
			{open ? (
				<ScForm
					onScFormSubmit={(e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
						setOpen(false);
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
									placeholder={__('Option Name', 'surecart')}
									required
									value={option?.name}
									autofocus
									ref={input}
									css={css`
										width: 50%;
									`}
									onScInput={(e) =>
										handleChange(e.target.value)
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
								<ScIcon
									name="trash"
									onClick={onDelete}
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
						<ScButton onClick={() => setOpen(true)}>
							{__('Edit', 'surecart')}
						</ScButton>
					</div>
				</div>
			)}
		</div>
	);
};
