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

			insertSureCartTemplates(
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

			insertSureCartTemplates(
				window?.scElementorData?.sc_product_card_template
			);
		}
	);

	// SureCart Product Pricing Widget.
	elementor.hooks.addAction(
		'panel/open_editor/widget/surecart-product-pricing',
		function (panel, model, view) {
			// Remove the default SureCart block by clearing the model.
			model.destroy();

			insertSureCartTemplates(
				window?.scElementorData?.sc_product_pricing_template
			);
		}
	);

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
}, jQuery);
