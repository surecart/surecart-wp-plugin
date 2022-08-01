/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScTag, ScButton } from '@surecart/components-react';

export default ({
    infoType,
    infoText,
	title,
	description,
    buttonLabel,
    buttonUrl,
}) => {
	return (
		<div
            css={css`
                .sc-getstarted-box-title {
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 28px;
                    color: #334155;
                    margin: 0.4em 0;    
                }
                .sc-getstarted-box-descritions {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 28px;
                    color: #334155;
                    margin: 0.4em 0 1em 0;   
                }
            `}
        >
            <ScTag type={infoType} style={{'--sc-tag-primary-background-color': '#f3e8ff','--sc-tag-primary-color': '#6b21a8'}}>{infoText}</ScTag>
            <p className='sc-getstarted-box-title'>{title}</p>
            <p className='sc-getstarted-box-descritions'>{description}</p>
            <ScButton type="primary" href={buttonUrl} style={{"--primary-background": "#002529"}}>{buttonLabel} &#8594;</ScButton>
        </div>
	);
};
