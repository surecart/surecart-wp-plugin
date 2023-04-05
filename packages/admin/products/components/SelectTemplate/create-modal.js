/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import {
	Modal,
	TextControl,
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { cleanForSlug } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
// import { store as editPostStore } from '../../../store';

const DEFAULT_TITLE = __('Custom Single Product Page', 'surecart');

export default function PostTemplateCreateModal({
	onClose,
	template,
	product,
	updateProduct,
}) {
	const [title, setTitle] = useState('');
	const [isBusy, setIsBusy] = useState(false);
	const { saveEntityRecord } = useDispatch(coreStore);

	const cancel = () => {
		setTitle('');
		onClose();
	};

	const submit = async (event) => {
		event.preventDefault();

		if (isBusy) {
			return;
		}

		setIsBusy(true);

		const newTemplateContent = template?.content?.raw;

		const { id } = await saveEntityRecord('postType', 'wp_template', {
			slug: cleanForSlug(title || DEFAULT_TITLE),
			content: newTemplateContent,
			title: title || DEFAULT_TITLE,
		});

		updateProduct({
			metadata: {
				...product.metadata,
				wp_template_id: id,
			},
		});

		setIsBusy(false);
		cancel();

		// __unstableSwitchToTemplateMode(true);
	};

	return (
		<Modal
			title={__('Duplicate Template', 'surecart')}
			onRequestClose={cancel}
			className="edit-post-post-template__create-modal"
		>
			<form
				className="edit-post-post-template__create-form"
				onSubmit={submit}
			>
				<VStack spacing="3">
					<TextControl
						__nextHasNoMarginBottom
						label={__('Name')}
						value={title}
						onChange={setTitle}
						placeholder={DEFAULT_TITLE}
						disabled={isBusy}
						help={__(
							'Describe the template, e.g. "T-Shirt Template". A custom template can be manually applied to any product.'
						)}
					/>
					<HStack justify="right">
						<Button variant="tertiary" onClick={cancel}>
							{__('Cancel')}
						</Button>

						<Button
							variant="primary"
							type="submit"
							isBusy={isBusy}
							aria-disabled={isBusy}
						>
							{__('Create')}
						</Button>
					</HStack>
				</VStack>
			</form>
		</Modal>
	);
}
