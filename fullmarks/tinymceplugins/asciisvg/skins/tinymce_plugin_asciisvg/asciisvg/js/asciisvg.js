$(function() {
    $('span.ASCIISvgScript').each(function(index, element) {
        script = element.innerHTML;
        // strip away comment tags
        script = script.slice(11, -5);
        console.log(script);
        // translate arrow markers to something ASCIIMathML expects
        script = script.replace('^-', '<-', 'g');
        script = script.replace('-^', '->', 'g');
        picture = element.nextSibling;
        initialized = false;
        translateandeval(script);
    });
});
