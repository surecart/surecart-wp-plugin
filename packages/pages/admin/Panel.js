import { useDispatch, useSelect } from '@wordpress/data';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { store as editorStore } from '@wordpress/editor';
import { useSetting } from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default () => {
	const { template, _surecart_dashboard_logo_width } = useSelect((select) => {
		const meta = select('core/editor').getEditedPostAttribute('meta');
		return {
			template: select(editorStore).getEditedPostAttribute('template'),
			_surecart_dashboard_logo_width:
				meta?._surecart_dashboard_logo_width,
		};
	});

	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

	const { editPost } = useDispatch(editorStore);

	if (template !== 'pages/template-surecart-dashboard.php') {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name="sc-dashboard-panel"
			title={__('Template Options', 'surecart')}
			className="custom-panel"
			icon={
				<svg
					width="36"
					height="36"
					viewBox="0 0 36 36"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M17.519 35.5C27.1944 35.5 35.0379 27.665 35.0379 18C35.0379 8.33502 27.1944 0.5 17.519 0.5C7.84351 0.5 0 8.33502 0 18C0 27.665 7.84351 35.5 17.519 35.5ZM17.5944 9.25C16.1877 9.25 14.241 10.0536 13.2463 11.0449L10.5448 13.7372H24.0104L28.5129 9.25H17.5944ZM21.7689 24.9551C20.7742 25.9464 18.8275 26.75 17.4208 26.75H6.50228L11.0048 22.2628H24.4704L21.7689 24.9551ZM26.1453 15.9808H8.29837L7.45535 16.8221C5.4592 18.617 6.05123 20.0192 8.84675 20.0192H26.742L27.5853 19.1779C29.562 17.3936 28.9408 15.9808 26.1453 15.9808Z"
						fill="currentColor"
					/>
				</svg>
			}
		>
			<UnitControl
				label={__('Logo Width', 'surecart')}
				value={_surecart_dashboard_logo_width}
				onChange={(_surecart_dashboard_logo_width) =>
					editPost({
						meta: {
							_surecart_dashboard_logo_width,
						},
					})
				}
				units={units}
			/>
		</PluginDocumentSettingPanel>
	);
};
