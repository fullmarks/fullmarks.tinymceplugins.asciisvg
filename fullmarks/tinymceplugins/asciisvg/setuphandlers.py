from Products.CMFCore.utils import getToolByName

def addCustomTags(site):
    pt = getToolByName(site, 'portal_transforms')

    safe_html_id = 'safe_html'
    transform = getattr(pt, safe_html_id)
    nasty = dict(transform.get_parameter_value('nasty_tags'))
    valid = dict(transform.get_parameter_value('valid_tags'))

    # we only add the svg tag as valid tag to prevent the transform from
    # stripping all svg tags from the DOM and leaving only text behind.
    # we regenerate the full svg image from scripts embedded in CDATA in
    # the page so we don't really need to store the full svg image
    valid['svg'] = '1'

    transform.set_parameters(nasty_tags_key=nasty.keys(),
                             nasty_tags_value=[str(s) for s in valid.values()],
                             valid_tags_key=valid.keys(),
                             valid_tags_value=[str(s) for s in valid.values()])
    transform._p_changed = True
    transform.reload()


def setup(context):
    """
    Setup ASCIISvg Plugin
    """
    # Only run step if a flag file is present (e.g. not an extension profile)
    if context.readDataFile('fullmarks.tinymceplugins.asciisvg_various.txt') \
            is None:
        return
    site = context.getSite()
    addCustomTags(site)
