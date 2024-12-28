import "./bookmarkList.js";
import "./bookmarkItem.js";
import "./filterPills.js";
import "./pagination.js";

/**
 * @typedef {Object} BookmarkResponse
 * @property {string} id
 * @property {string} url
 * @property {string} title
 * @property {string} description
 * @property {string} notes
 * @property {boolean} unread
 * @property {string[]} tag_names
 * @property {string} date_added
 * @property {string} date_modified
 */

/**
 * @typedef {Object} BookmarksResponse
 * @property {number} count
 * @property {BookmarkResponse[]} results
 */

const eForm = document.getElementById("query-form");
if (eForm) {
    eForm.onsubmit = () => {
        // add current tags and unread state to the hidden form inputs, to be
        // able to retrieve them again after the form has been submitted
        const eInputTags = document.getElementById("query-tags");
        if (eInputTags && eInputTags instanceof HTMLInputElement) {
            const s = new URLSearchParams(window.location.search);
            const tags = s.getAll("tags");
            /** @type {string[]} */
            const q = [];
            for (const tag of tags) {
                q.push(`${tag}`);
            }
            eInputTags.value = q.join(";");
        }
        const eInputUnread = document.getElementById("query-unread");
        if (eInputUnread && eInputUnread instanceof HTMLInputElement) {
            const s = new URLSearchParams(window.location.search);
            const unread = s.get("unread");
            if (unread) {
                eInputUnread.value = `unread=${unread}`;
            }
        }
    };
}
const eSearchDataList = document.getElementById("query-list");
const eSearchInput = document.getElementById("query-text");
if (
    eSearchInput &&
    eSearchInput instanceof HTMLInputElement &&
    eSearchDataList &&
    eSearchDataList instanceof HTMLDataListElement
) {
    eSearchInput.oninput = async () => {
        const value = eSearchInput.value;
        if (value.length < 3) {
            return;
        }

        const url = new URL("http://localhost:3000/api/bookmarks");
        url.searchParams.set("q", value);
        url.searchParams.set("limit", "5");
        const res = await fetch(url, {
            headers: {
                "Content-type": "application/json",
                Authorization: "Token abc123",
            },
        });
        /** @type {BookmarksResponse} */
        const content = await res.json();
        eSearchDataList.textContent = "";
        for (const bookmark of content.results) {
            const eOption = document.createElement("option");
            eOption.value = bookmark.title.replaceAll("-", "");
            eSearchDataList.appendChild(eOption);
        }
    };
}
