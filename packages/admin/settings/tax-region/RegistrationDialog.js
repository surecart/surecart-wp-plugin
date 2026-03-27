/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import { ScDialog } from '@surecart/components-react';
import RegistrationForm from './RegistrationForm';

export default ({
	region,
	registration,
	registrations,
	open,
	onRequestClose,
}) => {
	return (
		<div
			css={css`
				sc-dialog::part(body) {
					overflow: visible;
				}
			`}
		>
			<ScDialog
				label={
					registration?.id
						? sprintf(
								__('%s Tax', 'surecart'),
								registration?.tax_zone?.state_name ||
									registration?.tax_zone?.country_name
						  )
						: __('Collect Tax', 'surecart')
				}
				onScRequestClose={onRequestClose}
				open={open}
			>
				{open && (
					<RegistrationForm
						region={region}
						registrations={registrations}
						registration={registration}
						onSubmitted={onRequestClose}
						onDeleted={onRequestClose}
					/>
				)}
			</ScDialog>
		</div>
	);
};
