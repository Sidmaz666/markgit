const axios = require("axios");

// Polyfills for Node.js environment
if (typeof global !== 'undefined' && typeof global.btoa === 'undefined') {
  global.btoa = function(str: string): string {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof global !== 'undefined' && typeof global.atob === 'undefined') {
  global.atob = function(str: string): string {
    return Buffer.from(str, 'base64').toString('binary');
  };
}

// Browser environment polyfills
if (typeof window !== 'undefined' && typeof window.btoa === 'undefined') {
  (window as any).btoa = function(str: string): string {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof window !== 'undefined' && typeof window.atob === 'undefined') {
  (window as any).atob = function(str: string): string {
    return Buffer.from(str, 'base64').toString('binary');
  };
}

// Universal btoa/atob functions
const universalBtoa = (str: string): string => {
  if (typeof btoa !== 'undefined') {
    return btoa(str);
  } else if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'binary').toString('base64');
  } else {
    throw new Error('btoa is not available in this environment');
  }
};

const universalAtob = (str: string): string => {
  if (typeof atob !== 'undefined') {
    return atob(str);
  } else if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString('binary');
  } else {
    throw new Error('atob is not available in this environment');
  }
};

// Helper function to get MIME type for image files
const getMimeType = (extension: string | undefined): string => {
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon'
  };
  return mimeTypes[extension || ''] || 'application/octet-stream';
};

async function getList(
  user_name: string,
  repo_name: string,
  sub_folder:string = '',
  token?: string
): Promise<any[] | object> {
  let status: string = "true";

  try {
    const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${sub_folder}`;
    const headers = token ? { 'Authorization': `token ${token}` } : {};
    const fetch = await axios(url, { headers });
    const data = await fetch.data;
    let returnData = [];

    data.forEach((obj: any) => {
      if (
        obj.type == "file" &&
        /([a-zA-Z0-9\s_\\.\-:])+(\.(md|json|jpg|jpeg|png|gif|svg|webp|bmp|ico))$/gi.test(obj.name)
      ) {
        returnData.push(obj.name);
      }
    });

    returnData.push({ status: status });
    return returnData;
  } catch (error) {
    status = "false";
    return { status: status, error: "Invalid user name or repo name" };
  }
}

async function getContent(
  user_name: string,
  repo_name: string,
  file_path: string,
  token?: string
): Promise<any> {
  let status: string = "true";

  if (!/([a-zA-Z0-9\s_\\.\-:])+(\.(md|json|jpg|jpeg|png|gif|svg|webp|bmp|ico))$/gi.test(file_path)) {
    status = "false";
    return { status: status, error: "Invalid File Path - Only .md, .json, and image files are supported" };
  }

  try {
    const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${file_path}`;
    const headers = token ? { 'Authorization': `token ${token}` } : {};
    const fetch = await axios(url, { headers });
    const data = await fetch.data;
    const decodedContent = universalAtob(data.content);

    // Handle different file types
    if (file_path.toLowerCase().endsWith('.md')) {
      // Markdown files - convert to HTML
      const hljs = require("highlight.js");
      const markdown_converter = require("markdown-it")({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: function (str: any, lang: any): any {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return (
                '<pre class="hljs custom-code-hljs-class"><code>' +
                hljs.highlight(str, { language: lang, ignoreIllegals: true })
                  .value +
                "</code></pre>"
              );
            } catch (__) {}
          }
          return (
            '<pre class="hljs custom-code-hljs-class"><code>' +
            markdown_converter.utils.escapeHtml(str) +
            "</code></pre>"
          );
        },
      }).use(require('markdown-it-emoji'))
      .use(require('markdown-it-deflist'))
      .use(require('markdown-it-sub'))
      .use(require('markdown-it-sup'))
      .use(require('markdown-it-ins'))
      .use(require('markdown-it-mark'))
      .use(require('markdown-it-footnote'))

      const content = markdown_converter.render(decodedContent);
      status = "true";
      return { 
        status: status, 
        content_raw: decodedContent, 
        content_html: content,
        file_type: 'markdown',
        file_name: file_path.split('/').pop()
      };
    } else if (file_path.toLowerCase().endsWith('.json')) {
      // JSON files - parse and return
      try {
        const jsonContent = JSON.parse(decodedContent);
        status = "true";
        return { 
          status: status, 
          content_raw: decodedContent,
          content_json: jsonContent,
          file_type: 'json',
          file_name: file_path.split('/').pop()
        };
      } catch (jsonError) {
        status = "false";
        return { status: status, error: "Invalid JSON format" };
      }
    } else {
      // Image files - return base64 data and metadata
      const fileExtension = file_path.split('.').pop()?.toLowerCase();
      const mimeType = getMimeType(fileExtension);
      
      status = "true";
      return { 
        status: status, 
        content_raw: decodedContent,
        content_base64: data.content,
        file_type: 'image',
        file_name: file_path.split('/').pop(),
        mime_type: mimeType,
        download_url: data.download_url
      };
    }
  } catch (error) {
    status = "false";
    return { status: status, error: "Invalid user name or repo name" };
  }
}

async function search(
  keyword:string,
  user_name:string,
  repo_name:string,
  token?: string
) : Promise<any>
{
  let status:string = 'false'

  if(keyword.length == 0 || user_name.length == 0 || repo_name.length == 0){
    status = "false";
    return { status: status, error: "Provide Valid Data!" };
  }

  try{
  const url = `https://api.github.com/search/code?q=${keyword}+repo:${user_name}/${repo_name}`
  const headers = token ? { 'Authorization': `token ${token}` } : {};
  const fetch = await axios(url, { headers })
  const data = await fetch.data
  const returnData = []
  const returnDataItems = []

  if(data.total_count > 0){
    data.items.forEach((item:any) => {
      if (
        /([a-zA-Z0-9\s_\\.\-:])+(\.(md|json|jpg|jpeg|png|gif|svg|webp|bmp|ico))$/gi.test(item.name)
      ) {
      returnDataItems.push({
	filename: item.name,
	file_path : item.path,
      })
      }
 })
    status = 'true'
    returnData.push({status:status,total_count:returnDataItems.length},returnDataItems)
    return returnData
  } else {
    status = "false";
    return { status: status, error: "Nothing Found!" };
  }

  } catch(error){
    status = "false";
    return { status: status, error: "Invalid user name or repo name" };
  };
}

async function createFile(
  user_name: string,
  repo_name: string,
  file_path: string,
  content: string,
  token: string,
  commit_message?: string
): Promise<any> {
  let status: string = "true";

  if (!token) {
    status = "false";
    return { status: status, error: "Token is required for write operations" };
  }

  if (!/([a-zA-Z0-9\s_\\.\-:])+(\.(md|json|jpg|jpeg|png|gif|svg|webp|bmp|ico))$/gi.test(file_path)) {
    status = "false";
    return { status: status, error: "Only .md, .json, and image files are supported" };
  }

  try {
    const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${file_path}`;
    const headers = { 'Authorization': `token ${token}` };
    
    // Check if file already exists
    let sha = null;
    try {
      const existingFile = await axios(url, { headers });
      sha = existingFile.data.sha;
    } catch (error) {
      // File doesn't exist, which is fine for creation
    }

    const data = {
      message: commit_message || `Create ${file_path}`,
      content: universalBtoa(content),
      ...(sha && { sha: sha }) // Include sha if updating existing file
    };

    const response = await axios.put(url, data, { headers });
    
    status = "true";
    return { 
      status: status, 
      message: sha ? "File updated successfully" : "File created successfully",
      file: response.data.content
    };
  } catch (error: any) {
    status = "false";
    return { 
      status: status, 
      error: error.response?.data?.message || "Failed to create/update file" 
    };
  }
}

async function updateFile(
  user_name: string,
  repo_name: string,
  file_path: string,
  content: string,
  token: string,
  commit_message?: string
): Promise<any> {
  let status: string = "true";

  if (!token) {
    status = "false";
    return { status: status, error: "Token is required for write operations" };
  }

  if (!/([a-zA-Z0-9\s_\\.\-:])+(\.(md|json|jpg|jpeg|png|gif|svg|webp|bmp|ico))$/gi.test(file_path)) {
    status = "false";
    return { status: status, error: "Only .md, .json, and image files are supported" };
  }

  try {
    const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${file_path}`;
    const headers = { 'Authorization': `token ${token}` };
    
    // Get existing file to get SHA
    const existingFile = await axios(url, { headers });
    const sha = existingFile.data.sha;

    const data = {
      message: commit_message || `Update ${file_path}`,
      content: universalBtoa(content),
      sha: sha
    };

    const response = await axios.put(url, data, { headers });
    
    status = "true";
    return { 
      status: status, 
      message: "File updated successfully",
      file: response.data.content
    };
  } catch (error: any) {
    status = "false";
    return { 
      status: status, 
      error: error.response?.data?.message || "Failed to update file" 
    };
  }
}

async function deleteFile(
  user_name: string,
  repo_name: string,
  file_path: string,
  token: string,
  commit_message?: string
): Promise<any> {
  let status: string = "true";

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
  } catch (error: any) {
    status = "false";
    return { 
      status: status, 
      error: error.response?.data?.message || "Failed to delete file" 
    };
  }
}

async function createFolder(
  user_name: string,
  repo_name: string,
  folder_path: string,
  token: string,
  commit_message?: string
): Promise<any> {
  let status: string = "true";

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
    } else {
      return result;
    }
  } catch (error: any) {
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
