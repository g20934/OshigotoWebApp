//formにある情報を取り出す
      //ユーザーデータ
      var uid = "";
      var displayName = "";
      var email = "";
      var photoURL = "";
      var emailVerified = "";


      //database関係
      // Set the configuration for your app
      //Replace with your project's config object
      var config = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
      };

      // Get a reference to the database service
      var database = firebase.database();

      //イベントの日、イベント名をデータベースに追加
      function doActionEvent(){
        let tlName = document.querySelector('#eventName');
        let tlDate = document.querySelector('#eventDate')
        let userID = uid;
        let val = {
            'eventName':tlName.value,
            "eventDate":tlDate.value,
            'userID': userID
        };
        var people = database.ref("event").push();
        people.set(val);
      }
      //推しの名前をデータベースに追加
      function doActionOshinoName(){
          let tl = document.querySelector('#oshinoName');
          let userID = uid;
          let val = {
              'oshiName':tl.value,
              'userID': userID
          };
          var people = database.ref("info").push();
          people.set(val);
      }


      //推し始めた日をデータベースに追加
      function doActionOshiDate(){
          let tl = document.querySelector('#oshiDate');
          let userID = uid;
          let val = {
              'date':tl.value,
              'userID': userID
          };
          var people = database.ref("info").push();
          people.set(val);
      }

      //推しから呼ばれたい名前をデータベースに追加
      function doActionOshiName(){
          let tl = document.querySelector('#oshiName');
          let userID = uid;
          let val = {
              'userName':tl.value,
              'userID': userID
          };
          var people = database.ref("info").push();
          people.set(val);
      }

      //推しからのメッセージ(頑張れ系)をデータベースに追加
      function doActionOshiMessageGanbare(){
          let tl = document.querySelector('#oshiMessageGanbare');
          let userID = uid;
          let val = {
              'message':tl.value,
              'userID': userID
          };
          var people = database.ref("oshiMessageaGanbare").push();
          people.set(val);
      }

      //推しからのメッセージ(お疲れさま系)をデータベースに追加
      function doActionOshiMessageOtsukare(){
          let tl = document.querySelector('#oshiMessageOtsukare');
          let userID = uid;
          let val = {
              'message':tl.value,
              'userID': userID
          };
          var people = database.ref("oshiMessageaOtsukare").push();
          people.set(val);
      }

      //チャンネル名関係読み込み
      //データベース読み込み
      function readDatabase(id, title, writePlace){//id: databaseの場所 title: databaseの大きなくくり writePlace: htmlの中で書く場所(idタグ)
        title.on('value', (snapshot)=> {
            let data = snapshot.val();
            let result = '';
                let channel = data[id];
                result +=  channel.name;
            document.querySelector(writePlace).innerHTML = result;
        });
      }

      //チャンネルのデータベース読み込み
      var channels = database.ref('channel/');
      function readChannelDatabase(id, writePlace){
        readDatabase(id, channels, writePlace)
      }

      //readChannelDatabaseを呼び出す
      let j = 0;
      for(let i = 0; i < 3; i++){
        readChannelDatabase(i, "#list" + j);
        j++;
      }

      let channelNumber = 0;
      //データベースに追加

      function doActionChannelName(){
          let tl = document.querySelector('#channelName');
          let val = {
              'name':tl.value,
          };
          var people = database.ref("channel").push();
          people.set(val);
          tl.value = '';
          channelNumber++;
          console.log(channelNumber);
      }


      //jKanban(ToDOリスト)系の処理
      //初期状態のタスク管理ボード用JSONデータ
      var defaultBoards = [
          {
            "id": "sample-board-1",
            "title": "やること",
            "class": "task",
            "item": [
            //{ "title": "" }
            ]
          },

          {
              "id": "sample-board-2",
              "title": "作業中",
              "class": "progress",
              "item":[
                //{ "title": "" }
              ]
          },

          {
              "id": "sample-board-3",
              "title": "終了",
              "class": "done",
              "item": [
                //{ "title": "" }
              ]
          }
        ];;



    let k = 0;//new jKanbanを一回しか起きないようにする変数
    var kanban = "";//new jKanbanしたものを入れておく変数
    let cardID = "";//カードの状態(sample-board-3など)を保存しておく変数
    let n = 0;//動かした回数

    let resultuserName = "";//推しに呼ばれたい名前を入れる
    let resultOshiGanbareMessage = "";//推しから頑張って系のメッセージを受け取る
    let resultOshiOtsukare = "";//推しからお疲れ系のメッセージを受け取る
    let resultDay = "";
    let termDay = "";//推している日数
    let resultOshiName = "";//推しの名前
    //ユーザー情報を取得&カレンダーurlとタスクをデータベースから持ってきて表示
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        document.querySelector("#messageforuser").innerHTML = "オシゴトに関する様々な設定が行えます。";

        uid = user.uid;
        displayName = user.displayName;
        email = user.email;
        photoURL = user.photoURL;
        emailVerified = user.emailVerified;

        //ユーザー情報をデータベースから持ってくる
        database.ref('/info').orderByChild('userID').startAt(uid).endAt(uid).once('value',function(snapshot) {
          let data = snapshot.val();
          for(let i in data){
          let user = data[i];
          if(user.userName != null){
            resultuserName = user.userName;
          }
          if(user.oshiName != null){
            resultOshiName = user.oshiName;
          }
          if(user.date != null){
            resultDay = user.date;
          }

          let date1 = new Date(resultDay);//推し始めた日付
          let date2 = new Date();//今日
          termDay = Math.floor((date2 - date1) / 86400000);

          document.querySelector("#oshi").innerHTML = resultOshiName + "を推し始めてから" + termDay + "日目";
        　}
        });

        //イベント情報をデータベースから持ってくる
        database.ref('/event').orderByChild('userID').startAt(uid).endAt(uid).once('value',function(snapshot) {
          let data = snapshot.val();
          let resultEventName = "";
          let resultEventTerm = "";
          let resultEvent = "";
          for(let i in data){
            let eventinfo = data[i];

            let date1 = new Date();//今日
            let date2 = new Date(eventinfo.eventDate);//イベントの日付
            resultEventTerm = Math.floor((date2 - date1) / 86400000) + 1;

            resultEvent += "<li>" + eventinfo.eventName + "まであと" + resultEventTerm + "日";
          }
          document.querySelector("#event").innerHTML = resultEvent;
        });

        //背景画像
          //ファイルの参照
          var storageRef1 = firebase.storage().ref();
          const DownloadTask1 = storageRef1.child(uid + "/background.png");

          //画像ファイルのダウンロード
          DownloadTask1.getDownloadURL().then((downloadURL) => {
            document.querySelector('.container').style.backgroundImage = "url(" + downloadURL + ")";
          });

        //ヘッダーユーザー情報
        let authImg = document.getElementById("authImage_place");
        authImg.src = photoURL;
        document.querySelector("#authUserName").innerHTML = displayName;

        //カレンダー
        var o_iframe1 = document.getElementById('id_ifrem1');
        let result = "";//カレンダーのurlを入れておく。
        database.ref('/calendarURL').orderByChild('userID').startAt(uid).endAt(uid).once('value',function(snapshot) {
          let data = snapshot.val();
          for(let i in data){
          let calendar = data[i];
          result +=  calendar.url;
          o_iframe1.src = result;

          o_iframe1.style="border:solid 1px #777";
          o_iframe1.width="100%";
          o_iframe1.height="500px";
          o_iframe1.border="0";
          o_iframe1.scrolling="yes"
          }
        });

        //タスク
        database.ref('card/').orderByChild('userID').startAt(uid).endAt(uid).on('value', (snapshot)=> {
          let data = snapshot.val();
          let resultCurrentBoard = "";
          let resultTaskName = "";
          for(let i in data){
            let task = data[i];
            resultCurrentBoard = task.currentBoard;
            resultTaskName = task.name;
            var addTask={ "title": resultTaskName };
            if(resultCurrentBoard == "sample-board-1"){//todo
              defaultBoards[0].item.push(addTask);
            }else if(resultCurrentBoard == "sample-board-2"){//doing
              defaultBoards[1].item.push(addTask);
            }else if(resultCurrentBoard == "sample-board-3"){
              defaultBoards[2].item.push(addTask);
            }
          }
          if(k == 0){//1回目のみ実行
            //jKanbanのインスタンス作成
            kanban = new jKanban({
              element         : '#myKanban',  //タスク管理ボードを表示するHTML要素
              gutter          : '30px',       //ボード同士の間隔 15px
              widthBoard      : '500px',      //ボードのサイズ   250px
              responsivePercentage: true,
              boards          : defaultBoards,//初期状態のJSONデータ
              dragBoards       : false,
              itemAddOptions: {//タスク追加用のボタンを表示
                enabled: true,                                              // add a button to board for easy item creation
                content: '+',                                                // text or html content of the board button
                class: 'kanban-title-button btn btn-default btn-xs',         // default class of the button
                footer: false                                                // position the button on footer
            　},
              click:function(elem){//タスクをクリックして削除
                kanban.removeElement(elem);
                console.log(elem);

                database.ref('card/').orderByChild('userID').equalTo(uid).on('value', (snapshot)=> {
                  let data = snapshot.val();
                  let resultTaskName = "";
                  var word = elem.innerText;
                  //console.log("word: " + word);
                  for(let i in data){
                    let task = data[i];
                    resultTaskName = task.name;
                    if(word == resultTaskName){
                      database.ref("card").child(i).remove().then((error)=>{
                         alert(word + 'を削除しました。');
                         word = "";
                         elem = "";
                         return;
                      });
                    }
                  }
                });

              },
              buttonClick: (elem, id) => addFormElement(id), //タスク追加用の関数を指定
              //dropEl: (el, target, source, sibling) => setID(el, target, source, sibling),  // callback when any board's item are dragged
              dropEl: function(el, target, source, sibling){//カードが着地した状態を取得する&currentBoardの更新
                console.log(target.parentElement.getAttribute('data-id'));
                cardID = target.parentElement.getAttribute('data-id');
                console.log(el);

                database.ref('card/').orderByChild('userID').equalTo(uid).on('value', (snapshot)=> {
                  let data = snapshot.val();
                  let resultTaskName = "";
                  var word = el.innerText;
                  for(let i in data){
                    let task = data[i];
                    resultTaskName = task.name;
                    if(word == resultTaskName){
                      console.log("word: " + word + ", resultTaskName: " + resultTaskName);
                      if(task.currentBoard != cardID){
                        showPicture(el);
                        console.log("推しの写真やメッセージを表示します");
                      }else{
                        console.log("同じ場所なので、推しの写真やメッセージを表示しません");
                      }
                      database.ref("card").child(i).update({currentBoard: cardID});
                      console.log("currentBoardを更新しました！");
                      word = "";
                      el = "";
                      return;
                    }
                  }
                });
              },
            });
          }
            k++;
        });
        // ...
      } else {
        // User is signed out
        console.log("null");
        // ...
      }


    });

    /**推しの画像保存**/
    //Get elements
    var uploader = document.getElementById("uploader");
    const up = document.getElementById("up");
    //const sendBottom = document.getElementById("sendBottom");

    //アップロード
    up.addEventListener("click", () => {
      ////アップロードボタンが押されたら、inputタグからファイルの取得
      const file = document.getElementById("fileButton").files[0];
      //ファイルの参照(画像保存場所のファイルパスを作る)
      var storageRef = firebase.storage().ref();

      //ファイルのメタデータ
      var metadata = {
        contentType: "image/*",
        customMetadata: {
          "userID": uid
        }
      };
      //画像ファイルのアップロード
      const uploadTask = storageRef.child("image/" + file.name).put(file, metadata);
      //console.log(uploadTask);

      var flg = 0;
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          uploader.value = progress;
          document.querySelector("#showPercentage").innerHTML = progress + "%";
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
          if (progress === 100 && flg === 0) {
            console.log("100%です。");
            var display = document.querySelector(".disN");
            display.classList.replace("disN", "disB");
            flg = 1;
            //progress=0;
          }
        },
        function (error) {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              console.log(
                "目的の操作を行う権限がユーザーにありません。セキュリティ ルールが正しいことをご確認ください。"
              );
              break;

            case "storage/canceled":
              // User canceled the upload
              console.log("ユーザーがオペレーションをキャンセルしました。");
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              console.log("不明なエラーが発生しました。");
              break;
            default:
              console.log("error");
              break;
          }
        }
      );
    });

    //ダウンロード
    const down = document.getElementById("down");
    down.addEventListener("click", () => {
      //ファイルの取得
      const file = document.getElementById("fileButton").files[0];
      //ファイルの参照
      var storageRef = firebase.storage().ref();
      const DownloadTask = storageRef.child("image/" + file.name);

      DownloadTask.getMetadata().then((metadata)=> {
      });

      //画像ファイルのダウンロード
      DownloadTask.getDownloadURL().then((downloadURL) => {
        document.getElementById("oshiimage_place").src = downloadURL;
      });
    });

    /**背景設定**/
    //Get elements
    var uploader1 = document.getElementById("uploader1");
    const up1 = document.getElementById("up1");

    //アップロード
    up1.addEventListener("click", () => {
      ////アップロードボタンが押されたら、inputタグからファイルの取得
      const file1 = document.getElementById("fileButton1").files[0];
      //ファイルの参照(画像保存場所のファイルパスを作る)
      var storageRef1 = firebase.storage().ref();

      //ファイルのメタデータ
      var metadata1 = {
        contentType: "image/*",
        customMetadata: {
          "userID": uid
        }
      };
      //画像ファイルのアップロード
      const uploadTask1 = storageRef1.child(uid + "/" + file1.name).put(file1, metadata1);

      var flg1 = 0;
      uploadTask1.on(
        "state_changed",
        function (snapshot) {
          var progress1 = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress1 + "% done");
          uploader1.value = progress1;
          document.querySelector("#showPercentage1").innerHTML = progress1 + "%";
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
          if (progress1 === 100 && flg1 === 0) {
            console.log("100%です。");
            var display = document.querySelector(".disN1");
            display.classList.replace("disN1", "disB1");
            flg1 = 1;
          }
        },
        function (error) {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              console.log(
                "目的の操作を行う権限がユーザーにありません。セキュリティ ルールが正しいことをご確認ください。"
              );
              break;

            case "storage/canceled":
              // User canceled the upload
              console.log("ユーザーがオペレーションをキャンセルしました。");
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              console.log("不明なエラーが発生しました。");
              break;
            default:
              console.log("error");
              break;
          }
        }
      );
    });

    //ダウンロード
    const down1 = document.getElementById("down1");
    down1.addEventListener("click", () => {
      //ファイルの取得
      const file1 = document.getElementById("fileButton1").files[0];
      //ファイルの参照
      var storageRef1 = firebase.storage().ref();
      const DownloadTask1 = storageRef1.child(uid + "/background.png");

      DownloadTask1.getMetadata().then((metadata)=> {
      });

      //画像ファイルのダウンロード
      DownloadTask1.getDownloadURL().then((downloadURL) => {
        document.getElementById("oshiimage_place1").src = downloadURL;
      });
    });

    /**カレンダーurlをデータベースに追加**/
    function doActionCalenderURL(){
        let tl = document.querySelector('#calenderUrl');
        let userID = uid;
        let val = {
            'url':tl.value,
            'userID': userID
        };
        var people = database.ref("calendarURL").push();
        people.set(val);
        tl.value = '';
    }

    /**タスク追加用の関数**/
    function addFormElement(id) {
        const formItem = document.createElement('form');

        formItem.innerHTML = '<input type="text">';  //タスクを追加するための入力ボックスを作成
        kanban.addForm(id, formItem);  //入力ボックスをボードに追加

        //タスクを登録する時のイベント処理
        formItem.addEventListener('submit', (e) => {
          e.preventDefault();
          var title = e.target[0].value;
          // 0文字の場合登録しない
          if (title.length == 0) {
              return;
          }

          let val = {
              'name':title,
              "userID" : uid,
              'currentBoard': id,
              'space': "personal"
          };

          var task = database.ref("card").push();
          task.set(val);
          kanban.addElement(id, {"title": title}); //入力された文字列をタスクとして登録
          formItem.parentNode.removeChild(formItem); //入力ボックスを非表示にするために削除
          title.value = '';
        })
      }

      //写真を表示する機能
      function showPicture(el){
        var cardinfo = el.innerText;
        console.log(cardinfo);
        let img = document.getElementById("image_place");

        //推しからのメッセージ(頑張れ系)をデータベースから持ってくる
        database.ref('/oshiMessageaGanbare').orderByChild('userID').startAt(uid).endAt(uid).once('value',function(snapshot) {
          let data = snapshot.val();
          let array1 = new Array();
          let j = 0
          for(let i in data){
            array1.push(i);
            console.log(i);
        　}
          var random = Math.floor(Math.random() * 5);
          let o_message = data[array1[random]];
          resultOshiGanbareMessage =  o_message.message;
        });

        //推しからのメッセージ(お疲れ系)をデータベースから持ってくる
        database.ref('/oshiMessageaOtsukare').orderByChild('userID').startAt(uid).endAt(uid).once('value',function(snapshot) {
          let data = snapshot.val();
          let array1 = new Array();
          let j = 0
          for(let i in data){
            array1.push(i);
            console.log(i);
        　}
          var random = Math.floor(Math.random() * 5);
          let o_message = data[array1[random]];
          resultOshiOtsukare =  o_message.message;
        });


        if(cardID == "sample-board-2"){
          //頑張れ系の表示
          getPicURL(2);
          var displayB = document.querySelector(".balloon5");
          var displayF = document.querySelector(".faceicon");
          var displayS = document.querySelector(".says");
          displayB.classList.replace("balloon5", "balloon5_see");
          displayF.classList.replace("faceicon", "faceicon_see");
          displayS.classList.replace("says", "says_see");
        }else if(cardID == "sample-board-3"){
          //お疲れ様系の表示
          getPicURL(3);
          var displayB = document.querySelector(".balloon5");
          var displayF = document.querySelector(".faceicon");
          var displayS = document.querySelector(".says");
          displayB.classList.replace("balloon5", "balloon5_see");
          displayF.classList.replace("faceicon", "faceicon_see");
          displayS.classList.replace("says", "says_see");
        }else if(cardID == "sample-board-1"){
          //console.log("何も表示されません。原因として、タスク→タスク、進行中→タスク、完了→タスクの可能性があります");
        }
      }

      function getNum(situation){
        var random1 = Math.floor( Math.random() * 7 ) + 1;//乱数 1~11
        if(situation == 2 && random1% 2 == 0){//頑張れは奇数のファイル
          random1 =getNum(2);
        }else if(situation == 3 && random1 % 2 == 1){//お疲れ様は偶数
          random1 =getNum(3);
        }
        return random1;
      }

      function getPicURL(situation){
        var random = getNum(situation);

        var storage = firebase.storage();
        var imgRef = storage.ref().child("image/" + "idol" + random + ".png");
        imgRef.getDownloadURL().then((url)=> {
          document.getElementById("image_place").src = url;
          console.log(url);
          if(situation == 2){
            document.querySelector("#message").innerHTML = resultuserName + " "+resultOshiGanbareMessage;;
            console.log("頑張れ");
          }else if(situation == 3){
            document.querySelector("#message").innerHTML = resultuserName + " "+resultOshiOtsukare;
            console.log("お疲れ");
          }
          setTimeout(removePicture, 3000);
        }).catch(function(error) {
          // Handle any errors
          console.log("error");
          if(situation == 2){
            getPicURL(2);
          }else if(situation == 3){
            getPicURL(3);
          }
        });
      }


      function removePicture(){
        let img = document.getElementById("image_place");
        let word = document.getElementById("message");
        img.animate([{opacity: '1'}, {opacity: '0'}], 1000);
        word.animate([{opacity: '1'}, {opacity: '0'}], 1000);
        setTimeout(nullPictureAndMessage, 850);
      }

      function nullPictureAndMessage(){
        let img = document.getElementById("image_place");
        img.src = null;
        document.querySelector("#message").innerHTML = "";
        var displayB = document.querySelector(".balloon5_see");
        var displayF = document.querySelector(".faceicon_see");
        var displayS = document.querySelector(".says_see");
        displayB.classList.replace("balloon5_see" , "balloon5");
        displayF.classList.replace("faceicon_see", "faceicon");
        displayS.classList.replace("says_see", "says");
      }


      //サインアウト
      function signOut() {
        // [START auth_sign_out]
        firebase.auth().signOut().then(() => {
          // Sign-out successful.
          console.log("signout success");
        }).catch((error) => {
          // An error happened.
          console.log("error2");
        });
        // [END auth_sign_out]
      }

      /**スライドショー**/
      for(let i = 1; i <= 6; i++){
        var imgRef = firebase.storage().ref().child("image/" + "idol" + i + ".png");
        imgRef.getDownloadURL().then((url)=> {
          document.getElementById("slide" + i).src = url;
          console.log(i + ": " + url);
        }).catch(function(error) {
          console.log("error");
        });
      }


      $('.slider').not('.slick-initialized').slick({
          arrows: false,//左右の矢印はなし
          autoplay: true,//自動的に動き出すか。初期値はfalse。
          autoplaySpeed: 0,//自動的に動き出す待ち時間。初期値は3000ですが今回の見せ方では0
          speed: 5000,//スライドのスピード。初期値は300。
          infinite: true,//スライドをループさせるかどうか。初期値はtrue。
          pauseOnHover: false,//オンマウスでスライドを一時停止させるかどうか。初期値はtrue。
          pauseOnFocus: false,//フォーカスした際にスライドを一時停止させるかどうか。初期値はtrue。
          cssEase: 'linear',//動き方。初期値はeaseですが、スムースな動きで見せたいのでlinear
          slidesToShow: 4,//スライドを画面に4枚見せる
          slidesToScroll: 1,//1回のスライドで動かす要素数
        });

      //ストップウォッチに関する処理

      (function(){
        'use strict';

        //htmlのidからデータを取得
        //取得したデータを変数に代入

        var timer = document.getElementById('stoptimer');
        var start = document.getElementById('stopstart');
        var stop = document.getElementById('stopstop');
        var reset = document.getElementById('stopreset');

        //クリック時の時間を保持するための変数定義
        var startTime;

        //経過時刻を更新するための変数。 初めはだから0で初期化
        var elapsedTime = 0;

        //タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
        var timerId;

        //タイマーをストップ -> 再開させたら0になってしまうのを避けるための変数。
        var timeToadd = 0;


        //ミリ秒の表示ではなく、分とか秒に直すための関数, 他のところからも呼び出すので別関数として作る
        //計算方法として135200ミリ秒経過したとしてそれを分とか秒に直すと -> 02:15:200
        function updateTimetText(){

            //m(分) = 135200 / 60000ミリ秒で割った数の商　-> 2分
            var m = Math.floor(elapsedTime / 60000);

            //s(秒) = 135200 % 60000ミリ秒で / 1000 (ミリ秒なので1000で割ってやる) -> 15秒
            var s = Math.floor(elapsedTime % 60000 / 1000);

            //ms(ミリ秒) = 135200ミリ秒を % 1000ミリ秒で割った数の余り
            var ms = elapsedTime % 1000;


            //HTML 上で表示の際の桁数を固定する　例）3 => 03　、 12 -> 012
            //javascriptでは文字列数列を連結すると文字列になる
            //文字列の末尾2桁を表示したいのでsliceで負の値(-2)引数で渡してやる。
            m = ('0' + m).slice(-2);
            s = ('0' + s).slice(-2);
            ms = ('0' + ms).slice(-3);

            //HTMLのid　timer部分に表示させる　
            timer.textContent = m + ':' + s + ':' + ms;
        }


        //再帰的に使える用の関数
        function countUp(){

            //timerId変数はsetTimeoutの返り値になるので代入する
            timerId = setTimeout(function(){

                //経過時刻は現在時刻をミリ秒で示すDate.now()からstartを押した時の時刻(startTime)を引く
                elapsedTime = Date.now() - startTime + timeToadd;
                updateTimetText()

                //countUp関数自身を呼ぶことで10ミリ秒毎に以下の計算を始める
                countUp();

            //1秒以下の時間を表示するために10ミリ秒後に始めるよう宣言
            },10);
        }

        //startボタンにクリック時のイベントを追加(タイマースタートイベント)

        start.addEventListener('click',function(){

            //在時刻を示すDate.nowを代入
            startTime = Date.now();

            //再帰的に使えるように関数を作る
            countUp();
        });


        //stopボタンにクリック時のイベントを追加(タイマーストップイベント)

        stop.addEventListener('click',function(){

            //タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
           clearTimeout(timerId);


            //タイマーに表示される時間elapsedTimeが現在時刻かたスタートボタンを押した時刻を引いたものなので、
            //タイマーを再開させたら0になってしまう。elapsedTime = Date.now - startTime
            //それを回避するためには過去のスタート時間からストップ時間までの経過時間を足してあげなければならない。elapsedTime = Date.now - startTime + timeToadd (timeToadd = ストップを押した時刻(Date.now)から直近のスタート時刻(startTime)を引く)
           timeToadd += Date.now() - startTime;
        });


        //resetボタンにクリック時のイベントを追加(タイマーリセットイベント)
        reset.addEventListener('click',function(){

            //経過時刻を更新するための変数elapsedTimeを0にしてあげつつ、updateTimetTextで0になったタイムを表示。
            elapsedTime = 0;

            //リセット時に0に初期化したいのでリセットを押した際に0を代入してあげる
            timeToadd = 0;

            //updateTimetTextで0になったタイムを表示
            updateTimetText();
          });
        })();


      //タイマー機能に関する処理
      var timer1; //タイマーを格納する変数（タイマーID）の宣言

      // Get the modal
      var modal = document.getElementById("myModal");

      // Get the <span> element that closes the modal
      var closebtn = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      closebtn.onclick = function() {
        modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

      //カウントダウン関数を1000ミリ秒毎に呼び出す関数
      function cntStart(){
        document.timer.elements[2].disabled=true;
        timer1=setInterval("countDown()",1000);
      }

      //タイマー停止関数
      function cntStop(){
        document.timer.elements[2].disabled=false;
        clearInterval(timer1);
      }

      //カウントダウン関数
      function countDown(){
        var min=document.timer.elements[0].value;
        var sec=document.timer.elements[1].value;

        if( (min=="") && (sec=="") ){
          alert("時刻を設定してください！");//alert("")でポップアップが表示される
          reSet();
        }
        else{
          if (min=="") min=0;
          min=parseInt(min);

          if (sec=="") sec=0;
          sec=parseInt(sec);

          tmWrite(min*60+sec-1);
        }
      }

      //タイマーが0秒になった時音を鳴らす機能 参考　https://ja.stackoverflow.com/questions/39868/%e3%82%ad%e3%83%83%e3%83%81%e3%83%b3%e3%82%bf%e3%82%a4%e3%83%9e%e3%83%bc%e3%81%a7%e9%9f%b3%e3%82%92%e9%b3%b4%e3%82%89%e3%81%99
      //音源
      var audio = new Audio("sound.mp3");

      //タイマーの残り時間を書き出す関数
      function tmWrite(int){
        int=parseInt(int);

        if(int == 5 * 60){//("残り5分です！")
          modal.style.display = "block";
        }


        if (int<=0){
          reSet();
          audio.play();
          alert("時間です！");
        }
        else{
          //残り分数はintを60で割って切り捨てる
          document.timer.elements[0].value=Math.floor(int/60);
          //残り秒数はintを60で割った余り
          document.timer.elements[1].value=int % 60;
        }
      }

      //タイマーのフォームを初期状態に戻す（リセット）関数
      function reSet(){
        document.timer.elements[0].value="0";
        document.timer.elements[1].value="0";
        document.timer.elements[2].disabled=false;
        clearInterval(timer1);
      }