/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import SettingsBox from '../../SettingsBox';
import {
	ScBlockUi,
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedList,
	ScStackedListRow,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import ShippingMethodForm from './ShippingMethodForm';
import usePagination from '../../../hooks/usePagination';
import PrevNextButtons from '../../../ui/PrevNextButtons';
import Error from '../../../components/Error';

const PER_PAGE = 5;
const modals = {
	MODAL_EDIT_METHOD: 'edit-shipping-method',
	MODAL_ADD_METHOD: 'add-shipping-method',
};

export default () => {
	const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
	const [currentModal, setCurrentModal] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [busy, setBusy] = useState(false);
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [error, setError] = useState(false);

	const { shippingMethods, loadingMethods } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'shipping-method',
			{
				per_page: PER_PAGE,
				page: currentPage,
			},
		];

		const loading = select(coreStore).isResolving(
			'getEntityRecords',
			queryArgs
		);

		return {
			shippingMethods:
				select(coreStore).getEntityRecords(...queryArgs) || [],
			loadingMethods: loading,
		};
	});

	const { hasPagination } = usePagination({
		data: shippingMethods,
		page: currentPage,
		perPage: PER_PAGE,
	});

	const onDeleteShippingMethod = async (shippingMethodId) => {
		setBusy(true);
		try {
			await deleteEntityRecord(
				'surecart',
				'shipping-method',
				shippingMethodId,
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(__('Shipping method removed', 'surecart'), {
				type: 'snackbar',
			});
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setBusy(false);
		}
	};

	if (!shippingMethods.length) {
		return null;
	}

	return (
		<SettingsBox
			title={__('Shipping Methods', 'surecart')}
			end={
				<ScButton
					type="primary"
					onClick={() => setCurrentModal(modals.MODAL_ADD_METHOD)}
				>
					<ScIcon name="plus" /> {__('Add New', 'surecart')}
				</ScButton>
			}
			loading={loadingMethods}
			noButton
			description={__(
				'Create customized shipping methods to accommodate diverse needs, including options for speed, affordability, and promotional incentives.',
				'surecart'
			)}
		>
			<Error error={error} setError={setError} />
			<ScStackedList>
				{shippingMethods.map((shippingMethod) => (
					<ScStackedListRow
						key={shippingMethod.id}
						style={{
							'--columns': '3',
						}}
					>
						<strong>{shippingMethod.name}</strong>
						<div>{shippingMethod.description}</div>
						<div>
							<ScDropdown slot="suffix" placement="bottom-end">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() => {
											setSelectedShippingMethod(
												shippingMethod
											);
											setCurrentModal(
												modals.MODAL_EDIT_METHOD
											);
										}}
									>
										<ScIcon slot="prefix" name="edit" />
										{__('Edit', 'surecart')}
									</ScMenuItem>
									<ScMenuItem
										onClick={() =>
											onDeleteShippingMethod(
												shippingMethod.id
											)
										}
									>
										<ScIcon slot="prefix" name="trash" />
										{__('Delete', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						</div>
					</ScStackedListRow>
				))}
			</ScStackedList>
			{hasPagination && (
				<div
					css={css`
						padding: var(--sc-spacing-medium);
					`}
				>
					<PrevNextButtons
						data={shippingMethods}
						page={currentPage}
						setPage={setCurrentPage}
						perPage={PER_PAGE}
						loading={loadingMethods}
					/>
				</div>
			)}
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
			{currentModal && (
				<ShippingMethodForm
					open={
						currentModal === modals.MODAL_ADD_METHOD ||
						currentModal === modals.MODAL_EDIT_METHOD
					}
					isEdit={currentModal === modals.MODAL_EDIT_METHOD}
					onRequestClose={() => setCurrentModal(null)}
					selectedShippingMethod={selectedShippingMethod}
				/>
			)}
		</SettingsBox>
	);
};
