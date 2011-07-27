$(function() {
    $('span.ASCIISvgScript').each(function(index, element) {
        script = element.innerHTML;
        picture = element.nextSibling;
        initialized = false;
        translateandeval(script);
    });
});
