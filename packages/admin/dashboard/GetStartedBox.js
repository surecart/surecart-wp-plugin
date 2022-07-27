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
		<div>
            <ScTag type={infoType} style={{'--sc-tag-primary-background-color': '#f3e8ff','--sc-tag-primary-color': '#6b21a8'}}>{infoText}</ScTag>
            <p className='sc-getstarted-box-title'>{title}</p>
            <p className='sc-getstarted-box-descritions'>{description}</p>
            <ScButton type="primary" href={buttonUrl} style={{"--primary-background": "#002529"}}>{buttonLabel} &#8594;</ScButton>
        </div>
	);
};
