/**
 * @typedef {Object} TagResponse
 * @property {string} id
 * @property {string} name
 * @property {string} date_added
 */

/**
 * @typedef {Object} TagsResponse
 * @property {number} count
 * @property {TagResponse[]} results
 */

/**
 * @typedef {Object} BookmarkRequest
 * @property {string} url
 * @property {string} title
 * @property {string} [description]
 * @property {string} [notes]
 * @property {boolean} [unread]
 * @property {string[]} [tag_names]
 */

const server = localStorage.getItem("pinrs-server");
if (!server) {
    window.location.href = "settings.html";
}

const token = localStorage.getItem("pinrs-token");
if (!token) {
    window.location.href = "settings.html";
}

const theme = localStorage.getItem("pinrs-theme");
if (theme) {
    const eTheme = document.getElementById("color-scheme");
    if (eTheme instanceof HTMLSelectElement) {
        for (const eOption of Array.from(eTheme.options)) {
            if (eOption.value === theme) {
                eOption.selected = true;
            }
        }
    }
}

/** @type {BookmarkResponse["id"] | undefined} */
let bookmarkToEdit;

const tagsState = {
    /**
     * @type Set<string>
     */
    tags: new Set(),
    set selectedTags(newTags) {
        this.tags = newTags;

        const eForm = document.getElementById("add-form");
        if (!(eForm instanceof HTMLFormElement)) {
            return;
        }
        const eTagsInput = eForm.elements.namedItem("add-tags");
        const eTagsSelected = document.getElementById("selected-tags");
        if (
            !(eTagsInput instanceof HTMLInputElement) ||
            !(eTagsSelected instanceof HTMLDivElement)
        ) {
            return;
        }
        eTagsSelected.textContent = "";
        for (const tag of this.selectedTags) {
            const eTagOutput = document.createElement("output");
            eTagOutput.onclick = () => {
                this.tags.delete(tag);
                this.selectedTags = this.tags;
            };
            eTagOutput.textContent = tag;
            eTagOutput.classList.add("bookmark-tag");
            eTagsSelected.appendChild(eTagOutput);
        }
    },
    get selectedTags() {
        return this.tags;
    },
};

window.onload = async () => {
    const eForm = document.getElementById("add-form");
    if (!(eForm instanceof HTMLFormElement)) {
        return;
    }
    const eTagsDataList = document.getElementById("tags-list");
    const eTagsInput = eForm.elements.namedItem("add-tags");
    const eTagsSelected = document.getElementById("selected-tags");
    if (
        eTagsInput instanceof HTMLInputElement &&
        eTagsSelected instanceof HTMLDivElement &&
        eTagsDataList instanceof HTMLDataListElement
    ) {
        eTagsInput.onchange = () => {
            tagsState.selectedTags.add(eTagsInput.value);
            // biome-ignore lint/correctness/noSelfAssign: we want to trigger the set function
            tagsState.selectedTags = tagsState.selectedTags;
            eTagsInput.value = "";
        };

        const url = new URL(`${server}/api/tags/`);
        const res = await fetch(url, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Token ${token}`,
            },
        });
        /** @type {TagsResponse} */
        const content = await res.json();
        eTagsDataList.textContent = "";
        for (const tag of content.results) {
            const eOption = document.createElement("option");
            eOption.value = tag.name;
            eTagsDataList.appendChild(eOption);
        }

        // are we editing?
        const id = new URL(window.location.href).searchParams.get("id");
        if (id) {
            const url = new URL(`${server}/api/bookmarks/${id}/`);
            const res = await fetch(url, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${token}`,
                },
            });

            /** @type {BookmarkResponse} */
            const bookmark = await res.json();
            bookmarkToEdit = bookmark.id;

            const eUrlInput = eForm.elements.namedItem("add-url");
            const eTitleInput = eForm.elements.namedItem("add-title");
            const eDescriptionInput = eForm.elements.namedItem("add-description");
            const eNotesInput = eForm.elements.namedItem("add-notes");
            const eUnreadInput = eForm.elements.namedItem("add-unread");

            if (
                eUrlInput instanceof HTMLInputElement &&
                eTitleInput instanceof HTMLInputElement &&
                eDescriptionInput instanceof HTMLTextAreaElement &&
                eNotesInput instanceof HTMLTextAreaElement &&
                eUnreadInput instanceof HTMLInputElement
            ) {
                eUrlInput.value = bookmark.url;
                eTitleInput.value = bookmark.title;
                eDescriptionInput.value = bookmark.description;
                eNotesInput.value = bookmark.notes;
                eUnreadInput.checked = bookmark.unread;
                for (const tag of bookmark.tag_names) {
                    tagsState.selectedTags.add(tag);
                }
                // biome-ignore lint/correctness/noSelfAssign: we want to trigger the set function
                tagsState.selectedTags = tagsState.selectedTags;
            }
        }
    }

    eForm.onsubmit =
        /**
         * @param {SubmitEvent} ev
         */
        async (ev) => {
            ev.preventDefault();
            console.log("HEJ");
            const eUrlInput = eForm.elements.namedItem("add-url");
            const eTitleInput = eForm.elements.namedItem("add-title");
            const eDescriptionInput = eForm.elements.namedItem("add-description");
            const eNotesInput = eForm.elements.namedItem("add-notes");
            const eUnreadInput = eForm.elements.namedItem("add-unread");

            if (
                !(
                    eUrlInput instanceof HTMLInputElement &&
                    eTitleInput instanceof HTMLInputElement &&
                    eDescriptionInput instanceof HTMLTextAreaElement &&
                    eNotesInput instanceof HTMLTextAreaElement &&
                    eUnreadInput instanceof HTMLInputElement
                )
            ) {
                console.error("Missing data");
                return;
            }

            /** @type {BookmarkRequest} */
            const body = {
                url: eUrlInput.value,
                title: eTitleInput.value,
                description: eDescriptionInput.value,
                notes: eNotesInput.value,
                unread: eUnreadInput.checked,
                tag_names: Array.from(tagsState.selectedTags),
            };

            const url = bookmarkToEdit
                ? new URL(`${server}/api/bookmarks/${bookmarkToEdit}/`)
                : new URL(`${server}/api/bookmarks/`);
            await fetch(url, {
                method: bookmarkToEdit ? "PUT" : "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${token}`,
                },
            });
            window.location.href = "index.html";
        };
};
