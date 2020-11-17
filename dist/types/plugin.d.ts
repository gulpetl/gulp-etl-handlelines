import Vinyl = require('vinyl');
export declare type TransformCallback = (lineObj: object, context: any, file: Vinyl) => object | Array<object> | null;
export declare type FinishCallback = (context: any, file: Vinyl) => void;
export declare type StartCallback = (context: any, file: Vinyl) => void;
export declare type allCallbacks = {
    transformCallback?: TransformCallback;
    finishCallback?: FinishCallback;
    startCallback?: StartCallback;
};
export declare function handlelines(configObj: any, newHandlers?: allCallbacks): any;
