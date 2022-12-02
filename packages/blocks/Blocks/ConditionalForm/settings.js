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
  const { rule_groups } = attributes;

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
                  max-height: 80%;` }
                >
                  <Rules {...props}/>
                </Modal>
            ) }
          </PanelRow>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;
