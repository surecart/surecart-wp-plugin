import { __ } from '@wordpress/i18n';
import { DropdownMenu } from '@wordpress/components';
import { moreHorizontal, inbox, trash } from '@wordpress/icons';

export default ({ product, onDelete, onToggleArchive }) => {
	if (!product?.id) {
		return '';
	}

	return (
		<DropdownMenu
			controls={[
				...[
					!!onToggleArchive
						? {
								icon: inbox,
								onClick: onToggleArchive,
								title: product?.archived
									? __('Un-Archive Product', 'surecart')
									: __('Archive Product', 'surecart'),
						  }
						: {},
				],
				...[
					!!onDelete
						? {
								icon: trash,
								onClick: onDelete,
								title: __('Delete Product', 'surecart'),
						  }
						: {},
				],
			]}
			icon={moreHorizontal}
			label={__('More Actions', 'surecart')}
			popoverProps={{
				placement: 'bottom-end',
			}}
			menuProps={{
				style: {
					minWidth: '150px',
				},
			}}
		/>
	);
};
