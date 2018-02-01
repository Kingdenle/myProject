var customerScrollList = function (id , num , isColume) {
  this.isColume = isColume;
  this.id = id;
  this.num = num;
};

customerScrollList.prototype.refreshPhysicalItems = function () {
  if (!(this.data && (this.data.list instanceof Array)
    && this.data.list.length > 0))
    return;

  var newId = newSelectedId ? newSelectedId : 0;
  var oldId = oldSelectedId ? oldSelectedId : 0;
  var xpos;
  var time = animation ? 0.3 : 0;
  var newDisplayIndex;
  var oldDisplayIndex;
  var phyCount = this.physicalItems.length;
  var datalist = this.data.list;
  var dataDetailIntroduction = this.data.detailIntroduction;
  var virCount = datalist.length;
  var dataIndex;
  var movieIntrduction =  publicApi.$("#movieIntrduction");
  var domItems = this.physicalItems.map(function(item) {
    return publicApi.$('#' + item);
  });
  for (var index = 0; index < phyCount; index++) {
    if (newId >= 0 && newId < this.noScrollCountAtStart) {
      if(newId == 0) {
        newDisplayIndex = index;
        xpos = this.noScrollPositionsAtStart[newDisplayIndex];
        dataIndex = index;
      }else if (newId == 1) {
        newDisplayIndex = index;
        xpos = this.noScrollPositionsAtStart1[newDisplayIndex];
        dataIndex = index;
      }else if (newId == 2) {
        newDisplayIndex = index;
        xpos = this.noScrollPositionsAtStart2[newDisplayIndex];
        dataIndex = index;
      }else if (newId == 3) {
        newDisplayIndex = index;
        xpos = this.noScrollPositionsAtStart3[newDisplayIndex];
        dataIndex = index;
      }
      movieIntrduction.style.transform =
      'translate(' + this.intrductionNoScrollPositionsAtStart[this.selected] + 'vw' + ',0)';
    }else if (newId >= virCount - this.noScrollCountAtEnd && newId < virCount) {
      if(newId == virCount - this.noScrollCountAtEnd) {
        newDisplayIndex = (phyCount + index - virCount % phyCount) % phyCount;
        xpos = this.noScrollPositionsAtEnd[newDisplayIndex];
        dataIndex = virCount + newDisplayIndex - phyCount;
      }else if(newId == virCount - 2) {
        newDisplayIndex = (phyCount + index - virCount % phyCount) % phyCount;
        xpos = this.noScrollPositionsAtEnd1[newDisplayIndex];
        dataIndex = virCount + newDisplayIndex - phyCount;
      }else if(newId == virCount - 1) {
        newDisplayIndex = (phyCount + index - virCount % phyCount) % phyCount;
        xpos = this.noScrollPositionsAtEnd2[newDisplayIndex];
        dataIndex = virCount + newDisplayIndex - phyCount;
      }
      movieIntrduction.style.transform =
      'translate(' + this.intrductionNoScrollPositionsAtEnd[newId - virCount + this.noScrollCountAtEnd] + 'vw' + ',0)';
    } else {
      newDisplayIndex = (phyCount + index - (newId - this.noScrollCountAtStart) % phyCount) % phyCount;
      xpos = this.scrollPositions[newDisplayIndex];

      dataIndex = newId + newDisplayIndex - this.noScrollCountAtStart;

      oldDisplayIndex = (phyCount + index - (oldId - this.noScrollCountAtStart) % phyCount) % phyCount;
      if((newDisplayIndex == phyCount - 1 && oldDisplayIndex == 0)
        || (newDisplayIndex == 0 && oldDisplayIndex == phyCount - 1)) {
        time = 0;
      } else if (animation) {
        time = 0.3;
      }
      movieIntrduction.style.transform =
      'translate(' + this.intrductionScrollPosition + 'vw' + ',0)';
    }

    if (dataIndex < virCount && dataIndex >= 0){
      this.setCardData(domItems[index], datalist[dataIndex]);
    }
    else {
      xpos = 101.4;
      time = 0;
    }
    domItems[index].style.transform = 'translate(' + xpos + 'vw' + ',0)';
    domItems[index].style.transition = 'transform ' + time + 's';
  }

  movieIntrduction.innerHTML = dataDetailIntroduction[this.selected];
};