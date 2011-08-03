/**
 * ASCIIsvg plugin for TinyMCE.
 *   port of ASCIIsvg plugin for HTMLArea written by 
 *   David Lippman and Peter Jipsen
 *
 * @author David Lippman
 * @copyright Copyright � 2008 David Lippman.
 *
 * Plugin format based on code that is:
 * @copyright Copyright � 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('asciisvg');

	tinymce.create('tinymce.plugins.AsciisvgPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			var t= this;

			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceAsciisvg');

            ed.addCommand('mceInsertASCIISvg', function(val) {

                ed.selection.setContent('<div class="ASCIISvg"><span class="ASCIISvgScript"><![CDATA[' + val +']]></span><span class="ASCIISvgPicture" style="width:300px; height: 200px;"/></div>')
                node = ed.selection.getNode();
                picture = node.getElementsByClassName('ASCIISvgPicture')[0];
                initialized = false;
                translateandeval(val);

            });


			ed.addCommand('mceAsciisvg', function() {
				el = ed.selection.getNode();

				if (el.nodeName == 'IMG' && ed.dom.getAttrib(el,"script")!='') {
					script = ed.dom.getAttrib(el,"script");
					isnew = false;
					elwidth = parseInt(ed.dom.getStyle(el,"width"));
					elheight = parseInt(ed.dom.getStyle(el,"height"));
					alignm = ed.dom.getStyle(el,"float");
					if (alignm == "none") {
						alignm = ed.dom.getStyle(el,"vertical-align");
					}
				} else {
					isnew = true;
					script = "width=300; height=200; xmin=-7.5; xmax=7.5; xscl=1; axes();";
					elwidth = 300;
					elheight = 200;
					alignm = "middle";
				}
				
				ed.windowManager.open({
					file : url + '/asciisvgdlg.htm',
					width : 630 + parseInt(ed.getLang('asciisvg.delta_width', 0)),
					height : 440 + parseInt(ed.getLang('asciisvg.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					isnew : isnew, // Custom argument
					script : script,
					width : elwidth,
					height : elheight,
					alignm : alignm, 
				});
			});

			// Register asciisvg button
			ed.addButton('asciisvg', {
				title : 'asciisvg.desc',
				cmd : 'mceAsciisvg',
				image : url + '/img/ed_asciisvg.gif'
			});

            // Convert script to svg onInit
            ed.onInit.add(function(ed) {
                selected = ed.dom.select('span.ASCIISvgScript');
                for (var i=0; i < selected.length; i++) {
                    element = selected[i];
                    script = element.innerHTML;
                    // strip away comment tags
                    script = script.slice(11, -5);
                    picture = element.nextSibling;
                    initialized = false;
                    translateandeval(script);
                };
            });

            // Add a node change handler, selects the button in the UI
            // when an svg image is selected
			ed.onNodeChange.add(function(ed, cm, n) {
                selected = ed.dom.select('svg.mceItemVisualAid');
                for (var i=0; i < selected.length; i++) {
                    svg = selected[i];
                    svg.removeAttribute('class');
                };
				var svgcontainer = ed.dom.getParent(n, 'div.ASCIISvg');
				cm.setActive('asciisvg', svgcontainer);
                if (svgcontainer != null && svgcontainer.getElementsByClassName('mceItemVisualAid')) {
                    svg = svgcontainer.childNodes[1];
                    // not sure why ed.dom.addClass does not work
                    // ed.dom.addClass(svg, 'mceItemVisualAid');
                    svg.setAttribute('class', 'mceItemVisualAid');
                };
			});

		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'ASCIISvg Plugin',
				author : 'Roch� Compaan',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		}, 
		
	});

	// Register plugin
	tinymce.PluginManager.add('asciisvg', tinymce.plugins.AsciisvgPlugin);
})();
