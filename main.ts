import { EditorPosition, Plugin } from "obsidian";

function findParagraphStart(cursor: EditorPosition, lines: string[]) {
	let paragraphStart = cursor.line;

	let flag = false;
	while (paragraphStart > 0) {
		if (lines[paragraphStart].trim() === "" && flag) {
			break;
		}
		if (lines[paragraphStart].trim() !== "" && !flag) {
			flag = true;
		}
		paragraphStart--;
	}

	return paragraphStart;
}

function findParagraphEnd(cursor: EditorPosition, lines: string[]) {
	let paragraphEnd = cursor.line;
	const totalLines = lines.length;

	let flag = false;
	while (paragraphEnd < totalLines - 1) {
		if (lines[paragraphEnd].trim() === "" && flag) {
			break;
		}
		if (lines[paragraphEnd].trim() !== "" && !flag) {
			flag = true;
		}
		paragraphEnd++;
	}

	return paragraphEnd;
}

export default class ParagraphNavigationPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "move-to-start-of-paragraph",
			name: "Move to start of paragraph",
			hotkeys: [{ modifiers: ["Ctrl"], key: "ArrowUp" }],
			editorCallback: (editor) => {
				const cursor = editor.getCursor();
				const content = editor.getValue();
				const lines = content.split("\n");

				const paragraphStart = findParagraphStart(cursor, lines);

				editor.setCursor({ line: paragraphStart, ch: 0 });
			},
		});

		this.addCommand({
			id: "move-to-end-of-paragraph",
			name: "Move to end of paragraph",
			hotkeys: [{ modifiers: ["Ctrl"], key: "ArrowDown" }],
			editorCallback: (editor) => {
				const cursor = editor.getCursor();
				const content = editor.getValue();
				const lines = content.split("\n");

				const paragraphEnd = findParagraphEnd(cursor, lines);
				const lineContent = lines[paragraphEnd];

				editor.setCursor({
					line: paragraphEnd,
					ch: lineContent ? lineContent.length : 0,
				});
			},
		});

		this.addCommand({
			id: "select-to-start-of-paragraph",
			name: "Select to start of paragraph",
			hotkeys: [{ modifiers: ["Ctrl", "Shift"], key: "ArrowUp" }],
			editorCallback: (editor) => {
				const cursor = editor.getCursor();
				const content = editor.getValue();
				const lines = content.split("\n");

				const paragraphStart = findParagraphStart(cursor, lines);
				const anchor = editor.getCursor("anchor");
				const head = {
					line: paragraphStart,
					ch: 0,
				}
				editor.setSelection(anchor, head);
			},
		});

		this.addCommand({
			id: "select-to-end-of-paragraph",
			name: "Select to end of paragraph",
			hotkeys: [{ modifiers: ["Ctrl", "Shift"], key: "ArrowDown" }],
			editorCallback: (editor) => {
				const cursor = editor.getCursor();
				const content = editor.getValue();
				const lines = content.split("\n");

				const paragraphEnd = findParagraphEnd(cursor, lines);
				const lineContent = lines[paragraphEnd];
				const anchor = editor.getCursor("anchor");
				const head = {
					line: paragraphEnd,
					ch: lineContent ? lineContent.length : 0,
				}

				editor.setSelection(anchor, head);
			},
		});
	}

	onunload() {}
}
