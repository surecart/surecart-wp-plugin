/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import { ScFormatDate} from '@surecart/components-react';

export default ({ invoice, loading, busy, setBusy }) => {

	return (
		<>
			<Box
				title={__('', 'surecart')}
				loading={loading}
			>
				<div css={css`
					display: flex;
					justify-content: space-between;
				`}>
					{__('Due Date')}{' '}
					<ScFormatDate
						date={invoice?.due_date}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					/>
				</div>
				<div css={css`
					display: flex;
					justify-content: space-between;
				`}>
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
