/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useLink, useLocation } from '../../router';
import { __ } from '@wordpress/i18n';

export default ({ integration }) => {
	const location = useLocation();

	const { href, onClick } = useLink({
		id: integration.id,
		...location.params,
	});

	const sizes =
		integration?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes;
	const logo = sizes?.medium?.source_url || sizes?.thumbnail?.source_url;

	return (
		<a
			href={href}
			onClick={onClick}
			css={css`
				text-decoration: none;
				color: inherit;
				display: block;
				padding: var(--sc-card-padding, var(--sc-spacing-large));
				background: var(
					--sc-card-background-color,
					var(--sc-color-white)
				);
				border: 1px solid
					var(--sc-card-border-color, var(--sc-color-gray-300));
				border-radius: var(--sc-input-border-radius-medium);
				box-shadow: var(--sc-shadow-small);

				&:hover {
					text-decoration: none;
					color: inherit;
					background: var(--sc-color-gray-50);
				}
			`}
		>
			<div
				css={css`
					display: grid;
					gap: 1em;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<img
						src={logo}
						alt={integration.title?.rendered}
						width={32}
						height={32}
					/>

					<div>
						<h2
							css={css`
								font-size: 14px;
								margin: 0;
							`}
						>
							{integration.title?.rendered}
						</h2>
						{integration?.is_pre_installed && (
							<div
								css={css`
									font-size: 12px;
								`}
							>
								{__('Pre-installed', 'surecart')}
							</div>
						)}
						{integration?.is_enabled && (
							<div
								css={css`
									font-size: 12px;
								`}
							>
								{__('Enabled', 'surecart')}
							</div>
						)}
					</div>
				</div>

				<div
					css={css`
						color: var(--sc-color-gray-500);
						line-height: 1.3;
					`}
				>
					{integration?.acf?.summary}
				</div>
			</div>
		</a>
	);
};
