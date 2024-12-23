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

	const templateAddSection = jQuery('#tmpl-elementor-add-section');
	if (0 < templateAddSection.length) {
		var oldTemplateButton = templateAddSection.html();
		oldTemplateButton = oldTemplateButton.replace(
			'<div class="elementor-add-section-drag-title',
			'<div class="elementor-add-section-area-button elementor-surecart-template-button" title="SureCart"></div><div class="elementor-add-section-drag-title'
		);
		templateAddSection.html(oldTemplateButton);
	}

	elementor.on('preview:loaded', function (e) {
		jQuery(elementor.$previewContents[0].body).on(
			'click',
			'.elementor-surecart-template-button',
			function () {
				$e.route('library/templates/my-templates');

				// setTimeout(() => {
				// 	jQuery('#elementor-template-library-filter-text').val('SureCart');
				// }, 50);
			}
		);
	});

	/**
	 * When adding a SureCart Product Widget, replace the default block with the product element.
	 * This addresses issues with nested widgets in Elementor, ensuring state preservation on reload.
	 */
	elementor.hooks.addAction(
		'panel/open_editor/widget/surecart-product',
		function (panel, model, view) {
			const productElement = window?.scElementorData?.sc_product_template;
			const container = elementor.getPreviewContainer();

			// Remove the default SureCart block by clearing the model.
			model.destroy();

			const at = container.view.collection.length - 1 || 0;

			// Insert the product element content into the editor.
			productElement.content.forEach((contentElement) => {
				$e.run('document/elements/create', {
					container,
					model: contentElement,
					options: { at },
				});
			});

			$e.run('document/elements/settings', {
				container,
				settings: productElement.page_settings,
				options: {
					external: true,
				},
			});
		}
	);
}, jQuery);
