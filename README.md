 <p align="center">
  <img src="" />
  </p>

## NEXT.NAV

Welcome to <a href="" >Next.Nav</a>, a Visual Studio Code extension for viewing and manipulating projects using the Next.js App Router.

## Features

Next.nav allows Next.js developers to:

- Load a projects src/app route.
- View routes in a legible node based tree view.
- Easily access files in nested routes.
- Add / Remove routes to a clearly defined parent route.
- Add / Remove files to routes.
- Display whether routes render Client side or Server side.

## Getting Started

### Opening a Tree

1. Install VSCode
2. Install the extension by searching "Next Nav" in the extension marketplace or Launch VS Code Quick Open (Ctrl+P), paste the following command `insert command here` and press enter.
3. Open a Next.js project that is using the App Router in VSCode
4. Launch Next.Nav by opening the command palette using (Ctrl+Shift+P in Windows/Linux) or (Command+Shift+P MacOS) and typing `Next.Nav` highlight and press Enter
5. Select the Import Path icon and input the relative or absolute path of your root App route

### Adding Files

1. Click on any blank space on a folder node to open a modal to view its contents.
2. Add a file name and extension in the input field.
3. Add file with the green add file icon.

### Deleting Files

**waring:** this will **permanently** delete the file.

1. Click on any blank space on a folder node to open a modal to view a folders contents.
2. Click the red trash icon next to the file you want to delete.
3. Click confirm in the pop-over to **permanently** delete the file. (**waring:** this can not be undone)

### Adding Folders

1. Click on the plus icon on the right edge of the folder node you want your new folder to be nested in.
2. Give your new folder a name and submit.

### Deleting Folders

**waring:** this will **permanently** delete all contained files and sub folders

1. Click on the minus icon on the left edge of the folder node you want to delete
2. Type the name of the folder to confirm deletion of the directory and all sub directories and files contained. (**waring:** this can not be undone)

## Want to Contribute?

Next.Nav is an Open Source product and we encourage developers to contribute. Please create a fork of the dev branch and create a feature branch on your own repo. Please make all pull request from your feature branch into Next.Nav's dev branch

### Known Issues

- Demo Tree initially loads in upper let corner on first load
- Client side render checking logic might not work in extreme edge cases

### Features to Add

## Release Notes

### 1.0.0

Initial release of Next.Nav

## Contributors

<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/137316253?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Anatoliy Sokolov</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/anatoliy-sokolov/">Linkedin</a> |
      <a href="https://github.com/AnatoliySokolov98">GitHub</a>
    </td>
     <td align="center">
      <img src="https://avatars.githubusercontent.com/u/18522517?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Brian Henkel</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/b-henkel/">Linkedin</a> |
      <a href="https://github.com/FANFICPDF">GitHub</a>
    </td> <td align="center">
      <img src="https://avatars.githubusercontent.com/u/106214861?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Jordan Querubin</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/jordanquerubin/">Linkedin</a> |
      <a href="https://github.com/jequerubin">GitHub</a>
    </td> <td align="center">
      <img src="https://avatars.githubusercontent.com/u/122189452?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Nathaniel Peel</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/nathaniel-peel/">Linkedin</a> |
      <a href="https://github.com/nathanpeel">GitHub</a>
    </td>     
  </tr>
</table>
