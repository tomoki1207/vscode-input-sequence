'use strict';
var vscode = require('vscode');
var Range = vscode.Range;
var Position = vscode.Position;
var syntaxRegex = /^([+\-]?[\da-fA-F]+(?:\.\d+)?)\s*([+\-]|(?:\+\+|\-\-))?\s*(\d+)?\s*(?:\:\s*(\d+))?\s*(?:\:\s*(\d+))?$/;

// this method is called when your extension is activated
function activate(context) {
  var insertCmd = vscode.commands.registerCommand('insertSequentialNumbers', function () {
    var editor = vscode.window.activeTextEditor;
    var initialSelections = editor.selections.sort(sortSelection);
    var replaceSelection = vscode.workspace.getConfiguration("sequence").replaceSelection;
    var inputOptions = {};
    var undoStopBefore = true;
    inputOptions.placeHolder = "<start> <operator> <step> : <digit> : <radix>";
    inputOptions.validateInput = function (param) {
      if (param === "") {
        perform(initialSelections, editor, {}, replaceSelection, { undoStopBefore: undoStopBefore, undoStopAfter: false });
        return;
      }
      var test = parseInput(param);
      if (!test) {
        return 'Syntax error. The rule is "<start> <operator> <step> : <digit> : <radix>".';
      }
      // realtime simulate
      perform(initialSelections, editor, test, replaceSelection, { undoStopBefore: undoStopBefore, undoStopAfter: false });
      undoStopBefore &= false;
    };
    vscode.window.showInputBox(inputOptions)
      .then(function (value) {
        if (!value && value !== 0) {
          // undo
          if (!undoStopBefore) {
            vscode.commands.executeCommand("undo");
          }
          return;
        }
        // confirm input.
        var options = parseInput(value);
        perform(initialSelections, editor, options, replaceSelection, { undoStopBefore: false, undoStopAfter: true });
      });
  });

  var incrementCmd = vscode.commands.registerCommand('incrementSelections', function () {
    var editor = vscode.window.activeTextEditor;
    var initialSelections = editor.selections.sort(sortSelection);
    var options = {
      start: Number(editor.document.getText(editor.selections[0])), // Use top of selections.
      digit: 0,
      operator: "+",
      step: 1,
      radix: 10,
      input: "1"
    };
    // NOTE: "undoStop" option is unknown. Temporary use "false".
    // NOTE: This command always replace select values.
    perform(initialSelections, editor, options, true, { undoStopBefore: false, undoStopAfter: false });
  });

  var decrementCmd = vscode.commands.registerCommand('decrementSelections', function () {
    var editor = vscode.window.activeTextEditor;
    var initialSelections = editor.selections.sort(sortSelection);
    var options = {
      start: Number(editor.document.getText(editor.selections[0])), // Use top of selections.
      digit: 0,
      operator: "-",
      step: 1,
      radix: 10,
      input: "1"
    };
    // NOTE: "undoStop" option is unknown. Temporary use "false".
    // NOTE: This command always replace select values.
    perform(initialSelections, editor, options, true, { undoStopBefore: false, undoStopAfter: false });
  });

  context.subscriptions.push(insertCmd);
  context.subscriptions.push(incrementCmd);
  context.subscriptions.push(decrementCmd);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

function sortSelection(a, b) {
  return a.anchor.line - b.anchor.line || a.anchor.character - b.anchor.character;
}

function perform(initial, editor, options, replaceSelection, undoStop) {
  var currentSelection = editor.selections.sort(sortSelection);
  editor.edit(function (builder) {
    initial.forEach(function (selection, index) {
      var endOfInitialSelection = replaceSelection ? selection.start.character : selection.end.character + (currentSelection[index].start.character - selection.start.character);
      builder.replace(new Range(new Position(selection.end.line, endOfInitialSelection), currentSelection[index].end), calculate(index, options));
    });
  }, undoStop);
}

function parseInput(input) {
  var matches = input.match(syntaxRegex);
  if (!matches) {
    return null;
  }

  var radix = matches[5] ? parseInt(matches[5], 10) : 10;
  var start = parseInt(matches[1], radix);
  var operator = matches[2] || "+";
  var step = isNaN(matches[3]) ? 1 : parseInt(matches[3], 10);

  var digit = parseInt(matches[4], 10);
  if (isNaN(digit)) {
    digit = (start.toString() === matches[1]) ? 0 : matches[1].length;
    if (/^[+\-]/.test(matches[1])) {
      digit = Math.max(digit - 1, 0);
    }
  }
  return {
    start: start,
    digit: digit,
    operator: operator,
    step: step,
    radix: radix,
    input: input
  };
}

function calculate(index, options) {
  var value = NaN;
  switch (options.operator) {
    case "++":
      value = options.start + index;
      break;
    case "--":
      value = options.start - index;
      break;
    case "+":
      value = options.start + (index * options.step);
      break;
    case "-":
      value = options.start - (index * options.step);
      break;
    default:
      return "";
  }

  value = paddingZero(value, options.digit, options.radix);
  var hasAlpha = options.input.match(/([a-fA-F])/);
  if (hasAlpha) {
    // for hex.
    return hasAlpha[1] == hasAlpha[1].toLowerCase() ? value.toLowerCase() : value.toUpperCase();
  }
  return value;
}

function paddingZero(num, dig, radix) {
  if (!dig) {
    dig = 0;
  }
  if (!radix) {
    radix = 10;
  }
  var number = num.toString(radix);
  var numAbs = number.replace("-", "");
  var digit = Math.max(numAbs.length, dig);
  var result = "";
  if (0 <= number.indexOf("-")) {
    result += "-";
  }
  result += (Array(digit).join("0") + numAbs).slice(digit * -1);
  return result;
}