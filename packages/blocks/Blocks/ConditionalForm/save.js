/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { ScConditionalForm } from '@surecart/components-react';



export default function save( props ) {
  const { rule_groups } = props.attributes;

  return (
    <ScConditionalForm rule_groups={ JSON.stringify( rule_groups ) } >
      <div className='sc-conditional-from'>
        <InnerBlocks.Content />
      </div>
    </ScConditionalForm>
  )
}
