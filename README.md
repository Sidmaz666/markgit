# markgit

Use Github Repo as a Public Database to Store Markdown Files. Retrieve the Files in HTML Format. Get the List of Markdown Files From a Repo.

# Usage

### Include the script tag in the `<head>` section.

```html
   <script src="https://raw.githubusercontent.com/Sidmaz666/markgit/main/dist/markgit.js"></script> 
```    
Or Download the `markgit.js` file from the `dist` folder and add it locally.

```html
   <script src="./dist/markgit.js"></script> 
```  

### Initiate MarkGit in the `<script>` within `<head>` section.
	
```html
   <script>
     	const mg = MarkGit
   </script>
```
### Available Methods

1. `getList` -> List the Markdown `.md` Files in a Repo. It reqiures two parameter as ***string***, **Github Username** and the name of the **Repo**, Optionally it accepts a third parameter for any sub-folder in the repo. It returns an Array. Within the Array an Object with `status` key.

```javascript
      MarkGit.getList(username,reponame,sub_folder_name).then(
	data => console.log(data)
       )
```
2. `getContent` -> Get Conetnt of the Markdown `.md` File in a Repo. It reqiures three parameter as ***string***, **Github Username** , the name of the **Repo** and the **File Name or Path**. It returns an Object with `status`, `content_markdown` and `content_html`  key.

```javascript
      MarkGit.getContent(username,reponame,filename/filepath).then(
	data => console.log(data)
       )
```
3. `search` -> Search For Markdown File in a Repo via `Keyword`. It reqiures three parameter as ***string***, **Search Keyword** , **Github Username** and the name of the **Repo** . It returns an Array Object with `status`, `total_count` and an Array containing matched files with `filename` and `file_path`.

```javascript
      MarkGit.search(search_keyword,username,reponame).then(
	data => console.log(data)
       )
```

# Use With `npm` in `React, Vue, Angular`

Install using npm `npm i markgit`

Import/Require markgit

```javascript
   const mg = reqiure('markgit');
```

# Note 

Since **atob** function is not available in **nodejs** (requires for base64 encoding/decoding), `markgit` is only supported in the browser.


        


