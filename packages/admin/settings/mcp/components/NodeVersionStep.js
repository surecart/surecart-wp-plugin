import { __ } from '@wordpress/i18n';

export default function () {
	return (
		<li>
			<strong>{__('Verify Node.js version', 'surecart')}</strong>
			<ol>
				<li>
					{__('In your terminal, run:', 'surecart')}{' '}
					<code>node -v</code>
				</li>
				<li>{__('The version must be 20.1 or higher.', 'surecart')}</li>
				<li>
					{__('If it is lower, run:', 'surecart')}{' '}
					<code>nvm install 20 && nvm use 20</code>
				</li>
			</ol>
		</li>
	);
}
