import { __ } from '@wordpress/i18n';

export default function () {
	return (
		<li>
			<strong>
				{__('Update the environment variables', 'surecart')}
			</strong>
			<ol>
				<li>
					<strong>WP_API_USERNAME</strong>
					{' \u2014 '}
					{__('your WordPress username (prefilled).', 'surecart')}
				</li>
				<li>
					<strong>WP_API_PASSWORD</strong>
					{' \u2014 '}
					{__(
						'replace "your-application-password" with the password from Step 1.',
						'surecart'
					)}
				</li>
			</ol>
		</li>
	);
}
