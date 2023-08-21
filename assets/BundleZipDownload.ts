import Http from "./Http";
import CallNative from "./MyDev";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BundleZipDownload extends cc.Component {
    static instance: BundleZipDownload = null
    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    BundleVersion: any = null;
    BundleVersionLocal: any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        BundleZipDownload.instance = this
    }

    start() {
        this.BundleVersionLocal = Object.create({});
        let bndlLocal = cc.sys.localStorage.getItem("BundleVersionLocal");
        if (bndlLocal != null) {
            this.BundleVersionLocal = JSON.parse(bndlLocal);
        }
        cc.log("BundleVersionLocal:", JSON.stringify(this.BundleVersionLocal));
        this.loadVersionConfig();
    }
    loadVersionConfig() {
        var url = "http://%host/assets/AssetBundleVersion.json?t=" + new Date().getTime();
        url = url.replace("%host", "192.168.110.147:8080");
        Http.get(url, {}, (err, res) => {
            console.log("Respone BundleVersion =", res);
            if (err != null) {
                cc.log("Respone BundleVersion err =", err);
                return;
            }
            this.BundleVersion = res;
            // if (this.BundleVersionLocal == null) {
            //     this.BundleVersionLocal = this.BundleVersion;
            //     cc.sys.localStorage.setItem("BundleVersionLocal", JSON.stringify(this.BundleVersionLocal));
            // }

        }, false);
    }
    onClickTaiGame(event, bundleName) {
        // let url = bundleName;
        // let bundleData;
        // let isDownloadZip = false
        // if (!this.BundleVersionLocal.hasOwnProperty(bundleName)) { // chua tung co bundle trong local---> force Download new bundle
        //     isDownloadZip = true;
        // } else { //neu co roi. thi can check version local vs version remote;
        //     // bundleData = this.BundleVersion[bundleData];
        //     if (this.BundleVersionLocal[bundleName]["hash"] != this.BundleVersion[bundleName]["hash"]) { // cos bundle version moi
        //         isDownloadZip = true
        //     } else { //load lai bundle tu local len
        //         cc.log(" BUNDLE DA LOAD O LOCAL,KO CO VERSION MOI")
        //         isDownloadZip = false;
        //     }

        // }
        // if (cc.sys.isNative && (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)) {
        //     let versionBundle = this.BundleVersion[bundleName].hash;
        //     if (isDownloadZip) {
        //         cc.log("START DOWNLOAD NEW BUNDLE ZIP");
        //         this.downloadZipBundle(this.BundleVersion[bundleName].url, bundleName, this.BundleVersion[bundleName].hash)
        //     } else {
        //         cc.log("LOAD BUNDLE FROM LOCAL");
        //         let urlLocal = jsb.fileUtils.getWritablePath() + "BundleTemp/";
        //         //{"name":"Demo.e0c69","path":"/data/user/0/com.rongvang.online/files/BundleTemp/"}
        //         this.downloadBundle(urlLocal, bundleName, versionBundle);
        //     }
        // }
        // cc.assetManager.downloader.download("downloadZip", "http://192.168.110.147:8080/assets/" + bundleName, '.zip',
        //     { onFileProgress: (loaded, total) => console.log(loaded / total) });
        let zipURL = "http://192.168.110.147:8080/assets/" + bundleName + ".zip";
        let storagePath: string = jsb.fileUtils.getWritablePath() + 'gameZipDownload/'
        jsb.fileUtils.createDirectory(storagePath);
        let nameZip= storagePath+bundleName+".zip";
        let downloader = new jsb.Downloader();
        downloader.setOnFileTaskSuccess((task) => {

            console.log("DownloadZipComCoplelte")

        })

        downloader.setOnTaskProgress((task, curBytes, totalBytes) => {

            console.log(`progress:${curBytes}/${totalBytes}`)

        })

        downloader.setOnTaskError((task, errCode, errString) => {

            console.log(`Error Download:${errCode}/${errString}`)

        })

        console.log(`Start Download ZIP:${zipURL}`)

        downloader.createDownloadFileTask(zipURL, nameZip);
        // cc.assetManager.downloader.register(".zip",(url, options, onComplete) => onComplete(null, null));
        // cc.assetManager.downloader.download("Download_ZIp", zipURL, '.zip', { onFileProgress: (loaded, total) => console.log(loaded / total) },
        //     (err, file) => {
        //         if (err) {
        //             console.log(err)
        //         } else {
        //             console.log("Tai file thanh cong");
        //             console.log("File la:",file);
        //         }
        //     });
        // cc.assetManager.utils.
    }
    downloadZipBundle(urlBundle, bundleName, version) {
        this.downloadBinary({ url: urlBundle + ".zip", type: "arraybuffer" }, (err, data) => {
            if (null == err) {
                cc.log("Download Zip Bundle Sucessfully")
                let u8Arr = new Uint8Array(data);
                //保存文件
                let path = jsb.fileUtils.getWritablePath() + "BundleTemp/";
                if (!jsb.fileUtils.isDirectoryExist(path)) {
                    jsb.fileUtils.createDirectory(path);
                }
                cc.log("path save BundleZip=" + path);
                let fPath = `${path + bundleName}.zip`;
                let rst = jsb.fileUtils.writeDataToFile(u8Arr, fPath)
                console.log('-=-= rst   ', rst)
                if (rst) {
                    console.log('Save ZipFile-=-= DONE ')

                    CallNative.unzipFilePath(bundleName, version, fPath);
                } else {
                    cc.log("Blade:下载失败1")
                }
            } else {
                cc.log("Error Download Zip Bundle:下载失败2")
            }
        });
    }
    unzipFile(path) {
        let bufferAsset = jsb.fileUtils.get
        if (cc.sys.isNative && !Blob.prototype.text) {
            Blob.prototype.text = function () {
                return this.data;
            }
        }
        const reader = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(bufferAsset._buffer)));
        reader.getEntries().then((entries) => {
            if (entries.length) {
                entries[0].getData(
                    new zip.TextWriter()
                ).then((text) => {
                    //todo text extracted from zip
                });
            }
            reader.close();
        });
    }

    downloadBundle(path, nameBundle, versionBundle) {
        let option = { version: versionBundle }
        cc.log("downloadBundleJS: NameBundle=" + nameBundle);
        cc.log("downloadBundleJS: versionBundle=" + versionBundle);
        cc.log("downloadBundleJS: path=" + path);
        cc.log("downloadBundleJS: pathLoad=" + (path + nameBundle + `.${versionBundle}`));

        cc.assetManager.loadBundle(path + nameBundle, option, (err, bundle) => {
            if (err) {
                console.log(err);
                return;
            }
            bundle.load("dragon", cc.Prefab, (err2, asset) => {
                if (cc.isValid(err2)) {
                    return;
                }
                let game: any = cc.instantiate(asset)
                game.parent = this.node
                game.active = true;
                this.BundleVersionLocal[nameBundle] = {
                    hash: versionBundle,
                    url: path + nameBundle
                }
                cc.sys.localStorage.setItem("BundleVersionLocal", JSON.stringify(this.BundleVersionLocal));
            })
        });
    }

    downloadBinary(item, callback) {
        var url = item.url;
        cc.log("downloadBinary:" + url);
        var xhr = new XMLHttpRequest(), errInfo = "Load binary data failed: " + url;
        xhr.open("GET", url, true);
        xhr.responseType = item.type;
        xhr.onload = function () {
            var resp = xhr.response;
            if (resp) {
                callback && callback(null, xhr.response);
            } else callback && callback(errInfo + "(no response)");
        };
        xhr.onerror = function () {
            callback && callback(errInfo + "(error)");
        };
        xhr.ontimeout = function () {
            callback && callback(errInfo + "(time out)");
        };
        xhr.send(null);
    }
}
