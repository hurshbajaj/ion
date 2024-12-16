"use strict";
/* @new isLoggedIn? true
// @new age# 12
// @new ageExact$ 12.7
// @new name! "josh"
 > ["@new", "name", "//", "josh"]*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.isAlpha = exports.tokenOf = exports.staticTypes = exports.tokenTypes = void 0;
var tokenTypes;
(function (tokenTypes) {
    tokenTypes[tokenTypes["keyword"] = 0] = "keyword";
    tokenTypes[tokenTypes["identifier"] = 1] = "identifier";
    tokenTypes[tokenTypes["number"] = 2] = "number";
    tokenTypes[tokenTypes["openParen"] = 3] = "openParen";
    tokenTypes[tokenTypes["closeParen"] = 4] = "closeParen";
    tokenTypes[tokenTypes["binOp"] = 5] = "binOp";
    tokenTypes[tokenTypes["assignType"] = 6] = "assignType";
})(tokenTypes = exports.tokenTypes || (exports.tokenTypes = {}));
var staticTypes;
(function (staticTypes) {
    //assignType
    staticTypes[staticTypes["num"] = 0] = "num";
    staticTypes[staticTypes["deci"] = 1] = "deci";
    staticTypes[staticTypes["bool"] = 2] = "bool";
    staticTypes[staticTypes["str"] = 3] = "str";
    //binOps
    staticTypes[staticTypes["addPlus"] = 4] = "addPlus";
    staticTypes[staticTypes["minus"] = 5] = "minus";
    staticTypes[staticTypes["multiply"] = 6] = "multiply";
    staticTypes[staticTypes["divide"] = 7] = "divide";
    //keywords
    staticTypes[staticTypes["init"] = 8] = "init";
})(staticTypes = exports.staticTypes || (exports.staticTypes = {}));
var assignTypes = {
    "#": staticTypes.num,
    "$": staticTypes.deci,
    "?": staticTypes.bool,
    "!": staticTypes.num,
};
var binOps = {
    "+": staticTypes.addPlus,
    "-": staticTypes.minus,
    "*": staticTypes.multiply,
    "/": staticTypes.divide,
};
var keywords = {
    "@new": staticTypes.init
};
function tokenOf(val, type, subtype) {
    if (val === void 0) { val = ""; }
    if (subtype === void 0) { subtype = null; }
    return { val: val, type: type, subtype: subtype };
}
exports.tokenOf = tokenOf;
function isAlpha(src) {
    return src.toLowerCase() !== src.toUpperCase();
}
exports.isAlpha = isAlpha;
function tokenize(sourceCode) {
    var tokens = new Array();
    var src = sourceCode.split("");
    while (src.length > 0) {
        switch (src[0]) {
            case "(":
                tokens.push(tokenOf(src.shift(), tokenTypes.openParen));
                break;
            case ")":
                tokens.push(tokenOf(src.shift(), tokenTypes.closeParen));
                break;
            case "+":
            case "-":
            case "*":
            case "/":
                tokens.push(tokenOf(src.shift(), tokenTypes.binOp, binOps[src[0]]));
                break;
            case "#":
            case "$":
            case "?":
            case "!":
                tokens.push(tokenOf(src.shift(), tokenTypes.assignType, assignTypes[src[0]]));
                break;
            default:
                // @ts-ignore
                if (!isNaN(src[0])) {
                    var number = "";
                    //@ts-ignore
                    while (!isNaN(src[0])) {
                        number += src.shift();
                    }
                    tokens.push(tokenOf(number, tokenTypes.number));
                }
                else if (src[0] === "@") {
                    var keyword = src.shift();
                    // @ts-ignore
                    while (isNaN(src[0]) && src[0] !== " " && isAlpha(src[0])) {
                        // @ts-ignore
                        keyword += src.shift();
                    }
                    /*The way keywords record works is that, for e.g. , you may write @new,
                      it will be lexed/interpreted as init subtype. */
                    // @ts-ignore
                    tokens.push(tokenOf(keyword, tokenTypes.keyword, keywords[keyword]));
                }
                else if (isAlpha(src[0])) {
                    var identifier = "";
                    while (src.length > 0 && isAlpha(src[0])) {
                        identifier += src.shift();
                    }
                    tokens.push(tokenOf(identifier, tokenTypes.identifier));
                }
                else {
                    src.shift();
                }
                break;
        }
    }
    return tokens;
}
exports.tokenize = tokenize;
