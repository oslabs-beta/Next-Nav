"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs/promises");
const path = require("path");
const functions_1 = require("./functions");
//build the tree
async function treeMaker(srcDirName, appDirName) {
    let idCounter = 1; // global id counter
    //find directory
    const directory = await (0, functions_1.findDir)(srcDirName, appDirName);
    //we only want files with these endings
    const extensions = /\.(js|jsx|css|ts|tsx)$/;
    // Handle error cases
    if (directory.status === 'error') {
        console.error('Error in findDir:', directory);
        return {}; // Return the current structure or an appropriate error object
    }
    const structure = [
        {
            id: 0,
            folderName: appDirName,
            parentNode: null,
            path: directory.data,
            contents: []
        }
    ];
    //recurse and get files
    async function listFiles(dir, parent) {
        //we want file types
        const withFileTypes = true;
        const entities = await fs.readdir(dir, { withFileTypes });
        //loop if its directory add object and recurse if its a file add to its parent
        for (const entity of entities) {
            const fullPath = path.join(dir, entity.name);
            if (entity.isDirectory()) {
                const directoryData = {
                    id: idCounter++,
                    folderName: entity.name,
                    parentNode: parent,
                    path: fullPath,
                    contents: []
                };
                structure.push(directoryData);
                await listFiles(fullPath, directoryData.id);
            }
            else if (extensions.test(entity.name)) {
                structure[parent].contents.push(entity.name);
            }
        }
    }
    //if we have data return the object with directories
    if (directory.data) {
        try {
            await listFiles(directory.data, 0);
            console.log('tree ', JSON.stringify(structure, null, 2));
            return structure;
        }
        catch (err) {
            console.error('Error building the tree:', err);
            return {};
        }
    }
    else {
        console.error('Directory data not found');
        return {};
    }
}
exports.default = treeMaker;
//# sourceMappingURL=makeTree.js.map