/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScInput,
	ScFlex,
	ScFormControl,
	ScTextarea,
	ScForm,
	ScIcon,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState, useEffect, Fragment, useRef } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import Error from '../../../components/Error';
import HelpTooltip from '../../../components/HelpTooltip';

import ProgressBar from './ProgressBar';
import ShippingRateForm from '../rate/ShippingRateForm';
import CountryStateSelector from '../../../components/CountryStateSelector';

const sections = {
	SECTION_ADD_ZONE: 1,
	SECTION_ADD_RATE: 2,
};

export default ({
	open,
	onRequestClose,
	shippingProfileId,
	selectedZone,
	isEdit,
	onUpgradeRequired,
}) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [zoneName, setZoneName] = useState('');
	const [zoneTerritories, setZoneTerritories] = useState([]);
	const [zonePostalCodes, setZonePostalCodes] = useState([]);
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [section, setSection] = useState(sections.SECTION_ADD_ZONE);
	const [shippingZoneId, setShippingZoneId] = useState();
	const input = useRef(null);

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				input.current.triggerFocus();
			}, 100);
		}
		return () => {
			setZoneTerritories([]);
			setZoneName('');
			setZonePostalCodes([]);
			setError();
		};
	}, [open]);

	useEffect(() => {
		if (isEdit) {
			setZoneName(selectedZone?.name || '');
			setZoneTerritories(selectedZone?.territories || []);
			setZonePostalCodes(selectedZone?.postal_codes || []);
		}
	}, [isEdit]);

	const addShippingZone = async () => {
		const shippingZone = await saveEntityRecord(
			'surecart',
			'shipping-zone',
			{
				name: zoneName,
				postal_codes: zonePostalCodes,
				shipping_profile_id: shippingProfileId,
				territories: zoneTerritories,
			},
			{ throwOnError: true }
		);

		setShippingZoneId(shippingZone.id);
		setSection(sections.SECTION_ADD_RATE);
	};

	const editShippingZone = async () => {
		await saveEntityRecord(
			'surecart',
			'shipping-zone',
			{
				id: selectedZone.id,
				name: zoneName,
				postal_codes: zonePostalCodes,
				territories: zoneTerritories,
			},
			{ throwOnError: true }
		);
	};

	const onSubmit = async () => {
		if (!zoneTerritories.length) {
			setError({
				message: __(
					'Select at least one country or region.',
					'surecart'
				),
			});
			return;
		}

		setLoading(true);
		try {
			if (isEdit) {
				await editShippingZone();
				createSuccessNotice(__('Zone updated', 'surecart'), {
					type: 'snackbar',
				});
				onRequestClose();
			} else {
				await addShippingZone();
				createSuccessNotice(__('Zone added', 'surecart'), {
					type: 'snackbar',
				});
			}
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	const onPostalCodeChange = (value) => {
		const postcodes = value?.split('\n')?.filter((line) => line.length > 0);
		setZonePostalCodes(postcodes);
	};

	const renderZoneForm = () => {
		return (
			<Fragment>
				<ScForm
					onScSubmit={(e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
						onSubmit();
					}}
					onScFormSubmit={(e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
					}}
				>
					<ScFlex
						flexDirection="column"
						style={{
							'--sc-flex-column-gap': '1.5em',
						}}
					>
						<Error error={error} setError={setError} />
						<ScInput
							ref={input}
							required
							label={__('Zone Name', 'surecart')}
							onScInput={(e) => setZoneName(e.target.value)}
							name="zone-name"
							value={zoneName}
							placeholder={__(
								'United States,  United Kingdom, Global ...',
								'surecart'
							)}
						/>

						<ScFormControl
							label={__('Select Countries', 'surecart')}
							required
						>
							<CountryStateSelector
								value={zoneTerritories}
								onChange={setZoneTerritories}
							/>
						</ScFormControl>
						<ScFormControl
							label={__(
								'Limit to specific ZIP/postal codes',
								'surecart'
							)}
						>
							<HelpTooltip
								content={
									<div>
										<strong>
											{__(
												'Postal code filtering',
												'surecart'
											)}
										</strong>
										<p>
											{__(
												'Postal code filtering is applied in addition to territory filtering - an address must match both a territory and a postal code pattern (if provided) to be included in this shipping zone.',
												'surecart'
											)}
										</p>
										<p>
											{__(
												'Supports three matching modes:',
												'surecart'
											)}
										</p>
										<ol>
											<li>
												<strong>
													{__(
														'Exact match: ',
														'surecart'
													)}
												</strong>
												{__(
													'Provide the complete postal code as a string (e.g., "90210", "SW1A 1AA").',
													'surecart'
												)}{' '}
											</li>
											<li>
												<strong>
													{__(
														'Range match: ',
														'surecart'
													)}
												</strong>
												{__(
													'Use three dots ("...") to specify a numeric range (e.g., "90210...99000" matches all postal codes from 90210 to 99000). Only numeric postal codes are supported for ranges.',
													'surecart'
												)}{' '}
											</li>
											<li>
												<strong>
													{__(
														'Wildcard match: ',
														'surecart'
													)}
												</strong>
												{__(
													'Use asterisk ("") for prefix matching (e.g., "902" matches "90210", "90211", "902AB", etc.). All postal codes are normalized (uppercased and trimmed) before matching. If the array is empty, no postal code filtering is applied and all addresses within the territories will match.',
													'surecart'
												)}{' '}
											</li>
										</ol>
									</div>
								}
								slot="label-end"
								position="top left"
								width="400px"
							>
								<ScIcon
									slot="label-end"
									name="info"
									style={{ opacity: '0.5' }}
								/>
							</HelpTooltip>
							<ScTextarea
								value={zonePostalCodes?.join('\n')}
								placeholder={__(
									'Add one postal code per line',
									'surecart'
								)}
								onScInput={(e) =>
									onPostalCodeChange(e.target.value)
								}
								rows="5"
								columns="25"
								css={css`
									font-size: 12px;
								`}
								maxLength={500}
							/>
						</ScFormControl>
					</ScFlex>
					<ScFlex justifyContent="flex-start">
						<ScButton
							type="primary"
							disabled={loading}
							submit={true}
						>
							{isEdit
								? __('Save', 'surecart')
								: __('Next', 'surecart')}
						</ScButton>{' '}
						<ScButton
							type="text"
							onClick={onRequestClose}
							disabled={loading}
						>
							{__('Cancel', 'surecart')}
						</ScButton>
					</ScFlex>
				</ScForm>
				{loading && (
					<ScBlockUi
						style={{ '--sc-block-ui-opacity': '0.75' }}
						spinner
					/>
				)}
			</Fragment>
		);
	};

	return (
		<ScDialog
			open={open}
			label={
				isEdit
					? __('Edit Zone', 'surecart')
					: __('Add Zone', 'surecart')
			}
			onScRequestClose={(e) => {
				if (e.detail === 'overlay') {
					e.preventDefault();
					return false;
				}
				onRequestClose();
			}}
			style={{
				'--width': '38rem',
				'--dialog-body-overflow': 'visible',
				...(!isEdit
					? { '--body-spacing': 'var(--sc-spacing-xx-large)' }
					: {}),
			}}
			noHeader={!isEdit}
		>
			{!isEdit && (
				<ScFlex
					gap="1em"
					css={css`
						margin-bottom: var(--sc-spacing-large);
					`}
				>
					<ProgressBar
						isFilled={section >= sections.SECTION_ADD_ZONE}
						title={__('1. Create Zone', 'surecart')}
					/>
					<ProgressBar
						isFilled={section === sections.SECTION_ADD_RATE}
						title={__('2. Create Rate', 'surecart')}
					/>
				</ScFlex>
			)}
			{section === sections.SECTION_ADD_ZONE ? (
				renderZoneForm()
			) : (
				<ShippingRateForm
					onRequestClose={onRequestClose}
					shippingZoneId={shippingZoneId}
					onUpgradeRequired={onUpgradeRequired}
				/>
			)}
		</ScDialog>
	);
};
