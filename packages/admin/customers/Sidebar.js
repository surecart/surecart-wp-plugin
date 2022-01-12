/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __,  _n } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

import Box from '../ui/Box';

export default () => {
	return (
		<Fragment>
			<Box
				title={
					<div
						css={ css`
							display: flex;
							align-items: center;
							justify-content: space-between;
						` }
					>
						{ __( 'Summary', 'checkout_engine' ) }{ ' ' }
					</div>
				}
				css={ css`
					font-size: 14px;
				` }
			>
				<Fragment>
				</Fragment>
			</Box>
		</Fragment>
	);
};
