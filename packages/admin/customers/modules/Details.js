/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import {
	ScColumn,
	ScColumns,
	ScInput,
	ScTag,
} from '@surecart/components-react';
import { css, jsx } from '@emotion/core';

export default ({ customer, updateCustomer, loading }) => {
	return (
		<Box
			title={__('Customer Details', 'surecart')}
			loading={loading}
			header_action={
				customer?.id &&
				!customer?.live_mode && (
					<ScTag type="warning">{__('Test Mode', 'surecart')}</ScTag>
				)
			}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
				`}
			>
				<ScColumns>
          <ScColumn>
            <ScInput
              label={__('First Name', 'surecart')}
              className="sc-customer-fname"
              help={__('Your customer\'s first name.', 'surecart')}
              attribute="first_name"
              value={customer?.first_name}
              onScInput={(e) =>
                updateCustomer({ first_name: e.target.value })
              }
            />
          </ScColumn>
          <ScColumn>
            <ScInput
              label={__('Last Name', 'surecart')}
              className="sc-customer-lname"
              help={__('Your customer\'s last name.', 'surecart')}
              attribute="last_name"
              value={customer?.last_name}
              onScInput={(e) =>
                updateCustomer({ last_name: e.target.value })
              }
            />
          </ScColumn>
				</ScColumns>
        <ScColumns>
          <ScColumn>
            <ScInput
              label={__('Email', 'surecart')}
              className="sc-customer-email"
              help={__(
                "Your customer's email address.",
                'surecart'
              )}
              value={customer?.email}
              name="email"
              required
              onScInput={(e) =>
                updateCustomer({ email: e.target.value })
              }
            />
          </ScColumn>
          <ScColumn>
            <ScInput
              label={__('Phone', 'surecart')}
              className="sc-customer-phone"
              help={__('Your customer\'s phone number.', 'surecart')}
              attribute="phone"
              value={customer?.phone}
              onScInput={(e) =>
                updateCustomer({ phone: e.target.value })
              }
            />
          </ScColumn>
				</ScColumns>
			</div>
		</Box>
	);
};
