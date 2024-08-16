const vscode = require('vscode');
const { exec } = require('child_process');

// Komutları çalıştırmak için bir fonksiyon
function runCommand(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            vscode.window.showErrorMessage(`stderr: ${stderr}`);
            return;
        }
        vscode.window.showInformationMessage(`stdout: ${stdout}`);
    });
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "quick-aliases" is now active!');

    // Komutları tanımlayın
    const commands = [
        { id: 'quick-aliases.gitStatus', command: 'git status' },
        { id: 'quick-aliases.gitAdd', command: 'git add .' },
        { id: 'quick-aliases.gitCommit', command: 'git commit -m "Your message"' },
        { id: 'quick-aliases.gitPush', command: 'git push origin' },
        { id: 'quick-aliases.gitBranch', command: 'git branch' },
        { id: 'quick-aliases.gitSwitch', command: 'git switch' },
        { id: 'quick-aliases.createTestFile', command: 'touch test.js' }
    ];

    commands.forEach(({ id, command }) => {
        const disposable = vscode.commands.registerCommand(id, () => runCommand(command));
        context.subscriptions.push(disposable);
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
