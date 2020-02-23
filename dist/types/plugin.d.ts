export declare type TransformCallback = (lineObj: object, context: any) => object | Array<object> | null;
export declare type FinishCallback = (context: any) => void;
export declare type StartCallback = (context: any) => void;
export declare type allCallbacks = {
    transformCallback?: TransformCallback;
    finishCallback?: FinishCallback;
    startCallback?: StartCallback;
};
export declare function handlelines(configObj: any, newHandlers?: allCallbacks): any;
