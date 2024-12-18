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

	elementor.on('preview:loaded', function () {
		jQuery(elementor.$previewContents[0].body).on(
			'click',
			'.elementor-surecart-template-button',
			function (event) {
				// $e.run('library/open', { toDefault: true });
				$e.route( 'library/templates/my-templates' );

				// setTimeout(() => {
				// 	jQuery('#elementor-template-library-filter-text').val('SureCart');
				// }, 50);
			}
		);
	});
}, jQuery);
