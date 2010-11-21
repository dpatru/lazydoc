// LazyDoc: Makes documentation examples suitable for lazy readers. 


(function ( $ ){
     function lazydoc() {
	 var context = this, args = Array.prototype.slice.call(arguments);
	 if (!window.CodeMirror) 
	     return $.ajax({
			       url: 'codemirror/js/codemirror.js',
			       dataType: 'script',
			       error: function (){alert("Can\'t access codemirror.");},
			       success: function() {if (!window.CodeMirror) alert('Failed to access codemirror.'); else lazydoc.apply(context, args);}
			   });

	 return this.each(codeMirrorize);
     };
     var global_i = 0;
     function codeMirrorize(){
	 var el = this, i = global_i++;
	 var html_id = 'html'+i;
	 $(el).after('<button class="update '+html_id+'">Reload html</button><button class="setHeight '+html_id+'">Reset height & width</button><br/><iframe class="output" src="javascript:;" height="0px" id="'+html_id+'"></iframe>');
	 var html_el = $('#'+html_id)[0], editor;
	 var codeMirrorOptions = {
	     parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
	     path: "codemirror/js/",
	     stylesheet: ["codemirror/css/xmlcolors.css", "codemirror/css/jscolors.css", "codemirror/css/csscolors.css"],
	     height:"dynamic",
	     onChange: function(){$('button.'+html_id).attr('disabled', false);},
	     onLoad: function (ed) { 
		 editor = ed; // set the editor (the global editor variable is not set yet.)
		 update_html();
		 $('button.update.'+html_id).click(update_html);
		 $('button.setHeight.'+html_id).click(setHeight);
	     },
	     iframeClass: 'source',
	     minHeight: '10'
	 };
	 function setHeight(){
	     //var height = $(html_el).contents().find('html').outerHeight();
	     //$(html_el).height(height); // set the height of the iframe dynamically.
	     //var width = $(html_el).contents().find('html').outerWidth();
	     //$(html_el).width(width); // set the width of the iframe dynamically.

	     var height = $(html_el.contentDocument).height();
	     $(html_el).height(height); // set the height of the iframe dynamically.
	     var width = $(html_el.contentDocument).width();
	     $(html_el).width(width); // set the width of the iframe dynamically.
	 };
	 function setContent(c){
	     var w = html_el.contentWindow;
             w.document.open();
             w.document.write(c);
             w.document.close();
	     setHeight();
	 };
	 function update_html(){
	     setContent('<!doctype html><head><title>Empty</title></head><div></div>');
	     setContent(editor.getCode());
	     $('button.update.'+html_id).attr('disabled', true); // disable the update button because the iframe has already been updated.
	 };
	 return $(el).is('textarea')? CodeMirror.fromTextArea(el, codeMirrorOptions): 
	     (new CodeMirror(($(el).is(':input')? CodeMirror.replace(el): el), codeMirrorOptions));
     };
     $.fn.lazydoc = lazydoc; 


 })( jQuery); 
