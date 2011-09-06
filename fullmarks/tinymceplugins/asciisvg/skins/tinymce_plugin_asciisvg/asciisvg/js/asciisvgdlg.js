tinyMCEPopup.requireLangPack();

// copied from translateandeval in ASCIIMathML.js to validate the
// expression before we add it the list of graphs. Any exception raised
// is not caught so calling code knows if the expression is invalid
function validateexpr(src) { //modify user input to JavaScript syntax
  // replace plot(f(x),...) with plot("f(x)",...)  
  src = src.replace(/plot\(\x20*([^\"f\[][^\n\r;]+?)\,/g,"plot\(\"$1\",");
  src = src.replace(/plot\(\x20*([^\"f\[][^\n\r;]+)\)/g,"plot(\"$1\")");

  // replace (expr,expr) by [expr,expr] where expr has no (,) in it
  src = src.replace(/([=[(,]\x20*)\(([-a-z0-9./+*]+?),([-a-z0-9./+*]+?)\)/g,"$1[$2,$3]");
//alert(src)
  // insert * between digit and letter e.g. 2x --> 2*x
  src = src.replace(/([0-9])([a-df-zA-Z]|e^)/g,"$1*$2");
  src = src.replace(/\)([\(0-9a-zA-Z])/g,"\)*$1");

  with (Math) eval(src);
}

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
        document.getElementById("previewsvginput").value = this.script;
        updatePicture('previewsvg');
            
        this.initscript(this.script);
        this.loadeqn();
    },

    insert : function() {
        ed = tinyMCEPopup.editor;
        // translate comments characters since we embed our script as a
        // comment
        var transcript = "";
        transcript = this.script.replace(/<-/g, '^-');
        transcript = transcript.replace(/->/g, '-^');

        // Insert the contents from the input into the document
        if (this.isnew) {
            if (this.alignm == "left" || this.alignm == "right") {
                aligntxt = "vertical-align: middle; float: "+this.alignm+";";
            } else {
                aligntxt = "vertical-align: "+this.alignm+"; float: none;";
            }
            tinyMCEPopup.editor.execCommand('mceInsertASCIISvg', transcript);
        }
        else {
            el = ed.selection.getNode();
            svgcontainer = ed.dom.getParent(el, 'span.ASCIISvg');
            svgscript = svgcontainer.childNodes[0];
            svgscript.innerHTML = '<![CDATA[' + transcript +']]>'
            picture = svgcontainer.childNodes[1];
            initialized = false;
            translateandeval(this.script);

            // Store generated SVG in CDATA
            var svgnode = svgcontainer.getElementsByTagName('svg')[0];
            var svg = ed.dom.getOuterHTML(svgnode);
            svg = svg.replace(/>/g,"&gt;");
            svg = svg.replace(/</g,"&lt;");
            var cdata = '<![CDATA[' + svg + ']]>';
            var spansvg = svgcontainer.getElementsByClassName('SVG')[0];
            spansvg.innerHTML = cdata;

            ed.dom.setAttrib(picture,"script",this.script);
            ed.dom.setAttrib(picture,"width",this.width);
            ed.dom.setAttrib(picture,"height",this.height);
            if (this.alignm == "left" || this.alignm == "right") {
                ed.dom.setStyle(picture,"float",this.alignm);
                ed.dom.setStyle(picture,"vertical-align","middle");
            }
            else {
                ed.dom.setStyle(picture,"float","none");
                ed.dom.setStyle(picture,"vertical-align",this.alignm);
            }
            
        }
        tinyMCEPopup.close();
    },
    
    addgraph : function(index) {
        
        var commands = "";
        var eqnlabel = "";
        var graphs = document.getElementById("graphs");
    
        var type = document.getElementById("eqntype").value;
        var eq1 = document.getElementById("equation").value;
        var eqn2input = document.getElementById("eqn2");
        var eq2 = eqn2input && eqn2input.value || null;
    
        var gstart = document.getElementById("gstart");
        var gend = document.getElementById("gend");
        var m_gstart = gstart.options[gstart.selectedIndex].value;
        var m_gend = gend.options[gend.selectedIndex].value;
        var endpts = m_gstart + " " + m_gend;

        var m_color = document.getElementById("gcolor").value;
        var m_strokewidth = document.getElementById("strokewidth").value;
        var m_strokedash = document.getElementById("strokedash").value;
        var x_start = document.getElementById("xstart").value;
        var x_end = document.getElementById("xend").value;

        commands += 'stroke="' + m_color + '"; ';
        commands += 'strokewidth=' + m_strokewidth + '; ';
        if (m_strokedash != "none") {
           commands += 'strokedasharray="' + m_strokedash + '"; ';
        }

        if (type == "slope") {
           commands += 'slopefield("' + eq1 + '",' + eq2 + ',' + eq2 + ');'; 
           eqnlabel = "dy/dx=" + eq1;
        } 
        else {
            if (type == "func") {
                eqn = '"' + eq1 + '"';
                eqnlabel = "y=" + eq1;
            } else if (type == "polar") {
                eqn = '[\'cos(t)*(' + eq1 + ')\',\'sin(t)*(' + eq1 + ')\']';
                eqnlabel = "r=" + eq1;
            } else if (type == "param") {
                eqn = '[\'' + eq1 + '\',\''+ eq2 + '\']';
                eqnlabel = "[x,y]=" + eqn;
                eqnlabel = eqnlabel.replace(/\'/g,'');

            }

            if (typeof eval(x_start) == "number" && typeof eval(x_end) == "number") {
                commands += 'plot(' + eqn +',' + x_start + ',' + x_end +',null,null,"' + endpts +  '");';
            
            }
            else {
                commands += 'plot(' + eqn +',null,null,null,null,"' + endpts + '");';
            }

        }
        commands += ' var eqnlabel="' + eqnlabel + '";';
        commands += ' var eqntype="' + type + '";';
        commands += ' var eqn1="' + eq1 + '";';
        commands += ' var eqn2="' + eq2 + '";';

        if (index != null) {
            var option = graphs.options[index];
            currentvalue = option.value;
            currenttext = option.text;
            option.value = commands;
            option.text = eqnlabel;
        } else {
            var newopt = document.createElement('option');
            newopt.value = commands;
            newopt.text = eqnlabel;
            graphs.options[graphs.options.length] = newopt;
            graphs.selectedIndex = graphs.options.length - 1;
        }

        try {
            this.graphit();
        } catch(err) {
            if (err!="wait") {
                if (typeof err=="object") 
                    errstr = err.name+" "+err.message;
                else errstr = err;
                alert(eqnlabel +  " is not a valid function. Please correct it before trying to add or replace a graph.")
                // restore current option 
                if (index != null) {
                    option.value = currentvalue;
                    option.text = currenttext;
                    this.graphit();
                } else {
                    this.removegraph()
                }
            }
        }

        document.getElementById("equation").focus();
        
    },
    
    replacegraph : function() {
        this.addgraph(document.getElementById('graphs').selectedIndex);
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
        var commands = "";
         
        initialized = false;
        
        //commands = 'setBorder(5);';
    
        var m_xmin = document.getElementById("graph-xmin").value;
        var m_xmax = document.getElementById("graph-xmax").value;
        var m_ymin = document.getElementById("graph-ymin").value;
        var m_ymax = document.getElementById("graph-ymax").value;
        if (m_ymin == "") m_ymin = null
        if (m_ymax == "") m_ymax = null
        commands += 'initPicture(' + m_xmin + ',' + m_xmax + ','+ m_ymin + ',' + m_ymax + '); ';
    
        var m_xscl = document.getElementById("graph-xscl").value;
        var m_yscl = document.getElementById("graph-yscl").value;
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
        
    
        var graphs = document.getElementById("graphs");
        for (i=0; i < graphs.length; i++) {
            commands += graphs.options[i].value;
        }
        this.width = document.getElementById("graph-width").value;
        this.height = document.getElementById("graph-height").value;
        this.script = commands;
        this.alignm = document.getElementById("alignment").value;
        
        document.getElementById("previewsvg").setAttribute("script", this.script);
        document.getElementById("previewsvginput").value = this.script;
        validateexpr(this.script);
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
        var graphs = document.getElementById("graphs"); 
        if (graphs.options.length == 0) return;
        var script = graphs.options[graphs.selectedIndex].value;
        var commands = script.split(';');
        
        eval(script.slice(script.indexOf('var eqnlabel'), -1));

        if (eqntype == "func") {
            document.getElementById("eqntype").selectedIndex = 0;
        } else if (eqntype == "polar") {
            document.getElementById("eqntype").selectedIndex = 1;
        } else if (eqntype == "param") {
            document.getElementById("eqntype").selectedIndex = 2;
        } else if (eqntype == "slope") {
            document.getElementById("eqntype").selectedIndex = 3;
        } 
        this.changetype();

        document.getElementById("equation").value = eqn1;
        if ((eqntype == "param")||(eqntype == "slope")) {
            document.getElementById("eqn2").value = eqn2;
        }
    
        for (var i=0; i < commands.length; i++) {
            var command = commands[i];
            var parts = command.split('=');
            var cmd = parts[0].trim();
            var value = parts[1];
            if (value) {
                value = value.trim();
                value = value.replace(/\'/g,'');
            }

            if (cmd == "stroke") {
                switch (value) {
                    case "black": document.getElementById("gcolor").selectedIndex = 0; break;
                    case "red": document.getElementById("gcolor").selectedIndex = 1; break;
                    case "orange": document.getElementById("gcolor").selectedIndex = 2; break;
                    case "yellow": document.getElementById("gcolor").selectedIndex = 3; break;
                    case "green": document.getElementById("gcolor").selectedIndex = 4; break;
                    case "blue": document.getElementById("gcolor").selectedIndex = 5; break;
                    case "purple": document.getElementById("gcolor").selectedIndex = 6; break;
                }
            }
            else if (cmd == "strokewidth") {
                document.getElementById("strokewidth").selectedIndex = parseInt(value) - 1;
            }
            else if (cmd == "strokedasharray") {
                switch (value) {
                    case "2": document.getElementById("strokedash").selectedIndex = 1; break;
                    case "5": document.getElementById("strokedash").selectedIndex = 2; break;
                    case "5 2": document.getElementById("strokedash").selectedIndex = 3; break;
                    case "7 3 2 3": document.getElementById("strokedash").selectedIndex = 4; break;
                    default: document.getElementById("strokedash").selectedIndex = 0;
                }
            }
            else if (cmd.indexOf("plot") != -1) {
                var gstart = document.getElementById("gstart");
                for (var i=0; i < gstart.options.length; i++) {
                    if (cmd.indexOf(gstart.options[i].value) != -1) {
                        gstart.selectedIndex = i;
                    }
                }
                var gend = document.getElementById("gend");
                for (var i=0; i < gend.options.length; i++) {
                    if (cmd.indexOf(gend.options[i].value) != -1) {
                        gend.selectedIndex = i;
                    }
                }
                var plotargs = cmd.split(',');
                xstart = plotargs.slice(1,2);
                xend = plotargs.slice(2,3);
                if (parseInt(xstart)) {
                    document.getElementById("xstart").value = xstart;
                }
                if (parseInt(xend)) {
                    document.getElementById("xend").value = xend;
                }
            }
        }
    },
            
    initscript : function(text) {
        var alignment = "middle";
        var commands = text.split(";").reverse();

        var graphs = document.getElementById("graphs");
        graphs.length = 0;

        while (commands) {
            command = commands.pop()
            if (command == null) break;

            parts = command.split('=');
            cmd = parts[0].trim();
            value = parts[1];
            if (value) value = value.trim();

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

            // stroke, strokewidth, strokedasharray command
            else if (cmd == 'stroke' || cmd == 'strokewidth' || cmd == 'strokedasharray') {
                // the stroke command signals a new graph so create a
                // new option
                if (cmd == 'stroke') {
                    option = document.createElement('option');
                    graphs.options[graphs.options.length] = option;
                }
                option = graphs.options[graphs.options.length-1];
                option.value += cmd + "=" + value + "; ";
                graphs.options[graphs.options.length] = option;
            }

            // plot & slopefield command
            else if (cmd.indexOf('plot') != -1 || 
                     cmd.indexOf('slopefield') != -1) {
                option = graphs.options[graphs.options.length-1];
                option.value += cmd + "; ";
                graphs.options[graphs.options.length-1] = option;
            }

            // var eqnlabel
            else if (cmd.indexOf('var eqnlabel') != -1) {
                eqnlabel = command.slice(15,-1);
                option = graphs.options[graphs.options.length-1];
                option.value += command + "; ";
                option.text = eqnlabel;
            }

            // var eqntype, eqn1, eqn2
            else if (cmd.indexOf('var eqntype') != -1 ||
                     cmd.indexOf('var eqn1') != -1 ||
                     cmd.indexOf('var eqn2') != -1) {
                option = graphs.options[graphs.options.length-1];
                option.value += command + "; ";
            }

            // graph attributes
            else if (cmd) {
                node = document.getElementById('graph-'+cmd)
                if (node) {
                    node.value = value;
                }
            }

        }

        //this.graphit();
    },
    
    chgtext : function(tag,text)
    {
        var cnode = document.getElementById(tag);
        cnode.replaceChild(document.createTextNode(text),cnode.lastChild);
    }

};

tinyMCEPopup.onInit.add(AsciisvgDialog.init, AsciisvgDialog);
