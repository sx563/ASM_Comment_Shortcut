define([
    'base/js/namespace',
    'codemirror/lib/codemirror'
], function(Jupyter, CodeMirror) {
    "use strict";

    var prefix = 'auto';

    var action_toggleEmu86KernelComment = Jupyter.keyboard_manager.actions.register(
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

    var edit_mode_shortcut = {
        'Ctrl-Alt-e': action_toggleEmu86KernelComment
	};


	function toggleEmu86KernelComment(){
        var comment_token = ';';

        var cm = Jupyter.notebook.get_selected_cell().code_mirror
		
		var start_cursor = cm.doc.getCursor();
        CodeMirror.commands.goLineEnd(cm);
        CodeMirror.commands.goLineStartSmart(cm);

        var start_line_cursor = cm.doc.getCursor();
		var start_line = {'line': start_line_cursor.line, 'ch': start_line_cursor.ch};

        CodeMirror.commands.goLineEnd(cm);
        var end_line_cursor = cm.doc.getCursor();
		var end_line = {'line': end_line_cursor.line, 'ch': end_line_cursor.ch};
		
        
        var line = cm.doc.getRange(start_line, end_line);
		CodeMirror.commands.deleteLine(cm);
		cm.doc.setCursor(start_cursor.line, start_cursor.ch);
        if(line[0] === comment_token){
            cm.doc.replaceSelection(line.slice(1) + "\n");
        }else{
            cm.doc.replaceSelection(comment_token + line + "\n");
        }

        cm.doc.setCursor(start_cursor.line, start_cursor.ch);
        
    }


    return {
        load_ipython_extension: Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(edit_mode_shortcut),
    };

});
