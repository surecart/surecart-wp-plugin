/**
 * External dependencies.
 */
import { useDispatch } from '@wordpress/data';
import { MenuGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import {
	PreferenceToggleMenuItem,
	store as preferencesStore,
} from '@wordpress/preferences';

export default function () {
	const { set: setPreference } = useDispatch(preferencesStore);

	const turnOffDistractionFree = () => {
		setPreference('core', 'distractionFree', false);
	};

	const isLargeViewport = useViewportMatch('medium');
	if (!isLargeViewport) {
		return null;
	}

	return (
		<MenuGroup label={__('View', 'surecart')}>
			<PreferenceToggleMenuItem
				scope="core"
				name="fixedToolbar"
				onToggle={turnOffDistractionFree}
				label={__('Top toolbar', 'surecart')}
				info={__(
					'Access all block and document tools in a single place',
					'surecart'
				)}
				messageActivated={__('Top toolbar activated', 'surecart')}
				messageDeactivated={__('Top toolbar deactivated', 'surecart')}
			/>
		</MenuGroup>
	);
}
