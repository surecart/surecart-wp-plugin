import { styles } from '../../../admin/styles/admin';
import ColorPopup from '../../components/ColorPopup';
import Cart from './components/Cart';
import Mode from './components/Mode';
import Setup from './components/Setup';
import { ScCheckout, ScIcon } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import {
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
	LinkControl,
	useBlockProps,
} from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import {
	PanelRow,
	PanelBody,
	Button,
	BaseControl,
	ToggleControl,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment, useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ClaimNoticeModal from '../../../admin/components/ClaimNoticeModal';

export default function edit({ clientId, attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const [patterns, setPatterns] = useState([]);
	const UnitControl = __stableUnitControl
		? __stableUnitControl
		: __experimentalUnitControl;

	const {
		align,
		className,
		prices,
		font_size,
		loading_text,
		success_text,
		choice_type,
		mode,
		gap,
		color,
		success_url,
		persist_cart,
	} = attributes;

	const scCheckoutRef = useRef();

	// Set prices directly on the element for iframe compatibility.
	useEffect(() => {
		if (scCheckoutRef.current) {
			scCheckoutRef.current.prices = prices || [];
		}
	}, [prices]);

	const [showClaimNotice, setShowClaimNotice] = useState(false);
	const claimUrl = window?.scData?.claim_url;
	const isAccountClaimed = !claimUrl;

	const [custom_success_url, setCustomSuccessUrl] = useState(!!success_url);
	useEffect(() => {
		if (!custom_success_url) {
			setAttributes({ success_url: '' });
		}
	}, [custom_success_url]);

	const [tab, setTab] = useState('');
	const blockCount = useSelect((select) =>
		select(blockEditorStore).getBlockCount(clientId)
	);
	const { replaceInnerBlocks, setTemplateValidity } =
		useDispatch(blockEditorStore);

	// set template to valid for our post type.
	// prevents template changed warnings.
	const postType = useSelect((select) =>
		select('core/editor').getCurrentPostType()
	);
	useEffect(() => {
		if (postType === 'sc_form') {
			setTemplateValidity(true);
		}
	}, [postType]);

	const changeTemplate = async () => {
		const r = confirm(
			__(
				'Are you sure you want to change the template? This will completely replace your current form.',
				'surecart'
			)
		);
		if (!r) return;
		replaceInnerBlocks(clientId, [], false);
	};

	const formId = useSelect((select) => {
		// parent block id attribute.
		const parents = select(blockEditorStore).getBlockParents(clientId);
		const parentBlock = select(blockEditorStore).getBlocksByClientId(
			parents?.[0]
		);
		// current post id.
		const post_id = select('core/editor').getCurrentPostId();
		return parentBlock?.[0]?.attributes?.id || post_id;
	});

	useEffect(() => {
		getPatterns();
	}, []);

	const getPatterns = async () => {
		const patterns = await apiFetch({
			path: '/surecart/v1/form-patterns',
		});
		setPatterns(patterns);
	};

	/**
	 * Maybe create the template for the form.
	 */
	const maybeCreateTemplate = async ({
		template = 'default',
		choices,
		choice_type,
	}) => {
		const pattern = patterns.find(
			(pattern) => pattern.name === `surecart/${template}`
		);

		if (!pattern) {
			alert('Something went wrong');
			return;
		}
		// parse blocks.
		let parsed = parse(pattern.content);

		parsed = populateChoicesBlock(parsed, choices, choice_type);
		parsed = populateBlock(parsed, choices, 'surecart/donation');
		parsed = populateBlock(parsed, choices, 'surecart/name-your-price');
		parsed = populateProductDonationBlock(
			parsed,
			choices,
			'surecart/product-donation'
		);

		return parsed;
	};

	/**
	 * Maybe populated the donation block with the correct price.
	 */
	const populateChoicesBlock = (blocks, choices, choice_type) => {
		const remove =
			!choices?.length || !['checkbox', 'radio'].includes(choice_type);

		// look through nested blocks and add or remove prices.
		blocks.forEach(function iter(block, index, blocks) {
			if (block.name === 'surecart/price-selector') {
				if (remove) {
					blocks.splice(index, 1);
				} else {
					blocks[index].attributes.type = choice_type;
					blocks[index].innerBlocks = choices.map((choice, index) => {
						return [
							'surecart/price-choice',
							{
								price_id: choice?.id,
								quantity: choice?.quantity || 1,
								type: choice_type,
								checked: index === 0 && choice_type === 'radio',
							},
						];
					});
				}
			}
			Array.isArray(block.innerBlocks) && block.innerBlocks.forEach(iter);
		});

		return blocks;
	};

	/**
	 * Maybe populated the donation block with the correct price.
	 */
	const populateBlock = (blocks, choices, name) => {
		const remove = !choices?.length;

		// look through nested blocks and add or remove prices.
		blocks.forEach(function iter(block, index, blocks) {
			if (block.name === name) {
				if (remove) {
					blocks.splice(index, 1);
				} else {
					blocks[index].attributes.price_id = choices[0].id;
				}
			}
			Array.isArray(block.innerBlocks) && block.innerBlocks.forEach(iter);
		});

		return blocks;
	};

	/**
	 * Maybe populated the donation block with the correct price.
	 */
	const populateProductDonationBlock = (blocks, choices, name) => {
		const remove = !choices?.length;
		// look through nested blocks and add or remove prices.
		blocks.forEach(function iter(block, index, blocks) {
			if (block.name === name) {
				if (remove) {
					blocks.splice(index, 1);
				} else {
					blocks[index].attributes.product_id = choices[0].id;
				}
			}
			Array.isArray(block.innerBlocks) && block.innerBlocks.forEach(iter);
		});

		return blocks;
	};

	const onCreate = async ({
		choices,
		choice_type,
		template,
		custom_success_url,
		success_url,
	}) => {
		// form attributes.
		setAttributes({
			prices: choice_type === 'all' ? choices : [],
			redirect: custom_success_url && success_url ? success_url : '',
		});

		const result = await maybeCreateTemplate({
			template,
			choices,
			choice_type,
		});

		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate(result),
			false
		);
	};

	const onModeSelect = (mode) => {
		if (mode === 'live' && !isAccountClaimed) {
			setShowClaimNotice(true);
			return;
		}
		setAttributes({ mode });
		setShowClaimNotice(false);
	};

	const isDefaultCheckout =
		parseInt(window?.scData?.default_checkout_id || '') ===
		parseInt(formId);

	return (
		<Fragment>
			<style>{`
				.sc-form-edit-link-control {
					border: 1px solid #ddd;
					box-sizing: border-box;
				}
				.sc-form-edit-link-control .block-editor-link-control {
					min-width: 248px;
					max-width: 248px;
					overflow: hidden;
				}
				.sc-form-edit-link-control .block-editor-link-control__search-item-header {
					white-space: normal;
					overflow-wrap: anywhere;
				}
				.sc-form-edit-inner-blocks * > * > .wp-block:not(sc-choice):not(sc-column):not(sc-radio):not(sc-price-choice):not(sc-choices > *):not(.sc-invoice-details > *):not(:last-child) {
					margin-bottom: ${gap} !important;
				}
				.sc-form-edit-inner-blocks [data-type*='surecart/'] {
					pointer-events: all !important;
				}
				.sc-form-edit-inner-blocks .wp-block,
				.sc-form-edit-inner-blocks .block-editor-inserter {
					pointer-events: all !important;
				}
			`}</style>
			<InspectorControls>
				<PanelBody title={__('Form Template', 'surecart')}>
					<PanelRow>
						<div>
							<Button isPrimary onClick={changeTemplate}>
								{__('Change Template', 'surecart')}
							</Button>
						</div>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Style', 'surecart')}>
					<PanelRow>
						<BaseControl.VisualLabel>
							{__('Form Highlight Color', 'surecart')}
						</BaseControl.VisualLabel>
						<ColorPopup
							color={color}
							setColor={(color) => {
								setAttributes({ color: color?.hex });
							}}
						/>
					</PanelRow>
					<PanelRow>
						<UnitControl
							__next40pxDefaultSize
							label={__('Row Gap')}
							onChange={(gap) => setAttributes({ gap })}
							value={gap}
							help={__(
								'The this is the space between the rows of form elements.',
								'surecart'
							)}
							units={[
								{ value: 'px', label: 'px', default: 0 },
								{ value: 'em', label: 'em', default: 0 },
							]}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Thank You Page', 'surecart')}>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Custom Thank You Page', 'surecart')}
							checked={custom_success_url}
							onChange={(custom_success_url) =>
								setCustomSuccessUrl(custom_success_url)
							}
						/>
					</PanelRow>
					{custom_success_url && (
						<PanelRow>
							<div className="sc-form-edit-link-control">
								<LinkControl
									value={{ url: success_url }}
									shownUnlinkControl={true}
									noURLSuggestion
									showInitialSuggestions
									onChange={(nextValue) => {
										setAttributes({
											success_url: nextValue.url,
										});
									}}
								/>
							</div>
						</PanelRow>
					)}
				</PanelBody>

				{!isDefaultCheckout && (
					<PanelBody
						title={__('Form Cart Settings', 'surecart')}
						initialOpen={false}
					>
						<PanelRow>
							<ToggleControl
								__nextHasNoMarginBottom
								label={__('Persist Across Pages', 'surecart')}
								help={__(
									'Allow the cart for this form to persist across page views instead using the chosen products each page view.',
									'surecart'
								)}
								checked={persist_cart === 'browser'}
								onChange={(nextValue) => {
									setAttributes({
										persist_cart: nextValue
											? 'browser'
											: 'url',
									});
								}}
							/>
						</PanelRow>
					</PanelBody>
				)}

				<PanelBody
					title={__('Loading Text', 'surecart')}
					initialOpen={false}
				>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Submitting', 'surecart')}
							value={loading_text?.finalizing}
							placeholder={__('Submitting...', 'surecart')}
							onChange={(finalizing) =>
								setAttributes({
									loading_text: {
										...loading_text,
										finalizing,
									},
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Processing', 'surecart')}
							value={loading_text?.paying}
							placeholder={__('Processing...', 'surecart')}
							onChange={(paying) =>
								setAttributes({
									loading_text: {
										...loading_text,
										paying,
									},
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Confirming', 'surecart')}
							value={loading_text?.confirming}
							placeholder={__('Finalizing...', 'surecart')}
							onChange={(confirming) =>
								setAttributes({
									loading_text: {
										...loading_text,
										confirming,
									},
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Success', 'surecart')}
							value={loading_text?.confirmed}
							placeholder={__(
								'Success! Redirecting...',
								'surecart'
							)}
							onChange={(confirmed) =>
								setAttributes({
									loading_text: {
										...loading_text,
										confirmed,
									},
								})
							}
						/>
					</PanelRow>
					{custom_success_url && (
						<PanelRow>
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={__('Success & Redirecting', 'surecart')}
								value={loading_text?.redirecting}
								placeholder={__(
									'Success! Redirecting...',
									'surecart'
								)}
								onChange={(redirecting) =>
									setAttributes({
										loading_text: {
											...loading_text,
											redirecting,
										},
									})
								}
							/>
						</PanelRow>
					)}
				</PanelBody>
				<PanelBody
					title={__('Success Text', 'surecart')}
					initialOpen={false}
				>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Title', 'surecart')}
						value={success_text?.title}
						placeholder={__('Thank you!', 'surecart')}
						onChange={(title) =>
							setAttributes({
								success_text: {
									...success_text,
									title,
								},
							})
						}
					/>

					<TextareaControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Description', 'surecart')}
						value={success_text?.description}
						placeholder={__(
							'Your payment was successful. A receipt is on its way to your inbox.',
							'surecart'
						)}
						onChange={(description) =>
							setAttributes({
								success_text: {
									...success_text,
									description,
								},
							})
						}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Button Text', 'surecart')}
						value={success_text?.button}
						placeholder={__('Continue', 'surecart')}
						onChange={(button) =>
							setAttributes({
								success_text: {
									...success_text,
									button,
								},
							})
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{showClaimNotice ? (
					<ClaimNoticeModal
						title={__('Complete your store setup.', 'surecart')}
						bodyText={__(
							"Please complete your store to enable live mode. It's free!",
							'surecart'
						)}
						onRequestClose={() => setShowClaimNotice(false)}
						claimUrl={claimUrl}
					/>
				) : null}
				{blockCount === 0 ? (
					<Setup
						templates={patterns}
						onCreate={onCreate}
						clientId={clientId}
					/>
				) : (
					<div
						style={{
							maxWidth: 'var(--ast-content-width-size)',
							marginLeft: 'auto',
							marginRight: 'auto',
						}}
					>
						<div
							style={{
								...styles,
								padding: '10px 16px',
								borderRadius: '8px',
								display: 'grid',
								gap: '0.5em',
								border: '1px solid transparent',
								background:
									'var(--sc-input-background-color-disabled)',
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									fontSize: '15px',
								}}
							>
								<div
									style={{
										cursor: 'pointer',
										flex: 1,
										userSelect: 'none',
										display: 'inline-block',
										color: 'var(--sc-input-label-color)',
										fontWeight:
											'var(--sc-input-label-font-weight)',
										textTransform:
											'var(--sc-input-label-text-transform, none)',
										letterSpacing:
											'var(--sc-input-label-letter-spacing, 0)',
									}}
								>
									{__('Form', 'surecart')}
								</div>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Mode
										attributes={attributes}
										onModeSelect={onModeSelect}
									/>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<Button
											onClick={() =>
												setTab(
													tab === 'cart' ? '' : 'cart'
												)
											}
										>
											<span
												style={{
													display: 'inline-block',
													verticalAlign: 'top',
													boxSizing: 'border-box',
													margin: '1px 0 -1px 2px',
													padding: '0 5px',
													minWidth: '18px',
													height: '18px',
													borderRadius: '9px',
													backgroundColor:
														'currentColor',
													fontSize: '11px',
													lineHeight: 1.6,
													textAlign: 'center',
													zIndex: 26,
												}}
											>
												<span
													style={{
														color: '#fff',
													}}
												>
													{
														(prices || []).filter(
															(p) => p?.id
														)?.length
													}
												</span>
											</span>

											<ScIcon
												name="shopping-bag"
												style={{
													fontSize: '18px',
													color: 'var(--sc-input-label-color)',
												}}
											/>
										</Button>
									</div>
								</div>
							</div>

							{tab === 'cart' && (
								<Cart
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							)}
						</div>
						<ScCheckout
							ref={scCheckoutRef}
							mode="test"
							formId={formId}
							processors={scBlockData?.processors}
							stripePaymentElement={
								scBlockData?.beta?.stripe_payment_element
							}
							className={className}
							style={{
								marginTop: '2em',
								fontSize: `${font_size}px`,
								...(color
									? {
											'--sc-color-primary-500': color,
											'--sc-focus-ring-color-primary':
												color,
											'--sc-input-border-color-focus':
												color,
									  }
									: {}),
							}}
							disableComponentsValidation={true}
							persistSession={false}
							alignment={align}
							currencyCode={
								scBlockData.currency || scData?.currency
							}
							choiceType={choice_type}
						>
							<div className="sc-form-edit-inner-blocks">
								<InnerBlocks
									templateLock={false}
									renderAppender={
										blockCount
											? undefined
											: InnerBlocks.ButtonBlockAppender
									}
								/>
							</div>
						</ScCheckout>
					</div>
				)}
			</div>
		</Fragment>
	);
}
