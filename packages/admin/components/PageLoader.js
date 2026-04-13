import { __ } from '@wordpress/i18n';
import { ScSkeleton } from '@surecart/components-react';

export default () => {
	return (
		<div
			role="status"
			aria-live="polite"
			aria-label={__('Loading…', 'surecart')}
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.25em',
				padding: '1em 0',
			}}
		>
			<ScSkeleton style={{ width: '35%', height: '28px' }} />
			<ScSkeleton style={{ width: '60%' }} />
			<ScSkeleton style={{ width: '80%' }} />
			<ScSkeleton style={{ width: '70%' }} />
			<ScSkeleton style={{ width: '50%' }} />
		</div>
	);
};
