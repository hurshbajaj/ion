"use strict";
/* @new isLoggedIn? true
// @new age# 12
// @new ageExact$ 12.7
// @new name! "josh"
 > ["@new", "name", "//", "josh"]*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticTypes = exports.tokenTypes = void 0;
exports.tokenOf = tokenOf;
exports.isNum = isNum;
exports.isAlpha = isAlpha;
exports.canSkip = canSkip;
exports.tokenize = tokenize;
var fs = __importStar(require("fs"));
var tokenTypes;
(function (tokenTypes) {
    tokenTypes[tokenTypes["keyword"] = 0] = "keyword";
    tokenTypes[tokenTypes["identifier"] = 1] = "identifier";
    tokenTypes[tokenTypes["number"] = 2] = "number";
    tokenTypes[tokenTypes["openParen"] = 3] = "openParen";
    tokenTypes[tokenTypes["closeParen"] = 4] = "closeParen";
    tokenTypes[tokenTypes["binOp"] = 5] = "binOp";
    tokenTypes[tokenTypes["assignType"] = 6] = "assignType";
})(tokenTypes || (exports.tokenTypes = tokenTypes = {}));
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
})(staticTypes || (exports.staticTypes = staticTypes = {}));
var assignTypes = {
    "#": staticTypes.num,
    "$": staticTypes.deci,
    "?": staticTypes.bool,
    "!": staticTypes.str,
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
function isNum(num) {
    try {
        var hold = parseFloat(num);
        return true;
    }
    catch (e) {
        return false;
    }
}
function isAlpha(src) {
    return src.toLowerCase() !== src.toUpperCase();
}
function canSkip(src) {
    return src === "\n" || src === "\t" || src === ' ';
}
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
                var holdOp = src.shift();
                tokens.push(tokenOf(holdOp, tokenTypes.binOp, binOps[holdOp]));
                break;
            case "#":
            case "$":
            case "?":
            case "!":
                var hold = src.shift();
                tokens.push(tokenOf(hold, tokenTypes.assignType, assignTypes[hold]));
                break;
            default:
                if (canSkip(src[0])) {
                    src.shift();
                }
                // @ts-ignore
                else if (!isNaN(src[0])) {
                    var number = "";
                    //@ts-ignore
                    while (!isNaN(src[0])) {
                        number += src.shift();
                    }
                    tokens.push(tokenOf(number, tokenTypes.number));
                }
                else if (src[0] === "@") { //keywords
                    var keyword = src.shift();
                    // @ts-ignore
                    while (isNaN(src[0]) && src[0] !== " " && isAlpha(src[0])) {
                        // @ts-ignore
                        keyword += src.shift();
                    }
                    // @ts-ignore
                    tokens.push(tokenOf(keyword, tokenTypes.keyword, keywords[keyword]));
                }
                else if (isAlpha(src[0])) {
                    var identifier = "";
                    while (src.length > 0 && isAlpha(src[0])) {
                        identifier += src.shift();
                    }
                    tokens.push(tokenOf(identifier, tokenTypes.identifier));
                } //identifiers
                else { //error
                    console.log("Unrecognised Char");
                    src.shift();
                }
                break;
        }
    }
    return tokens;
}
var sourcecode = fs.readFileSync("./test.io", "utf-8");
var lexedArr = tokenize(sourcecode);
console.log(lexedArr);
