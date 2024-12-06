/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScCard,
	ScIcon,
} from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useLink, useLocation } from '../../router';
import { useEntityRecord } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';
import PluginActivationButton from './PluginActivationButton';
import Notifications from '../../components/Notifications';

const ActivateButton = ({ record, onActivated }) => {
	if (
		record?.plugin_slug &&
		record?.plugin_file_name &&
		!record?.is_plugin_active
	) {
		return (
			<PluginActivationButton
				plugin={record?.plugin_file_name}
				slug={record?.plugin_slug}
				onActivated={onActivated}
			/>
		);
	}

	if (!!record?.enable_link) {
		return (
			<ScButton type="primary" href={record?.enable_link} target="_blank">
				{__('Enable', 'surecart')}
				<ScIcon name="external-link" slot="suffix" />
			</ScButton>
		);
	}

	return <ScButton type="primary">{__('Enable', 'surecart')}</ScButton>;
};

const ActivatedButton = ({ record }) => {
	return (
		<ScButton type="text" disabled>
			{record?.is_pre_installed
				? __('Pre-installed', 'surecart')
				: __('Enabled', 'surecart')}
		</ScButton>
	);
};

export default ({ id }) => {
	const location = useLocation();
	const { invalidateResolutionForStore } = useDispatch(coreStore);
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

	const showDetails = !(IntegrationComponent && record?.is_enabled);

	return (
		<div
			css={css`
				display: grid;
				gap: 1.5em;
				margin: auto;
				width: 100%;
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

						<div
							css={css`
								margin-left: auto;
							`}
						>
							{record?.is_enabled ? (
								<ActivatedButton record={record} />
							) : (
								<ActivateButton
									record={record}
									onActivated={invalidateResolutionForStore}
								/>
							)}
						</div>
					</div>

					{showDetails && !!record?.you_tube_video_id && (
						<div
							css={css`
								width: 100%;
								min-width: 400px;
								max-width: 800px;
							`}
						>
							<div
								css={css`
									position: relative;
									width: 100%;
									overflow: hidden;
									padding-top: 56.25%;
								`}
							>
								<iframe
									width="560"
									height="315"
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										width: '100%',
										height: '100%',
										border: 'none',
									}}
									src={`https://www.youtube.com/embed/${record?.you_tube_video_id}`}
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									referrerpolicy="strict-origin-when-cross-origin"
									allowfullscreen
								></iframe>
							</div>
						</div>
					)}

					{IntegrationComponent && (
						<IntegrationComponent record={record} />
					)}

					{showDetails && (
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
			<Notifications
				css={css`
					position: fixed !important;
					left: auto !important;
					right: 40px;
					bottom: 40px;
					width: auto !important;

					:first-letter {
						text-transform: uppercase;
					}
				`}
			/>
		</div>
	);
};
