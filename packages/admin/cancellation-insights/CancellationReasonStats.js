import { css } from '@emotion/core';
import Box from '../ui/Box';

export function CancellationReasonStats() {
	return (
		<Box
			title={'Cancellations Reasons'}
			loading={false}
			hasDivider={false}
			// header_action={compare}
			css={css`
				border-radius: 6px !important;
				border: 1px solid var(--sc-color-gray-200);
			`}
		>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas
			optio eos id adipisci obcaecati expedita quod rerum ex at dolorum!
		</Box>
	);
}
