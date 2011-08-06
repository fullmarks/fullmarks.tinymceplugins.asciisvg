function drawgraph(svgscript) {
    script = svgscript.innerHTML;
    // strip away comment tags
    script = script.slice(11, -5);

    // translate arrow markers to something ASCIIMathML expects
    script = script.replace('^-', '<-', 'g');
    script = script.replace('-^', '->', 'g');
    picture = svgscript.nextSibling;
    initialized = false;
    translateandeval(script);
}

