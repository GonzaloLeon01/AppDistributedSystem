export default class AuthLayout {
    constructor(selector) {
        this.container = document.getElementById(selector);
        this.render();
    }

    render() {
        const layoutHtml = `
            <header class="auth-layout-header">
                <h1>Frontend</h1>
            </header>
            <div class="auth-layout-content-container">
                <div id="layout-content">
                </div>
            </div>
        `;
        this.container.innerHTML = layoutHtml;
    }
}