/**
 * ASCIIsvg plugin for TinyMCE
 *   uses Peter Jipsen ASCIIMathML.js library
 *   derived from David Lippman's TinyMCE Plugin
 *
 * @author Roché Compaan
 * @copyright Copyright © 2011 Roché Compaan.
 *
 * Plugin format based on code that is:
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('asciisvg');

	tinymce.create('tinymce.plugins.AsciisvgPlugin', {

		init : function(ed, url) {
			var t= this;

            ed.addCommand('mceInsertASCIISvg', function(val) {

                ed.selection.setContent('<div class="ASCIISvg"><span class="ASCIISvgScript"><![CDATA[' + val +']]></span><span class="ASCIISvgPicture" style="width:300px; height: 200px;"/></div>')
                node = ed.selection.getNode();
                svgscript = node.getElementsByClassName('ASCIISvgScript')[0];
                drawgraph(svgscript);
            });


			ed.addCommand('mceAsciisvg', function() {
				el = ed.selection.getNode();

				var svgcontainer = ed.dom.getParent(el, 'div.ASCIISvg');
				if (svgcontainer != null) {
                    svgscript = svgcontainer.childNodes[0];
                    svggraph = svgcontainer.childNodes[1];
                    script = svgscript.innerHTML;
                    // strip away comment tags
                    script = script.slice(11, -5);
                    // translate arrow markers to something ASCIIMathML expects
                    script = script.replace('^-', '<-', 'g');
                    script = script.replace('-^', '->', 'g');
					isnew = false;
					elwidth = parseInt(ed.dom.getStyle(svggraph,"width"));
					elheight = parseInt(ed.dom.getStyle(svggraph,"height"));
					alignm = ed.dom.getStyle(svggraph, "float");
					if (alignm == "none") {
						alignm = ed.dom.getStyle(el, "vertical-align");
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
					width : 670 + parseInt(ed.getLang('asciisvg.delta_width', 0)),
					height : 500 + parseInt(ed.getLang('asciisvg.delta_height', 0)),
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

            // Convert script to svg onInit and fix caret position
            ed.onInit.add(function(ed) {
                function drawgraphs() {
                    selected = ed.dom.select('span.ASCIISvgScript');
                    for (var i=0; i < selected.length; i++) {
                        element = selected[i];
                        drawgraph(element);
                    };
                }
                drawgraphs();
                ed.onSetContent.add(drawgraphs);

                if (!tinymce.isIE) {
					function fixCaretPos() {
						var last = ed.getBody().lastChild;
						if (last && last.nodeName == 'P' &&
                                    last.childNodes.length == 0)
                            last.innerHTML = '<br mce_bogus="1" />'
					};
                    fixCaretPos();
                };
                ed.onKeyUp.add(fixCaretPos);
                ed.onSetContent.add(fixCaretPos);
                ed.onVisualAid.add(fixCaretPos);

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
				cm.setActive('asciisvg', svgcontainer != null);
                if (svgcontainer != null && svgcontainer.getElementsByClassName('mceItemVisualAid')) {
                    svg = svgcontainer.childNodes[1];
                    if (svg != null) {
                        // not sure why ed.dom.addClass does not work
                        // ed.dom.addClass(svg, 'mceItemVisualAid');
                        svg.setAttribute('class', 'mceItemVisualAid');
                    }
                };
			});

            ed.onKeyPress.add(function(ed, e) {
                // delete graph when delete or backspace key is pressed
                if (e.keyCode == 46 || e.keyCode == 8) {
                    node = ed.selection.getNode();
                    var svgcontainer = ed.dom.getParent(node, 'div.ASCIISvg');
                    if (svgcontainer) {
                        svgcontainer.parentNode.removeChild(svgcontainer);
                    }
                }

                // place the caret after the svg node when pressing
                // enter, down or right arrow
                if (e.keyCode == 13 || e.keyCode == 0 ||
                    e.keyCode == 37 || e.keyCode == 38 ||
                    e.keyCode == 39 || e.keyCode == 40) {
                    var rng, svg, dom = ed.dom;

                    rng = ed.selection.getRng();
                    svg = dom.getParent(rng.startContainer, 'div.ASCIISvg');

                    if (svg) {
                        rng = dom.createRng();

                        if (e.keyCode == 37 || e.keyCode == 38) {
                            rng.setStartBefore(svg);
                            rng.setEndBefore(svg);
                        } else {
                            rng.setStartAfter(svg);
                            rng.setEndAfter(svg);
                        }
                        ed.selection.setRng(rng);
                    }
                }
            });


		},

		getInfo : function() {
			return {
				longname : 'ASCIISvg Plugin',
				author : 'Roché Compaan',
				authorurl : 'http://github.com/rochecompaan',
				infourl : 'https://github.com/fullmarks/fullmarks.tinymceplugins.asciisvg',
				version : "1.0"
			};
		}, 
		
	});

	// Register plugin
	tinymce.PluginManager.add('asciisvg', tinymce.plugins.AsciisvgPlugin);
})();
