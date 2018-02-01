var customerList = function (id , rowNum , columeNum , marginRight , marginBottom , template) {
  this.columeNum = columeNum;
  this.id = id;
  this.rowNum = rowNum;
  this.object = null;
  this.items = {};
  this.items.item = null;
  this.items.marginRight = marginRight;
  this.items.marginBottom = marginBottom;
  this.items.width = '';
  this.items.height = '';
  this.items.template = template;
};

customerList.prototype.createElement = function() {
  if(!this.object) {
    this.object = document.createElement("div");
    this.object.id = this.id;

    for(var i = 0 ; i < (this.columeNum * this.rowNum) ; i++) {
      this.items.item = document.createElement("div");
      this.items.item.id = 'customerList' + i;
      this.items.item.classList.add('srafList');
      this.object.appendChild(this.items.item);
      this.items.item.innerHTML = this.items.template;
    }
  }

};

customerList.prototype.initStyle = function () {
  this.items.width = (window.innerWidth / this.columeNum - this.items.marginRight) + 'px';
  this.items.height = (window.innerHeight / this.rowNum - this.items.marginBottom) + 'px';
  var srafLists = document.querySelectorAll('.srafList')
  for(var i = 0; i < srafLists.length ; i++) {
    srafLists[i].style.width = this.items.width;
    srafLists[i].style.height = this.items.height;
    srafLists[i].style.position = 'absolute';
    srafLists[i].style.border = '1px solid black';
    srafLists[i].style.left = (window.innerWidth / this.columeNum) * (i % this.columeNum) + 'px';
    srafLists[i].style.top = (window.innerHeight / this.rowNum) * (parseInt(i / this.columeNum)) + 'px';
  }
};

customerList.prototype.showElement = function() {
  if (!this.object) {
    this.createElement();
  }
  document.body.appendChild(this.object);
  this.initStyle();
}