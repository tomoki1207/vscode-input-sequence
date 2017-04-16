# vscode-input-sequence

[![Build status](http://img.shields.io/travis/tomoki1207/vscode-input-sequence/master.svg?style=flat-square)](https://travis-ci.org/tomoki1207/vscode-input-sequence)
[![AppVeyor](http://img.shields.io/appveyor/ci/tomoki1207/vscode-input-sequence/master.svg?style=flat-square)](https://ci.appveyor.com/project/tomoki1207/vscode-input-sequence)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/tomoki1207/vscode-input-sequence/master/LICENSE)

[sequential-number](https://atom.io/packages/sequential-number) for VSCode.

![screenshot](https://raw.githubusercontent.com/tomoki1207/vscode-input-sequence/images/screenshot.gif)

## Usage

### Default Keymap
<kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>0</kbd> => Open the input panel !

### Syntax Rules

`<start> <operator> <step> : <digit> : <radix>`

| Key                                   | Default | Definition                                                                                                                                      |
| :------------------------------------ | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **start**                             | `""`    | It specifies the number that you start typing an integer.                                                                                       |
| **operator** <small>(optional)</small> | `+`     | It specifies the generation rules of consecutive numbers in the `+` or `-`. The sign of the increment(`++`) and decrement(`--`) also available. |
| **step** <small>(optional)</small>     | `1`     | It specifies the integer to be added or subtracted.                                                                                             |
| **digit** <small>(optional)</small>    | `0`     | It specifies of the number of digits in the integer.                                                                                            |
| **radix** <small>(optional)</small>    | `10`    | It specifies an integer between 2 and 36 that represents radix.                                                                                 |

### More infomation and Examples

See [sequential-number](https://atom.io/packages/sequential-number).

### Configuration

+ `sequence.replaceSelection`
Replace initial selections by sequence or not.
![replaceScreenshot](https://raw.githubusercontent.com/tomoki1207/vscode-input-sequence/images/replaceSelection.gif)

## LICENSE
[LICENSE](./LICENSE)
