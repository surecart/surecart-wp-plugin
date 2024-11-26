/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScCard, ScSwitch } from '@surecart/components-react';

export default ({ provider }) => {
	return (
		<ScCard>
			<div
				css={css`
					display: grid;
					gap: 1em;
				`}
			>
				<div
					css={css`
						display: flex;
						justify-content: space-between;
					`}
				>
					<img
						src={provider.logo}
						alt={provider.label}
						width={24}
						height={24}
					/>
					<ScSwitch label={provider.label} />
				</div>
				<h2
					css={css`
						font-size: 14px;
						margin: 0;
					`}
				>
					{provider.label}
				</h2>
				{provider.item_help}
			</div>
		</ScCard>
	);
};
