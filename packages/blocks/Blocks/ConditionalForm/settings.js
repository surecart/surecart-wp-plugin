/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor'
import {
	PanelBody,
	PanelRow,
	TextControl,
	SelectControl,
	ToggleControl,
  Button,
  Modal
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import Rules from './rules';



const Settings = ( props ) => {
  const { attributes, setAttributes } = props;
  const { condition, operator, value, rule_groups } = attributes;

  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );
  // debugger;
  let rule_data = rule_groups ? JSON.parse( rule_groups ) : [];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Conditions', 'surecart')}>
          <PanelRow>
            <div>Active Groups</div>
          </PanelRow>
          {
            rule_data.map( ( rule, r_index ) => {
              return(
                <PanelRow>
                  Group - { rule.group_id }
                </PanelRow>
              )
            } )
          }
          <PanelRow>
            <Button variant="secondary" onClick={ openModal }>
              Configure Rules
            </Button>
            { isOpen && (
                <Modal title={ __( 'Configure Rules', 'surecart' ) } onRequestClose={ closeModal } css={css`
                  width: 75%;
                  max-width: 650px;
                  max-height: 80%;
                  height: 80%;` }
                >
                    {/* <Button variant="secondary" onClick={ closeModal }>
                        My custom close button
                    </Button> */}
                  <Rules {...props}/>
                </Modal>
            ) }
          </PanelRow>
					<PanelRow>
            <SelectControl
              label={ __( 'Condition', 'surecart') }
              value={ condition }
              options={ [
                { label: 'Checkout', value: 'checkout' },
                { label: 'Product', value: 'product' },
              ] }
              onChange={ ( condition ) => setAttributes({ condition })}
              __nextHasNoMarginBottom
            />
          </PanelRow>
          <PanelRow>
            <SelectControl
              label={ __( 'Operator', 'surecart') }
              value={ operator }
              options={ [
                { label: '===', value: '===' },
                { label: '!==', value: '!==' },
              ] }
              onChange={ ( operator ) => setAttributes({ operator })}
              __nextHasNoMarginBottom
            />
          </PanelRow>
          <PanelRow>
            <SelectControl
              label={ __( 'Value', 'surecart') }
              value={ value }
              options={ [
                { label: '50', value: '50' },
                { label: '100', value: '100' },
              ] }
              onChange={ ( value ) => setAttributes({ value })}
              __nextHasNoMarginBottom
            />
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;
