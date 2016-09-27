/* global suite, test */

var assert = require('assert');
var vscode = require('vscode');
var ext = require('../extension');
var loadModule = require('./module-loader').loadModule;

suite("Extension Tests", function () {

  var appContext = loadModule(__dirname + '/../extension.js');

  var invalidParseResult = function (input) {
    assert.equal(null, appContext.parseInput(input));
  };

  var expectParseResult = function (input, expected) {
    var options = appContext.parseInput(input);
    assert.ok(options);
    var result = expected.map(function (value, index) {
      return appContext.calculate(index, options);
    });
    assert.deepEqual(result, expected);
  };

  suite("Invalid input", function () {
    test("''", function () {
      invalidParseResult("");
    });
    test("--0011 ", function () {
      invalidParseResult("--0011");
    });
    test("++1", function () {
      invalidParseResult("++1");
    });
    test("+1/", function () {
      invalidParseResult("+1/");
    });
    test("1%1", function () {
      invalidParseResult("1%1");
    });
    test("1*2", function () {
      invalidParseResult("1*2");
    });
    test("-2+++", function () {
      invalidParseResult("-2+++");
    });
    test("+34hoge", function () {
      invalidParseResult("+34hoge");
    });
    test("alphabet", function () {
      invalidParseResult("alphabet");
    });
  });

  suite("Valid input", function () {
    suite("+ operator", function () {
      test("0", function () {
        expectParseResult("0", ["0", "1", "2", "3", "4"]);
      });
      test("1", function () {
        expectParseResult("1", ["1", "2", "3", "4", "5"]);
      });
      test("-1", function () {
        expectParseResult("-1", ["-1", "0", "1", "2", "3"]);
      });
      test("1 + 2", function () {
        expectParseResult("1 + 2", ["1", "3", "5", "7", "9"]);
      });
      test("5++", function () {
        expectParseResult("5++", ["5", "6", "7", "8", "9"]);
      });
      test("015 + 1", function () {
        expectParseResult("015 + 1", ["015", "016", "017", "018", "019"]);
      });
      test("09 + 65", function () {
        expectParseResult("09 + 65", ["09", "74", "139", "204", "269"]);
      });
      test("-20+12", function () {
        expectParseResult("-20+12", ["-20", "-8", "4", "16", "28"]);
      });
      test("-10 + 1 : 2", function () {
        expectParseResult("-10 + 1 : 2", ["-10", "-09", "-08", "-07", "-06"]);
      });
      test("-9 + 1000:3", function () {
        expectParseResult("-9 + 1000:3", ["-009", "991", "1991", "2991", "3991"]);
      });
    });
    suite("- operator", function () {
      test("0 -", function () {
        expectParseResult("0 -", ["0", "-1", "-2", "-3", "-4"]);
      });
      test("10 - 3", function () {
        expectParseResult("10 - 3", ["10", "7", "4", "1", "-2"]);
      });
      test("15--", function () {
        expectParseResult("15--", ["15", "14", "13", "12", "11"]);
      });
      test("0020 - 2", function () {
        expectParseResult("0020 - 2", ["0020", "0018", "0016", "0014", "0012"]);
      });
      test("-003120 - 21", function () {
        expectParseResult("-003120 - 21", ["-003120", "-003141", "-003162", "-003183", "-003204"]);
      });
      test("-8 -90 : 2", function () {
        expectParseResult("-8 -90 : 2", ["-08", "-98", "-188", "-278", "-368"]);
      });
    });
    suite("radix 2", function () {
      test("0 + 1 : 1 : 2", function () {
        expectParseResult("0 + 1 : 1 : 2", ["0", "1", "10", "11", "100"]);
      });
      test("-11 - 2 : 2 : 2", function () {
        expectParseResult("-11 - 2 : 2 : 2", ["-11", "-101", "-111", "-1001", "-1011"]);
      });
    });
    suite("radix 8", function () {
      test("6 + 1 : 2 : 8", function () {
        expectParseResult("6 + 1 : 2 : 8", ["06", "07", "10", "11", "12"]);
      });
      test("-5 - 5 : 2 : 8", function () {
        expectParseResult("-5 - 5 : 2 : 8", ["-05", "-12", "-17", "-24", "-31"]);
      });
    });
    suite("radix 16", function () {
      test("a + 6 : 1 : 16", function () {
        expectParseResult("a + 6 : 1 : 16", ["a", "10", "16", "1c", "22"]);
      });
      test("C4b + 9 : 6 : 16", function () {
        expectParseResult("C4b + 9 : 6 : 16", ["000C4B", "000C54", "000C5D", "000C66", "000C6F"]);
      });
      test("b - 12 : 2 : 16", function () {
        expectParseResult("b - 12 : 2 : 16", ["0b", "-01", "-0d", "-19", "-25"]);
      });
    });
  });
});