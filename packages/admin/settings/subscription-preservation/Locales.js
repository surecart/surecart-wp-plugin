import { ScInput, ScTextarea } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../SettingsBox';

export default ({ item, updateItem, loading }) => {
	const {
		reasons_title,
		reasons_description,
		skip_link,
		preserve_title,
		preserve_description,
		preserve_button,
		cancel_link,
	} = item?.preservation_locales;

	const updateLocale = (data) => {
		updateItem({
			preservation_locales: {
				...item?.preservation_locales,
				...data,
			},
		});
	};

	return (
		<>
			<SettingsBox
				title={__('Cancellation Survey', 'surecart')}
				description={__(
					'Cancellation survey dialog options.',
					'surecart'
				)}
				loading={loading}
			>
				<ScInput
					label={__('Title', 'surecart')}
					value={reasons_title}
					onScInput={(e) =>
						updateLocale({ reasons_title: e.target.value })
					}
				/>
				<ScTextarea
					label={__('Description', 'surecart')}
					value={reasons_description}
					onScInput={(e) =>
						updateLocale({ reasons_description: e.target.value })
					}
				/>
				<ScInput
					label={__('Skip Link', 'surecart')}
					value={skip_link}
					onScInput={(e) =>
						updateLocale({ skip_link: e.target.value })
					}
				/>
			</SettingsBox>

			<SettingsBox
				title={__('Renewal Discount', 'surecart')}
				description={__(
					'Provide a discount to keep a subscription.',
					'surecart'
				)}
				loading={loading}
			>
				<ScInput
					label={__('Preserve Title', 'surecart')}
					value={preserve_title}
					onScInput={(e) =>
						updateLocale({ preserve_title: e.target.value })
					}
				/>
				<ScTextarea
					label={__('Preserve Description', 'surecart')}
					value={preserve_description}
					onScInput={(e) =>
						updateLocale({ preserve_description: e.target.value })
					}
				/>
				<ScInput
					label={__('Preserve Button', 'surecart')}
					value={preserve_button}
					onScInput={(e) =>
						updateLocale({ preserve_button: e.target.value })
					}
				/>
				<ScInput
					label={__('Cancel Link', 'surecart')}
					value={cancel_link}
					onScInput={(e) =>
						updateLocale({ cancel_link: e.target.value })
					}
				/>
			</SettingsBox>
		</>
	);
};
