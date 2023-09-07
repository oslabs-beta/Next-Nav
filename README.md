 <p align="center">
  <img src="https://raw.githubusercontent.com/FANFICPDF/Next-Nav/readme/assets/next_nav_logo.png" alt="next.nav logo" />
  </p>

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
   ![Launching the Extension](https://i.imgur.com/10qMgfY.gif 'Launching the Extension')
4. Launch Next.Nav by opening the command palette using (Ctrl+Shift+P in Windows/Linux) or (Command+Shift+P MacOS) and typing `Next.Nav` highlight and press Enter
   ![Opening a Tree](https://i.imgur.com/sVYwqVu.gif 'Opening a Tree')
5. Select the Import Path icon and input the relative or absolute path of your root App route

### Opening Files

![Opening Files](https://i.imgur.com/zDKCPjo.gif 'Opening Files')

1. When you hover over a file type in the tree it will tell you the name
2. You can click on the icon of the file in the folder to open it.
   Alternatively, you can click on the folder to open a modal with all of the files
3. Click on a file to open it

### Adding Files

![Adding Files](https://i.imgur.com/xdraVMG.gif 'Adding Files')

1. Click on any blank space on a folder node to open a modal to view its contents.
2. Add a file name and extension in the input field.
3. Add file with the green add file icon.

### Deleting Files

**warning:** this will **permanently** delete the file.

![Deleting Files](https://i.imgur.com/U4KE5DN.gif 'Deleting Files')

1. Click on any blank space on a folder node to open a modal to view a folders contents.
2. Click the red trash icon next to the file you want to delete.
3. Click confirm in the pop-over to **permanently** delete the file. (**warning:** this can not be undone)

### Adding Folders

![Adding Folders](https://i.imgur.com/2b3FngG.gif 'Adding Folders')

1. Click on the plus icon on the right edge of the folder node you want your new folder to be nested in.
2. Give your new folder a name and submit.

### Deleting Folders

**warning:** this will **permanently** delete all contained files and sub folders

![Deleting Folders](https://i.imgur.com/qXMlm0Y.gif 'Deleting Folders')

1. Click on the minus icon on the left edge of the folder node you want to delete
2. Type the name of the folder to confirm deletion of the directory and all sub directories and files contained. (**warning:** this can not be undone)

## Want to Contribute?

Next.Nav is an Open Source product and we encourage developers to contribute. Please create a fork of the dev branch and create a feature branch on your own repo. Please make all pull request from your feature branch into Next.Nav's dev branch.

### Known Issues

- Demo Tree initially loads in upper let corner on first load
- Long file names clip on node edge
- File deletion popover does not disappear after confirm click

### Features to Add

- Renaming folders and files: add an edit button for file and folder names
- Moving folders and files
- Checklist for file types: add a filter panel to show specified file types
- Add more supported file types
- Add toggle option to not show client and server side render text for non-Next apps
- Recently used route (time stamp)

## Release Notes

### 1.0.0

Initial release of Next.Nav

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
      <a href="https://github.com/FANFICPDF">GitHub</a>
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
