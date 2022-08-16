import Box from '../../../ui/Box';
import { formatTime } from '../../../util/time';
import Copy from './Copy';
import { ScTag, ScSkeleton, ScInput } from '@surecart/components-react';
import { __, sprintf } from '@wordpress/i18n';

export default ({ license, updateLicense, loading }) => {
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
			header_action={renderTag()}
			loading={loading}
		>
			<ScInput
				label={__('License Key', 'surecart')}
				readonly
				value={license?.key}
				help={
					!!license?.created_at &&
					sprintf(
						__('Created on %s', 'surecart'),
						formatTime(license?.created_at)
					)
				}
			>
				<Copy slot="suffix" text={license?.key} />
			</ScInput>
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
