/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScFormControl,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSkeleton,
} from '@surecart/components-react';
import ModelSelector from '../../components/ModelSelector';
import useAvatar from '../../hooks/useAvatar';

export default ({ promotion, updatePromotion }) => {
	const { affiliation, loading } = useSelect(
		(select) => {
			if (!promotion?.affiliation?.id && !promotion?.affiliation) {
				return {
					affiliation: null,
					loading: false,
				};
			}

			const queryArgs = [
				'surecart',
				'affiliation',
				promotion?.affiliation?.id || promotion?.affiliation,
			];

			return {
				affiliation: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[promotion?.affiliation]
	);

	const avatarUrl = useAvatar({ email: affiliation?.email });

	if (loading) {
		return (
			<ScCard>
				<ScSkeleton />
			</ScCard>
		);
	}

	return (
		<>
			<ScFormControl
				label={__('Link to Affiliate', 'surecart')}
				style={{ display: 'block' }}
			>
				{affiliation?.id ? (
					<ScCard>
						<ScFlex
							alignItems="center"
							justifyContent="space-between"
						>
							<ScFlex
								alignItems="center"
								justifyContent="flex-start"
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
										<strong>
											{affiliation?.display_name}
										</strong>
									</div>
									<div>{affiliation?.email}</div>
								</div>
							</ScFlex>

							<ScDropdown placement="bottom-end">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() =>
											updatePromotion({
												affiliation: null,
											})
										}
									>
										<ScIcon
											slot="prefix"
											name="trash"
											style={{
												opacity: 0.5,
											}}
										/>
										{__('Remove', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						</ScFlex>
					</ScCard>
				) : (
					<ModelSelector
						name="affiliation"
						placeholder={__('None', 'surecart')}
						help={__(
							'Select an affiliate to link this promotion to.',
							'surecart'
						)}
						display={(item) =>
							`${item?.display_name || ''} - ${item?.email || ''}`
						}
						value={
							promotion?.affiliation?.id || promotion?.affiliation
						}
						onSelect={(affiliation) =>
							updatePromotion({ affiliation })
						}
					/>
				)}
			</ScFormControl>
		</>
	);
};
