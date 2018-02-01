var current_app_data = null;

var isAppStarted = function() {
  return current_app_data != null;
};

var stopCurrentApp = function() {
  if (current_app_data) {
    try {
      sraftv.setParam("app_stop", current_app_data, function(res) {
        console.log("app_stop return="+JSON.stringify(res));
      });
    } catch (e) {
      console.log("sraftv exception"+e);
    }
    current_app_data = null;
  }
};

var startApp = function() {
  var appid = "Sraf Youtube";
  var webapp = false;
  var url = '';
  try {
    var app_data = {appid: appid, webapp: webapp, url: url, autohide: true};
    var callback = function(res){
      console.log("app run return="+JSON.stringify(res));
      if (res.status == "ok") {
        if (res.handle)
          app_data.handle = res.handle;

        current_app_data = app_data;
        //document.body.removeChild(chtvObject.content);
      }
    };
    sraftv.setParam("app_run", app_data, callback);
  } catch (e) {
    console.log("srafws exception"+e);
  }
};

var chtvObject = {
  content: document.querySelector("#container"),
  items: Array.prototype.slice.call(document.querySelectorAll('.containers')),
  selected: 0,
  ypos:0,
  initialize: function() {
    this.getData();
/*    this.secondLineObj.setCardData();
    this.secondLineObj.setCardImage();*/
    this.getFocus();
  },

  getFocus: function() {
    this.firstLineObj.initialize();
  },

  data: [],
  getData: function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4 && xhr.status === 200){
        doResponse(xhr);
      }else{
        console.log('xhr.readyState:' + xhr.readyState);
        console.log('xhr.status:' + xhr.status);
      }
    };
    xhr.open("get","https://vod-feeds.netrange.com/feed/netrange-goodwood-fos",true);
    xhr.setRequestHeader("Content-Type","multipart/form-data/");
    xhr.send();
    function doResponse(xhr){
      for(var i = 0 ; i < 3 ; i++) {
        chtvObject.data[i] = JSON.parse(xhr.responseText).itemlist[i];
      }
      chtvObject.secondLineObj.setCardData();
      chtvObject.secondLineObj.setCardImage()
    }
  },

  rightAnimation: function() {
    if(chtvObject.selected == 1) {
      if(this.selected > 2 && this.xpos > -108) {
        this.xpos -= 27;
      }
      this.content.style.transform = 'translate(' + this.xpos + 'vw' + ',0)';
      this.content.style.transition = 'transform 0.2s';
      this.refreshIcon();
    }else {
      if(this.selected > 2 && this.xpos > -81) {
        this.xpos -= 27;
      }
      this.content.style.transform = 'translate(' + this.xpos + 'vw' + ',0)';
      this.content.style.transition = 'transform 0.2s';
      this.refreshIcon();
    }

  },
  leftAnimation: function() {
    if(this.selected >= 2) {
      this.xpos += 27;
    }
    this.content.style.transform = 'translate(' + this.xpos + 'vw' + ',0)';
    this.content.style.transition = 'transform 0.2s';
    this.refreshIcon();
  },

  onKeyDown: function(event) {
    switch (this.selected) {
      case 0:
        this.firstLineObj.onKeyDown(event);
      break;
      case 1:
        this.secondLineObj.onKeyDown(event);
      break;
      case 2:
        this.thirdLineObj.onKeyDown(event);
      break;
      case 3:
        this.forthLineObj.onKeyDown(event);
      break;
      case 4:
        this.fifthLineObj.onKeyDown(event);
      break;
      case 5:
        this.sixthLineObj.onKeyDown(event);
      break;
    }

    if(event.keyCode == 40 && this.selected < 5) {
      this.selected++;
      this.ypos -= 35;
      this.content.style.transform = 'translate(0vw,'+ this.ypos + 'vh' +')';
      this.content.style.transition = 'transform 0.2s';
    }else if(event.keyCode == 38 && this.selected > 0) {
      this.selected --;
      this.ypos += 35;
      this.content.style.transform = 'translate(0vw,'+ this.ypos + 'vh' +')';
      this.content.style.transition = 'transform 0.2s';
    }
  },

  firstLineObj: {
    content: document.querySelector("#lineContainer"),
    items: Array.prototype.slice.call(document.querySelectorAll('.firstLineItems')),
    selected: 0,
    oldSelected: 0,
    xpos: 0,
    initialize: function() {
      this.getFocus();
    },
    getFocus: function() {
      this.items[this.selected].focus();
      this.items[this.selected].classList.add("active");
    },
    loseFocus: function() {
      this.items[this.oldSelected].classList.remove("active");
    },
    refreshIcon: function(){
      this.items[this.selected].focus();
      this.items[this.oldSelected].classList.remove("active");
      this.items[this.selected].classList.add("active");
    },

    onKeyDown: function(event) {
      switch(event.keyCode){
        case 37:
          if(this.selected > 0){
            this.selected--;
          }
          chtvObject.leftAnimation.call(this);
        break;
        case 40:
          this.loseFocus();
          chtvObject.secondLineObj.initialize();
        break;
        case 39:
          if(this.selected < this.items.length - 1) {
            this.selected ++;
          }
        chtvObject.rightAnimation.call(this);
        break;
      }
      this.oldSelected = this.selected;
    },
  },

  secondLineObj: {
    content: document.querySelector("#lineContainer1"),
    items: Array.prototype.slice.call(document.querySelectorAll('.secondLineItems')),
    selected: 0,
    oldSelected: 0,
    xpos: 0,
    data:[],
    isplay: false,
    initialize: function() {
      this.getFocus();
    },
    getFocus: function() {
      this.items[this.selected].focus();
      this.items[this.selected].classList.add("active");
    },
    loseFocus: function() {
      this.items[this.oldSelected].classList.remove("active");
    },

    refreshIcon: function(){
      this.items[this.selected].focus();
      this.items[this.oldSelected].classList.remove("active");
      this.items[this.selected].classList.add("active");
    },

    createVideo: function() {
      var video = document.querySelector("#videoTag");
      var that = this;
      if(this.selected <= 3) {
        video.src = this.data[this.selected];
      } else{
        video.src = this.data[this.selected].url;
      }
      var playVideoTimer = window.setTimeout(function() {
        video.addEventListener('canplay', function() {
          video.style.display = 'block';
          video.play();
          that.isplay = true;
        });
      },2000)
    },

    back: function() {
      var video = document.querySelector("#videoTag");
      if(this.isplay) {
        video.pause();
      }
      this.isplay = false;
      video.style.display = "none";
    },

    setCardImage: function() {
      for(var i = 1 ; i < 4 ; i++) {
        this.items[i].style.backgroundImage = "url("+ db.itemlist[i].thumbnail+")";
        this.items[i].style.backgroundRepeat = "no-repeat";
        this.items[i].style.backgroundSize = "100% 100%";
      }
      if(chtvObject.data.length != 0) {
        for(var index = 4 ; index < this.data.length ; index++) {
          for(var i = 0 ; i < this.data[index].videoinfo.thumbnails.length ; i++) {
            if(this.items[index] != undefined) {
              this.items[index].style.backgroundImage = "url("+ "http:"+this.data[index].videoinfo.thumbnails[i].url+")";
              this.items[index].style.backgroundRepeat = "no-repeat";
              this.items[index].style.backgroundSize = "100% 100%";
            }
          }
        }
      }
    },

    setCardData: function() {
      for(var i = 1 ; i < 4 ; i++) {
        this.data[i] = db.itemlist[i].url;
      }
      for(var index = 0 ; index < 3 ; index++) {
        if(chtvObject.data.length != 0) {
          this.data.push(chtvObject.data[index]);
        }
      }
    },
    onKeyDown: function(event) {
      switch(event.keyCode){
        case 37:
          if(this.selected > 0){
            this.selected--;
          }
          chtvObject.leftAnimation.call(this);
        break;
        case 40:
          this.loseFocus();
          chtvObject.thirdLineObj.initialize();
        break;
        case 39:
          if(this.selected < this.items.length - 1) {
            this.selected ++;
          }
        chtvObject.rightAnimation.call(this);
        break;
        case 38:
          this.loseFocus();
          chtvObject.firstLineObj.initialize();
        break;
        case 13:
          if (this.selected == 0) {
            startApp();
          }else {
            if(this.isplay) {
              this.back();
            }else {
              this.createVideo();
            }
          }
        break;
        case 66:
          if(this.selected == 0) {
            if (isAppStarted()) {
              stopCurrentApp();
            }
          }else {
            this.back();
          }
        break;
      }
      this.oldSelected = this.selected;
    },
  },
  thirdLineObj: {
    content: document.querySelector("#lineContainer2"),
    items: Array.prototype.slice.call(document.querySelectorAll('.thirdLineItems')),
    selected: 0,
    oldSelected: 0,
    xpos: 0,
    initialize: function() {
      this.getFocus();
    },
    getFocus: function() {
      this.items[this.selected].focus();
      this.items[this.selected].classList.add("active");
    },
    loseFocus: function() {
      this.items[this.oldSelected].classList.remove("active");
    },

    refreshIcon: function(){
      this.items[this.selected].focus();
      this.items[this.oldSelected].classList.remove("active");
      this.items[this.selected].classList.add("active");
    },

    onKeyDown: function(event) {
      switch(event.keyCode){
        case 37:
          if(this.selected > 0){
            this.selected--;
          }
          chtvObject.leftAnimation.call(this);
        break;
        case 40:
          this.loseFocus();
          chtvObject.forthLineObj.initialize();
        break;
        case 39:
          if(this.selected < this.items.length - 1) {
            this.selected ++;
          }
        chtvObject.rightAnimation.call(this);
        break;
        case 38:
          this.loseFocus();
          chtvObject.secondLineObj.initialize();
        break;
      }
      this.oldSelected = this.selected;
    },
  },
  forthLineObj: {
    content: document.querySelector("#lineContainer3"),
    items: Array.prototype.slice.call(document.querySelectorAll('.imageItems')),
    selected: 0,
    oldSelected: 0,
    xpos: 0,
    initialize: function() {
      this.getFocus();
    },
    getFocus: function() {
      this.items[this.selected].focus();
      this.items[this.selected].classList.add("active");
    },
    loseFocus: function() {
      this.items[this.oldSelected].classList.remove("active");
    },

    refreshIcon: function(){
      this.items[this.selected].focus();
      this.items[this.oldSelected].classList.remove("active");
      this.items[this.selected].classList.add("active");
    },

    onKeyDown: function(event) {
      switch(event.keyCode){
        case 37:
          if(this.selected > 0){
            this.selected--;
          }
          chtvObject.leftAnimation.call(this);
        break;
        case 40:
          this.loseFocus();
          chtvObject.fifthLineObj.initialize();
        break;
        case 39:
          if(this.selected < this.items.length - 1) {
            this.selected ++;
          }
          chtvObject.rightAnimation.call(this);
        break;
        case 38:
          this.loseFocus();
          chtvObject.thirdLineObj.initialize();
        break;
      }
      this.oldSelected = this.selected;
    },
  },
  fifthLineObj: {
    content: document.querySelector("#lineContainer4"),
    items: Array.prototype.slice.call(document.querySelectorAll('.fifthLineItems')),
    selected: 0,
    oldSelected: 0,
    xpos: 0,
    initialize: function() {
      this.getFocus();
    },
    getFocus: function() {
      this.items[this.selected].focus();
      this.items[this.selected].classList.add("active");
    },
    loseFocus: function() {
      this.items[this.oldSelected].classList.remove("active");
    },

    refreshIcon: function(){
      this.items[this.selected].focus();
      this.items[this.oldSelected].classList.remove("active");
      this.items[this.selected].classList.add("active");
    },

    onKeyDown: function(event) {
      switch(event.keyCode){
        case 37:
          if(this.selected > 0){
            this.selected--;
          }
          chtvObject.leftAnimation.call(this);
        break;
        case 40:
          this.loseFocus();
          chtvObject.sixthLineObj.initialize();
        break;
        case 39:
          if(this.selected < this.items.length - 1) {
            this.selected ++;
          }
          chtvObject.rightAnimation.call(this);
        break;
        case 38:
          this.loseFocus();
          chtvObject.forthLineObj.initialize();
        break;
      }
      this.oldSelected = this.selected;
    },
  },

  sixthLineObj: {
    content: document.querySelector("#lineContainer5"),
    items: Array.prototype.slice.call(document.querySelectorAll('.sixthLineItems')),
    selected: 0,
    oldSelected: 0,
    xpos: 0,
    initialize: function() {
      this.getFocus();
    },
    getFocus: function() {
      this.items[this.selected].focus();
      this.items[this.selected].classList.add("active");
    },
    loseFocus: function() {
      this.items[this.oldSelected].classList.remove("active");
    },

    refreshIcon: function(){
      this.items[this.selected].focus();
      this.items[this.oldSelected].classList.remove("active");
      this.items[this.selected].classList.add("active");
    },

    onKeyDown: function(event) {
      switch(event.keyCode){
        case 37:
          if(this.selected > 0){
            this.selected--;
          }
          chtvObject.leftAnimation.call(this);
        break;
        case 39:
          if(this.selected < this.items.length - 1) {
            this.selected ++;
          }
          chtvObject.rightAnimation.call(this);
        break;
        case 38:
          this.loseFocus();
          chtvObject.fifthLineObj.initialize();
        break;
      }
      this.oldSelected = this.selected;
    },
  },
};


document.addEventListener("DOMContentLoaded" , function() {
  chtvObject.initialize();
});

document.addEventListener("keydown" , function(event) {
  chtvObject.onKeyDown(event);
});
