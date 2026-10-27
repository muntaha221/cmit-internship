const fs = require("fs");
const path = require("path");

function renderTemplate(templateName, variables) {
    const filePath = path.join(__dirname, "../templates/emails", templateName);
    let html = fs.readFileSync(filePath, "utf8");

    for (const [key, value] of Object.entries(variables)) {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return html;
}

module.exports = { renderTemplate };