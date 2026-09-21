const fs = require("fs");
const path = require("path");

// ============================================
// Template Service: Load HTML and replace variables
// ============================================

function loadTemplate(templateName) {
    const templatePath = path.join(__dirname, "../templates/emails", templateName);
    return fs.readFileSync(templatePath, "utf8");
}

function renderTemplate(templateName, variables) {
    let template = loadTemplate(templateName);
    
    // Replace {{variable}} with actual values
    for (const [key, value] of Object.entries(variables)) {
        template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    
    return template;
}

module.exports = {
    loadTemplate,
    renderTemplate
};