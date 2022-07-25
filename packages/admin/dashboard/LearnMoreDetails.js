export default ({title, descriptions}) => {
	return (
		<div className="sc-learn-details">
            <p className='sc-learn-details-title'>
                {title}
            </p>
            <p className='sc-learn-details-desc'>
                {descriptions}
            </p>
        </div>  
	);
};
