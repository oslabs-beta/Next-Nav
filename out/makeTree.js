"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs/promises");
const path = require("path");
const functions_1 = require("./functions");
//build the tree
async function treeMaker(srcDirName, appDirName) {
    let idCounter = 1; // global id counter
    const structure = [
        {
            id: 0,
            folderName: appDirName,
            parentNode: null,
            contents: []
        }
    ];
    const directory = await (0, functions_1.findDir)(srcDirName, appDirName);
    const extensions = /\.(js|jsx|css|ts|tsx)$/;
    // Handle error cases
    if (directory.status === 'error') {
        console.error('Error in findDir:', directory);
        return {}; // Return the current structure or an appropriate error object
    }
    async function listFiles(dir, parent) {
        const withFileTypes = true;
        const entities = await fs.readdir(dir, { withFileTypes });
        for (const entity of entities) {
            const fullPath = path.join(dir, entity.name);
            if (entity.isDirectory()) {
                const directoryData = {
                    id: idCounter++,
                    folderName: entity.name,
                    parentNode: parent,
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
    if (directory.data) {
        await listFiles(directory.data, 0);
    }
    console.log('tree ', JSON.stringify(structure, null, 2));
    return structure;
}
exports.default = treeMaker;
//# sourceMappingURL=makeTree.js.map