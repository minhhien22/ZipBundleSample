// import { Windown } from "../Windown";


const { ccclass, property } = cc._decorator;
@ccclass
export default class Http {
    static post(url: string, params: object, onFinished: (err: any, json: any) => void, isSendNormalParams = false, isShowBusy = true) {
        // cc.log("url Post==" + url);

        var xhr = new XMLHttpRequest();
        var _params = "";
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = null;
                    var e = null;
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (ex) {
                        e = ex;
                    }
                    //Windown.UIManager.hideLoading();
                    onFinished(e, data);
                } else {
                    //Windown.UIManager.hideLoading();;
                    onFinished(xhr.status, null);
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        if (isSendNormalParams) {
            // cc.log("Params Post==", params)
            xhr.send(JSON.stringify(params));
            // xhr.send(JSON.stringify({data:"137&46&66&65&64&66&68&66&69&61&67&60&61&67&61&67&66&61&46&70&46&112&117&46&56&46&122&246&117&98&46&70&46&113&121&109&122&46&56&46&80&102&80&102&131&77&102&130&120&119&77&102&88&77&102&100&91&89&94&134&93&99&78&120&95&86&90&81&109&93&98&82&112&82&61&60&77&102&101&98&119&109&60&131&97&109&114&82&83&112&117&61&60&89&127&132&121&93&101&86&99&91&118&94&97&88&133&111&134&109&92&90&97&90&77&102&94&119&112&89&124&97&110&85&82&119&89&60&90&121&110&88&120&100&90&96&86&99&101&116&77&102&82&91&63&68&98&98&118&65&97&109&117&78&122&101&64&119&119&113&81&90&98&99&123&61&95&97&61&116&120&93&117&116&122&99&65&97&63&110&131&97&120&94&63&97&122&94&62&93&63&110&133&60&99&96&134&93&120&95&80&65&62&93&89&77&102&81&99&78&65&97&99&65&93&97&110&116&132&99&110&117&120&98&93&83&83&46&70&46&122&113&119&123&128&46&135"}));
        } else {
            xhr.send(_params);
        }

    }
    static postNoToken(url: string, params: object, onFinished: (err: any, json: any) => void, isSendNormalParams = false, isShowBusy = true) {
        // cc.log("url Post==" + url);
        if (isShowBusy) {
            //Windown.UIManager.showLoading();
        }

        var xhr = new XMLHttpRequest();
        var _params = "";
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = null;
                    var e = null;
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (ex) {
                        e = ex;
                    }
                    //Windown.UIManager.hideLoading();;
                    onFinished(e, data);
                } else {
                    //Windown.UIManager.hideLoading();;
                    onFinished(xhr.status, null);
                }
            }
        };

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        if (isSendNormalParams) {
            // cc.log("Params Post==", params)
            xhr.send(JSON.stringify(params));
            cc.log("params:", params);
            // xhr.send(JSON.stringify({data:"137&46&66&65&64&66&68&66&69&61&67&60&61&67&61&67&66&61&46&70&46&112&117&46&56&46&122&246&117&98&46&70&46&113&121&109&122&46&56&46&80&102&80&102&131&77&102&130&120&119&77&102&88&77&102&100&91&89&94&134&93&99&78&120&95&86&90&81&109&93&98&82&112&82&61&60&77&102&101&98&119&109&60&131&97&109&114&82&83&112&117&61&60&89&127&132&121&93&101&86&99&91&118&94&97&88&133&111&134&109&92&90&97&90&77&102&94&119&112&89&124&97&110&85&82&119&89&60&90&121&110&88&120&100&90&96&86&99&101&116&77&102&82&91&63&68&98&98&118&65&97&109&117&78&122&101&64&119&119&113&81&90&98&99&123&61&95&97&61&116&120&93&117&116&122&99&65&97&63&110&131&97&120&94&63&97&122&94&62&93&63&110&133&60&99&96&134&93&120&95&80&65&62&93&89&77&102&81&99&78&65&97&99&65&93&97&110&116&132&99&110&117&120&98&93&83&83&46&70&46&122&113&119&123&128&46&135"}));
        } else {
            xhr.send(_params);
        }

    }

    static get(url: string, params: object, onFinished: (err: any, json: any) => void, isShowBusy = true) {
        if (isShowBusy) {
            //Windown.UIManager.showLoading();
        }
        var xhr = cc.loader.getXMLHttpRequest();
        var _params = "";
        params = params || {};
        if (params !== null) {
            var count = 0;
            var paramsLength = Object.keys(params).length;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    _params += key + "=" + params[key];
                    if (count++ < paramsLength - 1) {
                        _params += "&";
                    }
                }
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = null;
                    var e = null;
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (ex) {
                        e = ex;
                    }
                    //Windown.UIManager.hideLoading();;
                    onFinished(e, data);
                } else {
                    //Windown.UIManager.hideLoading();;
                    onFinished(xhr.status, null);
                }
            }
        };
      
        var link = url;
        cc.log("GET LINK:" + link);
        xhr.open("GET", link, true);
        // xhr.setRequestHeader('Access-Control-Allow-Origin:',"*");
        xhr.send();
      
    }
    static getNoToken(url: string, params: object, onFinished: (err: any, json: any) => void, isShowBusy = true) {
        if (isShowBusy) {
            //Windown.UIManager.showLoading();
        }

        var xhr = new XMLHttpRequest();
        var _params = "";
        params = params || {};
        if (params !== null) {
            var count = 0;
            var paramsLength = Object.keys(params).length;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    _params += key + "=" + params[key];
                    if (count++ < paramsLength - 1) {
                        _params += "&";
                    }
                }
            }
        }
        cc.log("getNoToken:" + _params);
        url = url + "?" + _params;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = null;
                    var e = null;
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (ex) {
                        e = ex;
                    }
                    //Windown.UIManager.hideLoading();;
                    onFinished(e, data);
                } else {
                    //Windown.UIManager.hideLoading();;
                    onFinished(xhr.status, null);
                }
            }
        };

        var link = url;
        cc.log("GET LINK:" + link);
        xhr.open("GET", link, true);
        xhr.send();
    }
    static encryptData(data) {
        let strData = JSON.stringify(data);
        let list = [];
        for (let i = 0; i < strData.length; i++) list.push(strData.charCodeAt(i) + 12);
        list = list.reverse();
        let strRes = list.join('&');
        return {
            data: strRes
        }
    }

    static deencryptData(data) {
        let newarr = data.split('&');
        let new2Arr = [];
        for (let i = 0; i < newarr.length; i++) {
            new2Arr.push(String.fromCharCode(parseInt(newarr[i]) - 12));
        }

        new2Arr = new2Arr.reverse();
        return JSON.parse(new2Arr.join(''));
    }
}
