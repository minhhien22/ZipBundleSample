'use strict';
var path = require('path');
var fs = require('fs');
var exec = require("child_process").exec;
var listBundleName = [];
var listVersion = []
var listIgnore = ["internal", "main", "resources"]
var bundleVersionData = {};
var urlBundle = "http://192.168.110.147:8080/assets"
var zipper = require("zip-local");
// const AdmZip = require("adm-zip");
// var urlBundle = "http://192.168.34.104:8700/assets"
var dest = '';
var assetsUrl = ""
// zipBundle("D:/Cocos/ZipBundleSample/build/web-mobile/assets")
function onBuildFinished(options, callback) {
  assetsUrl = path.join(options.dest, "assets");
  dest = path.join(options.dest, "assets");
  Editor.log("Prepare gen file AssetBundleVersion in:" + dest);
  setTimeout(() => {
    getListBundle();
  }, 1000);

  callback();
}
function onBeforeChangeFile(options) {
  getProjectManifestUid(projectManifestPath);
}
function onBeforeBuildFinish(options, callback) {
  onBuildFinished(options);
}
function getVersionBundle(dir, bundleName) {
  let status = fs.statSync(dir);
  if (status.isDirectory()) {
    let bundleUrl = urlBundle + "/" + bundleName;
    fs.readdir(dir, (err, files) => {
      files.forEach(file => {
        if (file.includes("index")) {
          let dataBundle = {};
          // listVersion.push(file.substr(6, 5));
          dataBundle['hash'] = file.substr(6, 5)
          dataBundle.url = bundleUrl;
          bundleVersionData[bundleName] = dataBundle;
        }
      });
    });
  }
}
function createVersionJson() {
  let str = JSON.stringify(bundleVersionData);
  str = str.replace(/\\/g, "/");
  fs.writeFile(path.join(dest, 'AssetBundleVersion.json'), str, (err) => {
    if (err) throw err;
    Editor.log('Generate AssetBundleVersion.json successfully!');
  });
}
function getListBundle() {
  let listFolder = [];
  fs.readdir(assetsUrl, (err, files) => {
    if (err) {
      Editor.log("Error Gen List Bundler:", err);
      return;
    }
    listFolder = files;
  });
  setTimeout(() => {
    listFolder.forEach(file => {
      listBundleName.push(file);
      getVersionBundle(path.join(assetsUrl, file), file);
    });
  }, 500);

  setTimeout(() => {
    createVersionJson();
    zipBundle(dest)
  }, 1000);
}
function zipBundle(src) {
  fs.readdirSync(src).forEach(file => {
    // console.log("zipBundle:" + file);
    let tempUrl = src + "/" + file;
    var stats = fs.statSync(tempUrl);
    if (stats.isDirectory() && !listIgnore.includes(file)) {
      let rawUrl = tempUrl;
      // zipFolder(rawUrl, src);
      zipDirectory(rawUrl, rawUrl + ".zip");
    }
  })
}
function zipDirectory(sourceDir, outPath) {
  Editor.log("zipDirectory:sourceDir="+sourceDir);
  Editor.log("zipDirectory:outPath="+outPath);
  zipper.sync.zip(sourceDir).compress().save(outPath);
  // zipper.sync.zip(sourceDir).compress().save(outPath);
}
async function zipFolder(src, path) {
  console.log("zipFolder:" + src + "---path==" + path);
  // let input = "res";
  // let out = "res.zip";
  // let cmd = cmdCD + src;
  // let cmd2 = cmdZip + out + " " + input;
  // exec(cmd + cmdLink + cmd2, (error, stdout, stderr) => {
  //   if (error) {
  //     Editor.log(`error: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     Editor.log(`stderr: ${stderr}`);
  //     return;
  //   }
  //   count++;
  //   Editor.log("Zip Success Folder:", src + "/" + input, count + "/" + listLoc.length);
  //   rimraf.sync(src + "/" + "res");
  //   if (count === listLoc.length) {
  //     getUrlSubGame(path);
  //     count = 0;
  //   }

  // });

}
module.exports = {
  load() {
    Editor.Builder.on('build-finished', onBuildFinished);
    // Editor.Builder.on('build-start', unCheckSub);
  },

  unload() {
    Editor.Builder.removeListener('build-finished', onBuildFinished);
    // Editor.Builder.removeListener('build-start', unCheckSub);
  },

  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('test');
    },
    'say-hello'() {
      //  Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('test', 'test:hello');
    },
    'clicked'() {
      //  Editor.log('Button clicked!');
    }
  },
};
