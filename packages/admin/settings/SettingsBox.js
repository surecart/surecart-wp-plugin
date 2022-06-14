import { __ } from '@wordpress/i18n';
import { ScDashboardModule } from '@surecart/components-react';
import SaveButton from '../templates/SaveButton';

export default ({
	title,
	description,
	loading,
	children,
	end,
	wrapperTag = 'sc-card',
	noButton = false,
}) => {
	const TagName = wrapperTag;

	return (
		<ScDashboardModule
			heading={title}
			style={{
				'--sc-dashboard-module-spacing': '1em',
				'--sc-dashbaord-module-heading-size': '1.1em',
			}}
		>
			{!!description && <span slot="description">{description}</span>}

			{!!end && <span slot="end">{end}</span>}

			<TagName>
				{loading ? (
					<div>
						<sc-skeleton
							style={{
								width: '100%',
								marginBottom: '15px',
								display: 'inline-block',
							}}
						></sc-skeleton>
						<sc-skeleton
							style={{
								width: '40%',
								display: 'inline-block',
							}}
						></sc-skeleton>
					</div>
				) : (
					children
				)}
			</TagName>
			{!noButton && (
				<div>
					<SaveButton>{__('Save', 'surecart')}</SaveButton>
				</div>
			)}
		</ScDashboardModule>
	);
};
