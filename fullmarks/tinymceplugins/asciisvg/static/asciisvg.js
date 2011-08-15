jq(function() {
    jq('span.ASCIISvgScript').each(function(index, element) {
        drawgraph(element);
    });
});

