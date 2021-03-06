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
//タブ1(みんなのtodo, doing, doneが見える)
//タブ1 初期状態のタスク管理ボード用JSONデータ
var defaultBoard1 = [
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
          //{ "title": " }
        ]
    }
  ];;

  //タブ2初期状態のタスク管理ボード用JSONデータ(人ごとリスト)
  var defaultBoard2 = [
      {
        "id": "sample-board-1",
        "title": "uji_matcha",
        "class": "task",
        "item": [
        //{ "title": "" }
        ]
      },

      {
          "id": "sample-board-2",
          "title": "kako_1115",
          "class": "progress",
          "item":[
            //{ "title": "" }
          ]
      },

      {
          "id": "sample-board-3",
          "title": "yukinoster",
          "class": "done",
          "item": [
            //{ "title": "" }
          ]
      }
    ];;

  //タブ1関連変数
  let k1 = 0;//new jKanbanを一回しか起きないようにする変数
  var kanban1 = "";//new jKanbanしたものを入れておく変数
  let cardID1 = "";//カードの状態(sample-board-3など)を保存しておく変数
  let n = 0;//動かした回数

  //タブ2関連変数
  let k2 = 0;//new jKanbanを一回しか起きないようにする変数
  var kanban2 = "";//new jKanbanしたものを入れておく変数
  let cardID2 = "";//カードの状態(sample-board-3など)を保存しておく変数

  //推し関連変数
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

      uid = user.uid;
      displayName = user.displayName;
      email = user.email;
      photoURL = user.photoURL;
      emailVerified = user.emailVerified;

      //ヘッダーユーザー情報
      let authImg = document.getElementById("authImage_place");
      authImg.src = photoURL;
      document.querySelector("#authUserName").innerHTML = displayName;

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

      　}
      });

      //タスク(タブ1)
      database.ref('card/').orderByChild("space").startAt("channel1").endAt("channel1").on('value', (snapshot)=> {//orderByChild('userID').startAt(uid).endAt(uid)
        let data = snapshot.val();
        let resultCurrentBoard = "";
        let resultTaskName = "";
        for(let i in data){
          let task = data[i];
          resultCurrentBoard = task.currentBoard;
          resultTaskName = task.name;
          var addTask={ "title": resultTaskName };
          if(resultCurrentBoard == "sample-board-1"){//todo
            defaultBoard1[0].item.push(addTask);
          }else if(resultCurrentBoard == "sample-board-2"){//doing
            defaultBoard1[1].item.push(addTask);
          }else if(resultCurrentBoard == "sample-board-3"){
            defaultBoard1[2].item.push(addTask);
          }
        }console.log(defaultBoard1);
        if(k1 == 0){//1回目のみ実行
          //jKanbanのインスタンス作成
          kanban1 = new jKanban({
            element         : '#myKanban1',  //タスク管理ボードを表示するHTML要素
            gutter          : '15px',       //ボード同士の間隔 15px
            widthBoard      : '250px',      //ボードのサイズ   250px
            responsivePercentage: true,
            boards          : defaultBoard1,//初期状態のJSONデータ
            dragBoards       : false,
            itemAddOptions: {//タスク追加用のボタンを表示
              enabled: true,                                              // add a button to board for easy item creation
              content: '+',                                                // text or html content of the board button
              class: 'kanban-title-button btn btn-default btn-xs',         // default class of the button
              footer: false                                                // position the button on footer
          　},
            click:function(elem){//タスクをクリックして削除
              kanban1.removeElement(elem);
              console.log(elem);

              database.ref('card/').orderByChild("space").equalTo("channel1").on('value', (snapshot)=> {
                let data = snapshot.val();
                let resultTaskName = "";
                var word = elem.innerText;
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
            buttonClick: (elem, id) => addFormElement1(id), //タスク追加用の関数を指定
            //dropEl: (el, target, source, sibling) => setID(el, target, source, sibling),  // callback when any board's item are dragged
            dropEl: function(el, target, source, sibling){//カードが着地した状態を取得する&currentBoardの更新
              console.log(target.parentElement.getAttribute('data-id'));
              cardID1 = target.parentElement.getAttribute('data-id');
              database.ref('card/').orderByChild("space").equalTo("channel1").on('value', (snapshot)=> {
                let data = snapshot.val();
                let resultTaskName = "";
                var word = el.innerText;
                for(let i in data){
                  let task = data[i];
                  resultTaskName = task.name;
                  if(word == resultTaskName){
                    console.log("word: " + word + ", resultTaskName: " + resultTaskName);
                    if(task.currentBoard != cardID1){//カードの発着が同じかどうか　違う時のみ、showPictureを呼び出す
                      showPicture(el);
                      console.log("推しの写真やメッセージを表示します");
                    }else{
                      console.log("同じ場所なので、推しの写真やメッセージを表示しません");
                    }
                    database.ref("card").child(i).update({currentBoard: cardID1});
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

          k1++;
      });

      //タスク(タブ2)
      database.ref('card/').orderByChild("space").startAt("channel1").endAt("channel1").on('value', (snapshot)=> {//orderByChild('userID').startAt(uid).endAt(uid)
        let data = snapshot.val();
        let resultCurrentBoard = "";
        let resultTaskName = "";
        for(let i in data){
          let task = data[i];
          resultUserID = task.userID;
          resultTaskName = task.name;
          var addTask={ "title": resultTaskName };
          if(resultUserID == "aaa"){//
            defaultBoard2[0].item.push(addTask);
          }else if(resultUserID == "bbb"){//
            defaultBoard2[1].item.push(addTask);
          }else if(resultUserID == "ccc"){//
            defaultBoard2[2].item.push(addTask);
          }
        }
        if(k2 == 0){//1回目のみ実行
          //jKanbanのインスタンス作成
          kanban2 = new jKanban({
            element         : '#myKanban2',  //タスク管理ボードを表示するHTML要素
            gutter          : '15px',       //ボード同士の間隔 15px
            widthBoard      : '250px',      //ボードのサイズ   250px
            responsivePercentage: true,
            boards          : defaultBoard2,//初期状態のJSONデータ
            dragBoards       : false,
            itemAddOptions: {//タスク追加用のボタンを表示
              enabled: true,                                              // add a button to board for easy item creation
              content: '+',                                                // text or html content of the board button
              class: 'kanban-title-button btn btn-default btn-xs',         // default class of the button
              footer: false                                                // position the button on footer
          　},
            click:function(elem){//タスクをクリックして削除
              kanban2.removeElement(elem);
              console.log(elem);

              database.ref('card/').orderByChild("space").equalTo("channel1").on('value', (snapshot)=> {
                let data = snapshot.val();
                let resultTaskName = "";
                var word = elem.innerText;
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
            buttonClick: (elem, id) => addFormElement2(id), //タスク追加用の関数を指定
            //dropEl: (el, target, source, sibling) => setID(el, target, source, sibling),  // callback when any board's item are dragged
            dropEl: function(el, target, source, sibling){//カードが着地した状態を取得する&currentBoardの更新
              console.log(target.parentElement.getAttribute('data-id'));
              cardID2 = target.parentElement.getAttribute('data-id');

              database.ref('card/').orderByChild("space").equalTo("channel1").on('value', (snapshot)=> {//人にタスクを割り振る
                let data = snapshot.val();
                let resultTaskName = "";
                var word = el.innerText;
                for(let i in data){
                  let task = data[i];
                  resultTaskName = task.name;
                  if(word == resultTaskName){
                    console.log("word: " + word + ", resultTaskName: " + resultTaskName);
                    if(cardID2 == "sample-board-1"){
                      database.ref("card").child(i).update({userID: "aaa"});
                    }else if(cardID2 == "sample-board-2"){
                      database.ref("card").child(i).update({userID: "bbb"});
                    }else if(cardID2 == "sample-board-3"){
                      database.ref("card").child(i).update({userID: "ccc"});
                    }
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

          k2++;
      });
      // ...
    } else {
      // User is signed out
      console.log("null");
    }
  });

  //タスク追加用の関数(タブ1)
  function addFormElement1(id) {
      const formItem = document.createElement('form');

      formItem.innerHTML = '<input type="text">';  //タスクを追加するための入力ボックスを作成
      kanban1.addForm(id, formItem);  //入力ボックスをボードに追加

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
            'space': "channel1"
        };

        var task = database.ref("card").push();
        task.set(val);
        kanban1.addElement(id, {"title": title}); //入力された文字列をタスクとして登録
        formItem.parentNode.removeChild(formItem); //入力ボックスを非表示にするために削除
        title.value = '';
      })
    }

    //タスク追加用の関数
    function addFormElement2(id) {
        const formItem = document.createElement('form');

        formItem.innerHTML = '<input type="text">';  //タスクを追加するための入力ボックスを作成
        kanban2.addForm(id, formItem);  //入力ボックスをボードに追加

        //タスクを登録する時のイベント処理(タブ2)
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
              'currentBoard': "sample-board-1",
              'space': "channel1"
          };

          var task = database.ref("card").push();
          task.set(val);
          kanban2.addElement(id, {"title": title}); //入力された文字列をタスクとして登録
          formItem.parentNode.removeChild(formItem); //入力ボックスを非表示にするために削除
          title.value = '';
        })
      }

    //写真を表示する機能
    //let tempID1 = "";
    function showPicture(el){
      //console.log(el);
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

      if(cardID1 == "sample-board-2"){
        //頑張れ系の表示
        getPicURL(2);
        var displayB = document.querySelector(".balloon5");
        var displayF = document.querySelector(".faceicon");
        var displayS = document.querySelector(".says");
        displayB.classList.replace("balloon5", "balloon5_see");
        displayF.classList.replace("faceicon", "faceicon_see");
        displayS.classList.replace("says", "says_see");
      }else if(cardID1 == "sample-board-3"){
        //お疲れ様系の表示
        getPicURL(3);
        var displayB = document.querySelector(".balloon5");
        var displayF = document.querySelector(".faceicon");
        var displayS = document.querySelector(".says");
        displayB.classList.replace("balloon5", "balloon5_see");
        displayF.classList.replace("faceicon", "faceicon_see");
        displayS.classList.replace("says", "says_see");
      }else if(cardID1 == "sample-board-1"){
        //console.log("何も表示されません。原因として、タスク→タスク、進行中→タスク、完了→タスクの可能性があります");
      }
    }

    function getNum(situation){
      var random1 = Math.floor( Math.random() * 7 ) + 1;//乱数
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
          document.querySelector("#message").innerHTML = resultuserName + " "+resultOshiGanbareMessage;
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