jQuery(window).ready(function () {
	if (typeof elementor === 'undefined') {
		return;
	}

	// Form edit link
	elementor.channels.editor.on('surecart:form:edit', function (view) {
		let block_id = view.elementSettingsModel.get('sc_form_block');
		if (!block_id) {
			return;
		}

		let win = window.open(
			scElementorData.site_url +
				`/wp-admin/post.php?post=${block_id}&action=edit`,
			'_blank'
		);
		win.focus();
	});

	// Form create link
	elementor.channels.editor.on('surecart:form:create', function () {
		let win = window.open(
			scElementorData.site_url +
				`/wp-admin/post-new.php?post_type=sc_form`,
			'_blank'
		);
		win.focus();
	});

	/**
	 * When adding a SureCart Product Widget, replace the default block with the product element.
	 * This addresses issues with nested widgets in Elementor, ensuring state preservation on reload.
	 */
	elementor.hooks.addAction(
		'panel/open_editor/widget/surecart-product',
		function (panel, model, view) {
			// Remove the default SureCart block by clearing the model.
			model.destroy();

			// Clear the preview container if it's empty.
			maybeClearElementorPreview();

			insertSureCartTemplate(
				window?.scElementorData?.sc_product_template
			);
		}
	);

	// SureCart Product Card Widget.
	elementor.hooks.addAction(
		'panel/open_editor/widget/surecart-product-card',
		function (panel, model, view) {
			// Remove the default SureCart block by clearing the model.
			model.destroy();

			// Clear the preview container if it's empty.
			maybeClearElementorPreview();

			insertSureCartTemplate(
				window?.scElementorData?.sc_product_card_template
			);
		}
	);

	// SureCart Product Pricing Widget.
	elementor.hooks.addAction(
		'panel/open_editor/widget/surecart-product-pricing',
		function (panel, model, view) {
			model.destroy();

			insertSureCartTemplate(
				window?.scElementorData?.sc_product_pricing_template
			);
		}
	);

	/**
	 * Clears the preview container if its first container element and which is empty.
	 */
	function maybeClearElementorPreview() {
		const firstContainer =
			elementor.getPreviewContainer().document?.container?.children?.[0];

		if (
			0 === firstContainer?.children?.length &&
			firstContainer?.type === 'container'
		) {
			$e.run('document/elements/empty', {
				force: true,
			});
		}
	}

	/**
	 * Sets up the SureCart template button in the Elementor editor.
	 */
	function setupSureCartTemplateButton() {
		const documentType = elementor.config.document.type;

		const showSureCartIcon =
			documentType === 'surecart-product' || documentType === 'loop-item';

		if (!showSureCartIcon) return;

		const templateAddSection = jQuery('#tmpl-elementor-add-section');
		if (templateAddSection?.length > 0) {
			let oldTemplateButton = templateAddSection.html();
			if (
				!oldTemplateButton.includes(
					'elementor-surecart-template-button'
				)
			) {
				oldTemplateButton = oldTemplateButton.replace(
					'<div class="elementor-add-section-drag-title',
					'<div class="elementor-add-section-area-button elementor-surecart-template-button" title="SureCart"></div><div class="elementor-add-section-drag-title'
				);
				templateAddSection.html(oldTemplateButton);
			}
		}

		elementor.on('preview:loaded', function () {
			jQuery(elementor.$previewContents[0].body).on(
				'click',
				'.elementor-surecart-template-button',
				function (event) {
					event.preventDefault();
					const modal = jQuery('#sc-elementor-modal-dialog');
					modal.removeClass('show').hide().addClass('show').show();
				}
			);
		});

		jQuery(document).on('click', '#sc-elementor-modal-close', function () {
			jQuery('#sc-elementor-modal-dialog').removeClass('show').hide();
		});

		jQuery(document).on('click', '.sc-elementor-modal-card', function () {
			jQuery('#sc-elementor-modal-dialog').removeClass('show').fadeOut();

			const selectedOption = jQuery(this).attr('id');
			const templateName =
				selectedOption === 'sc-elementor-single-product-template'
					? window?.scElementorData?.sc_product_template
					: window?.scElementorData?.sc_product_card_template;
			insertSureCartTemplate(templateName);
		});
	}

	// Run initially to set up the SureCart template button.
	setupSureCartTemplateButton();

	// Re-run every time Elementor document type changes to ensure the button is set up correctly.
	elementor.channels.editor.on(
		'change:document:type',
		setupSureCartTemplateButton
	);

	function generateUniqueIds(element) {
		element.id = elementorCommon.helpers.getUniqueId();
		if (element?.elements) {
			// Recursively generate IDs for child elements.
			element.elements.forEach((childElement) => {
				generateUniqueIds(childElement);
			});
		}
		return element;
	}

	function insertSureCartTemplate(template) {
		// Generate elements with unique IDs.
		const elements = [];
		for (let contentElement of template.elements) {
			contentElement = generateUniqueIds(contentElement);
			elements.push(contentElement);
		}

		$e.run('document/elements/create', {
			container: elementor.getPreviewContainer(),
			model: {
				id: elementorCommon.helpers.getUniqueId(),
				elType: 'container',
				settings: template?.settings || {},
				elements,
			},
		});
	}
});
