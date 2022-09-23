/**
 * WordPress dependencies.
 */
 import { InnerBlocks } from '@wordpress/block-editor';

 export default ({ attributes }) => {
	const { label } = attributes;
	 return (
		 <sc-radio-group label={label}>
			 <div>
				 <InnerBlocks.Content />
			 </div>
		 </sc-radio-group>
	 );
 };
 