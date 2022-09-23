import { ScOrderBump, ScDashboardModule } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ bump, loading }) => {
	if (loading) return null;
	console.log({ bump });
	return (
		<div style={{ position: 'sticky' }}>
			<sc-text
				tag="h2"
				style={{
					'--font-size': '15px',
					'--font-weight': 'var(--sc-font-weight-bold)',
					marginBottom: 'var(--sc-spacing-medium)',
				}}
			>
				{__('Preview', 'surecart')}
			</sc-text>
			<ScOrderBump bump={bump} />
		</div>
	);
};
