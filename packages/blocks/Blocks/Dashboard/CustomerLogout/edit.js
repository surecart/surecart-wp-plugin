import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { color, redirectToCurrent } = attributes;

  const currentUser = wp.data.select("core").getCurrentUser();

  let avatarUrl = 'https://secure.gravatar.com/avatar/fd59ee0f8195887bcd910e658c896c21?s=80&d=mm&r=g';

  if ( currentUser?.avatar_urls ) {

    const avatars = Object.values( currentUser?.avatar_urls );

      avatarUrl = avatars[ avatars.length - 1 ];
  }

	return (
		<div>
			<InspectorControls>
        <PanelBody title={__('Settings')}>
					<PanelRow>
						<ToggleControl
							label={__('Redirect to current URL')}
							checked={redirectToCurrent}
							onChange={() =>
								setAttributes({
									redirectToCurrent: !redirectToCurrent,
								})
							}
						/>
					</PanelRow>
				</PanelBody>
        <PanelColorSettings
            title={__('Color Settings')}
            colorSettings={[
              {
                value: color,
                onChange: (color) =>
                  setAttributes({ color }),
                label: __('Color', 'surecart'),
              },
            ]}
          ></PanelColorSettings>
			</InspectorControls>
			<div className="sc-customer-logout">
        <sc-dropdown>
          <sc-button type="text" slot="trigger" style={ { 'color' : color } }>
            <sc-avatar image={avatarUrl} slot="prefix" style={ { '--sc-avatar-size' : '2em', 'color' : color } }></sc-avatar>
            { currentUser?.name || __( 'User', 'surecart' ) }
            <sc-icon name="chevron-up" slot="suffix"></sc-icon>
          </sc-button>

          <sc-menu>
            <sc-menu-item href="#">
              <sc-icon slot="prefix" name="log-out"></sc-icon>
              { __( 'Logout', 'surecart' ) }
            </sc-menu-item>
          </sc-menu>
        </sc-dropdown>
		  </div>
		</div>
	);
};
