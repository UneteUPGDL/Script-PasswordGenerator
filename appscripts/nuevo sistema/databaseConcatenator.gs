/**
 * Returns a Folder object of the container folder, or returns null if not.
 * @param {string} fileId - The id of the file
 */
function getParentFolderId(id) {
    let file = DriveApp.getFileById(id);
    let parentFolders = file.getParents();

    if (parentFolders.hasNext()) {
        let parentFolder = parentFolders.next();
        return DriveApp.getFolderById(parentFolder.getId());
    } else {
        return null;
    }
}

/**
 * Reads the folder recursiveley or not;
 * @param {Folder} folder - folder to look inside
 * @param {bool} recursive - look inside inner folders.by default is false
 *
 * returns a list of file ids
 */
function readFolder(folder, recursive = false) {
    let folders = folder.getFolders();
    let files = folder.getFiles();

    let fileList = [];

    while (files.hasNext()) {
        let file = files.next();
        fileList.push(file);
    }

    if (recursive) {
        while (folders.hasNext()) {
            let currentFolder = folders.next();
            fileList = [...fileList, ...readFolder(currentFolder, recursive)];
        }
    }
    return fileList;
}

/**
 * Returns the folder depending on the name, if the folder is not found return null
 * @params {string} folderName - name of the folder
 */
function getFolderByName(folder, folderName) {
    let folders = folder.getFolders();

    while (folders.hasNext()) {
        let currentFolder = folders.next();
        if (currentFolder.getName() === folderName) {
            return currentFolder;
        }
    }

    return null;
}

function myFunction() {
    let containerFolder = getParentFolderId(
        SpreadsheetApp.getActiveSpreadsheet().getId()
    );
    let institutions = getFolderByName(containerFolder, 'Instituciones');

    let institutionList = institutions.getFolders();
    let databaseInformation = [];

    while (institutionList.hasNext()) {
        let currentInstitution = institutionList.next();
        let institutionName = currentInstitution.getName();

        let projectCVS = readFolder(currentInstitution, true);

        projectCVS.forEach(currentFile => {
            let csvStr = currentFile.getBlob().getDataAsString();

            let fileData = csvStr.split('\n').slice(1);
            fileData.pop();

            let linesData = [];
            fileData.forEach(line => {
                let lineInfo = line.split(',');
                lineInfo.push(institutionName);
                linesData.push(lineInfo);
            });

            databaseInformation.push(...linesData);
        });
    }

    Logger.log(':)');

    let currentSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    currentSheet.getRange('A1').setValue('ID');
    currentSheet.getRange('B1').setValue('Nombre');
    currentSheet.getRange('C1').setValue('Sexo');
    currentSheet.getRange('D1').setValue('Carrera');
    currentSheet.getRange('E1').setValue('Status');
    currentSheet.getRange('F1').setValue('Proyecto');
    currentSheet.getRange('G1').setValue('Institución');
    currentSheet.getRange('H1').setValue('Ciclo');
    currentSheet.getRange('I1').setValue('Baja');
    currentSheet.getRange('J1').setValue('Creditos');

    databaseInformation.forEach((line, index) => {
        let currentIdx = index + 2;
        let studentID = line[0];
        let name = line[1];
        let gender = line[2];
        let major = line[3];
        let status = line[4];
        let project = line[5];
        let cycle = line[6];
        let baja = line[7];
        let credits = line[8];
        let institution = line[9];

        currentSheet.getRange(`A${currentIdx}`).setValue(studentID);
        currentSheet.getRange(`B${currentIdx}`).setValue(name);
        currentSheet.getRange(`C${currentIdx}`).setValue(gender);
        currentSheet.getRange(`D${currentIdx}`).setValue(major);
        currentSheet.getRange(`E${currentIdx}`).setValue(status);
        currentSheet.getRange(`F${currentIdx}`).setValue(project);
        currentSheet.getRange(`G${currentIdx}`).setValue(institution);
        currentSheet.getRange(`H${currentIdx}`).setValue(cycle);
        currentSheet.getRange(`I${currentIdx}`).setValue(baja);
        currentSheet.getRange(`J${currentIdx}`).setValue(credits);
    });
}
