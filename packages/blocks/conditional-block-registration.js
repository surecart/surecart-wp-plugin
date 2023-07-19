import { select, subscribe } from '@wordpress/data';
import { registerBlocks, unregisterBlocks } from './register-block';

export const registerBlocksExceptForTemplates = ({ templates, blocks }) =>
	registerBlocksForTemplates({ templates, blocks }, false);

// listens to current FSE template and either registers or unregisters blocks
// based on a list of template names or partial template strings (like a template prefix).
export const registerBlocksForTemplates = (
	{ templates, blocks },
	register = true
) => {
	let currentTemplateId = '';
	subscribe(() => {
		const previousTemplateId = currentTemplateId;
		const store = select('core/edit-site');
		currentTemplateId = store?.getEditedPostId();

		if (previousTemplateId === currentTemplateId || !currentTemplateId) {
			return;
		}

		const hasTemplate = templates.some((template) =>
			currentTemplateId.includes(template)
		);

		if (hasTemplate) {
			register ? registerBlocks(blocks) : unregisterBlocks(blocks);
		} else {
			register ? unregisterBlocks(blocks) : registerBlocks(blocks);
		}
	});
};
