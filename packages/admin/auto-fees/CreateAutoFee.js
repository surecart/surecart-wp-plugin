/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect, useRef } from 'react';

import {
	ScButton,
	ScForm,
	ScChoice,
	ScChoices,
	ScInput,
	ScIcon,
	ScRadioGroup,
	ScRadio,
} from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';
import { TEMPLATES, TEMPLATE_CHOICES } from './templates';
import { TYPE_CHOICES, APPLIES_WHILE_CHOICES } from './utils/constants';
import { getAppliesWhileRule } from './utils/helper';
import Error from '../components/Error';

// Responsive row layout: label left, controls right (stacks on mobile)
const settingRowStyles = css`
	display: flex;
	flex-direction: column;
	gap: 1em;

	@media (min-width: 768px) {
		flex-direction: row;
		align-items: flex-start;
		gap: 2em;
	}
`;

const settingLabelStyles = css`
	display: flex;
	flex-direction: column;

	@media (min-width: 768px) {
		flex: 0 0 40%;
	}
`;

const settingControlStyles = css`
	display: flex;
	gap: 8px;

	@media (min-width: 768px) {
		flex: 0 0 60%;
		justify-content: flex-start;
	}
`;

const helpTextStyles = css`
	color: #6b7280;
	font-size: 12px;
`;

const iconStyles = css`
	font-weight: 600;
	width: 20px;
	height: 20px;
`;

const choiceLabelStyles = css`
	font-weight: 600;
	line-height: 1;
`;

export default ({ id, onCreateAutoFee }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [autoFeeDisplayName, setAutoFeeDisplayName] = useState('');
	const [autoFeeName, setAutoFeeName] = useState('');
	const [autoFeeTarget, setAutoFeeTarget] = useState('');
	const [currentTemplate, setCurrentTemplate] = useState('');
	const [appliesWhile, setAppliesWhile] = useState('');
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);
	const nameInputRef = useRef(null);

	// focus the name input.
	useEffect(() => {
		if (nameInputRef.current) {
			setTimeout(() => {
				nameInputRef.current.triggerFocus();
			}, 250);
		}
	}, []);

	// set the auto-fee target.
	useEffect(() => {
		const feeTarget =
			TEMPLATE_CHOICES?.find((t) => t.value === currentTemplate)
				?.fee_target || '';
		setAutoFeeTarget(feeTarget);

		const appliesWhile =
			TEMPLATE_CHOICES?.find((t) => t.value === currentTemplate)
				?.applies_while || '';
		setAppliesWhile(appliesWhile);
	}, [currentTemplate]);

	// set the auto-fee name from template label when template changes (except start_blank).
	useEffect(() => {
		const templateLabel =
			TEMPLATE_CHOICES?.find((t) => t.value === currentTemplate)?.label ||
			'';

		// Check if current name matches any template label
		const currentNameMatchesTemplate = TEMPLATE_CHOICES?.some(
			(t) => t.label === autoFeeDisplayName
		);

		// Only update if name is empty or matches an existing template label
		if (
			templateLabel &&
			(!autoFeeDisplayName || currentNameMatchesTemplate)
		) {
			const label =
				currentTemplate === 'start_blank' ? '' : templateLabel;
			setAutoFeeDisplayName(label);
		}
	}, [currentTemplate]);

	// create the auto-fee.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);

			const appliesRule = getAppliesWhileRule(
				appliesWhile,
				autoFeeTarget
			);
			const templateRule =
				TEMPLATES?.[currentTemplate]?.rules?.conditions?.[0]
					?.conditions?.[0];

			// Build conditions array - only include rules if there are actual conditions.
			const innerConditions = [
				appliesRule && { ...appliesRule },
				templateRule && { ...templateRule },
			].filter(Boolean);

			const createdAutoFee = await saveEntityRecord(
				'surecart',
				'auto-fee',
				{
					...TEMPLATES?.[currentTemplate],
					...(appliesWhile &&
						autoFeeTarget &&
						innerConditions.length > 0 && {
							rules: {
								type: 'group',
								combinator: 'or',
								conditions: [
									{
										type: 'group',
										combinator: 'and',
										conditions: innerConditions,
									},
								],
							},
						}),
					...(autoFeeTarget && { fee_target: autoFeeTarget }),
					name: autoFeeDisplayName,
					start_at: Math.floor(Date.now() / 1000),
					metadata: {
						internal_name: autoFeeName,
					},
				},
				{ throwOnError: true }
			);
			if (!createdAutoFee?.id) {
				throw {
					message: __(
						'Could not create dynamic price. Please try again.',
						'surecart'
					),
				};
			}

			onCreateAutoFee(createdAutoFee.id);
		} catch (e) {
			console.error(e);
			setError(e);
			setIsSaving(false);
		}
	};

	const isTargetEditable = currentTemplate === 'start_blank';

	return (
		<CreateTemplate id={id}>
			<Error error={error} />
			<ScForm onScSubmit={onSubmit}>
				<Box
					title={__('Create new dynamic price', 'surecart')}
					footer={
						<div
							css={css`
								display: flex;
								width: 100%;
								justify-content: space-between;
							`}
						>
							<ScButton
								href={'admin.php?page=sc-auto-fees'}
								type="default"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
							<ScButton
								type="primary"
								submit
								loading={isSaving}
								disabled={!autoFeeDisplayName || !autoFeeTarget || !autoFeeName || !appliesWhile || !currentTemplate}
							>
								{__('Continue', 'surecart')}
								<ScIcon slot="suffix" name="arrow-right" />
							</ScButton>
						</div>
					}
				>
					<ScInput
						label={__('Name', 'surecart')}
						help={__(
							'This is the internal name for your dynamic price. This is not visible to the customer.',
							'surecart'
						)}
						value={autoFeeName}
						onScInput={(e) => setAutoFeeName(e.target.value)}
						required
						tabIndex="0"
						ref={nameInputRef}
						autofocus
					/>
					<ScInput
						label={__('Display Name', 'surecart')}
						help={__(
							'A friendly name for your dynamic price. This will be displayed to the customer. This should be unique.',
							'surecart'
						)}
						value={autoFeeDisplayName}
						onScInput={(e) => setAutoFeeDisplayName(e.target.value)}
						required
						tabIndex="0"
					/>
					<div
						css={css`
							max-height: 480px;
							padding: 0 10px;
							margin: 0 -10px;
							overflow: auto;
							display: flex;
							flex-direction: column;
							gap: 16px;
							position: relative;
						`}
					>
						<ScChoices
							label={__('Recipe', 'surecart')}
							onScChange={(e) =>
								setCurrentTemplate(e.target.value)
							}
							style={{
								'--sc-choice-padding': '1.3em',
								'--columns': 2,
								padding: '0 1px',
							}}
							required
						>
							{(TEMPLATE_CHOICES || []).map(
								({ value, label, description, icon }) => {
									return (
										<ScChoice
											key={value}
											showControl={false}
											checked={currentTemplate === value}
											value={value}
										>
											<div
												style={{
													display: 'flex',
													gap: '1em',
												}}
												slot="footer"
											>
												<ScIcon
													style={{
														fontWeight: '600',
														width: '20px',
														height: '20px',
													}}
													name={icon}
												/>
												<div>
													<div
														style={{
															fontWeight: 600,
															lineHeight: 1,
														}}
													>
														{label}
													</div>
													{!!description && (
														<div
															style={{
																marginTop:
																	'0.5em',
																fontWeight: 400,
																color: '#6B7280',
															}}
														>
															{description}
														</div>
													)}
												</div>
											</div>
										</ScChoice>
									);
								}
							)}
						</ScChoices>
						<div
							css={css`
								&::before {
									content: '';
									position: absolute;
									top: -20px;
									left: 0;
									right: 0;
									height: 20px;
									background: linear-gradient(
										to top,
										rgba(255, 255, 255, 0.95),
										rgba(255, 255, 255, 0)
									);
									pointer-events: none;
								}
							`}
							style={{
								position: 'sticky',
								bottom: 0,
							}}
						></div>
					</div>

					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: 2em;
						`}
					>
						<div css={settingRowStyles}>
							<div css={settingLabelStyles}>
								<label htmlFor="choices-2">
									{__('Applies to', 'surecart')}
									<span
										aria-hidden="true"
										className="required"
									>
										{' '}
										*
									</span>
								</label>
								<span css={helpTextStyles}>
									{__(
										'Choose where the dynamic price applies to',
										'surecart'
									)}
								</span>
							</div>
							<div css={settingControlStyles}>
								<ScChoices
									onScChange={(e) =>
										setAutoFeeTarget(e.target.value)
									}
									autoWidth
									required
									style={{ flex: 1 }}
								>
									<div>
										{(TYPE_CHOICES || []).map((type) => {
											const disabled =
												!isTargetEditable &&
												type.value !== autoFeeTarget;

											const showLock =
												!isTargetEditable &&
												type.value === autoFeeTarget;
											return (
												<ScChoice
													key={type.value}
													showControl={false}
													checked={
														autoFeeTarget ===
														type.value
													}
													value={type.value}
													style={{
														'--sc-choice-padding':
															'10px',
														'--sc-choice-border-radius':
															'8px',
														pointerEvents: disabled
															? 'none'
															: 'auto',
													}}
													disabled={disabled}
												>
													<div
														css={css`
															display: flex;
															gap: 1em;
															align-items: center;
														`}
														slot="footer"
													>
														<ScIcon
															css={iconStyles}
															name={
																showLock
																	? 'lock'
																	: type.icon
															}
														/>
														<div
															css={
																choiceLabelStyles
															}
														>
															{type.label}
														</div>
													</div>
												</ScChoice>
											);
										})}
									</div>
								</ScChoices>
							</div>
						</div>

						<div css={settingRowStyles}>
							<div css={settingLabelStyles}>
								<label htmlFor="choices-2">
									{__('When to apply', 'surecart')}
									<span
										aria-hidden="true"
										className="required"
									>
										{' '}
										*
									</span>
								</label>
								<span css={helpTextStyles}>
									{__(
										'Choose when the dynamic price should be applied',
										'surecart'
									)}
								</span>
							</div>
							<div css={settingControlStyles}>
								<ScRadioGroup
									css={css`
										flex: 1;
										width: 100%;
										font-size: 14px;
									`}
								>
									<div
										css={css`
											display: flex;
											flex-direction: column;
											gap: 1em;
										`}
									>
										{(APPLIES_WHILE_CHOICES || []).map(
											({ value, label, description }) => {
												return (
													<ScRadio
														checked={
															appliesWhile ===
															value
														}
														value={value}
														onClick={() =>
															setAppliesWhile(
																value
															)
														}
														key={value}
													>
														{label}
														<span slot="description">
															{description}
														</span>
													</ScRadio>
												);
											}
										)}
									</div>
								</ScRadioGroup>
							</div>
						</div>
					</div>
				</Box>
			</ScForm>
		</CreateTemplate>
	);
};
