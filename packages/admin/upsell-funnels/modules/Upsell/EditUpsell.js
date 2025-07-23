/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDrawer,
	ScForm,
	ScInput,
	ScSwitch,
} from '@surecart/components-react';
import { __, sprintf } from '@wordpress/i18n';
import Discount from './Discount';
import { useRef, useState } from '@wordpress/element';
import Product from './Product';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import DisplayConditions from './DisplayConditions';
import { useDispatch, useSelect } from '@wordpress/data';
import { createErrorString } from '../../../util';
import Template from './Template';

const OFFER_TITLE = {
	initial: __('Initial Offer', 'surecart'),
	accepted: __('Accept Offer', 'surecart'),
	declined: __('Decline Offer', 'surecart'),
};

export default ({ upsell: initialUpsell, open, onRequestClose }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);
	const [hasEdits, setHasEdits] = useState(false);
	const inputRef = useRef(null);

	const [upsell, setUpsell] = useState({
		duplicate_purchase_behavior: 'allow',
		fee_description: __('Bundle Discount', 'surecart'),
		metadata: {
			wp_template_part_id: 'surecart/surecart//upsell-info',
			wp_template_id: 'pages/template-surecart-blank.php',
		},
		...initialUpsell,
	});

	const editUpsell = (data) => {
		setHasEdits(true);
		setUpsell({ ...upsell, ...data });
	};

	const isSaving = useSelect((select) =>
		select(coreStore).isSavingEntityRecord('surecart', 'upsell', upsell?.id)
	);

	const onSubmit = async (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		try {
			await saveEntityRecord('surecart', 'upsell', upsell, {
				throwOnError: true,
			});
			setHasEdits(false);
			onRequestClose();
		} catch (e) {
			console.error(e);
			createErrorNotice(createErrorString(e), { type: 'snackbar' });
		}
	};

	const checkForChanges = (e) => {
		if (
			hasEdits &&
			!window.confirm(
				__(
					'You have unsaved changes. If you proceed, they will be lost.',
					'surecart'
				)
			)
		) {
			e.preventDefault();
		}
	};

	return (
		<ScForm
			style={{
				'--sc-form-row-spacing': 'var(--sc-spacing-large)',
			}}
			onScSubmit={onSubmit}
			onScFormSubmit={(e) => {
				e.preventDefault();
				e.stopImmediatePropagation();
			}}
		>
			<ScDrawer
				label={sprintf(
					// Translators: %1s is the action (Create or Edit), %2s is the type of upsell (Offer, Initial Offer, Accept Offer, Decline Offer)
					__('%1s %2s', 'surecart'),
					upsell?.id
						? __('Edit', 'surecart')
						: __('Create', 'surecart'),
					OFFER_TITLE[upsell?.step] || __('Offer', 'surecart')
				)}
				style={{ '--sc-drawer-size': '32rem' }}
				stickyHeader
				open={open}
				onScAfterShow={() => inputRef.current.triggerFocus()}
				onScRequestClose={checkForChanges}
				onScAfterHide={onRequestClose}
			>
				<div
					css={css`
						padding: 30px;
						display: grid;
						gap: 2em;
					`}
				>
					<ScInput
						label={__('Title', 'surecart')}
						ref={inputRef}
						help={__(
							'This is shown on the upsell page.',
							'surecart'
						)}
						placeholder={__(
							'i.e. An exclusive offer, just for you.',
							'surecart'
						)}
						value={upsell?.metadata?.title}
						onScInput={(e) =>
							editUpsell({
								metadata: {
									...upsell.metadata,
									title: e.target.value,
								},
							})
						}
						required
					/>

					<Product
						label={__('Product price', 'surecart')}
						priceId={upsell?.price?.id || upsell?.price}
						onSelect={(price) => editUpsell({ price })}
					/>

					<Discount upsell={upsell} onUpdate={editUpsell} />

					<DisplayConditions upsell={upsell} onUpdate={editUpsell} />

					<Template upsell={upsell} onUpdate={editUpsell} />

					<ScSwitch
						checked={upsell?.replacement_behavior === 'all'}
						onScChange={(e) =>
							editUpsell({
								replacement_behavior: e.target.checked ? 'all' : 'none'
							})
						}
					>
						<span slot="label">{__('Replace Order', 'surecart')}</span>
						<span slot="description">
							{__(
								'Replace the entire order with this product',
								'surecart'
							)}
						</span>
					</ScSwitch>

					<ScInput
						label={__('Statement label', 'surecart')}
						help={__(
							'This is shown to the customer on invoices and line items.',
							'surecart'
						)}
						placeholder={__('I.E. Bundle Discount', 'surecart')}
						value={upsell?.fee_description}
						onScInput={(e) =>
							editUpsell({ fee_description: e.target.value })
						}
						required
					/>
				</div>

				<ScButton
					type="primary"
					slot="footer"
					submit
					busy={isSaving}
					disabled={!hasEdits}
				>
					{upsell?.id
						? __('Update Offer', 'surecart')
						: __('Create Offer', 'surecart')}
				</ScButton>
				<ScButton
					type="text"
					slot="footer"
					onClick={(e) =>
						e.target.closest('sc-drawer').requestClose()
					}
				>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDrawer>
		</ScForm>
	);
};
