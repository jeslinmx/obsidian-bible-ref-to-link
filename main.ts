import { Editor, MarkdownView, Plugin } from 'obsidian';
import { scanAndProcessTokens } from 'procref';

function manipulateEditor(editor: Editor) {
	const cursorPosition = editor.getCursor()
	if (editor.somethingSelected()) {
		editor.replaceSelection(scanAndProcessTokens(editor.getSelection()))
	}
	else {
		editor.setValue(scanAndProcessTokens(editor.getValue()))
	}
	editor.setCursor(cursorPosition)
}

export default class BibleRefToLinkPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'process-verses',
			name: 'Detect and convert Bible references to links',
			icon: "book-open-check",
			editorCallback(editor: Editor, view: MarkdownView) {
				manipulateEditor(editor)
			},
		})
		// this.addRibbonIcon("book-open-check", "Convert Bible references to links", (evt: MouseEvent) => {
		// 	const editor = app.workspace.activeEditor?.editor
		// 	if (editor) {
		// 		manipulateEditor(editor)
		// 	}
		// });
	}

	onunload() {
		
	}
}
