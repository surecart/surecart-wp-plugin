/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScCard } from '@surecart/components-react';
import Box from '../../ui/Box';
import ModelSelector from '../../components/ModelSelector';

import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import useAvatar from '../../hooks/useAvatar';

export default ({ referral, updateReferral, loading }) => {
	const { affiliation, loadingAffiliation } = useSelect(
		(select) => {
			if (!referral?.affiliation) return {};
			const queryArgs = [
				'surecart',
				'affiliation',
				referral?.affiliation,
			];
			return {
				affiliation: select(coreStore).getEntityRecord(...queryArgs),
				loadingAffiliation: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[referral?.affiliation]
	);

	const avatarUrl = useAvatar({ email: affiliation?.email });

	return (
		<Box
			title={__('Affiliate', 'surecart')}
			loading={loading || loadingAffiliation}
		>
			<ScCard>
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 2em;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: flex-start;
							gap: 1em;
							flex: 1;
						`}
					>
						<div>
							<img
								src={avatarUrl}
								css={css`
									width: 36px;
									height: 36px;
									border-radius: var(
										--sc-border-radius-medium
									);
								`}
							/>
						</div>
						<div>
							<div>
								<strong>{affiliation?.display_name}</strong>
							</div>
							<div>{affiliation?.email}</div>
						</div>
					</div>

					<ModelSelector
						unselect={false}
						name="affiliation"
						value={affiliation?.id}
						requestQuery={{
							archived: false,
						}}
						onSelect={(affiliation) =>
							updateReferral({ affiliation })
						}
						display={(affiliation) => affiliation.display_name}
						css={css`
							min-width: 370px;
							text-align: right;
						`}
					>
						<ScButton slot="trigger" size="small">
							{__('Change', 'surecart')}
						</ScButton>
					</ModelSelector>
				</div>
			</ScCard>
		</Box>
	);
};
