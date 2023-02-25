# markgit

Use Github Repo as a Public Database to Store Markdown Files. Retrieve the Files in HTML Format. Get the List of Markdown Files From a Repo.

# Usage

1. Add the script tag in the `<head>` section.

       <script src="./dist/markgit.js"></script>
      
2. Initiate MarkGit in the script within `<head>` section.

        <script>
        MarkGit.getList('sidmaz666','anime').then(
	      data => console.log(data)
	      )
        MarkGit.getContent('sidmaz666','anime','README.md').then(
	      data => console.log(data)
	      )
        </script>
        


