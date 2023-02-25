const axios = require("axios");

async function getList(
  user_name: string,
  repo_name: string
): Promise<any[] | object> {
  let status: string = "true";

  try {
    const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents`;
    const fetch = await axios(url);
    const data = await fetch.data;
    let returnData = [];

    data.forEach((obj: any) => {
      if (
        obj.type == "file" &&
        /([a-zA-Z0-9\s_\\.\-:])+(.md)$/gi.test(obj.name)
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
  file_path: string
): Promise<any> {
  let status: string = "true";

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

    const url = `https://api.github.com/repos/${user_name}/${repo_name}/contents/${file_path}`;
    const fetch = await axios(url);
    const data = await fetch.data;
    const content = markdown_converter.render(
     atob(data.content)
    );

    status = "true";
    return { status: status, content_markdown: atob(data.content), content_html: content };
  } catch (error) {
    status = "false";
    return { status: status, error: "Invalid user name or repo name" };
  }
}

module.exports = {
  getList,
  getContent,
};
