/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../../../ui/Box';
import Copy from './Copy';
import {
	ScTag,
	ScSkeleton,
	ScInput,
	ScButton,
	ScIcon,
} from '@surecart/components-react';
import { __, sprintf } from '@wordpress/i18n';

export default ({ license, updateLicense, loading, onEditKey }) => {
	const renderTag = () => {
		if (loading) {
			return <ScSkeleton style={{ width: '75px' }}></ScSkeleton>;
		}

		if (license?.status === 'active') {
			return <ScTag type="success">{__('Active', 'surecart')}</ScTag>;
		}
		if (license?.status === 'revoked') {
			return <ScTag type="danger">{__('Revoked', 'surecart')}</ScTag>;
		}
		if (license?.status === 'inactive') {
			return <ScTag type="info">{__('Inactive', 'surecart')}</ScTag>;
		}

		return <ScTag type="info">{license?.status}</ScTag>;
	};

	return (
		<Box
			title={__('License', 'surecart')}
			header_action={
				<div style={{ minWidth: 'auto' }}>{renderTag()}</div>
			}
			loading={loading}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.5em;
				`}
			>
				<ScInput
					label={__('License Key', 'surecart')}
					readonly
					value={license?.key}
					help={
						!!license?.created_at &&
						sprintf(
							__('Created on %s', 'surecart'),
							license?.created_at_date_time
						)
					}
					css={css`
						width: 100%;
					`}
				>
					<Copy slot="suffix" text={license?.key} />
				</ScInput>

				<ScButton
					onClick={onEditKey}
					type="default"
					aria-label={__('Edit License Key', 'surecart')}
				>
					<ScIcon name="edit" />
				</ScButton>
			</div>
			<ScInput
				label={__('Activation Limit', 'surecart')}
				type="number"
				min="0"
				value={license?.activation_limit}
				onScInput={(e) =>
					updateLicense({
						activation_limit: parseInt(e.target.value),
					})
				}
				help={__(
					'Enter the number of unique activations for this key. Leave blank for infinite.',
					'surecart'
				)}
			/>
		</Box>
	);
};
