import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

export default () => {
	const blockProps = useBlockProps();

	const dummyOptionsDefault = [
		{ label: 'First First Option Option', value: 'first-option' },
		{ label: 'Second Option', value: 'second-option' },
		{ label: 'Third Option', value: 'third-option' },
		{ label: 'Fourth Option', value: 'fourth-option' },
		{ label: 'Fifth Option', value: 'fifth-option' },
	];

	const [dummyOptions, setDummyOptions] = useState(dummyOptionsDefault);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(dummyOptions[0] || {});

	useEffect(() => {
		// remove selected item from options.
		const newOptions = dummyOptionsDefault.filter(
			(option) => option.value !== selectedItem.value
		);
		setDummyOptions(newOptions);
	}, [dummyOptions]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const selectItem = (option) => {
		setSelectedItem(option);
		setIsMenuOpen(false);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<div className="sc-dropdown">
			<button
				className="sc-dropdown__trigger button button--standard button--medium button--default button--caret button--has-label"
				onClick={toggleMenu}
			>
				<span className="button__label">{selectedItem.label}</span>
				<span className="button__caret">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</span>
			</button>
			{isMenuOpen && (
				<div className={'sc-dropdown__panel'}>
					{dummyOptions.map((option) => (
						<div
							key={option.value}
							className="sc-dropdown__menu-item"
							onClick={() => selectItem(option)}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
