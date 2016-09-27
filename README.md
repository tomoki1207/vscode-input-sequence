# vscode-input-sequence

[sequential-number](https://atom.io/packages/sequential-number) for VSCode.

## Usage

### Default Keymap
<kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>0</kbd> => Open the input panel !

### Syntax Rules

`<start> <operator> <step> : <digit> : <radix>`

| Key                                   | Default | Definition                                                                                                                                      |
| :------------------------------------ | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **start**                             | `""`    | It specifies the number that you start typing an integer.                                                                                       |
| **operator** <small>(optinal)</small> | `+`     | It specifies the generation rules of consecutive numbers in the `+` or `-`. The sign of the increment(`++`) and decrement(`--`) also available. |
| **step** <small>(optinal)</small>     | `1`     | It specifies the integer to be added or subtracted.                                                                                             |
| **digit** <small>(optinal)</small>    | `0`     | It specifies of the number of digits in the integer.                                                                                            |
| **radix** <small>(optinal)</small>    | `10`    | It specifies an integer between 2 and 36 that represents radix.                                                                                 |

### More infomation and Examples

See [sequential-number](https://atom.io/packages/sequential-number).

## LICENSE
[LICENSE](./LICENSE)
