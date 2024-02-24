import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	const blockProps = useBlockProps({
		className: 'sc-tag sc-tag--primary',
	});

	return (
		<RichText
			tagName="div"
			value={text}
			onChange={(text) => setAttributes({ text })}
			aria-label={text ? __('Sale Label') : __('Empty Sale label')}
			data-empty={text ? false : true}
			placeholder={__('Type in sale badge text', 'surecart')}
			{...blockProps}
		/>
	);
};
