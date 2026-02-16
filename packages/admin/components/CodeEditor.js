/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useRef } from '@wordpress/element';

/**
 * CodeEditor component using WordPress CodeMirror.
 * Falls back to regular textarea if CodeMirror is not available.
 *
 * @param {Object} props Component props.
 * @param {string} props.value The editor value.
 * @param {Function} props.onChange Callback when value changes.
 * @param {string} props.label Optional label for the editor.
 * @param {string} props.help Optional help text.
 * @param {string} props.mode CodeMirror mode (default: 'application/json').
 * @param {number} props.rows Number of rows for fallback textarea.
 * @param {Object} props.codemirrorOptions Additional CodeMirror options.
 */
export default function CodeEditor({
	value,
	onChange,
	label,
	help,
	mode = 'application/json',
	rows = 15,
	codemirrorOptions = {},
}) {
	const textareaRef = useRef(null);
	const codeEditorRef = useRef(null);
	const onChangeRef = useRef(onChange);

	// Keep onChange ref up to date.
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	// Initialize CodeMirror when component mounts.
	useEffect(() => {
		if (!textareaRef.current) {
			return;
		}

		// Check if wp.codeEditor is available.
		if (
			typeof window.wp === 'undefined' ||
			!window.wp.codeEditor ||
			!window.wp.codeEditor.initialize
		) {
			return; // Fallback to regular textarea
		}

		// Build editor settings.
		const defaultSettings = window.wp.codeEditor.defaultSettings || {};
		const editorSettings = {
			...defaultSettings,
			codemirror: {
				...defaultSettings.codemirror,
				mode,
				lineNumbers: true,
				lineWrapping: true,
				indentUnit: 2,
				tabSize: 2,
				indentWithTabs: false,
				gutters: ['CodeMirror-lint-markers'],
				lint: true,
				...codemirrorOptions,
			},
		};

		const editor = window.wp.codeEditor.initialize(
			textareaRef.current,
			editorSettings
		);

		codeEditorRef.current = editor;

		// Update parent when CodeMirror content changes.
		editor.codemirror.on('change', () => {
			onChangeRef.current(editor.codemirror.getValue());
		});

		// Cleanup function.
		return () => {
			if (codeEditorRef.current) {
				codeEditorRef.current.codemirror.toTextArea();
				codeEditorRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode]);

	// Update CodeMirror content when value changes externally.
	useEffect(() => {
		if (
			codeEditorRef.current &&
			codeEditorRef.current.codemirror &&
			codeEditorRef.current.codemirror.getValue() !== value
		) {
			codeEditorRef.current.codemirror.setValue(value);
		}
	}, [value]);

	return (
		<div
			css={css`
				.CodeMirror {
					height: auto;
					min-height: 400px;
					border: 1px solid var(--sc-color-gray-300);
					border-radius: var(--sc-border-radius-small);
				}
				.CodeMirror-scroll {
					min-height: 400px;
				}
			`}
		>
			{label && (
				<label
					css={css`
						display: block;
						margin-bottom: 0.5em;
						font-weight: var(--sc-font-weight-semibold);
						font-size: var(--sc-font-size-medium);
					`}
				>
					{label}
				</label>
			)}
			<textarea
				ref={textareaRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				rows={rows}
				css={css`
					width: 100%;
					font-family: monospace;
					font-size: 0.875em;
				`}
			/>
			{help && (
				<p
					css={css`
						margin-top: 0.5em;
						margin-bottom: 0;
						color: var(--sc-color-gray-600);
						font-size: var(--sc-font-size-small);
					`}
				>
					{help}
				</p>
			)}
		</div>
	);
}

