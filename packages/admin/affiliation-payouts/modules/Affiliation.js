/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScBlockUi, ScButton, ScFlex } from '@surecart/components-react';
import Box from '../../ui/Box';
import ModelSelector from '../../components/ModelSelector';

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default ({ referral, loading, expanded }) => {
	const [saving, setSaving] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const onSelectAffiliation = async (affiliation) => {
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'referral'
		);

		try {
			setSaving(true);
			const saved = await apiFetch({
				method: 'POST',
				path: addQueryArgs(`${baseURL}/${referral.id}`, {
					expand: expanded,
				}),
				data: {
					id: referral.id,
					affiliation,
				},
			});

			if (saved?.id) {
				createSuccessNotice(__('Affiliate changed successfully.'));
				receiveEntityRecords(
					'surecart',
					'referral',
					{
						...referral,
						affiliation: saved.affiliation,
					},
					undefined,
					false,
					{
						affiliation: saved.affiliation,
					}
				);
			}
		} catch (e) {
			console.log(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box title="Affiliate" loading={loading}>
			<ScFlex
				alignItems="center"
				justifyContent="flex-start"
				style={{ gap: '1em' }}
			>
				<div>
					<div>{`${referral?.affiliation?.first_name} ${
						referral?.affiliation?.last_name || ''
					}`}</div>
					<div>{referral?.affiliation?.email}</div>
				</div>

				<ModelSelector
					unselect={false}
					name="affiliation"
					value={referral.affiliation}
					requestQuery={{
						archived: false,
					}}
					onSelect={(affiliation) => onSelectAffiliation(affiliation)}
					display={(affiliation) =>
						`${affiliation.first_name} ${
							affiliation.last_name || ''
						}`
					}
					css={css`
						min-width: 370px;
					`}
				>
					<ScButton slot="trigger" size="small">
						{__('Change', 'surecart')}
					</ScButton>
				</ModelSelector>
			</ScFlex>
			{saving && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</Box>
	);
};
