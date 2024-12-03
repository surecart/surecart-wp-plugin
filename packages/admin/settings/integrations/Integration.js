/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScCard,
} from '@surecart/components-react';
import { useLink, useLocation } from '../../router';
import { useEntityRecord } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';

export default ({ id }) => {
	const location = useLocation();
	const { record } = useEntityRecord('surecart', 'integration_catalog', id);
	const { id: _, ...rest } = location.params;
	const { href, onClick } = useLink({ ...rest });

	// Dynamically import the component based on id
	let IntegrationComponent = null;
	try {
		IntegrationComponent = require(`./components/${id}`).default;
	} catch (e) {
		// Component doesn't exist, silently fail
	}

	return (
		<div
			css={css`
				display: grid;
				gap: 1.5em;
				max-width: 600px;
				margin: auto;
			`}
		>
			<ScBreadcrumbs>
				<ScBreadcrumb href={href} onClick={onClick}>
					{__('Integrations', 'surecart')}
				</ScBreadcrumb>
				<ScBreadcrumb>{record?.name}</ScBreadcrumb>
			</ScBreadcrumbs>

			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 1em;
				`}
			>
				<img
					src={record?.logo}
					alt={record?.name}
					css={css`
						width: 48px;
						height: 48px;
						flex: 0 0 48px;
					`}
				/>
				<div
					css={css`
						flex: 1;
						display: grid;
						gap: 0.25em;
					`}
				>
					<h1
						css={css`
							margin: 0;
							font-size: 16px;
						`}
					>
						{record?.name}
					</h1>
					<span>{record?.summary}</span>
				</div>
			</div>

			<ScCard>
				<div
					css={css`
						display: grid;
						gap: 2em;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 2em;
						`}
					>
						{!!record?.support_link && !!record?.support_name && (
							<div
								css={css`
									display: grid;
									gap: 0.1em;
								`}
							>
								<div
									css={css`
										text-transform: uppercase;
										font-size: 10px;
									`}
								>
									{__('Support', 'surecart')}
								</div>
								<div
									css={css`
										font-size: 12px;
									`}
								>
									<ExternalLink
										css={css`
											text-decoration: none;
											color: var(--sc-color-primary-500);
											font-weight: bold;
										`}
										href={record?.support_link}
									>
										{record?.support_name}
									</ExternalLink>
								</div>
							</div>
						)}

						{!!record?.docs_link && (
							<div
								css={css`
									display: grid;
									gap: 0.1em;
								`}
							>
								<div
									css={css`
										text-transform: uppercase;
										font-size: 10px;
									`}
								>
									{__('Docs', 'surecart')}
								</div>
								<div
									css={css`
										font-size: 12px;
									`}
								>
									<ExternalLink
										css={css`
											text-decoration: none;
											color: var(--sc-color-primary-500);
											font-weight: bold;
										`}
										href={record?.docs_link}
									>
										{__('Docs', 'surecart')}
									</ExternalLink>
								</div>
							</div>
						)}

						{!!record?.website_link && (
							<div
								css={css`
									display: grid;
									gap: 0.1em;
								`}
							>
								<div
									css={css`
										text-transform: uppercase;
										font-size: 10px;
									`}
								>
									{__('Website', 'surecart')}
								</div>
								<div
									css={css`
										font-size: 12px;
									`}
								>
									<ExternalLink
										css={css`
											text-decoration: none;
											color: var(--sc-color-primary-500);
											font-weight: bold;
										`}
										href={record?.website_link}
									>
										{new URL(record.website_link)?.host
											.split('.')
											.slice(-2)
											.join('.')}
									</ExternalLink>
								</div>
							</div>
						)}

						<ScButton
							type="primary"
							css={css`
								margin-left: auto;
							`}
						>
							Enable
						</ScButton>
					</div>

					{!record?.is_enabled && record?.you_tube_video_id && (
						<iframe
							width="560"
							height="315"
							src={`https://www.youtube.com/embed/${record?.you_tube_video_id}`}
							title="YouTube video player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen
						></iframe>
					)}

					{IntegrationComponent && <IntegrationComponent />}

					{!record?.is_enabled && (
						<div
							css={css`
								h1,
								h2,
								h3,
								h4,
								h5,
								h6 {
									margin: 0;
									font-size: 15px;
									margin-bottom: 4px;
									font-weight: 600;
									color: var(--sc-color-gray-900);
								}

								p {
									margin: 0;
									font-size: 15px;
									line-height: 1.7;
									color: var(--sc-color-gray-500);
								}

								p:not(:last-child) {
									margin-bottom: 1.2em;
								}
							`}
							dangerouslySetInnerHTML={{
								__html: record?.description,
							}}
						/>
					)}
				</div>
			</ScCard>
		</div>
	);
};
