define([
	'base/js/namespace',
	'codemirror/lib/codemirror'
], function(Jupyter, CodeMirror) {
	"use strict";

	const prefix = 'auto';

	const action_toggleEmu86KernelComment = Jupyter.keyboard_manager.actions.register(
		{
		icon: 'fa-comment-o',
		help: 'Toggle Emu86 Kernel Comment',
		help_index: 'ec',
		id: 'toggle-emu86-kernel-comment',
		handler: toggleEmu86KernelComment
		},
		'toggle-emu86-kernel-comment',
		prefix
	);

	const edit_mode_shortcut = {
		'Ctrl-Alt-e': action_toggleEmu86KernelComment
	};


	const comment_token = ";";

	function executetoggleComment(job, cm, start_line_cursor, start_text_cursor){
		if(job === "uncommentLine" ){
			cm.doc.setCursor(start_text_cursor);
			CodeMirror.commands.delCharAfter(cm);
		}
		if(job === "commentLine"){
			cm.doc.setCursor(start_line_cursor);
			cm.doc.replaceSelection(comment_token);
		}
	}

	function iterateThroughSelectedTextDoingJob(job, cm, from_cursor, to_cursor){
		cm.doc.setCursor(from_cursor);
		let cursor_line = -1;
		while(to_cursor.line != cursor_line){
			CodeMirror.commands.goLineStart(cm);
			let start_line_cursor = cm.doc.getCursor();

			CodeMirror.commands.goLineEnd(cm);
			CodeMirror.commands.goLineStartSmart(cm);
			let start_text_cursor = cm.doc.getCursor();

			CodeMirror.commands.goLineEnd(cm);
			let end_text_cursor = cm.doc.getCursor();
			cursor_line = end_text_cursor.line;

			let line = cm.doc.getRange(start_text_cursor, end_text_cursor);
			if(line.trim() !== ""){
				if(job === "determineCommentOrUncomment"){
					if(line[0] !== comment_token){
						return "commentLine";
					}
				}else{
					executetoggleComment(job, cm, start_line_cursor, start_text_cursor);
				}
			}

			cm.doc.setCursor(start_line_cursor.line + 1, start_line_cursor.ch);
		}
		return "uncommentLine";
	}

	function toggleEmu86KernelComment(){
		const cm = Jupyter.notebook.get_selected_cell().code_mirror

		const from_cursor = cm.doc.getCursor("from");
		const to_cursor = cm.doc.getCursor("to");

		const toggleCommentJob = iterateThroughSelectedTextDoingJob("determineCommentOrUncomment", cm, from_cursor, to_cursor);
		iterateThroughSelectedTextDoingJob(toggleCommentJob, cm, from_cursor, to_cursor);

		cm.doc.setSelection(from_cursor, to_cursor);
	}

	return {
		load_ipython_extension: Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(edit_mode_shortcut),
	};

});
