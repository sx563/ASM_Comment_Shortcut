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

        CodeMirror.commands.goLineEnd(cm);
        CodeMirror.commands.goLineStartSmart(cm);
        var start_cursor = cm.doc.getCursor();
		var start = {'line': start_cursor.line, 'ch': start_cursor.ch};

        CodeMirror.commands.goLineEnd(cm);
        var end_cursor = cm.doc.getCursor();
		var end = {'line': end_cursor.line, 'ch': end_cursor.ch};
        
        var line = cm.doc.getRange(start, end);
        if(line[0] === comment_token){
            CodeMirror.commands.deleteLine(cm);
            cm.doc.setCursor(start_cursor.line, start_cursor.ch);
            cm.doc.replaceSelection(line.slice(1) + "\n");
        }else{
            cm.doc.setCursor(start_cursor.line, start_cursor.ch)
            cm.doc.replaceSelection(comment_token);
        }

        cm.doc.setCursor(start_cursor.line, start_cursor.ch);
        
    }


    return {
        load_ipython_extension: Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(edit_mode_shortcut),
    };

});
