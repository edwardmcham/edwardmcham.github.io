"""
main.py — Zensical Macros module.

Zensical's Macros extension lets any Markdown page call a Python
function by name using {{ function_name() }}. Whatever the function
returns is inserted directly into the page at that spot.

Zensical finds and calls define_env(env) automatically on every build —
nothing here is called manually. Every function a page is allowed to
use must be registered inside it with the @env.macro decorator.
"""

def define_env(env):
    """Required entry point Zensical looks for by name."""

    @env.macro
    def social_icons():
        """
        Build the row of contact/social icons shown at the top of the
        home and resume pages, from the same [[project.extra.social]]
        list in zensical.toml that the site footer already reads.

        Email is a special case: its link is rebuilt from
        site_author_email instead of the array's own `link` field, so
        the address only ever needs to change in one place. See
        overrides/partials/social.html for the matching footer logic.
        """
        extra = env.conf.get("extra", {})
        social = extra.get("social", [])
        email = extra.get("site_author_email", "")

        parts = []
        for entry in social:
            # Icon shortcode syntax uses hyphens, e.g.
            # ":fontawesome-solid-envelope:" — not the slash-separated
            # path used in zensical.toml.
            icon = entry["icon"].replace("/", "-")

            if "envelope" in entry["icon"]:
                link = "mailto:" + email
            else:
                link = entry["link"]

            # Markdown link syntax: [:icon-name:](url "title")
            parts.append('[:{}:]({} "{}")'.format(icon, link, entry["name"]))

        return '<span class="social-icons">\n' + "\n".join(parts) + "\n</span>"