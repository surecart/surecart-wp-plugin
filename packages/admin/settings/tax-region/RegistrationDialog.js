/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScDialog } from '@surecart/components-react';
import RegistrationForm from './RegistrationForm';

export default ({ region, registration, open, onRequestClose }) => {
	return (
		<div
			css={css`
				sc-dialog::part(body) {
					overflow: visible;
				}
			`}
		>
			<ScDialog
				label={__('Collect Tax', 'surecart')}
				onScRequestClose={onRequestClose}
				open={open}
			>
				{open && (
					<RegistrationForm
						region={region}
						registration={registration}
						onSubmitted={onRequestClose}
						onDeleted={onRequestClose}
					/>
				)}
			</ScDialog>
		</div>
	);
};
