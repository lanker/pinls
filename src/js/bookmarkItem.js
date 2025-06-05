/** @import { BookmarkResponse } from "./index.js" */

class BookmarkItem extends HTMLElement {
    static observedAttributes = ["url", "title"];

    /**
     * @param {BookmarkResponse} bookmark
     */
    set bookmark(bookmark) {
        this._bookmark = bookmark;
    }

    connectedCallback() {
        if (!this._bookmark) {
            return;
        }

        const shadow = this.attachShadow({ mode: "open" });
        const eContainer = document.createElement("li");

        const eAdded = document.createElement("span");
        eAdded.textContent = new Date(Date.parse(this._bookmark.date_added)).toLocaleDateString();
        eAdded.title = new Date(Date.parse(this._bookmark.date_added)).toISOString();
        eAdded.classList.add("bookmark-added");
        eContainer.appendChild(eAdded);

        const eTitle = document.createElement("a");
        eTitle.href = this._bookmark.url;
        eTitle.textContent = this._bookmark.title;
        eTitle.classList.add("bookmark-title");
        if (this._bookmark.unread) {
            eTitle.classList.add("bookmark-title-unread");
        }
        eContainer.appendChild(eTitle);

        const eUrl = document.createElement("a");
        eUrl.href = this._bookmark.url;
        eUrl.textContent = this._bookmark.url;
        eUrl.classList.add("bookmark-url");
        eContainer.appendChild(eUrl);

        for (const item of [
            { value: this._bookmark.description },
            { header: "Notes", value: this._bookmark.notes },
        ]) {
            if (!item.value) {
                continue;
            }
            const eWrapper = document.createElement("p");

            if (item.header) {
                const eHeader = document.createElement("div");
                eHeader.classList.add("bookmark-description-header");
                eHeader.textContent = item.header;
                eWrapper.append(eHeader);
            }

            const eValue = document.createElement("div");
            eValue.textContent = item.value;
            eValue.title = item.value;
            eValue.classList.add("bookmark-description");
            eWrapper.append(eValue);
            eContainer.appendChild(eWrapper);
        }

        if (this._bookmark.tag_names.length > 0) {
            /** @import { TagPills } from "./tagPills.js" */
            const eTags = /** @type {TagPills} */ (document.createElement("tag-pills"));
            eTags.tags = this._bookmark.tag_names;
            if (this._bookmark.unread) {
                eTags.setAttribute("unread", "");
            }
            eContainer.appendChild(eTags);
        }

        const eActions = document.createElement("div");
        eActions.classList.add("bookmark-actions");

        const eView = document.createElement("button");
        eView.type = "button";
        eView.textContent = "View";
        eView.onclick = () => {
            if (!this._bookmark) {
                return;
            }
            const eViewer = /** @type {BookmarkView} */ (document.createElement("bookmark-view"));
            eViewer.bookmark = this._bookmark;
            shadow.appendChild(eViewer);
        };
        eActions.appendChild(eView);

        const eDivider = document.createElement("span");
        eDivider.textContent = " | ";
        eActions.appendChild(eDivider);

        const eEdit = document.createElement("a");
        eEdit.href = `add.html?id=${this._bookmark.id}`;
        eEdit.textContent = "Edit";
        eActions.appendChild(eEdit);

        eContainer.appendChild(eActions);
        shadow.appendChild(eContainer);

        const eStyle = document.createElement("link");
        eStyle.setAttribute("rel", "stylesheet");
        eStyle.setAttribute("href", "css/style.css");
        shadow.appendChild(eStyle);
    }
}

customElements.define("bookmark-item", BookmarkItem);
