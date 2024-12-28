/** @import { BookmarksResponse } from "./index.js" */

class BookmarkList extends HTMLElement {
    /**
     * @param {URLSearchParams} query
     * @returns {Promise<BookmarksResponse>}
     */
    async getBookmarks(query) {
        const url = new URL("http://localhost:3000/api/bookmarks");

        const unread = query.get("unread");
        if (unread) {
            url.searchParams.append("unread", "yes");
        }

        const offset = query.get("offset");
        if (offset) {
            url.searchParams.append("offset", offset);
        }

        let q = "";
        if (query.has("tags")) {
            const qTags = [];
            const tags = query.getAll("tags");
            for (const tag of tags) {
                // tags coming from form is separated with ;
                const tagParts = tag.split(";");
                for (const tagPart of tagParts) {
                    if (!tagPart) {
                        continue;
                    }
                    qTags.push(tagPart);
                }
            }
            if (qTags.length > 0) {
                q = `#${qTags.join(" #")?.toString()}`;
            }
        }

        if (query.has("query")) {
            q += `${q ? " " : ""}${query.getAll("query").join(" ")?.toString()}`;
        }

        if (q) {
            url.searchParams.append("q", q);
        }

        const res = await fetch(url, {
            headers: {
                "Content-type": "application/json",
                Authorization: "Token abc123",
            },
        });
        const content = await res.json();
        return content;
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const query = new URL(document.location.toString()).searchParams;

        const bookmarks = await this.getBookmarks(query);

        const eList = document.createElement("ul");
        for (const bookmark of bookmarks.results) {
            const eListItem = document.createElement("bookmark-item");
            // @ts-ignore don't know how to make BookmarkItem the correct type
            eListItem.bookmark = bookmark;
            // const eListItem = document.createElement("li");
            // eListItem.innerHTML = `<a href=${bookmark.url}>${bookmark.title}</a>`;
            eList.appendChild(eListItem);
        }

        shadow.appendChild(eList);

        const eStyle = document.createElement("link");
        eStyle.setAttribute("rel", "stylesheet");
        eStyle.setAttribute("href", "css/style.css");
        shadow.appendChild(eStyle);
    }
}

customElements.define("bookmark-list", BookmarkList);
