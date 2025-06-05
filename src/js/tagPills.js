export class TagPills extends HTMLElement {
    /**
     * @param {BookmarkResponse["tag_names"]} tags
     */

    set tags(tags) {
        this._tags = tags;
    }
    connectedCallback() {
        if (!this._tags) {
            return;
        }

        const shadow = this.attachShadow({ mode: "open" });
        const url = new URL(window.location.href);
        const eTags = document.createElement("div");
        eTags.classList.add("bookmark-tags");
        for (const tag of this._tags) {
            const eTag = document.createElement("a");
            const existingTags = url.searchParams.getAll("tags");
            const newUrl = new URL(url);
            if (!existingTags.includes(tag)) {
                const s = new URLSearchParams(newUrl.search);
                s.append("tags", tag);
                s.delete("offset");
                newUrl.search = s.toString();
            }
            eTag.href = newUrl.href;
            eTag.textContent = `#${tag}`;
            eTag.classList.add("bookmark-tag");
            eTags.appendChild(eTag);
        }

        if (this.hasAttribute("unread")) {
            const eTag = document.createElement("a");
            url.searchParams.set("unread", "yes");
            url.searchParams.delete("offset");
            eTag.href = url.href;
            eTag.textContent = "unread";
            eTag.classList.add("bookmark-tag");
            eTag.classList.add("bookmark-tag-unread");
            eTags.appendChild(eTag);
        }

        const eStyle = document.createElement("link");
        eStyle.setAttribute("rel", "stylesheet");
        eStyle.setAttribute("href", "css/style.css");
        shadow.appendChild(eStyle);
        shadow.appendChild(eTags);
    }
}

customElements.define("tag-pills", TagPills);
