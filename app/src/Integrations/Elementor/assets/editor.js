let inertElements = [];

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
	 * When adding a SureCart Widgets, remove the default SureCart block and insert the SureCart template.
	 */
	for (const [widgetName, template] of Object.entries(
		window?.scElementorData?.templates
	)) {
		elementor.hooks.addAction(
			'panel/open_editor/widget/' + widgetName,
			function (panel, model, view) {
				// Remove the default SureCart block by clearing the model.
				model.destroy();

				// Clear the preview container if it's empty.
				maybeClearElementorPreview();

				// Insert the SureCart template.
				insertSureCartTemplate(template);
			}
		);
	}

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
	 * Opens the SureCart template modal.
	 */
	function openModal() {
		const modal = jQuery('#sc-elementor-modal-dialog');
		modal.addClass('show');

		// make other items inert
		inertElements = [];
		document
			.querySelectorAll('body > :not(#sc-elementor-modal-dialog)')
			.forEach((el) => {
				if (!el.hasAttribute('inert')) {
					el.setAttribute('inert', '');
					inertElements.push(el);
				}
			});

		// get and focus the first focusable element
		const firstFocusableElement = modal.find(
			'button, [href], input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		)[0];
		if (firstFocusableElement) {
			setTimeout(() => {
				firstFocusableElement.focus();
			}, 100);
		}
	}

	/**
	 * Closes the SureCart template modal.
	 */
	function closeModal() {
		jQuery('#sc-elementor-modal-dialog').removeClass('show');
		// remove inert attribute from all children of the document
		inertElements.forEach((el) => {
			el.removeAttribute('inert');
		});
		inertElements = [];
	}

	/**
	 * Sets up the SureCart template button in the Elementor editor.
	 */
	function setupSureCartTemplateButton() {
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
					`<# if ( 'loop-item' === elementor.documents.getCurrent()?.config?.type || 'surecart-product' === elementor.documents.getCurrent()?.config?.type ) { #><div class="elementor-add-section-area-button elementor-surecart-template-button" title="SureCart"></div><# } #>
          <div class="elementor-add-section-drag-title`
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
					openModal();
				}
			);
		});

		jQuery(document).on(
			'click',
			'#sc-elementor-modal-close, .sc-elementor-modal__overlay',
			function () {
				closeModal();
			}
		);

		jQuery(document).on('keydown', function (event) {
			console.log(event.key);
			if (event.key === 'Escape') {
				closeModal();
			}
		});

		jQuery(document).on('click', '.sc-elementor-modal__card', function () {
			closeModal();
			const templateKey = jQuery(this).data('template-key');
			insertSureCartTemplate(
				window?.scElementorData?.templates?.[templateKey]
			);
		});
	}

	// Run initially to set up the SureCart template button.
	setupSureCartTemplateButton();

	/**
	 * Show our template selection popup when the user is on a SureCart product page.
	 */
	elementor.on('document:loaded', function () {
		// document is loaded.
		if (
			'surecart-product' !==
			elementor.documents.getCurrent()?.config?.type
		) {
			return;
		}

		// If the document has elements, don't show the modal.
		if (elementor.documents.getCurrent()?.config?.elements?.length !== 0) {
			return;
		}

		// close the library.
		$e.run('library/close');

		// open our modal.
		openModal();
	});

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
		for (let element of template.elements) {
			element = generateUniqueIds(element);
			elements.push(element);
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
