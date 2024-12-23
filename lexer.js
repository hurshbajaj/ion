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
var subtypeVals;
(function (subtypeVals) {
    subtypeVals[subtypeVals["sum"] = 0] = "sum";
    subtypeVals[subtypeVals["differance"] = 1] = "differance";
    subtypeVals[subtypeVals["mult"] = 2] = "mult";
    subtypeVals[subtypeVals["div"] = 3] = "div";
    subtypeVals[subtypeVals["variableTYPE"] = 4] = "variableTYPE";
    subtypeVals[subtypeVals["variableSTATE"] = 5] = "variableSTATE";
})(subtypeVals || (subtypeVals = {}));
var binOp = {
    "+": "sum",
    "-": "differance",
    "*": "mult",
    "/": "div"
};
var keywordsRecord = {
    "$": "init",
    "%": "sub-init"
};
var flagsVARTYPE;
(function (flagsVARTYPE) {
    flagsVARTYPE[flagsVARTYPE["(integer)"] = 0] = "(integer)";
    flagsVARTYPE[flagsVARTYPE["(string)"] = 1] = "(string)";
    flagsVARTYPE[flagsVARTYPE["(boolean)"] = 2] = "(boolean)";
    flagsVARTYPE[flagsVARTYPE["(decimal)"] = 3] = "(decimal)";
    flagsVARTYPE[flagsVARTYPE["(function)"] = 4] = "(function)";
    flagsVARTYPE[flagsVARTYPE["(construct)"] = 5] = "(construct)";
})(flagsVARTYPE || (flagsVARTYPE = {}));
var flagsVARSTATE;
(function (flagsVARSTATE) {
    flagsVARSTATE[flagsVARSTATE["(const)"] = 0] = "(const)";
    flagsVARSTATE[flagsVARSTATE["(static)"] = 1] = "(static)";
})(flagsVARSTATE || (flagsVARSTATE = {}));
function isAlpha(src) {
    return src.toLowerCase() !== src.toUpperCase();
}
function isNum(src) {
    var holder = Number(src);
    return !isNaN(holder);
}
function tokenize(val, type, subtype) {
    if (subtype === void 0) { subtype = null; }
    return { val: val, type: type, subtype: subtype };
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
                    var subtype = null;
                    if (Object.keys(flagsVARTYPE).includes(flag)) {
                        subtype = subtypeVals.variableTYPE;
                    }
                    else if (Object.keys(flagsVARSTATE).includes(flag)) {
                        subtype = subtypeVals.variableSTATE;
                    }
                    // @ts-ignore
                    lexedArr.push(tokenize(flag, tokenType.variableFlag, subtype));
                }
                else {
                    lexedArr.push(tokenize(src.shift(), tokenType.openParen));
                }
                break;
            case ")":
                lexedArr.push(tokenize(src.shift(), tokenType.closeParen));
                break;
            case ":":
                lexedArr.push(tokenize(src.shift(), tokenType.assignToken));
                break;
            //case for <> argument
            default:
                if (Object.keys(binOp).includes(src[0])) {
                    var hold = src.shift();
                    // @ts-ignore
                    lexedArr.push(tokenize(hold, tokenType.binOp, binOp[hold]));
                }
                //is skippable
                //is keyword
                //is alpha
                //is number
                //error
                break;
        }
    }
    return lexedArr;
}
