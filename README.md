 <p align="center">
  <img src="https://raw.githubusercontent.com/b-henkel/Next-Nav/readme/assets/next_nav_logo.png" alt="next.nav logo" />
  </p>

<div align="center">

![Version: 1.0.5](https://img.shields.io/badge/version-1.0.5-black)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

</div>

<div align="center">

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

</div>

#

## NEXT.NAV

Welcome to <a href="https://www.next-nav.com" >Next.Nav</a>, a Visual Studio Code extension for viewing and manipulating projects using the Next.js App Router.

## Features

Next.nav allows Next.js developers to:

- Load a projects src/app route.
- View routes in a legible node based tree view.
- Easily access files in nested routes.
- Add / Remove routes to a clearly defined parent route.
- Add / Remove files to routes.
- Display whether routes render Client side or Server side.

## Getting Started

### Launching the Extension and Opening a Tree

1. Install VSCode
2. Install the extension by searching "Next Nav" in the extension marketplace or Launch VS Code Quick Open (Ctrl+P in Windows/Linux) or (Command+P MacOS), paste the following command `ext install NextNav.NextNav` and press enter.
3. Open a Next.js project that is using the App Router in VSCode
   ![Launching the Extension](https://i.imgur.com/10qMgfY.gif "Launching the Extension")
4. Launch Next.Nav from status bar or by opening the command palette using (Ctrl+Shift+P in Windows/Linux) or (Command+Shift+P MacOS) and typing `Next.Nav` highlight and press Enter
   ![Opening a Tree](https://i.imgur.com/sVYwqVu.gif "Opening a Tree")
5. Select the Import Path icon and input the relative or absolute path of your root App route (Note: Next.Nav will automatically grab your file structure if it is under the 'src/app' route)

### Opening Files

![Opening Files](https://i.imgur.com/zDKCPjo.gif "Opening Files")

1. When you hover over a file type in the tree it will tell you the name
2. You can click on the icon of the file in the folder to open it.
   Alternatively, you can click on the folder to open a modal with all of the files
3. Click on a file to open it

### Adding Files

![Adding Files](https://i.imgur.com/xdraVMG.gif "Adding Files")

1. Click on any blank space on a folder node to open a modal to view its contents.
2. Add a file name and extension in the input field.
3. Add file with the green add file icon.

### Deleting Files

**warning:** this will **permanently** delete the file.

![Deleting Files](https://i.imgur.com/U4KE5DN.gif "Deleting Files")

1. Click on any blank space on a folder node to open a modal to view a folders contents.
2. Click the red trash icon next to the file you want to delete.
3. Click confirm in the pop-over to **permanently** delete the file. (**warning:** this can not be undone)

### Adding Folders

![Adding Folders](https://i.imgur.com/2b3FngG.gif "Adding Folders")

1. Click on the plus icon on the right edge of the folder node you want your new folder to be nested in.
2. Give your new folder a name and submit.

### Deleting Folders

**warning:** this will **permanently** delete all contained files and sub folders

![Deleting Folders](https://i.imgur.com/qXMlm0Y.gif "Deleting Folders")

1. Click on the minus icon on the left edge of the folder node you want to delete
2. Type the name of the folder to confirm deletion of the directory and all sub directories and files contained. (**warning:** this can not be undone)

## Want to Contribute?

Next.Nav is an Open Source product and we encourage developers to contribute. Please create a fork of the dev branch and create a feature branch on your own repo. Please make all pull request from your feature branch into Next.Nav's dev branch.

### Known Issues

- Demo Tree initially loads in upper let corner on first load
- File deletion popover does not disappear after confirm click

### Features to Add

- Renaming folders and files: add an edit button for file and folder names
- Moving folders and files: adjust routes through drag and drop
- Filter for file types: add a checklist panel to highlight selected file types
- Add support for more file types
- Add toggle option for client/serverside render text on nodes
- Recently used route (time stamp)

### Possible Iterations

- Implement debugging and optimization insights for routes
- Provide a pages router to app router converter
- Expand to prototyping tool for Next.js projects

## Release Notes

### 1.0.0 - Initial release of Next.Nav

<details><summary>1.0.2</summary>
  <ul>
    <li>Fix to disallow submit on enter keypress for an empty input field within import popover</li>
    <li>Fix to remove string after new file creation</li>
    <li>Improve various UI elements</li>
    <li>Update README.md to reflect new known issues</li>
  </ul>
</details>

<details><summary>1.0.3</summary>
  <ul>
    <li>Fix to stop long folder names from clipping node edge (c/o <a href="https://github.com/miso-devel" >miso-devel</a>!)</li>
    <li>Update to show import popover on load</li>
  </ul>
</details>

<details><summary>1.0.4</summary>
  <ul>
    <li>Update import to grab 'src/app' automatically if present</li>
    <li>Revert change to show import popover on load</li>
  </ul>
</details>
<details><summary>1.0.5</summary>
  <ul>
    <li>Adds status-bar launch item. This makes it seamless when navigating back to the extension.</li>
    <li>Adds limit to icons displayed </li>
  </ul>
</details>

## Contributors

<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/137316253?v=4" width="140px;" alt="a photo of Anatoliy Sokolov"/>
      <br />
      <sub><b>Anatoliy Sokolov</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/anatoliy-sokolov/">Linkedin</a> |
      <a href="https://github.com/AnatoliySokolov98">GitHub</a>
    </td>
     <td align="center">
      <img src="https://avatars.githubusercontent.com/u/18522517?v=4" width="140px;" alt="a photo of Brian Henkel"/>
      <br />
      <sub><b>Brian Henkel</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/b-henkel/">Linkedin</a> |
      <a href="https://github.com/b-henkel">GitHub</a>
    </td> <td align="center">
      <img src="https://avatars.githubusercontent.com/u/106214861?v=4" width="140px;" alt="a photo of Jordan Querubin"/>
      <br />
      <sub><b>Jordan Querubin</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/jordanquerubin/">Linkedin</a> |
      <a href="https://github.com/jequerubin">GitHub</a>
    </td> <td align="center">
      <img src="https://avatars.githubusercontent.com/u/122189452?v=4" width="140px;" alt="a photo of Nathan Peel"/>
      <br />
      <sub><b>Nathan Peel</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/nathaniel-peel/">Linkedin</a> |
      <a href="https://github.com/nathanpeel">GitHub</a>
    </td>     
  </tr>
</table>
