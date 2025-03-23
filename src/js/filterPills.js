class FilterPills extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const url = new URL(window.location.href);
        const query = url.searchParams;
        let isFiltered = false;

        const eContainer = document.createElement("div");
        eContainer.style.display = "flex";
        eContainer.style.gap = "1rem";

        const eTags = document.createElement("span");
        for (const tagQuery of query.getAll("tags")) {
            const currentQuery = new URLSearchParams(url.search);
            // this is for handling tags separated with a ;, coming from the search form
            // first remove the "tags=tag1;tag2" query
            currentQuery.delete("tags", tagQuery);
            // then split "tag1;tag2" and re-add them one by one (if nothing to
            // split it will just be re-added again)
            const tags = tagQuery.split(";");
            for (const tag of tags) {
                currentQuery.append("tags", tag);
            }
            // create a pill for each tag
            for (const tag of tags) {
                if (!tag) {
                    continue;
                }
                isFiltered = true;
                const eTag = document.createElement("a");
                const queryForLink = new URLSearchParams(currentQuery);
                queryForLink.delete("tags", tag);
                const newUrl = new URL(url);
                newUrl.search = queryForLink.toString();
                eTag.href = newUrl.href;
                eTag.textContent = `x #${tag}`;
                eTag.classList.add("bookmark-tag");
                eTags.appendChild(eTag);
            }
        }

        for (const text of query.getAll("query")) {
            const eTag = document.createElement("a");
            const s = new URLSearchParams(url.search);
            s.delete("query", text);
            const newUrl = new URL(url);
            newUrl.search = s.toString();
            eTag.href = newUrl.href;
            eTag.textContent = `x ${text}`;
            eTag.classList.add("bookmark-tag");
            eTags.appendChild(eTag);
        }

        if (query.has("unread")) {
            const unread = query.get("unread");
            if (unread) {
                isFiltered = true;
                const eTag = document.createElement("a");
                const s = new URLSearchParams(url.search);
                s.delete("unread");
                const newUrl = new URL(url);
                newUrl.search = s.toString();
                eTag.href = newUrl.href;
                eTag.textContent = "x unread";
                eTag.classList.add("bookmark-tag");
                eTag.classList.add("bookmark-tag-unread");
                eTags.appendChild(eTag);
            }
        }

        if (isFiltered) {
            const eHeader = document.createElement("span");
            eHeader.textContent = "Current filter:";
            eContainer.appendChild(eHeader);
        }

        eContainer.appendChild(eTags);
        shadow.appendChild(eContainer);

        const eStyle = document.createElement("link");
        eStyle.setAttribute("rel", "stylesheet");
        eStyle.setAttribute("href", "css/style.css");
        shadow.appendChild(eStyle);
    }
}

customElements.define("filter-pills", FilterPills);
