window.onload = () => {
    const eFormServer = document.getElementById("form-server");
    if (eFormServer instanceof HTMLFormElement) {
        const currentServer = localStorage.getItem("pinrs-server");
        if (currentServer) {
            const eInput = eFormServer.elements.namedItem("server");
            if (eInput instanceof HTMLInputElement) {
                eInput.value = currentServer;
            }
        }
        eFormServer.onsubmit = (event) => {
            event.preventDefault();
            if (!(event.target instanceof HTMLFormElement)) {
                return;
            }
            const eInput = event.target.elements.namedItem("server");
            if (!(eInput instanceof HTMLInputElement)) {
                return;
            }
            localStorage.setItem("pinrs-server", eInput.value);
        };
    }

    const eFormToken = document.getElementById("form-token");
    if (eFormToken instanceof HTMLFormElement) {
        const currentToken = localStorage.getItem("pinrs-token");
        if (currentToken) {
            const eInput = eFormToken.elements.namedItem("token");
            if (eInput instanceof HTMLInputElement) {
                eInput.value = currentToken;
            }
        }
        eFormToken.onsubmit = (event) => {
            event.preventDefault();
            if (!(event.target instanceof HTMLFormElement)) {
                return;
            }
            const eInput = event.target.elements.namedItem("token");
            if (!(eInput instanceof HTMLInputElement)) {
                return;
            }
            localStorage.setItem("pinrs-token", eInput.value);
        };
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

        eTheme.onchange = (event) => {
            if (!(event.target instanceof HTMLSelectElement)) {
                return;
            }

            localStorage.setItem("pinrs-theme", event.target.value);
        };
    }
};
