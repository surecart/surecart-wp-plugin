/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { ScConditionalForm } from '@surecart/components-react';



export default function save( props ) {
  const { rule_groups } = props.attributes;

  // <ScConditionalForm id="sc-conditional-form-1" rule_groups={ JSON.stringify( rule_groups ) } >
  return (
    <ScConditionalForm id="sc-conditional-form-1" >
      <div className='sc-conditional-from'>
        <InnerBlocks.Content />
      </div>
    </ScConditionalForm>
  )
}
