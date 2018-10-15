import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
//import { VideoPlayer } from '@ionic-native/video-player';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
/**
 * Generated class for the VideosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  declare var firebase;

@IonicPage()
@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html',
})
export class VideosPage {
  videos = [];
  videosURL = [];
  imageURI: string;
  stringPic: string;
  uploadFile={
    name:'',
    downloadUrl:''
  }
  fire={
    downloadUrl:''
  };
  stringVideo: string;
  stringAudio: string;
  firebaseUploads: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private mediaCapture: MediaCapture, private f: File) {
    this.firebaseUploads = firebase.database().ref('/fireuploads/');
    this.getDataFromDB();
    
    /*this.videoPlayer.play('https://firebasestorage.googleapis.com/v0/b/shoppinglist-820b6.appspot.com/o/files%2F1534239955195.3gp?alt=media&token=b60cd0a3-e08e-4843-b3f4-0517fb985615').then(() => {
    console.log('video completed');
    }).catch(err => {
    console.log(err);
    })*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideosPage');
  }

  getDataFromDB(){
    //Retrieve The List
    this.videos = [];
    firebase.database().ref('/fireuploads/').on("value", (snapshot) =>
    {
      snapshot.forEach((snap) => 
      {
        //this.cuisine._key = snap.key;
        //this.cuisine.name = snap.val();

        //console.log(snap.val().name + ' key ' + snap.key)
        //Appending to items list
        let tokens= snap.val().downloadUrl.split('%',2);
        let fileName = tokens[1].split('?',1);
        let fileType = fileName[0].split('.');
        console.log(fileType[1]);
        //console.log(snap.val().downloadUrl.split('%',1));
        if(fileType[1] == '3gp' || fileType[1] == 'mp4'){
          this.videos.push({downloadURL:snap.val().downloadUrl});
          //console.log('downloading video');
          //this.videosURL.push({downloadURL:snap.val().downloadUrl});
          //console.log('Done downloading video');
          //console.log(this.videosURL[0]);
          console.log(this.videos[0]);
          console.log(this.videos[0].downloadURL);
        }
        
        //this.cuisine.name = snap.val().name;
        //this.cuisine._key = snap.key;
        //this.items.push(this.cuisine);
        return false;
      });
    });

  }

  uploads(type) {
    this.platform.ready().then(() => {
      let promise
      switch (type) {
        case 'camera':
          promise = this.mediaCapture.captureImage()
          break
        case 'video':
          promise = this.mediaCapture.captureVideo()
          break
        case 'audio':
          promise = this.mediaCapture.captureAudio()
          break
      }
      promise.then((mediaFile: MediaFile[]) => {
        console.log(mediaFile)
       // this.presentLoading();
        this.imageURI = mediaFile[0].fullPath
        var name = this.imageURI.substring(this.imageURI.lastIndexOf('/')+1, this.imageURI.length);
        console.log(name);
       // this.presentLoading();
        switch (type) {
          case 'camera':
            this.stringPic = this.imageURI;
            this.uploadFile.name ="Camera Image"
            this.uploadFile.downloadUrl =  this.stringPic;
            //this.upload.push({name:"Camera Image",downloadUrl: this.stringPic});
            break;
          case 'video':
          this.stringVideo = this.imageURI;
          this.uploadFile.name ="Video"
          this.uploadFile.downloadUrl =   this.stringVideo ;
         // this.upload.push({name:"Video",downloadUrl: this.stringVideo});
            break;
          case 'audio':
          this.stringAudio = this.imageURI;
          this.uploadFile.name ="Audio"
          this.uploadFile.downloadUrl =  this.stringAudio;
         // this.upload.push({name:"Audio",downloadUrl: this.stringAudio});
            break;
        }
        var directory: string = this.imageURI.substring(0, this.imageURI.lastIndexOf('/')+1);
        directory = directory.split('%20').join(' ')
        name = name.split('%20').join(' ')
        console.log(directory)
        console.log('About to read buffer')
        let seperatedName = name.split('.')
        let extension = ''
        if (seperatedName.length > 1) {
          extension = '.' + seperatedName[1]
        }
        return this.f.readAsArrayBuffer(directory, name).then((buffer: ArrayBuffer) => {
          console.log(buffer)
          console.log('Uploading file')
          var blob = new Blob([buffer], { type: mediaFile[0].type });
          console.log(blob.size);
          console.log(blob)
          const storageRef = firebase.storage().ref('files/' + new Date().getTime() + extension);
          return storageRef.put(blob).then((snapshot:any) => {
            console.log('Upload completed')
            //this.loader.dismiss;
            console.log(snapshot.Q)
             let  files = [];
            storageRef.getDownloadURL().then((url) => {
              this.fire.downloadUrl = url;
              this.firebaseUploads.push({downloadUrl: url});
              return this.fire.downloadUrl;
            });
            console.log(this.firebaseUploads);
            // switch (type) {
            //   case 'camera':
            //   this.files.picture = storageRef.getDownloadURL().toString();
            //   // this.uploadFile.name = "Camera Taken Picture";
            //   // this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
            //   console.log( "url",storageRef.getDownloadURL().toString());
            //   this.uploads.push(this.uploadFile);
            //     break
            //   case 'video':
            //   // this.files.video = storageRef.getDownloadURL().toString();
            //   // this.uploadFile.name = "Camera Taken Video";
            //   this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
            //   this.uploads.push(this.uploadFile);
            //   console.log( "url",storageRef.getDownloadURL().toString());
            //     break
            //   case 'audio':
            //   // this.files.audio = storageRef.getDownloadURL().toString();
            //   // this.uploadFile.name = "Audio Taken ";
            //  // this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
            //   this.uploads.push(this.uploadFile);
            //   console.log( "url",storageRef.getDownloadURL().toString());
            //     break
            // }
             // this.presentMedia(type);
          })
          // return this.userService.saveProfilePicture(blob)
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    })
    //displaying new videos
    this.getDataFromDB();
  }
}
