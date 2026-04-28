import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';

export default function ({ appPasswordsUrl, clientLabel }) {
	return (
		<li>
			<strong>{__('Create an Application Password', 'surecart')}</strong>
			<ol>
				<li>
					<ExternalLink href={appPasswordsUrl}>
						{__('Open Application Passwords', 'surecart')}
					</ExternalLink>{' '}
					{__('to go to your WordPress profile.', 'surecart')}
				</li>
				<li>
					{__(
						'In the "New Application Password Name" field, enter a recognizable name (e.g.',
						'surecart'
					)}{' '}
					<code>{clientLabel}</code>
					{').'}
				</li>
				<li>
					{__('Click', 'surecart')}{' '}
					<strong>
						{__('Add Application Password', 'surecart')}
					</strong>
					.
				</li>
				<li>
					{__(
						'Copy the generated password immediately — it will not be shown again.',
						'surecart'
					)}
				</li>
			</ol>
		</li>
	);
}
