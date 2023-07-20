import { select, subscribe } from '@wordpress/data';
import { registerBlocks, unregisterBlocks } from './register-block';

// listens to current FSE template and either registers or unregisters blocks
// based on a list of template names or partial template strings (like a template prefix).
export const registerBlocksForTemplates = ({ blocks, include, exclude }) => {
	let currentTemplateId = null;

	// always register blocks.
	registerBlocks(blocks);

	subscribe(() => {
		const previousTemplateId = currentTemplateId;
		const store = select('core/edit-site');
		currentTemplateId = store?.getEditedPostId();

		// template didn't change or we don't have a template, do nothing.
		if (previousTemplateId === currentTemplateId || !currentTemplateId) {
			return;
		}

		// find out if we should include or exclude the template.
		if (!!include) {
			const includeTemplate = (include || []).some((template) =>
				(currentTemplateId || '').includes(template)
			);
			console.log({ include: blocks.map((block) => block.name) });
			includeTemplate ? registerBlocks(blocks) : unregisterBlocks(blocks);
		}

		if (!!exclude) {
			const excludeTemplate = (exclude || []).some((template) =>
				(currentTemplateId || '').includes(template)
			);
			console.log({ exclude: blocks.map((block) => block.name) });
			excludeTemplate ? unregisterBlocks(blocks) : registerBlocks(blocks);
		}
	});
};
