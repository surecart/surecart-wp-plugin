import { registerPlugin } from '@wordpress/plugins';
import Panel from './Panel';

registerPlugin('plugin-document-setting-panel-demo', {
	render: Panel,
});
