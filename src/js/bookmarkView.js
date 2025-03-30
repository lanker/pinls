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

        if (this._bookmark.description) {
            const eDescriptionTitle = document.createElement("h3");
            eDescriptionTitle.textContent = "Description";
            eContainer.appendChild(eDescriptionTitle);
            const eDescription = document.createElement("div");
            eDescription.textContent = this._bookmark.description;
            eContainer.appendChild(eDescription);
        }

        if (this._bookmark.notes) {
            const eNotesTitle = document.createElement("h3");
            eNotesTitle.textContent = "Notes";
            eContainer.appendChild(eNotesTitle);
            const eNotes = document.createElement("div");
            eNotes.textContent = this._bookmark.notes;
            eContainer.appendChild(eNotes);
        }

        // tags (create component)
        if (this._bookmark.tag_names.length > 0 || this._bookmark.unread) {
            const eNotesTitle = document.createElement("h3");
            eNotesTitle.textContent = "Tags";
            eContainer.appendChild(eNotesTitle);

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

            if (this._bookmark.unread) {
                const eTag = document.createElement("a");
                url.searchParams.set("unread", "yes");
                url.searchParams.delete("offset");
                eTag.href = url.href;
                eTag.textContent = "unread";
                eTag.classList.add("bookmark-tag");
                eTag.classList.add("bookmark-tag-unread");
                eTags.appendChild(eTag);
            }

            eContainer.appendChild(eTags);
        }

        // metadata
        {
            const eMetadata = document.createElement("div");
            eMetadata.classList.add("bookmark-metadata-container");

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

        // actions
        {
            const eActions = document.createElement("div");
            eActions.classList.add("bookmark-actions");

            const eEdit = document.createElement("a");
            eEdit.href = `add.html?id=${this._bookmark.id}`;
            eEdit.textContent = "Edit";
            eActions.appendChild(eEdit);

            const eDivider = document.createElement("span");
            eDivider.textContent = " | ";
            eActions.appendChild(eDivider);

            const eDeleteContainer = document.createElement("span");
            const eDelete = document.createElement("button");
            eDelete.type = "button";
            eDelete.textContent = "Delete";
            eDelete.id = "delete-button";
            eDelete.onclick = () => {
                const eDivider1 = document.createElement("span");
                eDivider1.textContent = "?: ";
                eDeleteContainer.appendChild(eDivider1);

                const eYes = document.createElement("button");
                eYes.textContent = "yes";
                eDeleteContainer.appendChild(eYes);
                eYes.onclick = async () => {
                    const server = localStorage.getItem("pinrs-server");
                    const token = localStorage.getItem("pinrs-token");
                    if (!this._bookmark || !server || !token) {
                        return;
                    }
                    try {
                        const url = new URL(`${server}/api/bookmarks/${this._bookmark.id}/`);
                        await fetch(url, {
                            method: "DELETE",
                            headers: {
                                "Content-type": "application/json",
                                Authorization: `Token ${token}`,
                            },
                        });
                        window.location.href = "index.html";
                    } catch (err) {
                        console.error(err);
                        console.error("Failed to delete", this._bookmark.id);
                        eDeleteContainer.replaceChildren(eDelete);
                    }
                };
                const eDivider2 = document.createElement("span");
                eDivider2.textContent = " | ";
                eDeleteContainer.appendChild(eDivider2);

                const eNo = document.createElement("button");
                eNo.textContent = "no";
                eNo.onclick = () => {
                    eDeleteContainer.replaceChildren(eDelete);
                };
                eDeleteContainer.appendChild(eNo);
            };
            eDeleteContainer.appendChild(eDelete);
            eActions.appendChild(eDeleteContainer);

            eContainer.appendChild(eActions);
        }

        const eClose = document.createElement("button");
        eClose.classList.add("close-button");
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
