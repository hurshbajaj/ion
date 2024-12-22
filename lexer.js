"use strict";
/* @new isLoggedIn? true
// @new age# 12
// @new ageExact$ 12.7
// @new name! "josh"
 > ["@new", "name", "//", "josh"]*/
Object.defineProperty(exports, "__esModule", { value: true });
var tokenType;
(function (tokenType) {
    tokenType[tokenType["keyword"] = 0] = "keyword";
    tokenType[tokenType["identifier"] = 1] = "identifier";
    tokenType[tokenType["variableFlag"] = 2] = "variableFlag";
    tokenType[tokenType["argument"] = 3] = "argument";
    tokenType[tokenType["assignToken"] = 4] = "assignToken";
    tokenType[tokenType["binOp"] = 5] = "binOp";
    tokenType[tokenType["openParen"] = 6] = "openParen";
    tokenType[tokenType["closeParen"] = 7] = "closeParen";
    tokenType[tokenType["number"] = 8] = "number";
})(tokenType || (tokenType = {}));
var keywordsRecord = {
    "$": "init",
    "%": "sub-init"
};
//variable flag types~~
var varflagsVARTYPE;
(function (varflagsVARTYPE) {
    varflagsVARTYPE[varflagsVARTYPE["(integer)"] = 0] = "(integer)";
    varflagsVARTYPE[varflagsVARTYPE["(string)"] = 1] = "(string)";
    varflagsVARTYPE[varflagsVARTYPE["(boolean)"] = 2] = "(boolean)";
    varflagsVARTYPE[varflagsVARTYPE["(decimal)"] = 3] = "(decimal)";
    varflagsVARTYPE[varflagsVARTYPE["(function)"] = 4] = "(function)";
    varflagsVARTYPE[varflagsVARTYPE["(construct)"] = 5] = "(construct)";
})(varflagsVARTYPE || (varflagsVARTYPE = {})); //varflagsVARTYPE
var varflagsMISC;
(function (varflagsMISC) {
    varflagsMISC[varflagsMISC["const"] = 0] = "const";
    varflagsMISC[varflagsMISC["static"] = 1] = "static";
})(varflagsMISC || (varflagsMISC = {}));
function isAlpha(src) {
    return src.toLowerCase() !== src.toUpperCase();
}
function isNum(src) {
    var holder = Number(src);
    return !isNaN(holder);
}
function tokenize(val, type) {
    return { val: val, type: type };
}
function lexer(srcCode) {
    var lexedArr = new Array();
    var src = srcCode.split("");
    while (src[0]) {
        switch (src[0]) {
            case "(":
                if (isAlpha(src[0])) {
                    var flag = "";
                    // @ts-ignore
                    while (src[0] !== ")") {
                        flag += src.shift();
                    }
                    lexedArr.push(tokenize(flag, tokenType.variableFlag));
                }
                else {
                    lexedArr.push(tokenize(src.shift(), tokenType.openParen));
                }
                break;
            case ")":
                lexedArr.push(tokenize(src.shift(), tokenType.closeParen));
                break;
        }
    }
    return lexedArr;
}
