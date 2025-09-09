# markgit

Use Github Repo as a Database to Store Markdown Files. Retrieve, Create, Update, and Delete Markdown Files and Folders. Get the List of Markdown Files From a Repo. Supports both **public** and **private** repositories with token authentication.

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

1. `getList` -> List the Markdown `.md` Files in a Repo. It requires two parameters as ***string***, **Github Username** and the name of the **Repo**. Optionally it accepts a third parameter for any sub-folder in the repo, and a fourth parameter for **GitHub Personal Access Token** (for private repos). It returns an Array. Within the Array an Object with `status` key.

```javascript
      // For public repositories
      MarkGit.getList(username, reponame, sub_folder_name).then(
	data => console.log(data)
       )

      // For private repositories
      MarkGit.getList(username, reponame, sub_folder_name, token).then(
	data => console.log(data)
       )
```

2. `getContent` -> Get Content of the Markdown `.md` File in a Repo. It requires three parameters as ***string***, **Github Username**, the name of the **Repo** and the **File Name or Path**. Optionally it accepts a fourth parameter for **GitHub Personal Access Token** (for private repos). It returns an Object with `status`, `content_markdown` and `content_html` key.

```javascript
      // For public repositories
      MarkGit.getContent(username, reponame, filename/filepath).then(
	data => console.log(data)
       )

      // For private repositories
      MarkGit.getContent(username, reponame, filename/filepath, token).then(
	data => console.log(data)
       )
```

3. `search` -> Search For Markdown File in a Repo via `Keyword`. It requires three parameters as ***string***, **Search Keyword**, **Github Username** and the name of the **Repo**. Optionally it accepts a fourth parameter for **GitHub Personal Access Token** (for private repos). It returns an Array Object with `status`, `total_count` and an Array containing matched files with `filename` and `file_path`.

```javascript
      // For public repositories
      MarkGit.search(search_keyword, username, reponame).then(
	data => console.log(data)
       )

      // For private repositories
      MarkGit.search(search_keyword, username, reponame, token).then(
	data => console.log(data)
       )
```

## Write Operations (Requires Token)

4. `createFile` -> Create a new Markdown file in a repository. It requires **Github Username**, **Repo Name**, **File Path**, **Content**, and **GitHub Personal Access Token**. Optionally accepts a commit message. Returns an Object with `status` and `message`.

```javascript
      MarkGit.createFile(username, reponame, 'new-file.md', '# New File\n\nThis is new content!', token, 'Add new file').then(
	data => console.log(data)
       )
```

5. `updateFile` -> Update an existing Markdown file in a repository. It requires **Github Username**, **Repo Name**, **File Path**, **New Content**, and **GitHub Personal Access Token**. Optionally accepts a commit message. Returns an Object with `status` and `message`.

```javascript
      MarkGit.updateFile(username, reponame, 'existing-file.md', '# Updated File\n\nThis content has been updated!', token, 'Update file content').then(
	data => console.log(data)
       )
```

6. `deleteFile` -> Delete a Markdown file from a repository. It requires **Github Username**, **Repo Name**, **File Path**, and **GitHub Personal Access Token**. Optionally accepts a commit message. Returns an Object with `status` and `message`.

```javascript
      MarkGit.deleteFile(username, reponame, 'file-to-delete.md', token, 'Remove unnecessary file').then(
	data => console.log(data)
       )
```

7. `createFolder` -> Create a new folder in a repository. It requires **Github Username**, **Repo Name**, **Folder Path**, and **GitHub Personal Access Token**. Optionally accepts a commit message. Returns an Object with `status` and `message`.

```javascript
      MarkGit.createFolder(username, reponame, 'new-folder', token, 'Add new folder').then(
	data => console.log(data)
       )
```

# Write Operations Requirements

**Important**: All write operations (create, update, delete) require a GitHub Personal Access Token with appropriate permissions. The token must have the following scopes:
- `repo` (Full control of private repositories)
- `workflow` (Update GitHub Action workflows) - optional
- `write:packages` (Upload packages to GitHub Package Registry) - optional

# Private Repository Support

To access private repositories, you need to provide a GitHub Personal Access Token as the last parameter to any function.

### Creating a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name and select the following scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
4. Click "Generate token" and copy the token
5. **Important**: Store the token securely and never commit it to your code

### Example with Private Repository

```javascript
const token = 'your_github_personal_access_token_here';

// Read operations
MarkGit.getList('username', 'private-repo', '', token).then(
  data => console.log('Files:', data)
);

MarkGit.getContent('username', 'private-repo', 'README.md', token).then(
  data => console.log('Content:', data)
);

MarkGit.search('keyword', 'username', 'private-repo', token).then(
  data => console.log('Search results:', data)
);

// Write operations
MarkGit.createFile('username', 'private-repo', 'new-document.md', '# New Document\n\nThis is a new markdown file!', token).then(
  data => console.log('File created:', data)
);

MarkGit.updateFile('username', 'private-repo', 'existing-document.md', '# Updated Document\n\nThis content has been updated!', token).then(
  data => console.log('File updated:', data)
);

MarkGit.createFolder('username', 'private-repo', 'new-folder', token).then(
  data => console.log('Folder created:', data)
);

MarkGit.deleteFile('username', 'private-repo', 'old-file.md', token).then(
  data => console.log('File deleted:', data)
);
```

# Use With `npm` in `React, Vue, Angular`

Install using npm `npm i markgit`

Import/Require markgit

```javascript
   const mg = require('markgit');
```

# Node.js Support

`markgit` now supports both **browser** and **Node.js** environments! The library automatically detects the environment and provides the necessary polyfills for base64 encoding/decoding.

### Node.js Usage

```javascript
const MarkGit = require('markgit');

// All functions work the same way in Node.js
MarkGit.getList('username', 'reponame').then(data => console.log(data));
MarkGit.getContent('username', 'reponame', 'README.md').then(data => console.log(data));
MarkGit.search('keyword', 'username', 'reponame').then(data => console.log(data));

// Write operations also work in Node.js
const token = 'your_github_token';
MarkGit.createFile('username', 'reponame', 'new-file.md', '# Content', token).then(data => console.log(data));
```

### Browser Usage

#### Script Tag (UMD)
```html
<!-- Use the browser UMD build -->
<script src="./dist/markgit.js"></script>
<script>
  MarkGit.getList('username', 'reponame').then(data => console.log(data));
</script>
```

#### ES6 Modules
```html
<!-- Use the browser ES6 module build -->
<script type="module">
  import MarkGit from './dist/markgit.esm.js';
  
  MarkGit.getList('username', 'reponame').then(data => console.log(data));
</script>
```

#### Named Imports
```html
<script type="module">
  import { getList, getContent, createFile } from './dist/markgit.esm.js';
  
  getList('username', 'reponame').then(data => console.log(data));
  getContent('username', 'reponame', 'README.md').then(data => console.log(data));
</script>
```

### Node.js Usage

#### CommonJS (require)
```javascript
// Use the Node.js CommonJS build
const MarkGit = require('markgit');
// or
const MarkGit = require('./dist/markgit-node.js');

MarkGit.getList('username', 'reponame').then(data => console.log(data));
```

#### ES6 Modules (import)
```javascript
// Use the Node.js ES6 module build
import MarkGit from 'markgit';
// or
import MarkGit from './dist/markgit-node.esm.js';

MarkGit.getList('username', 'reponame').then(data => console.log(data));
```

#### Named Imports
```javascript
// Import specific functions
import { getList, getContent, createFile } from 'markgit';

getList('username', 'reponame').then(data => console.log(data));
getContent('username', 'reponame', 'README.md').then(data => console.log(data));
```

### Build Files

The library provides four builds for maximum compatibility:

#### Browser Builds
- **`markgit.js`** - Browser UMD build (includes all dependencies, ~1MB)
- **`markgit.esm.js`** - Browser ES6 module build (includes all dependencies, ~1MB)

#### Node.js Builds
- **`markgit-node.js`** - Node.js CommonJS build (external dependencies, ~6KB)
- **`markgit-node.esm.js`** - Node.js ES6 module build (external dependencies, ~6KB)

### Environment Detection

The library automatically detects whether it's running in a browser or Node.js environment and uses the appropriate base64 encoding/decoding methods:
- **Browser**: Uses native `btoa`/`atob` functions
- **Node.js**: Uses `Buffer` for base64 operations


        


