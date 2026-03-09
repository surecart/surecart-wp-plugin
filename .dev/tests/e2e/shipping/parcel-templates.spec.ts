/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { PARCEL_TEMPLATE_API_PATH } from '../request-utils/endpoints';
import { create as createAccount } from '../provisional-account';

const SHIPPING_SETTINGS_URL =
	'/wp-admin/admin.php?page=sc-settings&tab=shipping_protocol';

/**
 * Helper to get the parcel dialog by mode.
 */
const getParcelDialog = (page, mode: 'add' | 'edit' = 'add') => {
	const label =
		mode === 'edit' ? 'Edit Parcel Template' : 'Add New Parcel Template';
	return page.locator(`sc-dialog[label="${label}"]`);
};

/**
 * Helper to fill in the parcel template form fields.
 * Uses `sc-input input` to target the native input inside Stencil web components.
 */
const fillParcelForm = async (
	page,
	dialog,
	{
		name,
		weight,
		length,
		width,
		height,
	}: {
		name: string;
		weight?: string;
		length?: string;
		width?: string;
		height?: string;
	}
) => {
	// Fill name — target the native <input> inside the sc-input web component.
	const nameInput = dialog.locator('sc-input[name="parcel-name"] input');
	await nameInput.fill(name);

	// Fill dimensions if provided.
	if (length) {
		await dialog
			.locator('sc-input[label="Length"] input')
			.fill(length);
	}
	if (width) {
		await dialog.locator('sc-input[label="Width"] input').fill(width);
	}
	if (height) {
		await dialog
			.locator('sc-input[label="Height"] input')
			.fill(height);
	}

	// Fill weight if provided.
	if (weight) {
		const weightInput = dialog.locator('sc-input[label="Weight"] input');
		await weightInput.fill(weight);
	}
};

/**
 * Helper to click edit/delete/set-as-default on a specific row.
 */
const clickRowAction = async (
	page,
	rowText: string,
	action: 'Edit' | 'Delete' | 'Set as Default'
) => {
	const row = page
		.locator('sc-stacked-list-row')
		.filter({ hasText: rowText });
	await row.locator('sc-button[circle]').click();
	await row.locator('sc-menu-item').filter({ hasText: action }).click();
};

/**
 * Helper to clean up all parcel templates via API.
 */
const deleteAllParcelTemplates = async (requestUtils) => {
	try {
		const response = await requestUtils.rest({
			method: 'GET',
			path: PARCEL_TEMPLATE_API_PATH,
		});

		const items = response?.data || response || [];
		for (const template of items) {
			if (template?.id) {
				await requestUtils.rest({
					method: 'DELETE',
					path: `${PARCEL_TEMPLATE_API_PATH}/${template.id}`,
				});
			}
		}
	} catch (e) {
		console.warn('Parcel template cleanup failed:', e);
	}
};

test.describe('Parcel Templates', () => {
	test.beforeEach(async ({ requestUtils }) => {
		await createAccount(requestUtils);
		await deleteAllParcelTemplates(requestUtils);
	});

	test.afterEach(async ({ requestUtils }) => {
		await deleteAllParcelTemplates(requestUtils);
	});

	test('Should render the Parcel Templates section', async ({ page }) => {
		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		// Check that the section title is visible (use getByLabel to avoid strict mode violation).
		await expect(page.getByLabel('Parcel Templates')).toBeVisible();

		// Check that the empty state is visible (allow extra time for cleanup to propagate).
		await expect(
			page.getByText(
				'No parcel templates yet. Create one to get started.'
			)
		).toBeVisible({ timeout: 15000 });

		// Check that the Add button is visible.
		await expect(page.getByText('Add New Template')).toBeVisible();
	});

	test('Should create a new parcel template', async ({ page }) => {
		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		// Click Add New Template button.
		await page.getByText('Add New Template').click();

		// Get the dialog.
		const dialog = getParcelDialog(page, 'add');
		await expect(dialog).toHaveAttribute('open', '');

		// Fill the form.
		await fillParcelForm(page, dialog, {
			name: 'Small Box',
			length: '12',
			width: '10',
			height: '8',
			weight: '2',
		});

		// Submit the form.
		await dialog.locator('sc-button[type="primary"]').click();

		// Verify the template appears in the list (dialog unmounts on close).
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Small Box' })
		).toBeVisible({ timeout: 15000 });
	});

	test('Should edit a parcel template', async ({ page, requestUtils }) => {
		// Create a template via API first.
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Original Box',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '3',
				weight_unit: 'lb',
				default: false,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		// Wait for the row to appear.
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Original Box' })
		).toBeVisible({ timeout: 15000 });

		// Click Edit.
		await clickRowAction(page, 'Original Box', 'Edit');

		// Get the edit dialog.
		const dialog = getParcelDialog(page, 'edit');
		await expect(dialog).toHaveAttribute('open', '');

		// Update the name.
		await fillParcelForm(page, dialog, {
			name: 'Updated Box',
		});

		// Submit.
		await dialog.locator('sc-button[type="primary"]').click();

		// Verify the updated name appears (dialog unmounts on close).
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Updated Box' })
		).toBeVisible({ timeout: 15000 });
	});

	test('Should delete a non-default parcel template', async ({
		page,
		requestUtils,
	}) => {
		// Create a non-default template via API first.
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Delete Me Box',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '1',
				weight_unit: 'lb',
				default: false,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		// Wait for the row to appear.
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Delete Me Box' })
		).toBeVisible({ timeout: 15000 });

		// Click Delete (opens confirmation dialog).
		await clickRowAction(page, 'Delete Me Box', 'Delete');

		// Confirm deletion in the dialog.
		const confirmDialog = page.locator(
			'sc-dialog[label="Delete Parcel Template"]'
		);
		await expect(confirmDialog).toHaveAttribute('open', '');
		await confirmDialog.locator('sc-button[type="primary"]').click();

		// Verify the template is removed.
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Delete Me Box' })
		).not.toBeVisible({ timeout: 15000 });
	});

	test('Should show default tag for default template', async ({
		page,
	}) => {
		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		// Create a template via the UI with default toggle ON.
		await page.getByText('Add New Template').click();
		const dialog = getParcelDialog(page, 'add');
		await expect(dialog).toHaveAttribute('open', '');

		await fillParcelForm(page, dialog, {
			name: 'Default Parcel',
			length: '10',
			width: '8',
			height: '6',
			weight: '2',
		});

		// Toggle the default switch ON.
		await dialog.locator('sc-switch').click();

		// Submit.
		await dialog.locator('sc-button[type="primary"]').click();

		// Verify the row appears with the Default tag.
		const row = page
			.locator('sc-stacked-list-row')
			.filter({ hasText: 'Default Parcel' });
		await expect(row).toBeVisible({ timeout: 15000 });
		await expect(row.locator('sc-tag')).toContainText('Default', {
			timeout: 10000,
		});
	});

	test('Should toggle parcel type between Box and Polymailer', async ({
		page,
	}) => {
		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		// Open the add dialog.
		await page.getByText('Add New Template').click();
		const dialog = getParcelDialog(page, 'add');
		await expect(dialog).toHaveAttribute('open', '');

		// By default, "Box or Tube" should be selected and height should be visible.
		const heightInput = dialog.locator('sc-input[label="Height"]');
		await expect(heightInput).toBeVisible();

		// Switch to Polymailer — use role-based selector for the toggle option.
		await dialog
			.getByRole('radio', { name: 'Polymailer (Envelope)' })
			.click();

		// Height should be hidden for Polymailer.
		await expect(heightInput).not.toBeVisible();

		// Switch back to Box.
		await dialog.getByRole('radio', { name: 'Box or Tube' }).click();

		// Height should be visible again.
		await expect(heightInput).toBeVisible();
	});

	test('Should display multiple templates in a list', async ({ page }) => {
		// Create first template via UI to avoid back-to-back API race conditions.
		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		await page.getByText('Add New Template').click();
		const dialog1 = getParcelDialog(page, 'add');
		await expect(dialog1).toHaveAttribute('open', '');
		await fillParcelForm(page, dialog1, {
			name: 'Small Box',
			length: '12',
			width: '10',
			height: '8',
			weight: '1',
		});
		await dialog1.locator('sc-button[type="primary"]').click();
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Small Box' })
		).toBeVisible({ timeout: 15000 });

		// Create second template via UI.
		await page.getByText('Add New Template').click();
		const dialog2 = getParcelDialog(page, 'add');
		await expect(dialog2).toHaveAttribute('open', '');
		// Switch to Polymailer.
		await dialog2
			.getByRole('radio', { name: 'Polymailer (Envelope)' })
			.click();
		await fillParcelForm(page, dialog2, {
			name: 'Large Envelope',
			length: '15',
			width: '12',
			weight: '1',
		});
		await dialog2.locator('sc-button[type="primary"]').click();

		// Verify both templates appear.
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Small Box' })
		).toBeVisible({ timeout: 15000 });
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Large Envelope' })
		).toBeVisible({ timeout: 15000 });
	});

	test('Should pre-populate polymailer type and hide height in Edit modal', async ({
		page,
		requestUtils,
	}) => {
		// Create a polymailer template via API.
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'My Polymailer',
				package_type: 'poly_mailer',
				dimensions: {
					length: '15',
					width: '12',
					unit: 'in',
				},
				weight: '0.5',
				weight_unit: 'lb',
				default: false,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'My Polymailer' })
		).toBeVisible({ timeout: 15000 });

		// Open Edit modal.
		await clickRowAction(page, 'My Polymailer', 'Edit');
		const dialog = getParcelDialog(page, 'edit');
		await expect(dialog).toHaveAttribute('open', '');

		// Polymailer radio should be selected.
		await expect(
			dialog.getByRole('radio', { name: 'Polymailer (Envelope)' })
		).toBeChecked();

		// Height input should be hidden.
		await expect(
			dialog.locator('sc-input[label="Height"]')
		).not.toBeVisible();
	});

	test('Should pre-populate all fields in Edit modal', async ({
		page,
		requestUtils,
	}) => {
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Full Box',
				package_type: 'box',
				dimensions: {
					length: '20',
					width: '15',
					height: '10',
					unit: 'in',
				},
				weight: 5,
				weight_unit: 'lb',
				default: false,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Full Box' })
		).toBeVisible({ timeout: 15000 });

		await clickRowAction(page, 'Full Box', 'Edit');
		const dialog = getParcelDialog(page, 'edit');
		await expect(dialog).toHaveAttribute('open', '');

		// Verify each field.
		await expect(
			dialog.locator('sc-input[name="parcel-name"] input')
		).toHaveValue('Full Box');
		await expect(
			dialog.locator('sc-input[label="Length"] input')
		).toHaveValue('20');
		await expect(
			dialog.locator('sc-input[label="Width"] input')
		).toHaveValue('15');
		await expect(
			dialog.locator('sc-input[label="Height"] input')
		).toHaveValue('10');
		await expect(
			dialog.locator('sc-input[label="Weight"] input')
		).toHaveValue('5');
		await expect(
			dialog.getByRole('radio', { name: 'Box or Tube' })
		).toBeChecked();
	});

	test('Should cancel delete and keep the template', async ({
		page,
		requestUtils,
	}) => {
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Keep Me Box',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '1',
				weight_unit: 'lb',
				default: false,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Keep Me Box' })
		).toBeVisible({ timeout: 15000 });

		// Click Delete to open confirmation dialog.
		await clickRowAction(page, 'Keep Me Box', 'Delete');
		const confirmDialog = page.locator(
			'sc-dialog[label="Delete Parcel Template"]'
		);
		await expect(confirmDialog).toHaveAttribute('open', '');

		// Click Cancel (use getByText to avoid strict mode violation with multiple text buttons).
		await confirmDialog.getByText('Cancel').click();

		// Template should still be in the list.
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Keep Me Box' })
		).toBeVisible();
	});

	test('Should show different icons for Box and Polymailer', async ({
		page,
		requestUtils,
	}) => {
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Icon Box',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '1',
				weight_unit: 'lb',
				default: false,
			},
		});
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Icon Envelope',
				package_type: 'poly_mailer',
				dimensions: {
					length: '15',
					width: '12',
					unit: 'in',
				},
				weight: '0.5',
				weight_unit: 'lb',
				default: false,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		const boxRow = page
			.locator('sc-stacked-list-row')
			.filter({ hasText: 'Icon Box' });
		const envelopeRow = page
			.locator('sc-stacked-list-row')
			.filter({ hasText: 'Icon Envelope' });

		await expect(boxRow).toBeVisible({ timeout: 15000 });
		await expect(envelopeRow).toBeVisible({ timeout: 15000 });

		// Box should use "package" icon, polymailer should use "mail" icon.
		await expect(boxRow.locator('sc-icon[name="package"]')).toBeVisible();
		await expect(
			envelopeRow.locator('sc-icon[name="mail"]')
		).toBeVisible();
	});

	test('Should create a polymailer without height', async ({ page }) => {
		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		await page.getByText('Add New Template').click();
		const dialog = getParcelDialog(page, 'add');
		await expect(dialog).toHaveAttribute('open', '');

		// Switch to Polymailer.
		await dialog
			.getByRole('radio', { name: 'Polymailer (Envelope)' })
			.click();

		// Fill form without height.
		await fillParcelForm(page, dialog, {
			name: 'Flat Mailer',
			length: '15',
			width: '12',
			weight: '0.3',
		});

		// Submit.
		await dialog.locator('sc-button[type="primary"]').click();

		// Verify it appears in the list.
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Flat Mailer' })
		).toBeVisible({ timeout: 15000 });
	});

	test('Should accept decimal weight values', async ({ page }) => {
		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		await page.getByText('Add New Template').click();
		const dialog = getParcelDialog(page, 'add');
		await expect(dialog).toHaveAttribute('open', '');

		await fillParcelForm(page, dialog, {
			name: 'Decimal Weight Box',
			length: '10',
			width: '8',
			height: '6',
			weight: '2.5',
		});

		// Submit.
		await dialog.locator('sc-button[type="primary"]').click();

		// Verify it appears in the list with the decimal weight.
		const row = page
			.locator('sc-stacked-list-row')
			.filter({ hasText: 'Decimal Weight Box' });
		await expect(row).toBeVisible({ timeout: 15000 });
		await expect(row).toContainText('2.5');
	});

	test('Should accept decimal dimension values', async ({ page }) => {
		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		await page.getByText('Add New Template').click();
		const dialog = getParcelDialog(page, 'add');
		await expect(dialog).toHaveAttribute('open', '');

		await fillParcelForm(page, dialog, {
			name: 'Decimal Dims Box',
			length: '10.5',
			width: '8.25',
			height: '6.75',
			weight: '2',
		});

		// Submit.
		await dialog.locator('sc-button[type="primary"]').click();

		// Verify it appears in the list with decimal dimensions.
		const row = page
			.locator('sc-stacked-list-row')
			.filter({ hasText: 'Decimal Dims Box' });
		await expect(row).toBeVisible({ timeout: 15000 });
		await expect(row).toContainText('10.5');
	});

	test('Should hide delete option for default template', async ({
		page,
		requestUtils,
	}) => {
		// Create a default template via API.
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Default Box',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '1',
				weight_unit: 'lb',
				default: true,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		const row = page
			.locator('sc-stacked-list-row')
			.filter({ hasText: 'Default Box' });
		await expect(row).toBeVisible({ timeout: 15000 });

		// Open the 3-dot menu.
		await row.locator('sc-button[circle]').click();

		// Edit should be visible, Delete should not.
		await expect(
			row.locator('sc-menu-item').filter({ hasText: 'Edit' })
		).toBeVisible();
		await expect(
			row.locator('sc-menu-item').filter({ hasText: 'Delete' })
		).not.toBeVisible();
	});

	test('Should show Set as Default for non-default templates', async ({
		page,
		requestUtils,
	}) => {
		// Create a non-default template via API.
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Regular Box',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '1',
				weight_unit: 'lb',
				default: false,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		const row = page
			.locator('sc-stacked-list-row')
			.filter({ hasText: 'Regular Box' });
		await expect(row).toBeVisible({ timeout: 15000 });

		// Open the 3-dot menu.
		await row.locator('sc-button[circle]').click();

		// "Set as Default" should be visible for non-default templates.
		await expect(
			row.locator('sc-menu-item').filter({ hasText: 'Set as Default' })
		).toBeVisible();
	});

	test('Should hide default toggle when editing default template', async ({
		page,
		requestUtils,
	}) => {
		// Create a default template via API.
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'Default Template',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '1',
				weight_unit: 'lb',
				default: true,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'Default Template' })
		).toBeVisible({ timeout: 15000 });

		// Open Edit modal.
		await clickRowAction(page, 'Default Template', 'Edit');
		const dialog = getParcelDialog(page, 'edit');
		await expect(dialog).toHaveAttribute('open', '');

		// Default toggle should be hidden when editing a default template.
		await expect(dialog.locator('sc-switch')).not.toBeVisible();
	});

	test('Should sort default template to top of list', async ({
		page,
		requestUtils,
	}) => {
		// Create a non-default template first.
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'AAA First Alphabetically',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '1',
				weight_unit: 'lb',
				default: false,
			},
		});

		// Create a default template second.
		await requestUtils.rest({
			method: 'POST',
			path: PARCEL_TEMPLATE_API_PATH,
			data: {
				name: 'ZZZ Default Box',
				package_type: 'box',
				dimensions: {
					length: '10',
					width: '8',
					height: '6',
					unit: 'in',
				},
				weight: '1',
				weight_unit: 'lb',
				default: true,
			},
		});

		await page.goto(SHIPPING_SETTINGS_URL);
		await page.waitForLoadState('networkidle');

		// Wait for both rows to appear.
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'ZZZ Default Box' })
		).toBeVisible({ timeout: 15000 });
		await expect(
			page
				.locator('sc-stacked-list-row')
				.filter({ hasText: 'AAA First Alphabetically' })
		).toBeVisible({ timeout: 15000 });

		// The default template should be the first row.
		const firstRow = page.locator('sc-stacked-list-row').first();
		await expect(firstRow).toContainText('ZZZ Default Box');
	});
});
