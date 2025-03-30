window.onload = () => {
    const eFormSettings = document.getElementById("form-settings");
    if (!(eFormSettings instanceof HTMLFormElement)) {
        return;
    }

    eFormSettings.onsubmit = (event) => {
        event.preventDefault();
        if (!(event.target instanceof HTMLFormElement)) {
            return;
        }
        const eServer = event.target.elements.namedItem("server");
        if (!(eServer instanceof HTMLInputElement)) {
            return;
        }
        localStorage.setItem("pinrs-server", eServer.value);

        const eToken = event.target.elements.namedItem("token");
        if (!(eToken instanceof HTMLInputElement)) {
            return;
        }
        localStorage.setItem("pinrs-token", eToken.value);

        const eTheme = event.target.elements.namedItem("theme");
        if (!(eTheme instanceof HTMLSelectElement)) {
            return;
        }
        localStorage.setItem("pinrs-theme", eTheme.value);

        window.location.href = "index.html";
    };

    const eTestServer = eFormSettings.elements.namedItem("test-server");
    if (eTestServer instanceof HTMLButtonElement) {
        eTestServer.onclick = async () => {
            console.log("test");
            const eServer = eFormSettings.elements.namedItem("server");
            const eToken = eFormSettings.elements.namedItem("token");
            if (!(eServer instanceof HTMLInputElement) || !(eToken instanceof HTMLInputElement)) {
                return;
            }
            eServer.onchange = () => {
                eTestServer.classList.remove("success");
                eTestServer.classList.remove("failure");
            };
            eToken.onchange = () => {
                eTestServer.classList.remove("success");
                eTestServer.classList.remove("failure");
            };
            const server = eServer.value;
            const token = eToken.value;
            const url = new URL(`${server}/api/bookmarks/?limit=1`);
            try {
                const res = await fetch(url, {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });
                if (res.status === 200) {
                    eTestServer.classList.add("success");
                } else {
                    eTestServer.classList.remove("success");
                    eTestServer.classList.add("failure");
                }
            } catch (err) {
                eTestServer.classList.remove("success");
                eTestServer.classList.add("failure");
                console.error(err);
            }
        };
    }

    const currentServer = localStorage.getItem("pinrs-server");
    if (currentServer) {
        const eInput = eFormSettings.elements.namedItem("server");
        if (eInput instanceof HTMLInputElement) {
            eInput.value = currentServer;
        }
    }

    const currentToken = localStorage.getItem("pinrs-token");
    if (currentToken) {
        const eInput = eFormSettings.elements.namedItem("token");
        if (eInput instanceof HTMLInputElement) {
            eInput.value = currentToken;
        }
    }

    const eTheme = document.getElementById("color-scheme");
    if (eTheme instanceof HTMLSelectElement) {
        const currentTheme = localStorage.getItem("pinrs-theme");
        if (currentTheme) {
            for (const eOption of Array.from(eTheme.options)) {
                if (eOption.value === currentTheme) {
                    eOption.selected = true;
                }
            }
        }
    }
};
