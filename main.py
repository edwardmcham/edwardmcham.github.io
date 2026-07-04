def define_env(env):
    @env.macro
    def social_icons():
        extra = env.conf.get("extra", {})
        social = extra.get("social", [])
        email = extra.get("site_author_email", "")

        parts = []
        for s in social:
            icon = s["icon"].replace("/", "-")
            if "envelope" in s["icon"]:
                link = "mailto:" + email
            else:
                link = s["link"]
            parts.append('[:{}:]({} "{}")'.format(icon, link, s["name"]))

        return '<span class="social-icons">\n' + "\n".join(parts) + "\n</span>"