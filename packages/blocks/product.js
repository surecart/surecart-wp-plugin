import * as BuyButtons from './Blocks/Product/BuyButtons';
import * as Description from './Blocks/Product/Description';
import * as Media from './Blocks/Product/Media';
import * as Info from './Blocks/Product/Info';
import * as Price from './Blocks/Product/Price';
import * as Quantity from './Blocks/Product/Quantity';
import * as Title from './Blocks/Product/Title';
import * as PriceChoices from './Blocks/Product/PriceChoices';
import { registerBlocks } from './register-block';
import { __ } from '@wordpress/i18n';

// import './plugins/product-panel';
// import './plugins/toolbar-button';

window.setTimeout(() => {
	// Delaying autosaves we avoid creating drafts to remote
	const settings = window.wp.data.select('core/editor').getEditorSettings();
	settings.autosaveInterval = 60 * 60 * 24 * 7; // Let's wait a week for it to autosave.
	window.wp.data.dispatch('core/editor').updateEditorSettings(settings);
}, 0);
// We need to return a string or null, otherwise executing this script will error.
// eslint-disable-next-line no-unused-expressions
('');

registerBlocks([
	Info,
	BuyButtons,
	Quantity,
	Title,
	Media,
	Description,
	Price,
	PriceChoices,
]);
