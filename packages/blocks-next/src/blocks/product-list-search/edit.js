import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Icon, search } from '@wordpress/icons';

export default () => {
	const blockProps = useBlockProps({
		style: {
			display: 'flex',
		},
	});
	return (
		<div {...blockProps}>
			<input className="wp-block-search__input" type="search" />
			<button
				className="wp-element-button wp-block-search__button"
				type="button"
				style={{
					paddingTop: '0.3em',
					paddingBottom: '0.3em',
				}}
			>
				<Icon icon={search} />
			</button>
		</div>
	);
};
