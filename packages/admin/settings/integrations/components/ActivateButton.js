import PluginActivationButton from './PluginActivationButton';
import { ScButton, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

const ActivateButton = ({ record, onActivated }) => {
	if (record?.plugin_slug && record?.plugin_file) {
		return (
			<PluginActivationButton
				plugin={record?.plugin_file}
				slug={record?.plugin_slug}
				onActivated={onActivated}
			/>
		);
	}

	if (record?.theme_slug && !record?.activation_link) {
		return (
			<ScButton
				type="primary"
				href={addQueryArgs('theme-install.php', {
					theme: record?.theme_slug,
				})}
				target="_blank"
			>
				{__('Enable', 'surecart')}
				<ScIcon name="external-link" slot="suffix" />
			</ScButton>
		);
	}

	if (!!record?.activation_link) {
		return (
			<ScButton
				type="primary"
				href={record?.activation_link}
				target="_blank"
			>
				{__('Enable', 'surecart')}
				<ScIcon name="external-link" slot="suffix" />
			</ScButton>
		);
	}

	return null;
};

const ActivatedButton = ({ record }) => {
	if (record?.plugin_slug && record?.plugin_file) {
		return (
			<PluginActivationButton
				plugin={record?.plugin_file}
				slug={record?.plugin_slug}
			/>
		);
	}

	if (record?.is_pre_installed) {
		if (!!record?.activation_link) {
			return (
				<ScButton
					type="text"
					href={record?.activation_link}
					target="_blank"
				>
					{__('Pre-installed', 'surecart')}
					<ScIcon name="external-link" slot="suffix" />
				</ScButton>
			);
		}
		return (
			<ScButton type="text" disabled>
				{__('Pre-installed', 'surecart')}
			</ScButton>
		);
	}

	return (
		<ScButton type="text" disabled>
			{__('Installed', 'surecart')}
		</ScButton>
	);
};

export default ({ record, onActivated }) => {
	return record?.is_enabled || record?.is_pre_installed ? (
		<ActivatedButton record={record} />
	) : (
		<ActivateButton record={record} onActivated={onActivated} />
	);
};
