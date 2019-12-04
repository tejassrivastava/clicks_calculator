const mm = require("moment");
const _ = require("lodash");
const fs = require("file-system")
mm.suppressDeprecationWarnings = true;
const clicks = require("./clicks.json");
const timePeriod = [
  { start: "00:00:00", end: "00:59:59" },
  { start: "01:00:00", end: "01:59:59" },
  { start: "02:00:00", end: "02:59:59" },
  { start: "03:00:00", end: "03:59:59" },
  { start: "04:00:00", end: "04:59:59" },
  { start: "05:00:00", end: "05:59:59" },
  { start: "06:00:00", end: "06:59:59" },
  { start: "07:00:00", end: "07:59:59" },
  { start: "08:00:00", end: "08:59:59" },
  { start: "09:00:00", end: "09:59:59" },
  { start: "10:00:00", end: "10:59:59" },
  { start: "11:00:00", end: "11:59:59" },
  { start: "12:00:00", end: "12:59:59" },
  { start: "13:00:00", end: "13:59:59" },
  { start: "14:00:00", end: "14:59:59" },
  { start: "15:00:00", end: "15:59:59" },
  { start: "16:00:00", end: "16:59:59" },
  { start: "17:00:00", end: "17:59:59" },
  { start: "18:00:00", end: "18:59:59" },
  { start: "19:00:00", end: "19:59:59" },
  { start: "20:00:00", end: "20:59:59" },
  { start: "21:00:00", end: "21:59:59" },
  { start: "22:00:00", end: "22:59:59" },
  { start: "23:00:00", end: "23:59:59" }
];
c();

function c() {
  let clickss = _.cloneDeep(clicks);

  const unique = [...new Set(clickss.map(item => item.ip))];

  arrOcc = [...unique];
  arrNumber = arrOcc.map(occ => clickss.filter(e => e.ip === occ).length);

  //Extract those IP whose counts are more than 10

  let arrObjToDel = [];
  for (let i = 0; i < arrNumber.length; i++) {
    if (arrNumber[i] > 10) {
      arrObjToDel.push(arrOcc[i]);
    }
  }

  // Remove all the occurence of the IP which occur more than 10 times.

  if (arrObjToDel.length > 0) {
    for (let i = 0; i < arrObjToDel.length; i++) {
      clickss = clickss.filter(function(e) {
        if (e.ip === arrObjToDel[i]) {
          return false;
        }
        return true;
      });
    }
  }

  // let t = mm("3/11/2016 02:02:58").format('HH:mm:ss');
  // let s = mm("02:00:00",'HH:mm:ss');
  // let e =  mm("02:59:59",'HH:mm:ss');
  // t = mm(t,'HH:mm:ss')

  // h = mm(t).isBetween(s,e)
  // console.log(h);
  let result = [];

  for (let i = 0; i < timePeriod.length; i++) {
    let startP = mm(timePeriod[i].start, "HH:mm:ss");
    // console.log(startP);
    let endP = mm(timePeriod[i].end, "HH:mm:ss");
    // console.log(endP);

    let fiA = clickss.filter(v => {
      let t = mm(v.timestamp).format("HH:mm:ss");
      t = mm(t, "HH:mm:ss");
      if (t.isBetween(startP, endP)) {
        return v;
      }
    });

    if (fiA.length > 0) {
      // console.log("Index:",i);
      // console.log(fiA)

      let duplicatesArr = _.difference(fiA, _.uniqBy(fiA, "ip"), "ip");

      if (duplicatesArr.length > 0) {
        let fiAOrdered = _.orderBy(fiA, "amount", "desc");
        // console.log('duplicates : ',duplicatesArr);
        // console.log('fiAOrdered : ',fiAOrdered);

        for (let k = 0; k < duplicatesArr.length; k++) {
          if (duplicatesArr[k].ip === fiAOrdered[0].ip) {
            let v = _.find(fiA, function(o, index) {
              return o.ip === duplicatesArr[k].ip;
            });
            result.push(v);
            break;
          } else {
            result.push(fiAOrdered[0]);
          }
        }
      } else {
        let f = _.orderBy(fiA, "amount", "desc");
        //    console.log('f:',f);
        result.push(f[0]);
      }
    }
  }
  console.log("Result: ", result);
  fs.writeFile('result.json',JSON.stringify(result));
}
