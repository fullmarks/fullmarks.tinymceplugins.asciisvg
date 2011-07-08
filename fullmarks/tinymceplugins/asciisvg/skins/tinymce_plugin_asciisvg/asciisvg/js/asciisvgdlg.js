tinyMCEPopup.requireLangPack();

var AsciisvgDialog = {
	width: 300,
	height: 200,
	alignm: "middle",
	script: "",
	isnew: null,
	
	init : function() {
		var f = document.forms[0];

		// Get the selected contents as text and place it in the input
		this.width = tinyMCEPopup.getWindowArg('width');
		this.height = tinyMCEPopup.getWindowArg('height');
		this.isnew = tinyMCEPopup.getWindowArg('isnew');
		this.script = tinyMCEPopup.getWindowArg('script');
		this.alignm = tinyMCEPopup.getWindowArg('alignm');
		
        document.getElementById("previewsvg").setAttribute("script",this.script);
        document.getElementById("previewsvg").value = this.script;
        updatePicture('previewsvg');
			
		this.initscript(this.script);
		
	},

	insert : function() {
		ed = tinyMCEPopup.editor;
		// Insert the contents from the input into the document
		if (this.isnew) {
			if (this.alignm == "left" || this.alignm == "right") {
				aligntxt = "vertical-align: middle; float: "+this.alignm+";";
			} else {
				aligntxt = "vertical-align: "+this.alignm+"; float: none;";
			}
			tinyMCEPopup.editor.execCommand('mceInsertContent', false, '<div class="ASCIIsvg" style="width:300px; height: 200px;"/>');
			el = tinyMCEPopup.editor.selection.getNode();
			ed.dom.setAttrib(el, "script", this.script);
		} else {
			el = tinyMCEPopup.editor.selection.getNode();
			ed.dom.setAttrib(el,"script",this.script);
			ed.dom.setAttrib(el,"width",this.width);
			ed.dom.setAttrib(el,"height",this.height);
			ed.dom.setStyle(el,"width",this.width + 'px');
			ed.dom.setStyle(el,"height",this.height + 'px');
			if (this.alignm == "left" || this.alignm == "right") {
				ed.dom.setStyle(el,"float",this.alignm);
				ed.dom.setStyle(el,"vertical-align","middle");
			} else {
				ed.dom.setStyle(el,"float","none");
				ed.dom.setStyle(el,"vertical-align",this.alignm);
			}
			
		}
		tinyMCEPopup.close();
	},
	
	addgraph : function() {
		
		var commands = "";
		var graphs = document.getElementById("graphs");
		var newopt = document.createElement('option');
	
		var type = document.getElementById("eqntype").value;
		var eq1 = document.getElementById("equation").value;
		var eq2 = null;
	
		 m_gstart = document.getElementById("gstart").selectedIndex;
		 m_gend = document.getElementById("gend").selectedIndex;
         endpts = ""
         switch (m_gstart) {
             case "arrow": endpts += "<-"; 
             case "opendot": endpts += "o-"; 
             case "dot": endpts += "*-"; 
            }
         switch (m_gend) {
             case "arrow": endpts += "->"; 
             case "opendot": endpts += "-o"; 
             case "dot": endpts += "-*"; 
            }

		 m_color = document.getElementById("gcolor").value;
		 m_strokewidth = document.getElementById("strokewidth").value;
		 m_strokedash = document.getElementById("strokedash").value;
         x_start = document.getElementById("xstart").value;
         x_end = document.getElementById("xend").value;

         commands += 'stroke="' + m_color + '"; ';
         commands += 'strokewidth=' + m_strokewidth + '; ';
         if (m_strokedash != "none") {
            commands += 'strokedasharray=' + m_strokedash + '; ';
         }

         if (type == "slope") {
			commands += 'slopefield("' + eq1 + '",' + eq2 + ',' + m_gstart + ');'; 
         } 
         else {
			if (type == "func") {
				eqn = '"' + eq1 + '"';
			} else if (type == "polar") {
				eqn = '["cos(t)*(' + eq1 + ')","sin(t)*(' + eq2 + ')"]';
			} else if (type == "param") {
				eqn = '["' + eq1 + '","'+ eq2 + '"]';
			}

			if (typeof eval(x_start) == "number" && typeof eval(x_end) == "number") {
				commands += 'plot(' + eqn +',' + x_start + ',' + x_end +',null,null,"' + endpts +  '");';
			
			}
            else {
				commands += 'plot(' + eqn +',null,null,null,null,"' + endpts + '");';
			}

        }

        newopt.value = commands;
        newopt.text = eq1;
		graphs.options[graphs.options.length] = newopt;
		graphs.selectedIndex = graphs.options.length - 1;
		this.graphit();
		document.getElementById("equation").focus();
		
	},
	
	replacegraph : function() {
		var graphs = document.getElementById("graphs");
		if (graphs.selectedIndex >= 0) {
			graphs.options[graphs.selectedIndex] = null;  //standards compliant
		}
		this.addgraph();
	},
	
	removegraph : function() {
		var graphs = document.getElementById("graphs");
		if (graphs.selectedIndex >= 0) {
			graphs.options[graphs.selectedIndex] = null;
			if (graphs.options.length > 0) {this.loadeqn();}
		}
		this.graphit();
		document.getElementById("equation").focus();
	},
	
	graphit : function() {
		ed = tinyMCEPopup.editor;
		var commands;
		commands = "";
	     
		initialized = false;
		
		//commands = 'setBorder(5);';
	
		m_xmin = document.getElementById("graph-xmin").value;
		m_xmax = document.getElementById("graph-xmax").value;
		m_ymin = document.getElementById("graph-ymin").value;
		m_ymax = document.getElementById("graph-ymax").value;
		if (m_ymin == "") m_ymin = null
		if (m_ymax == "") m_ymax = null
		commands += 'initPicture(' + m_xmin + ',' + m_xmax + ','+ m_ymin + ',' + m_ymax + '); ';
	
		m_xscl = document.getElementById("graph-xscl").value;
		m_yscl = document.getElementById("graph-yscl").value;
		if (m_xscl == "") m_xscl = null
		if (m_yscl == "") m_yscl = null
		if (document.getElementById("labels").checked) {
			m_labels = '1';
		} else {
			m_labels = 'null';
		}
	
		if (document.getElementById("grid").checked) {
			m_grid = ',' + m_xscl + ',' + m_yscl;
		} else {
			m_grid = ',null,null';
		}
		commands += 'axes(' + m_xscl + ',' + m_yscl + ',' + m_labels + m_grid + '); ';
	      
		commands += 'width=' + document.getElementById("graph-width").value + '; '
        commands += 'height=' + document.getElementById("graph-height").value + '; ';
		
	
		graphs = document.getElementById("graphs");
		for (i=0; i < graphs.length; i++) {
			commands += graphs.options[i].value;
		}
		this.width = document.getElementById("graph-width").value;
		this.height = document.getElementById("graph-height").value;
		this.script = commands;
		this.alignm = document.getElementById("alignment").value;
		
        document.getElementById("previewsvg").setAttribute("script", this.script);
        document.getElementById("previewsvginput").value = this.script;
        updatePicture('previewsvg');	

	},
	
	changetype : function() {
		var type = document.getElementById("eqntype").value;
		
		if (type == "func") {
			this.chgtext("eq1lbl","f(x)=");
			document.getElementById("equation").value = "sin(x)";
			this.chgtext("eq2lbl","");
			this.chgtext("eq2","");
			
		} else if (type == "polar") {
			this.chgtext("eq1lbl", "r(t)=");
			document.getElementById("equation").value = "t";
			this.chgtext("eq2lbl","");
			this.chgtext("eq2","");
			
		} else if (type == "param") {
			this.chgtext("eq1lbl", "f(t)=");
			this.chgtext("eq2lbl","g(t)= ");
			var newinput = document.createElement('input');
			newinput.type = "text";
			newinput.name = "eqn2";
			newinput.id = "eqn2";
			newinput.size = "15";
			newinput.value = "cos(t)";
			var cnode = document.getElementById("eq2");
			cnode.replaceChild(newinput,cnode.lastChild);
			document.getElementById("equation").value = "sin(t)";
	
		} else if (type == "slope") {
			this.chgtext("eq1lbl", "dy/dx (x,y) = ");
			document.getElementById("equation").value = "x*y";
			this.chgtext("eq2lbl","every ");
			var newinput = document.createElement('input');
			newinput.type = "text";
			newinput.name = "eqn2";
			newinput.id = "eqn2";
			newinput.size = "2";
			newinput.value = "1";
			var cnode = document.getElementById("eq2");
			cnode.replaceChild(newinput,cnode.lastChild);
			
		}
		document.getElementById("gstart").selectedIndex = 0;
		document.getElementById("gend").selectedIndex = 0;
		document.getElementById("xstart").value = "";
		document.getElementById("xend").value = "";
		document.getElementById("gcolor").selectedIndex = 0;
		document.getElementById("strokewidth").selectedIndex = 0;
		document.getElementById("strokedash").selectedIndex = 0;
	
	},
	
	loadeqn : function() {
		graphs = document.getElementById("graphs");	
		
		var sa = graphs.options[graphs.selectedIndex].value.split(",");
		
		if (sa[0] == "func") {
			document.getElementById("eqntype").selectedIndex = 0;
		} else if (sa[0] == "polar") {
			document.getElementById("eqntype").selectedIndex = 1;
		} else if (sa[0] == "param") {
			document.getElementById("eqntype").selectedIndex = 2;
		} else if (sa[0] == "slope") {
			document.getElementById("eqntype").selectedIndex = 3;
		} 
		this.changetype();
		document.getElementById("equation").value = sa[1];
		if ((sa[0] == "param")||(sa[0] == "slope")) {
			document.getElementById("eqn2").value = sa[2];
		}
	
		document.getElementById("gstart").selectedIndex = sa[3];
		document.getElementById("gend").selectedIndex = sa[4];
		document.getElementById("xstart").value = sa[5];
		document.getElementById("xend").value = sa[6];
		switch (sa[7]) {
			case "black": document.getElementById("gcolor").selectedIndex = 0; break;
			case "red": document.getElementById("gcolor").selectedIndex = 1; break;
			case "orange": document.getElementById("gcolor").selectedIndex = 2; break;
			case "yellow": document.getElementById("gcolor").selectedIndex = 3; break;
			case "green": document.getElementById("gcolor").selectedIndex = 4; break;
			case "blue": document.getElementById("gcolor").selectedIndex = 5; break;
			case "purple": document.getElementById("gcolor").selectedIndex = 6; break;
		}
		document.getElementById("strokewidth").selectedIndex = sa[8] - 1;
		switch (sa[9]) {
			case "2": document.getElementById("strokedash").selectedIndex = 1; break;
			case "5": document.getElementById("strokedash").selectedIndex = 2; break;
			case "5 2": document.getElementById("strokedash").selectedIndex = 3; break;
			case "7 3 2 3": document.getElementById("strokedash").selectedIndex = 4; break;
			default: document.getElementById("strokedash").selectedIndex = 0;
		}
	},
			
	initscript : function(text) {
		alignment = "middle";
		commands = text.split(";");

		for (i=0; i < commands.length; i++) {
            parts = commands[i].split('=');
            cmd = parts[0].trim();
            value = parts[1];
            if (value) value.trim();

            // axes command
            if (cmd.indexOf('axes') != -1) {
                params = cmd.slice(5, -1);
                if (params) {
                    params = params.split(',')
                    dx = params[0]
                    dy = params[1]
                    labels = params[2]
                    gdx = params[3]
                    gdy = params[4]
                    // ui only supports grid or no grid
                    grid = gdx || gdy
                    dox = params[5]
                    doy = params[6]
                    if (labels) {
                        document.getElementById("labels").checked = true;
                    } else {
                        document.getElementById("labels").checked = false;
                    }
                    if (grid) {
                        document.getElementById("grid").checked = true;
                    } else {
                        document.getElementById("grid").checked = false;
                    }
                }
            }
            // plot command
            else if (cmd.indexOf('plot') != -1) {
                equation = cmd.slice(5, -1);
                if (equation) {
                    document.getElementById('equation').value = equation;
                }
            }

            // slopefield command
            else if (cmd.indexOf('slopefield') != -1) {
                equation = cmd.slice(5, -1);
                if (equation) {
                    document.getElementById('equation').value = equation;
                }
            }

            // graph attributes
            else if (cmd) {
                node = document.getElementById('graph-'+cmd)
                if (node) {
                    node.value = value;
                }
            }
		}

		document.getElementById("graphs").length = 0;

        /*
		var inx = 11;
		while (sa.length > inx+9) {
			var newopt = document.createElement('option');
			
			if (sa[inx]== "func") {
				newopt.text = 'y=' + sa[inx+1];
			} else if (sa[inx] == "polar") {
				newopt.text = 'r=' + sa[inx+1];
			} else if (sa[inx] == "param") {
				newopt.text = '[x,y]=[' + sa[inx+1] + ','+ sa[inx+2] + ']';
			} else if (sa[inx] == "slope") {
				newopt.text = 'dy/dx='+ sa[inx+1];
			}
			newopt.value = sa[inx]+','+sa[inx+1]+','+sa[inx+2]+','+sa[inx+3]+','+sa[inx+4]+','+sa[inx+5]+','+sa[inx+6]+','+sa[inx+7]+','+sa[inx+8]+','+sa[inx+9];
			graphs = document.getElementById("graphs");
			graphs.options[graphs.options.length] = newopt;
			//document.getElementById("graphs").add(newopt);
			inx += 10;
		}
		if (inx > 11) {
			this.loadeqn();
		}
		
		switch (alignment.toLowerCase()) {
			case "text-top": document.getElementById("alignment").selectedIndex = 0; break;
			case "middle": document.getElementById("alignment").selectedIndex = 1; break;
			case "text-bottom": document.getElementById("alignment").selectedIndex = 2; break;
			case "left": document.getElementById("alignment").selectedIndex = 3; break;
			case "right": document.getElementById("alignment").selectedIndex = 4; break;
			default: document.getElementById("alignment").selectedIndex = 0; break;
		}
        */
		
		//this.graphit();
	},
	
	chgtext : function(tag,text)
	{
		var cnode = document.getElementById(tag);
		cnode.replaceChild(document.createTextNode(text),cnode.lastChild);
	}

};

tinyMCEPopup.onInit.add(AsciisvgDialog.init, AsciisvgDialog);
