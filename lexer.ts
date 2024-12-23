/* @new isLoggedIn? true
// @new age# 12
// @new ageExact$ 12.7
// @new name! "josh"
 > ["@new", "name", "//", "josh"]*/

/*
import * as fs from 'fs';

export enum tokenTypes {
    keyword,
    identifier,

    number,
    openParen,
    closeParen,
    binOp,

    assignType
}
export enum staticTypes {
    //assignType
    num,
    deci,
    bool,
    str,
    //binOps
    addPlus,
    minus,
    multiply,
    divide,
    //keywords
    init
}

const assignTypes:Record<string, staticTypes> = {
    "#": staticTypes.num,
    "$": staticTypes.deci,
    "?": staticTypes.bool,
    "!": staticTypes.str,
};
const binOps:Record<string, staticTypes> = {
    "+": staticTypes.addPlus,
    "-": staticTypes.minus,
    "*": staticTypes.multiply,
    "/": staticTypes.divide,
}
const keywords:Record<string, staticTypes> = {
    "@make": staticTypes.init
};

export interface token {
    val: string;
    type: tokenTypes;
    subtype: staticTypes | null;
}
export function tokenOf(val: string = "", type: tokenTypes, subtype: staticTypes | null = null): token {
    return {val, type, subtype};
}

export function isNum(num: any):boolean{
    try{
        let hold = parseFloat(num);
        return !isNaN(hold);
    }catch(e){
        return false;
    }
}
export function isAlpha(src: string):boolean {
    return src.toLowerCase() !== src.toUpperCase();
}
export function canSkip(src: string):boolean {
    return src === "\n" || src === "\t" || src === ' ' || src === '\r';
}

export function tokenize(sourceCode: string): Array<token> {
    let tokens = new Array<token>();

    let src = sourceCode.split("");
    while(src.length > 0) {
        switch(src[0]) {
            case"(":
                tokens.push(tokenOf(src.shift()!, tokenTypes.openParen));
                break;
            case")":
                tokens.push(tokenOf(src.shift()!, tokenTypes.closeParen));
                break;
            case"+":
            case"-":
            case"*":
            case"/":
                let holdOp = src.shift()!;
                tokens.push(tokenOf(holdOp, tokenTypes.binOp, binOps[holdOp]));
                break;
            case"#":
            case"$":
            case"?":
            case"!":
                let hold = src.shift()!;
                tokens.push(tokenOf(hold, tokenTypes.assignType, assignTypes[hold]));
                break;
            default:
                if(canSkip(src[0])){
                    src.shift();
                }
                // @ts-ignore
                else if(isNum(src[0])){
                    let number = "";
                    //@ts-ignore
                    while (src.length > 0 && isNum(src[0])){
                        number += src.shift();
                    }
                    tokens.push(tokenOf(number, tokenTypes.number));
                }
                else if(src[0] === "@"){ //keywords
                    let keyword = src.shift()!;
                    // @ts-ignore
                    while(src.length > 0 && isNaN(src[0]) && isAlpha(src[0])){
                        // @ts-ignore
                        keyword += src.shift();
                    }
                    tokens.push(tokenOf(keyword, tokenTypes.keyword, keywords[keyword]));
                } else if(isAlpha(src[0])){
                    let identifier = "";
                    while (src.length > 0 && isAlpha(src[0])) {
                        identifier += src.shift();
                    }
                    tokens.push(tokenOf(identifier, tokenTypes.identifier));
                } else{ //error
                    src.shift();
                }
                break;
        }
    }

    return tokens;
}

const sourcecode:string = fs.readFileSync("./test.io", "utf-8");
const lexedArr:any[] = tokenize(sourcecode);

console.log("Lexed Array -> ", lexedArr) */

import * as fs from "fs";

interface token{
    val: string;
    type: tokenType;
    subtype: subtypeVals | null;
}
enum tokenType{
    keyword, //sub
    identifier,
    variableFlag, //subtypes: const, varTypes like string, integer~ , static (inside classes) //sub
    argument,

    assignToken, // colon (:)

    binOp,
    openParen,
    closeParen,
    number,
}

enum subtypeVals{
    "sum",
    "differance",
    "mult",
    "div",

    "variableTYPE", //var type flags

    "variableSTATE", //const, static
}

const binOp:Record<string, string> = {
    "+":"sum",
    "-":"differance",
    "*":"mult",
    "/":"div"
}

const keywordsRecord:Record<string, string> = {
    "$":"init",
    "%":"sub-init"
}
enum flagsVARTYPE{
    "(integer)",
    "(string)",
    "(boolean)",
    "(decimal)",
    "(function)",
    "(construct)"
}

enum flagsVARSTATE {
    "(const)",
    "(static)"
}

function isAlpha(src:string):boolean{
    return src.toLowerCase() !== src.toUpperCase();
}
function isNum(src:any):boolean{
    const holder = Number(src);
    return !isNaN(holder);
}

function tokenize(val:any, type:tokenType, subtype:subtypeVals | null = null):token{
    return {val, type, subtype}
}

function lexer(srcCode:string):token[]{
    let lexedArr:Array<token> = new Array<token>();
    let src = srcCode.split("");
    while(src[0]){
        switch(src[0]){
            case "(":
                if (isAlpha(src[0])){
                    let flag = ""
                    // @ts-ignore
                    while(src[0] !== ")") {
                        flag += src.shift()
                    }
                    let subtype = null;

                    if(Object.keys(flagsVARTYPE).includes(flag)){
                        subtype = subtypeVals.variableTYPE;
                    }else if(Object.keys(flagsVARSTATE).includes(flag)){
                        subtype = subtypeVals.variableSTATE;
                    }

                    // @ts-ignore
                    lexedArr.push(tokenize(flag, tokenType.variableFlag, subtype));
                }else{

                    lexedArr.push(tokenize(src.shift(), tokenType.openParen))
                }
                break;

            case ")":
                lexedArr.push(tokenize(src.shift(), tokenType.closeParen))
                break;

            case ":":
                lexedArr.push(tokenize(src.shift(), tokenType.assignToken))
                break;
            //case for <> argument
            default:
                if(Object.keys(binOp).includes(src[0])){
                    const hold = src.shift();
                    // @ts-ignore
                    lexedArr.push(tokenize(hold, tokenType.binOp, binOp[hold]))
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
