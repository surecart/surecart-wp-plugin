/**
 * External dependencies.
 */
import { MenuGroup, MenuItem, VisuallyHidden } from '@wordpress/components';
import { ActionItem } from '@wordpress/interface';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { serialize } from '@wordpress/blocks';
import { useCopyToClipboard } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { external } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { MORE_MENU_ACTION_ITEM_SLOT_NAME } from '../constants';
import WritingMenu from './WritingMenu';
import MoreMenuDropdown from './MoreMenuDropdown';

export default function () {
	const renderBlockToolbar = true;

	const { createNotice } = useDispatch('core/notices');

	const { blocks } = useSelect((select) => {
		const { getBlocks } = select(blockEditorStore);

		return {
			blocks: getBlocks(),
		};
	}, []);

	const getText = () => {
		return serialize(blocks);
	};

	const onCopySuccess = () => {
		createNotice('success', __('All content copied.', 'surecart'));
	};

	const ref = useCopyToClipboard(getText, onCopySuccess);

	return (
		<MoreMenuDropdown>
			{(onClose) => (
				<>
					{renderBlockToolbar && <WritingMenu />}

					<ActionItem.Slot
						name={MORE_MENU_ACTION_ITEM_SLOT_NAME}
						label={__('Plugins', 'surecart')}
						as={MenuGroup}
						fillProps={{ onClick: onClose }}
					/>

					<MenuGroup label={__('Tools', 'surecart')}>
						<MenuItem
							ref={ref}
							role="menuitem"
							disabled={!blocks.length}
						>
							{__('Copy all content', 'surecart')}
						</MenuItem>
						<MenuItem
							role="menuitem"
							icon={external}
							href={__(
								'https://wordpress.org/documentation/article/wordpress-block-editor/',
								'surecart'
							)}
							target="_blank"
							rel="noopener noreferrer"
						>
							{__('Help', 'surecart')}
							<VisuallyHidden as="span">
								{
									/* translators: accessibility text */
									__('(opens in a new tab)', 'surecart')
								}
							</VisuallyHidden>
						</MenuItem>
					</MenuGroup>
				</>
			)}
		</MoreMenuDropdown>
	);
}
