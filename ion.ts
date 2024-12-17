/* @new isLoggedIn? true
// @new age# 12
// @new ageExact$ 12.7
// @new name! "josh"
 > ["@new", "name", "//", "josh"]*/

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
    "@new": staticTypes.init
};

export interface token {
    val: string;
    type: tokenTypes;
    subtype: staticTypes | null;
}

export function tokenOf(val: string = "", type: tokenTypes, subtype: staticTypes | null = null): token {
    return {val, type, subtype};
}

export function isAlpha(src: string):boolean {
    return src.toLowerCase() !== src.toUpperCase();
}
export function canSkip(src: string):boolean {
    return src === "\n" || src === "\t" || src === " ";
}

export function tokenize(sourceCode: string): Array<token> {
    let tokens = new Array<token>();
    let src = sourceCode.split("");
    while(src.length > 0) {
        switch(src[0]) {
            case "(":
                tokens.push(tokenOf(src.shift(), tokenTypes.openParen))
                break;
            case ")":
                tokens.push(tokenOf(src.shift(), tokenTypes.closeParen))
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
                if(!isNaN(src[0])){
                    let number = "";
                    //@ts-ignore
                    while (!isNaN(src[0])){
                        number += src.shift();
                    }
                    tokens.push(tokenOf(number, tokenTypes.number));
                }else if(src[0] === "@"){
                    let keyword = src.shift();
                    // @ts-ignore
                    while(isNaN(src[0]) && src[0] !== " " && isAlpha(src[0])){
                        // @ts-ignore
                        keyword += src.shift();
                    }
                    /*The way keywords record works is that, for e.g. , you may write @new,
                      it will be lexed/interpreted as init subtype. */
                    // @ts-ignore
                    tokens.push(tokenOf(keyword, tokenTypes.keyword, keywords[keyword]));
                } else if(isAlpha(src[0])){
                    let identifier = "";
                    while (src.length > 0 && isAlpha(src[0])) {
                        identifier += src.shift();
                    }
                    tokens.push(tokenOf(identifier, tokenTypes.identifier));
                } else if(canSkip(src[0])){
                    src.shift();
                }else{
                    console.log("Unrecognised Char")
                }


                break;

        }
    }

    return tokens;
}

const sourcecode:string = fs.readFileSync("./test.io", "utf-8");
const lexedArr:any[] = tokenize(sourcecode);

console.log(lexedArr);

