$(function() {
    $('span.ASCIISvgScript').each(function(index, element) {
        script = element.innerHTML;
        // strip away comment tags
        script = script.slice(11, -5);
        picture = element.nextSibling;
        initialized = false;
        translateandeval(script);
    });
});
