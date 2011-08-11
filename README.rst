Introduction
============

A TinyMCE plugin for Plone to render a function of a graph as SVG and it
requires a browser that can render SVG.

It is based on the TinyMCE plugin written by David Lippman as part of
the IMathAS project: http://www.imathas.com/. A demo of the IMathAS
version of the plugin is available here:
http://www.imathas.com/editordemo/demo.html

For FullMarks (and Plone), the plugin has been modified to always render
SVG and not use any fallbacks that generate images server-side.

Additionally it uses the latest version (ver 2.0) of the ASCIIMATH
javascript library by Peter Jipsen available here:
http://mathcs.chapman.edu/~jipsen/mathml/asciimath.html

This plugin was developed as part of the FullMarks project funded by the
Shuttleworth Foundation, an open educational repository of model
questions and answers. See http://www.fullmarks.org.za and
http://github.com/fullmarks for more information.

Installation
============

1. Add as an egg to your buildout and rerun buildout::

    [buildout]
    eggs =
        fullmarks.tinymceplugins.asciisvg

2. Navigate to Add-ons in the Site Setup area of your Plone site.

3. Activate the TinyMCE ASCIISvg plugin
