let inertElements = [];
let currentDocType = '';

jQuery(window).ready(function () {
	if (typeof elementor === 'undefined') {
		return;
	}

	// Form edit link
	elementor.channels.editor.on('surecart:form:edit', function (view) {
		let block_id = view?.container?.settings?.get('sc_form_block');

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
	for (const template of Object.values(
		window?.scElementorData?.templates || {}
	)) {
		const widgetName = template?.widget_name || '';
		if (!widgetName) {
			continue;
		}

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
	 * Filter templates by document type and set empty state message.
	 *
	 * @param {jQuery} modal - The modal element
	 */
	function filterTemplatesAndSetEmptyState(modal) {
		// Apply document type class for CSS filtering.
		const docType = elementor.documents.getCurrent()?.config?.type || '';
		currentDocType = docType;
		modal.removeClass('surecart-product loop-item').addClass(docType);

		// Get translation strings.
		const i18n = window?.scElementorData?.i18n || {};

		// Document type to template type mapping.
		const docTypeMapping = {
			'surecart-product': {
				templateType: 'product-form',
				emptyMessage: i18n?.no_product_form_templates,
			},
			'loop-item': {
				templateType: 'product-card',
				emptyMessage: i18n?.no_product_card_templates,
			},
		};

		// Set empty state message based on document type.
		const cardContainer = modal.find('.sc-elementor-modal__card-container');
		const config = docTypeMapping[docType] || {
			emptyMessage: i18n?.no_templates,
		};
		cardContainer.attr('data-empty-message', config.emptyMessage);

		// Filter templates if we have a mapping for this document type.
		if (config.templateType) {
			modal.find('.sc-elementor-modal__card').each(function () {
				const templateType = jQuery(this).data('template-type') || '';
				jQuery(this).toggle(templateType === config.templateType);
			});
		}

		// Check for visible templates after filtering and show empty state if needed.
		setTimeout(() => {
			const visibleTemplates = modal.find(
				'.sc-elementor-modal__card:visible'
			).length;
			if (visibleTemplates === 0) {
				// Instead of emptying the container, add a message element.
				if (!cardContainer.find('.sc-elementor-empty-state').length) {
					const emptyMessage =
						cardContainer.attr('data-empty-message');
					cardContainer.html(
						`<div class="sc-elementor-empty-state">${emptyMessage}</div>`
					);
				}
			} else {
				// Remove any existing empty state message.
				cardContainer.find('.sc-elementor-empty-state').remove();
			}
		}, 100);
	}

	/**
	 * Opens the SureCart template modal.
	 */
	function openModal() {
		const modal = jQuery('#sc-elementor-modal-dialog');
		modal.addClass('show');

		// Filter templates and set empty state message.
		filterTemplatesAndSetEmptyState(modal);

		// Make other items inert.
		inertElements = [];
		document
			.querySelectorAll('body > :not(#sc-elementor-modal-dialog)')
			.forEach((el) => {
				if (!el.hasAttribute('inert')) {
					el.setAttribute('inert', '');
					inertElements.push(el);
				}
			});

		// Get and focus the first focusable element.
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
			if (event.key === 'Escape') {
				closeModal();
			}
		});

		jQuery(document).on('click', '.sc-elementor-modal__card', function () {
			// Check if the template is valid for current document type
			const templateType = jQuery(this).data('template-type') || '';
			const isValidTemplate =
				(currentDocType === 'surecart-product' &&
					templateType === 'product-form') ||
				(currentDocType === 'loop-item' &&
					templateType === 'product-card') ||
				!currentDocType ||
				!templateType;

			if (!isValidTemplate) {
				return;
			}

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

		// Check if we have the new structure with content property or the old structure
		const templateContent = template.content || template;

		if (!templateContent || !templateContent.elements) {
			console.error('Invalid template structure:', template);
			return;
		}

		for (let element of templateContent.elements) {
			element = generateUniqueIds(element);
			elements.push(element);
		}

		$e.run('document/elements/create', {
			container: elementor.getPreviewContainer(),
			model: {
				id: elementorCommon.helpers.getUniqueId(),
				elType: 'container',
				settings: templateContent?.settings || {},
				elements,
			},
		});

		// If there are outer elements, create a new container for them and add them.
		// This is useful for templates that have outer elements like extra sections or containers.
		if (templateContent.outer_elements) {
			$e.run('document/elements/create', {
				container: elementor.getPreviewContainer(),
				model: {
					id: elementorCommon.helpers.getUniqueId(),
					elType: 'container',
					elements: templateContent.outer_elements.map((element) => {
						element = generateUniqueIds(element);
						return element;
					}),
				},
			});
		}
	}
});
