/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';

import Box from '../../ui/Box';
import { useEffect, useState } from 'react';
import SelectProductGroup from '../../components/SelectProductGroup';
import useEntities from '../../mixins/useEntities';
import apiFetch from '@wordpress/api-fetch';

import { ScForm, ScInput } from '@surecart/components-react';

export default ({ loading, product, updateProduct }) => {
	const [saving, setSaving] = useState(false);
	const [modal, setModal] = useState(false);

	const onNew = () => {
		setModal(true);
	};

	const [query, setQuery] = useState(null);
	const {
		product_groups,
		receiveProductgroups,
		fetchProductgroups,
		isLoading,
	} = useEntities('product_group');

	useEffect(() => {
		fetchProductgroups({
			query: {
				query,
			},
		});
	}, [query]);

	const onSelect = (product_group) => {
		updateProduct({
			product_group,
		});
	};

	const onCreate = async (e) => {
		setSaving(true);
		const { name } = await e.target.getFormJson();

		try {
			const group = await apiFetch({
				path: 'surecart/v1/product_groups/',
				method: 'POST',
				data: {
					name,
				},
			});

			if (group?.id) {
				receiveProductgroups(group);
				updateProduct({
					product_group: group?.id,
				});
			}
		} finally {
			setSaving(false);
			setModal(false);
		}
	};

	if (!product?.recurring) return null;

	return (
		<Box title={__('Upgrade Group', 'surecart')} loading={loading}>
			<SelectProductGroup
				css={css`
					flex: 0 1 50%;
				`}
				help={__(
					'Add this product to a group with others you want the purchaser to switch between.',
					'surecart'
				)}
				value={product?.product_group?.id || product?.product_group}
				groups={product_groups}
				onQuery={setQuery}
				onFetch={() => setQuery('')}
				loading={isLoading}
				onSelect={onSelect}
				onNew={onNew}
			/>
			{modal && (
				<Modal
					title={__('Create Product Group', 'surecart')}
					css={css`
						max-width: 500px !important;
					`}
					onRequestClose={() => setModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<ScForm
						onScFormSubmit={onCreate}
						css={css`
							--sc-form-row-spacing: var(--sc-spacing-large);
						`}
					>
						<ScInput
							required
							name="name"
							label={__('Group Name', 'surecart')}
							help={__(
								'This is not shown to the customer, but is used help you identify the group.',
								'surecart'
							)}
							autofocus
						/>

						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<Button isPrimary isBusy={saving} type="submit">
								{__('Create', 'surecart')}
							</Button>
							<Button onClick={() => setModal(false)}>
								{__('Cancel', 'surecart')}
							</Button>
						</div>
					</ScForm>
				</Modal>
			)}
		</Box>
	);
};
