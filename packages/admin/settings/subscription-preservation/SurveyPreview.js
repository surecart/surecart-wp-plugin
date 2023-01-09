/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScCancelSurvey,
	ScDialog,
	ScIcon,
} from '@surecart/components-react';
import { useState } from 'react';

export default ({ renderTrigger, protocol, reasons }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			{renderTrigger({ open, setOpen })}
			<ScDialog
				style={{
					'--width': '675px',
					'--body-spacing': 'var(--sc-spacing-xxx-large)',
				}}
				noHeader
				open={open}
				onScRequestClose={() => setOpen(false)}
			>
				<ScButton
					class="close__button"
					type="text"
					circle
					onClick={() => setOpen(false)}
					css={css`
						position: absolute;
						top: 0;
						right: 0;
						font-size: 22px;
					`}
				>
					<ScIcon name="x" />
				</ScButton>

				<ScCancelSurvey protocol={protocol} reasons={reasons} />
			</ScDialog>
		</>
	);
};
