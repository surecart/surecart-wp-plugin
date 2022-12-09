import { ScInput, ScTextarea } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ item, updateItem }) => {
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
			<ScInput
				label={__('Cancelation Insights Title', 'surecart')}
				value={reasons_title}
				onScInput={(e) =>
					updateLocale({ reasons_title: e.target.value })
				}
			/>
			<ScTextarea
				label={__('Cancelation Insights Description', 'surecart')}
				value={reasons_description}
				onScInput={(e) =>
					updateLocale({ reasons_description: e.target.value })
				}
			/>
			<ScInput
				label={__('Skip Link', 'surecart')}
				value={skip_link}
				onScInput={(e) => updateLocale({ skip_link: e.target.value })}
			/>
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
				onScInput={(e) => updateLocale({ cancel_link: e.target.value })}
			/>
		</>
	);
};
