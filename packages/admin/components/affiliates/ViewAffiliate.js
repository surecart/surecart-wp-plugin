/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import {
	ScAvatar,
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScText,
} from '@surecart/components-react';
import useAvatar from '../../hooks/useAvatar';

export default ({ updateItem, affiliation }) => {
	const avatarUrl = useAvatar({ email: affiliation?.email });

	return (
		<div>
			<ScFlex alignItems="center">
				<ScFlex alignItems="center">
					<div>
						<ScAvatar
							image={avatarUrl}
							initials={
								(affiliation?.first_name || '').charAt(0) +
								(affiliation?.last_name || '').charAt(0)
							}
						/>
					</div>

					<div>
						<a
							href={addQueryArgs('admin.php', {
								page: 'sc-affiliates',
								action: 'edit',
								id: affiliation?.id,
							})}
						>
							{`${affiliation?.first_name}  ${affiliation?.last_name}`}
						</a>
						<ScText
							css={css`
								color: var(--sc-color-gray-500);
							`}
						>
							{affiliation?.email}
						</ScText>
					</div>
				</ScFlex>

				<ScDropdown placement="bottom-end">
					<ScButton type="text" slot="trigger">
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem
							onClick={() =>
								updateItem({
									affiliation: null,
								})
							}
						>
							<ScIcon
								slot="prefix"
								style={{ opacity: 0.5 }}
								name="x-square"
							/>
							{__('Remove', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScFlex>
		</div>
	);
};
