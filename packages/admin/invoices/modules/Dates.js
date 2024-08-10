/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import AddressDisplay from '../../components/AddressDisplay';
import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScIcon,
	ScDialog,
	ScAddress,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScForm,
	ScFormatDate,
} from '@surecart/components-react';

export default ({ invoice, loading, busy, setBusy }) => {

	return (
		<>
			<Box
				title={__('', 'surecart')}
				loading={loading}
			>
				<div>
					{__('Due Date')}{' '}
					<ScFormatDate
						date={invoice?.due_date}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					/>
				</div>
				<div>
					{__('Issue Date')}{' '}
					<ScFormatDate
						date={invoice?.issue_date}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					/>
				</div>
			</Box>
		</>
	);
};
