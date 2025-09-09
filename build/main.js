const axios = require("axios");
async function getList(user_name, repo_name, sub_folder = '', token) {
    let status = "true";
    try {
        const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${sub_folder}`;
        const headers = token ? { 'Authorization': `token ${token}` } : {};
        const fetch = await axios(url, { headers });
        const data = await fetch.data;
        let returnData = [];
        data.forEach((obj) => {
            if (obj.type == "file" &&
                /([a-zA-Z0-9\s_\\.\-:])+(.md)$/gi.test(obj.name)) {
                returnData.push(obj.name);
            }
        });
        returnData.push({ status: status });
        return returnData;
    }
    catch (error) {
        status = "false";
        return { status: status, error: "Invalid user name or repo name" };
    }
}
async function getContent(user_name, repo_name, file_path, token) {
    let status = "true";
    if (!/([a-zA-Z0-9\s_\\.\-:])+(.md)$/gi.test(file_path)) {
        status = "false";
        return { status: status, error: "Invalid File Path" };
    }
    try {
        const hljs = require("highlight.js");
        const markdown_converter = require("markdown-it")({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return ('<pre class="hljs custom-code-hljs-class"><code>' +
                            hljs.highlight(str, { language: lang, ignoreIllegals: true })
                                .value +
                            "</code></pre>");
                    }
                    catch (__) { }
                }
                return ('<pre class="hljs custom-code-hljs-class"><code>' +
                    markdown_converter.utils.escapeHtml(str) +
                    "</code></pre>");
            },
        }).use(require('markdown-it-emoji'))
            .use(require('markdown-it-deflist'))
            .use(require('markdown-it-sub'))
            .use(require('markdown-it-sup'))
            .use(require('markdown-it-ins'))
            .use(require('markdown-it-mark'))
            .use(require('markdown-it-footnote'));
        const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${file_path}`;
        const headers = token ? { 'Authorization': `token ${token}` } : {};
        const fetch = await axios(url, { headers });
        const data = await fetch.data;
        const content = markdown_converter.render(atob(data.content));
        status = "true";
        return { status: status, content_markdown: atob(data.content), content_html: content };
    }
    catch (error) {
        status = "false";
        return { status: status, error: "Invalid user name or repo name" };
    }
}
async function search(keyword, user_name, repo_name, token) {
    let status = 'false';
    if (keyword.length == 0 || user_name.length == 0 || repo_name.length == 0) {
        status = "false";
        return { status: status, error: "Provide Valid Data!" };
    }
    try {
        const url = `https://api.github.com/search/code?q=${keyword}+repo:${user_name}/${repo_name}`;
        const headers = token ? { 'Authorization': `token ${token}` } : {};
        const fetch = await axios(url, { headers });
        const data = await fetch.data;
        const returnData = [];
        const returnDataItems = [];
        if (data.total_count > 0) {
            data.items.forEach((item) => {
                if (/([a-zA-Z0-9\s_\\.\-:])+(.md)$/gi.test(item.name)) {
                    returnDataItems.push({
                        filename: item.name,
                        file_path: item.path,
                    });
                }
                else {
                    status = "false";
                    return { status: status, error: "No Markdown File Found" };
                }
            });
            status = 'true';
            returnData.push({ status: status, total_count: returnDataItems.length }, returnDataItems);
            return returnData;
        }
        else {
            status = "false";
            return { status: status, error: "Nothing Found!" };
        }
    }
    catch (error) {
        status = "false";
        return { status: status, error: "Invalid user name or repo name" };
    }
    ;
}
async function createFile(user_name, repo_name, file_path, content, token, commit_message) {
    let status = "true";
    if (!token) {
        status = "false";
        return { status: status, error: "Token is required for write operations" };
    }
    if (!/([a-zA-Z0-9\s_\\.\-:])+(.md)$/gi.test(file_path)) {
        status = "false";
        return { status: status, error: "Only .md files are supported" };
    }
    try {
        const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${file_path}`;
        const headers = { 'Authorization': `token ${token}` };
        // Check if file already exists
        let sha = null;
        try {
            const existingFile = await axios(url, { headers });
            sha = existingFile.data.sha;
        }
        catch (error) {
            // File doesn't exist, which is fine for creation
        }
        const data = {
            message: commit_message || `Create ${file_path}`,
            content: btoa(content),
            ...(sha && { sha: sha }) // Include sha if updating existing file
        };
        const response = await axios.put(url, data, { headers });
        status = "true";
        return {
            status: status,
            message: sha ? "File updated successfully" : "File created successfully",
            file: response.data.content
        };
    }
    catch (error) {
        status = "false";
        return {
            status: status,
            error: error.response?.data?.message || "Failed to create/update file"
        };
    }
}
async function updateFile(user_name, repo_name, file_path, content, token, commit_message) {
    let status = "true";
    if (!token) {
        status = "false";
        return { status: status, error: "Token is required for write operations" };
    }
    if (!/([a-zA-Z0-9\s_\\.\-:])+(.md)$/gi.test(file_path)) {
        status = "false";
        return { status: status, error: "Only .md files are supported" };
    }
    try {
        const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${file_path}`;
        const headers = { 'Authorization': `token ${token}` };
        // Get existing file to get SHA
        const existingFile = await axios(url, { headers });
        const sha = existingFile.data.sha;
        const data = {
            message: commit_message || `Update ${file_path}`,
            content: btoa(content),
            sha: sha
        };
        const response = await axios.put(url, data, { headers });
        status = "true";
        return {
            status: status,
            message: "File updated successfully",
            file: response.data.content
        };
    }
    catch (error) {
        status = "false";
        return {
            status: status,
            error: error.response?.data?.message || "Failed to update file"
        };
    }
}
async function deleteFile(user_name, repo_name, file_path, token, commit_message) {
    let status = "true";
    if (!token) {
        status = "false";
        return { status: status, error: "Token is required for write operations" };
    }
    try {
        const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${file_path}`;
        const headers = { 'Authorization': `token ${token}` };
        // Get existing file to get SHA
        const existingFile = await axios(url, { headers });
        const sha = existingFile.data.sha;
        const data = {
            message: commit_message || `Delete ${file_path}`,
            sha: sha
        };
        await axios.delete(url, { data, headers });
        status = "true";
        return {
            status: status,
            message: "File deleted successfully"
        };
    }
    catch (error) {
        status = "false";
        return {
            status: status,
            error: error.response?.data?.message || "Failed to delete file"
        };
    }
}
async function createFolder(user_name, repo_name, folder_path, token, commit_message) {
    let status = "true";
    if (!token) {
        status = "false";
        return { status: status, error: "Token is required for write operations" };
    }
    try {
        // Create a .gitkeep file to create the folder
        const file_path = folder_path.endsWith('/') ? `${folder_path}.gitkeep` : `${folder_path}/.gitkeep`;
        const content = `# ${folder_path}\n\nThis folder was created using MarkGit.`;
        const result = await createFile(user_name, repo_name, file_path, content, token, commit_message || `Create folder ${folder_path}`);
        if (result.status === "true") {
            return {
                status: "true",
                message: `Folder ${folder_path} created successfully`,
                folder_path: folder_path
            };
        }
        else {
            return result;
        }
    }
    catch (error) {
        status = "false";
        return {
            status: status,
            error: error.message || "Failed to create folder"
        };
    }
}
module.exports = {
    getList,
    getContent,
    search,
    createFile,
    updateFile,
    deleteFile,
    createFolder
};
