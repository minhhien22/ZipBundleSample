import BundleZipDownload from "./BundleZipDownload";


var UNZIP = "2";
cc.NativeCallJS = (evt: string, params: string) => {
    console.log('iNativeCallJS------------------------>   EVT ' + typeof evt + ' = ' + evt + " ==>>    " + params);
    switch (evt + '') {
        case UNZIP: {
            //     let data_mail = Utils.data_mail;
            //     data_mail.push({ title: "ADMIN", content: "You have just been successfully added " + Utils.formatNumber(Utils.price_IAP) + " gold. Wish you have moments of fun entertainment." })
            //     Utils.data_mail = data_mail

            //     Utils.money += Utils.price_IAP
            //     Utils.vip = Utils.vip + 1;
            //     if (Utils.vip > 15) {
            //         Utils.vip = 15
            //     }
            //     Utils.price_IAP = -1
            //     UIManager.instance.updateInfo();
            let paObj = JSON.parse(params);
            BundleZipDownload.instance.downloadBundle(paObj.path,paObj.name)
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

    static unzipFilePath(distName, path) {
        CallNative.onCallNative(UNZIP, JSON.stringify({ name: distName, path: path }))
    }
}