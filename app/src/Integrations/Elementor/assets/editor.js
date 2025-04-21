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

	// SureCart Product Pricing Widget.
	elementor.hooks.addAction(
		'panel/open_editor/widget/surecart-product-pricing',
		function (panel, model, view) {
			model.destroy();

			insertSureCartTemplates(
				window?.scElementorData?.sc_product_pricing_template
			);
		}
	);

	const templateAddSection = jQuery('#tmpl-elementor-add-section');
	if (0 < templateAddSection.length) {
		var oldTemplateButton = templateAddSection.html();
		oldTemplateButton = oldTemplateButton.replace(
			'<div class="elementor-add-section-drag-title',
			'<div class="elementor-add-section-area-button elementor-surecart-template-button" title="SureCart"></div><div class="elementor-add-section-drag-title'
		);
		templateAddSection.html(oldTemplateButton);
	}

	elementor.on('preview:loaded', function () {
		jQuery(elementor.$previewContents[0].body).on(
			'click',
			'.elementor-surecart-template-button',
			function (event) {
				event.preventDefault();
				const modal = jQuery('#sc-elementor-modal-dialog');

				// Reset and show the modal
				modal.removeClass('show').hide();
				modal.addClass('show').show();
			}
		);
	});

	// Close dialog on close button click
	jQuery(document).on('click', '#sc-elementor-modal-close', function () {
		const modal = jQuery('#sc-elementor-modal-dialog');
		modal.removeClass('show').hide();
	});

	// Handle card click events
	jQuery(document).on('click', '.sc-elementor-modal-card', function () {
		const modal = jQuery('#sc-elementor-modal-dialog');
		modal.removeClass('show').fadeOut();

		const selectedOption = jQuery(this).attr('id');
		if (selectedOption === 'sc-elementor-single-product-template') {
			insertSureCartTemplates(
				window?.scElementorData?.sc_product_template
			);
		} else if (selectedOption === 'sc-elementor-product-card-template') {
			insertSureCartTemplates(
				window?.scElementorData?.sc_product_card_template
			);
		}
	});

	function insertSureCartTemplates(template) {
		// Get the active container - either the one being dragged into or the selected one
		const container =
			elementor.channels.data.request('container:active') ||
			elementor.getPreviewView().getContainer();

		// Get the insertion index based on the drop location or selected element
		const dropLocation = elementor.channels.data.request('drop-location');
		const selectedElement = elementor.selection.getElements()[0];

		let at;
		if (dropLocation) {
			// If we have a drop location, use that
			at = dropLocation.index;
		} else if (selectedElement) {
			// If we have a selected element, insert after it
			at = container.view.collection.indexOf(selectedElement.model);
		} else {
			// Default to beginning of container
			at = 0;
		}

		// Insert the product element content into the editor.
		template.content.forEach((contentElement) => {
			$e.run('document/elements/create', {
				container,
				model: contentElement,
				options: { at },
			});

			// Increment the index to ensure elements are added in the correct order.
			at++;
		});

		// Apply the page settings only to the newly inserted elements
		const newElements = container.view.collection.slice(
			at - template.content.length,
			at
		);
		newElements.forEach((element) => {
			$e.run('document/elements/settings', {
				container: element,
				settings: template.page_settings,
				options: {
					external: true,
				},
			});
		});
	}
});
