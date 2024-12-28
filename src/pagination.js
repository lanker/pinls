const DEFAULT_NUMBER_OF_POSTS = 100;

class Pagination extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const url = new URL(window.location.href);
        const query = url.searchParams;

        const eContainer = document.createElement("div");
        eContainer.classList.add("bookmark-pagination");

        const currentOffset = Number(query.get("offset")) ?? 0;

        if (currentOffset > 0) {
            const offsetPrevious = Math.max(currentOffset - DEFAULT_NUMBER_OF_POSTS, 0);
            const previousUrl = new URL(url);
            const previousQuery = new URLSearchParams(previousUrl.search);
            previousQuery.set("offset", offsetPrevious.toString());
            previousUrl.search = previousQuery.toString();
            const ePrevious = document.createElement("a");
            ePrevious.href = previousUrl.href;
            ePrevious.textContent = "< newer";
            eContainer.appendChild(ePrevious);
        } else {
            // empty span to take up the space...
            eContainer.appendChild(document.createElement("span"));
        }

        const offsetNext = Math.min(
            currentOffset + DEFAULT_NUMBER_OF_POSTS,
            100000, // TODO: get number of bookmarks,
        );
        const nextUrl = new URL(url);
        const nextQuery = new URLSearchParams(nextUrl.search);
        nextQuery.set("offset", offsetNext.toString());
        nextUrl.search = nextQuery.toString();
        const eNext = document.createElement("a");
        eNext.href = nextUrl.href;
        eNext.textContent = "older >";
        eContainer.appendChild(eNext);

        shadow.appendChild(eContainer);

        const eStyle = document.createElement("link");
        eStyle.setAttribute("rel", "stylesheet");
        eStyle.setAttribute("href", "css/style.css");
        shadow.appendChild(eStyle);
    }
}

customElements.define("bookmark-pagination", Pagination);
