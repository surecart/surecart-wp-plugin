/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScCard } from '@surecart/components-react';
import { useLink, useLocation } from '../../router';

export default ({ provider }) => {
	const location = useLocation();

	const { href, onClick } = useLink({
		id: provider.name,
		...location.params,
	});

	return (
		<a href={href} onClick={onClick}>
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
		</a>
	);
};
