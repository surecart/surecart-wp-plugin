/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScFlex, ScFormControl } from '@surecart/components-react';
import Box from '../../ui/Box';
import ModelSelector from '../../components/ModelSelector';

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { select } from '@wordpress/data';

export default ({ referral, loading, updateReferral }) => {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	const onSelectAffiliation = (affiliation) => {
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'referral'
		);
		setError(null);

		try {
			setSaving(true);
			const saved = apiFetch({
				method: 'POST',
				path: addQueryArgs(`${baseURL}/${referral.id}`, {
					expand: ['affiliation'],
				}),
				data: {
					id: referral.id,
					affiliation: affiliation.id,
				},
			});
		} catch (error) {
			setError(error);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box title="Affiliate" loading={loading}>
			{referral?.affiliation?.id ? (
				<ScFlex alignItems="center" justifyContent="space-between">
					<div>
						<div>{`${referral?.affiliation?.first_name} ${referral?.affiliation?.last_name}`}</div>
						<div>{referral?.affiliation?.email}</div>
					</div>

					<ModelSelector
						unselect={false}
						name="affiliation"
						value={referral.affiliation}
						requestQuery={{
							archived: false,
						}}
						onSelect={(affiliation) =>
							onSelectAffiliation(affiliation)
						}
						display={(affiliation) =>
							`${affiliation.first_name} ${affiliation.last_name}`
						}
						css={css`
							flex: 0 1 50%;
						`}
					>
						<ScButton slot="trigger" size="small">
							Change
						</ScButton>
					</ModelSelector>
				</ScFlex>
			) : (
				<ScFormControl
					label={__('Select Affiliate', 'surecart')}
					required
				></ScFormControl>
			)}
		</Box>
	);
};
