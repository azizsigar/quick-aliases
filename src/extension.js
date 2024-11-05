const vscode = require("vscode");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Terminal aliases to be added
const aliases = [
  'alias gs="git status"',
  'alias ga="git add ."',
  'alias gc="git commit -m"',
  'alias gp="git push origin"',
  'alias gb="git branch"',
  'alias gswitch="git switch"',
  'alias newfile="touch test.js"',
];

// Shell configuration files
const getShellConfigFile = () => {
  const shell = process.env.SHELL;

  if (shell.includes("bash")) {
    return path.join(os.homedir(), ".bashrc");
  } else if (shell.includes("zsh")) {
    return path.join(os.homedir(), ".zshrc");
  } else if (shell.includes("fish")) {
    return path.join(os.homedir(), ".config/fish/config.fish");
  } else {
    return null; // For unsupported shells
  }
};

// Function to add aliases to the shell configuration file
const addAliasesToShellConfig = (filePath) => {
  if (filePath) {
    fs.appendFile(
      filePath,
      `\n# Quick Aliases Extension\n${aliases.join("\n")}\n`,
      (err) => {
        if (err) {
          vscode.window.showErrorMessage(
            `Failed to update shell config file: ${err.message}`
          );
        } else {
          vscode.window.showInformationMessage(
            "Aliases added to shell configuration. Please restart your terminal."
          );
        }
      }
    );
  } else {
    vscode.window.showErrorMessage("Unsupported shell. No aliases added.");
  }
};

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
  console.log("Quick Aliases Extension activated!");

  // Add aliases to shell config when the extension is activated
  const shellConfigFile = getShellConfigFile();
  addAliasesToShellConfig(shellConfigFile);

  // Komutları tanımlayın
  const commands = [
    { id: "quick-aliases.gitStatus", command: "git status" },
    { id: "quick-aliases.gitAdd", command: "git add ." },
    { id: "quick-aliases.gitCommit", command: 'git commit -m "Your message"' },
    { id: "quick-aliases.gitPush", command: "git push origin" },
    { id: "quick-aliases.gitBranch", command: "git branch" },
    { id: "quick-aliases.gitSwitch", command: "git switch" },
    { id: "quick-aliases.createTestFile", command: "touch test.js" },
  ];

  commands.forEach(({ id, command }) => {
    const disposable = vscode.commands.registerCommand(id, () =>
      runCommand(command)
    );
    context.subscriptions.push(disposable);
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
