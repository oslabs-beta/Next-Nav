"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs/promises");
const path = require("path");
async function treeMaker(validDir) {
    let idCounter = 1; // global id counter
    const extensions = /\.(js|jsx|css|ts|tsx)$/;
    const structure = [
        {
            id: 0,
            folderName: path.basename(validDir),
            parentNode: null,
            path: validDir,
            contents: []
        }
    ];
    // Recursive function to list files
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
    try {
        await listFiles(validDir, 0);
        console.log('tree ', JSON.stringify(structure, null, 2));
        return structure;
    }
    catch (err) {
        console.error('Error building the tree:', err);
        return {};
    }
}
exports.default = treeMaker;
//# sourceMappingURL=makeTree.js.map