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
		'Ctrl-Shift-/': action_toggleEmu86KernelComment,
		'Cmdtrl-Shift-/': action_toggleEmu86KernelComment
	};

	const comment_token = ";";

	function executetoggleComment(job, cm, startLineCursor, startTextCursor){
		if(job === "uncommentLine" ){
			cm.doc.setCursor(startTextCursor);
			CodeMirror.commands.delCharAfter(cm);
		}
		if(job === "commentLine"){
			cm.doc.setCursor(startLineCursor);
			cm.doc.replaceSelection(comment_token);
		}
	}

	function fetchCursorPositions(cm){
		CodeMirror.commands.goLineStart(cm);
		const startLineCursor = cm.doc.getCursor();

		CodeMirror.commands.goLineEnd(cm);
		CodeMirror.commands.goLineStartSmart(cm);
		const startTextCursor = cm.doc.getCursor();

		CodeMirror.commands.goLineEnd(cm);
		const endTextCursor = cm.doc.getCursor();

		return [startLineCursor, startTextCursor, endTextCursor];
	}

	function iterateThroughSelectedTextDoingJob(job, cm, fromCursor, toCursor){
		cm.doc.setCursor(fromCursor);
		let cursorLine = -1;
		while(toCursor.line != cursorLine){

			const [startLineCursor, startTextCursor, endTextCursor] = [...fetchCursorPositions(cm)];
			cursorLine = endTextCursor.line;

			let line = cm.doc.getRange(startTextCursor, endTextCursor);
			if(line.trim() !== ""){
				if(job === "determineCommentOrUncomment"){
					if(line[0] !== comment_token){
						return "commentLine";
					}
				} else{
					executetoggleComment(job, cm, startLineCursor, startTextCursor);
				}
			}

			cm.doc.setCursor(startLineCursor.line + 1, startLineCursor.ch);
		}
		return "uncommentLine";
	}

	function toggleSingleComment(cm, cursor){
		cm.doc.setCursor(cursor);
		const [startLineCursor, startTextCursor, endTextCursor] = [...fetchCursorPositions(cm)];

		let line = cm.doc.getRange(startTextCursor, endTextCursor);
		if(line.trim() !== ""){
			if (line[0] !== comment_token){
				executetoggleComment('commentLine', cm, startLineCursor, startTextCursor);
			}
			else{
				executetoggleComment('uncommentLine', cm, startLineCursor, startTextCursor);
			}
		}
	}

	function toggleEmu86KernelComment(){
		const cm = Jupyter.notebook.get_selected_cell().code_mirror

		const fromCursor = cm.doc.getCursor("from");
		const toCursor = cm.doc.getCursor("to");
		
		if (fromCursor.line === toCursor.line){
			toggleSingleComment(cm, fromCursor)
		} else{
			const toggleCommentJob = iterateThroughSelectedTextDoingJob("determineCommentOrUncomment", cm, fromCursor, toCursor);
			iterateThroughSelectedTextDoingJob(toggleCommentJob, cm, fromCursor, toCursor);
		}
		cm.doc.setSelection(fromCursor, toCursor);
	}

	return {
		load_ipython_extension: Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(edit_mode_shortcut),
	};

});
