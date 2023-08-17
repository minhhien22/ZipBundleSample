/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class AppActivity extends Cocos2dxActivity {
    public static AppActivity activity;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            // so just quietly finish and go away, dropping the user back into the activity
            // at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        activity = this;
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();

    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }

        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }
    public static void onCallFromJavascript(final String evt, final String params) throws JSONException, UnsupportedEncodingException {
        Log.d(Contanst.TAG, "---onCallFromJavascript === EVT " + evt + " Data: " + params);
        switch (evt) {
            case Contanst.GET_DEVICE_ID: {
              activity.sendToJavascript(Contanst.GET_DEVICE_ID,activity.getDeviceIdd());
                break;
            }
            case Contanst.UNZIP:{
                JSONObject jsonData = new JSONObject(params);
                String distName = jsonData.getString("name");
                String path = jsonData.getString("path");
                String version=jsonData.getString("version");
                Log.d("JS", "onCallFromJavascript: " + path+"---name"+distName);

                activity.unzip(distName, version,path, null);
            }


        }
    }
    public static String getDeviceIdd(){
        String deviceId = Settings.Secure.getString(Contanst.instance.getContext().getContentResolver(),
                Settings.Secure.ANDROID_ID);
        return deviceId;

    }
    public static void sendToJavascript(final String evt, final String params) {
        Log.d("JS","sendToJavascript:evt="+evt+"---Params="+params);
        activity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
             //   Cocos2dxJavascriptJavaBridge.evalString("cc.NativeCallJS(\"" + evt + "\",\"" + params + "\")");
                Cocos2dxJavascriptJavaBridge.evalString("cc.NativeCallJS('" + evt + "','" + params + "')");
            }
        });
    }
    public interface UnzipFile_Progress
    {
        void Progress(int percent, String FileName);
    }
    public static void checkExistBundle(String pathFolder ){
        File dirBundle = new File(pathFolder);
        if (dirBundle.isDirectory())
        {
            Log.d("JS", "Exist Bundle--->Remove it: " + pathFolder);
            String[] children = dirBundle.list();
            for (int i = 0; i < children.length; i++)
            {
                new File(dirBundle, children[i]).delete();
            }
        }
    }
    // unzip(new File("/sdcard/pictures.zip"), new File("/sdcard"));
    public static void unzip(String distName,String version, String path, UnzipFile_Progress progress)
    {
        Log.d("JS", "unzip file: " + distName);
        File zipFile = new File(path);
        Log.d("JS", "parent path: " + zipFile.getParent());
        File targetDirectory =new File(zipFile.getParent() + File.separator + distName);
        checkExistBundle(zipFile.getParent() + File.separator + distName);


       // }
        long total_len = zipFile.length();
        long total_installed_len = 0;

        try
        {
            ZipInputStream zis = new ZipInputStream(new BufferedInputStream(new FileInputStream(zipFile)));
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[1024];
            while ((ze = zis.getNextEntry()) != null)
            {
                Log.d("JS", "unzip file: " + ze.getName());
                if (progress != null)
                {
                    total_installed_len += ze.getCompressedSize();
                    String file_name = ze.getName();
                    int percent = (int)(total_installed_len * 100 / total_len);
                    progress.Progress(percent, file_name);
                }

                File file = new File(targetDirectory, ze.getName());
                File dir = ze.isDirectory() ? file : file.getParentFile();
                if (!dir.isDirectory() && !dir.mkdirs())
                    Log.d("JS", "Failed to ensure directory: " + dir.getAbsolutePath());
                if (ze.isDirectory())
                    continue;
                FileOutputStream fout = new FileOutputStream(file);
                try
                {
                    while ((count = zis.read(buffer)) != -1)
                        fout.write(buffer, 0, count);
                } finally
                {
                    fout.close();
                }

                // if time should be restored as well
                long time = ze.getTime();
                if (time > 0)
                    file.setLastModified(time);
            }
            Log.d("JS", "unzip: DONE");
            JSONObject jsonData = new JSONObject();
            jsonData.put("name", distName);
            jsonData.put("path", zipFile.getParent() + File.separator );
            jsonData.put("version",version);
            activity.sendToJavascript("2", jsonData.toString());
            zis.close();
            File file = new File(path);
            file.delete();
        } catch (IOException | JSONException e)
        {
            Log.d("JS", "unzip: IOException");
        }
    }
}
