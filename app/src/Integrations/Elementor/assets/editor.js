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

	elementor.hooks.addAction(
		'panel/open_editor/widget/surecart-shop',
		function (panel, model, view) {
			// Remove the default SureCart block by clearing the model.
			model.destroy();

			insertSureCartTemplates(
				window?.scElementorData?.sc_shop_page_template,
				model
			);
		}
	);

	function insertSureCartTemplates(template) {
		const container = elementor.getPreviewContainer();

		const at = container.view.collection.length - 1 || 0;

		// Insert the product element content into the editor.
		template.content.forEach((contentElement) => {
			$e.run('document/elements/create', {
				container,
				model: contentElement,
				options: { at },
			});
		});

		$e.run('document/elements/settings', {
			container,
			settings: template.page_settings,
			options: {
				external: true,
			},
		});
	}
}, jQuery);
