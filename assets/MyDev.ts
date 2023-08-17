import BundleZipDownload from "./BundleZipDownload";


var UNZIP = "2";
cc.NativeCallJS = (evt: string, params: string) => {
    console.log('iNativeCallJS------------------------>   EVT ' + typeof evt + ' = ' + evt + " ==>>    " + params);
    switch (evt + '') {
        case UNZIP: {
            //{"name":"Demo","path":"\/data\/user\/0\/com.rongvang.online\/files\/BundleTemp\/","version":"49208"}
            let paObj = JSON.parse(params);
            BundleZipDownload.instance.downloadBundle(paObj.path,paObj.name,paObj.version)
            break;
        }
    }
}

export default class CallNative {
    static onCallNative(evt: string, params: string) {
        // console.log('Call Native-=-=-= EVT ' + evt + " PARAMS " + params)
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", evt, params);
        } else if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("AppController", "onCallFromJavaScript:andParams:", evt, params);
        }
    }

    static unzipFilePath(distName,version, path) {
        CallNative.onCallNative(UNZIP, JSON.stringify({ name: distName, path: path,version:version }))
    }
}