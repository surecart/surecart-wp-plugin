/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticeStore } from '@wordpress/notices';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import Error from '../../../components/Error';

export default ({ selectedShippingMethod, isEdit, onRequestClose, open }) => {
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticeStore);

	const [method, setMethod] = useState({
		name: '',
		description: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isEdit && selectedShippingMethod) {
			setMethod({
				name: selectedShippingMethod.name,
				description: selectedShippingMethod.description,
			});
		}
	}, [selectedShippingMethod, isEdit]);

	const editShippingMethod = async () => {
		await saveEntityRecord(
			'surecart',
			'shipping-method',
			{
				id: selectedShippingMethod?.id,
				...method,
			},
			{
				throwOnError: true,
			}
		);
	};

	const addShippingMethod = async () => {
		await saveEntityRecord('surecart', 'shipping-method', method, {
			throwOnError: true,
		});
	};

	const onSubmit = async () => {
		setLoading(true);
		try {
			if (isEdit) {
				await editShippingMethod();
				createSuccessNotice(__('Shipping method updated', 'surecart'), {
					type: 'snackbar',
				});
			} else {
				await addShippingMethod();
				createSuccessNotice(__('Shipping method added', 'surecart'), {
					type: 'snackbar',
				});
			}

			await invalidateResolutionForStore();

			onRequestClose();
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			open={open}
			label={
				isEdit
					? __('Edit Shipping Method', 'surecart')
					: __('Add Shipping Method', 'surecart')
			}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
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
					css={css`
						gap: var(--sc-spacing-medium);
					`}
				>
					<ScInput
						required
						label={__('Name', 'surecart')}
						onScInput={(e) =>
							setMethod({
								...method,
								name: e.target.value,
							})
						}
						name="method-name"
						value={method.name}
					/>
					<ScInput
						label={__('Description', 'surecart')}
						placeholder={__('E.g. 1-2 days', 'surecart')}
						help={__(
							'A description to let the customer know the average time it takes for shipping.',
							'surecart'
						)}
						onScInput={(e) =>
							setMethod({
								...method,
								description: e.target.value,
							})
						}
						value={method.description}
						name="method-description"
					/>
				</ScFlex>
				<ScFlex justifyContent="flex-start">
					<ScButton type="primary" disabled={loading} submit={true}>
						{isEdit
							? __('Update', 'surecart')
							: __('Add', 'surecart')}
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
		</ScDialog>
	);
};
