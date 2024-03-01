/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScButton, ScText } from '@surecart/components-react';
import Box from '../../../ui/Box';
import Definition from '../../../ui/Definition';

export default ({ affiliationRequestId, affiliationRequest, loading }) => {
	const [saving, setSaving] = useState(false);

	// TODO: Fetch the affiliate user details by the affiliationRequestId.

	return (
		<Box title={__('Affiliate', 'surecart')} loading={loading || saving}>
			<Definition
				title={
					<div>
						{!!affiliationRequest?.used && (
							<div>
								{affiliationRequest?.first_name +
									' ' +
									affiliationRequest?.last_name}
								<br />
								{affiliationRequest?.email}
							</div>
						)}

						{!affiliationRequest?.used ? (
							<ScText>
								{__(
									'No connected affiliate user found !',
									'surecart'
								)}
							</ScText>
						) : null}
					</div>
				}
			></Definition>
		</Box>
	);
};
