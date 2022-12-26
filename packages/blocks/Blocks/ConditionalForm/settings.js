/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
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
  const { attributes, setAttributesm } = props;
  const { rule_groups } = attributes;

  const formId = 'sc-rules-group-' + Math.random().toString( 36 ).substring( 2, 5 );

  props.formId = formId;

  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );

  props.closeModal = closeModal;

  let rule_data = rule_groups ? rule_groups : [];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Conditions', 'surecart')}>
          <PanelRow>
            <div>{ __( 'Active Groups', 'surecart' ) }</div>
          </PanelRow>
          {
            rule_data.map( ( rule ) => {
              return(
                <PanelRow>
                  { sprintf( __( 'Group - %s', 'surecart' ), rule.group_id ) }

                </PanelRow>
              )
            } )
          }
          <PanelRow>
            <Button variant="secondary" onClick={ openModal }>
              { __( 'Configure Rules', 'surecart' ) }
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
