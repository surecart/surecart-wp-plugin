import {
	ScAvatar,
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __, _n } from '@wordpress/i18n';

export default ({ attributes, setAttributes, className }) => {
	const { color, redirectToCurrent } = attributes;
	const currentUser = useSelect((select) =>
		select(coreStore).getCurrentUser()
	);

	let avatarUrl =
		currentUser?.avatar_urls?.[96] ||
		currentUser?.avatar_urls?.[48] ||
		currentUser?.avatar_urls?.[24] ||
		'https://secure.gravatar.com/avatar/fd59ee0f8195887bcd910e658c896c21?s=80&d=mm&r=g';

	return (
		<div>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Redirect to current URL', 'surecart')}
							checked={redirectToCurrent}
							onChange={(redirectToCurrent) =>
								setAttributes({
									redirectToCurrent,
								})
							}
						/>
					</PanelRow>
				</PanelBody>

				<PanelColorSettings
					title={__('Color Settings', 'surecart')}
					colorSettings={[
						{
							value: color,
							onChange: (color) => setAttributes({ color }),
							label: __('Color', 'surecart'),
						},
					]}
				></PanelColorSettings>
			</InspectorControls>

			<div className={className}>
				<ScDropdown>
					<ScButton
						type="text"
						slot="trigger"
						style={{ color: color }}
					>
						<ScAvatar
							image={avatarUrl}
							slot="prefix"
							style={{ '--sc-avatar-size': '2em', color: color }}
						></ScAvatar>
						{currentUser?.name ||
							currentUser?.email ||
							__('User', 'surecart')}
						<ScIcon name="chevron-up" slot="suffix" />
					</ScButton>

					<ScMenu>
						<ScMenuItem href="#">
							<ScIcon slot="prefix" name="log-out"></ScIcon>
							{__('Logout', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</div>
		</div>
	);
};
