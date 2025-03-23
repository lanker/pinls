class BookmarkView extends HTMLElement {
    static observedAttributes = ["url", "title"];

    /**
     * @param {BookmarkResponse} bookmark
     */
    set bookmark(bookmark) {
        this._bookmark = bookmark;
    }

    disconnectedCallback() {
        console.log("disconnectedCallback");
        this.remove();
    }

    connectedCallback() {
        if (!this._bookmark) {
            return;
        }

        const shadow = this.attachShadow({ mode: "open" });
        const eContainer = document.createElement("dialog");

        eContainer.onmousedown = (ev) => {
            if (ev.target === eContainer) {
                this.remove();
            }
        };

        const eTitle = document.createElement("h2");
        eTitle.textContent = this._bookmark.title;
        eContainer.appendChild(eTitle);

        const eUrl = document.createElement("a");
        eUrl.href = this._bookmark.url;
        eUrl.textContent = this._bookmark.url;
        eContainer.appendChild(eUrl);

        const eDescription = document.createElement("div");
        eDescription.textContent = this._bookmark.description;
        eContainer.appendChild(eDescription);

        const eNotes = document.createElement("div");
        eNotes.textContent = this._bookmark.notes;
        eContainer.appendChild(eNotes);

        // tags (create component)
        {
            const url = new URL(window.location.href);
            const eTags = document.createElement("div");
            eTags.classList.add("bookmark-tags");
            for (const tag of this._bookmark.tag_names) {
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
            eContainer.appendChild(eTags);
        }
        // metadata
        {
            const eMetadata = document.createElement("div");
            eMetadata.classList.add("bookmark-view-metadata-container");

            const eDateAdded = document.createElement("span");
            eDateAdded.textContent = `Added: ${new Date(Date.parse(this._bookmark.date_added)).toLocaleDateString()}`;
            eDateAdded.title = this._bookmark.date_added;
            eMetadata.appendChild(eDateAdded);

            const eDateModified = document.createElement("span");
            eDateModified.textContent = ` | Modifed: ${new Date(Date.parse(this._bookmark.date_modified)).toLocaleDateString()}`;
            eDateModified.title = this._bookmark.date_modified;
            eMetadata.appendChild(eDateModified);

            eContainer.appendChild(eMetadata);
        }

        const eClose = document.createElement("button");
        eClose.textContent = "Close";
        eClose.type = "button";
        eClose.onclick = () => {
            this.remove();
        };
        eContainer.appendChild(eClose);

        shadow.appendChild(eContainer);

        const eStyle = document.createElement("link");
        eStyle.setAttribute("rel", "stylesheet");
        eStyle.setAttribute("href", "css/style.css");
        shadow.appendChild(eStyle);

        eContainer.showModal();
    }
}

customElements.define("bookmark-view", BookmarkView);
