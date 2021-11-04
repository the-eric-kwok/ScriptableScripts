// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: hand-holding-usd;
let apiUrl = "https://datacenter-web.eastmoney.com/api/data/v1/get?sortColumns=PUBLIC_START_DATE&sortTypes=-1&pageSize=50&pageNumber=1&reportName=RPT_BOND_CB_LIST&columns=ALL&quoteColumns=f2~01~CONVERT_STOCK_CODE~CONVERT_STOCK_PRICE,f235~10~SECURITY_CODE~TRANSFER_PRICE,f236~10~SECURITY_CODE~TRANSFER_VALUE,f2~10~SECURITY_CODE~CURRENT_BOND_PRICE,f237~10~SECURITY_CODE~TRANSFER_PREMIUM_RATIO,f239~10~SECURITY_CODE~RESALE_TRIG_PRICE,f240~10~SECURITY_CODE~REDEEM_TRIG_PRICE,f23~01~CONVERT_STOCK_CODE~PBV_RATIO&source=WEB&client=WEB";
let pageUrl = "https://data.eastmoney.com/kzz/default.html";
/**
 * 可转债类，定义了一条可转债数据中需要的部分
 * @param {str} name 可转债名称
 * @param {str} code 可转债代码
 * @param {str} price 正股价
 * @param {str} swapPrice 转股价
 * @param {str} publicStartDate 申购日期
 * @param {str} listingDate 上市日期
 */
class Bond {
  constructor(name, code, price, swapPrice, publicStartDate, listingDate) {
    if (name) {
      this._name = name;
    } else {
      throw Error("错误：可转债名称不可为空");
    }
    if (code) {
      this._code = code;
    } else {
      throw Error("错误：可转债代码不可为空");
    }
    if (price && price != "-") {
      this._price = parseFloat(price);
    }
    if (swapPrice && swapPrice != "-") {
      this._swapPrice = parseFloat(swapPrice);
    }
    let re = /\d{4}-\d{2}-\d{2}.*/g;
    if (publicStartDate && publicStartDate.length > 0 && re.test(publicStartDate)) {
      this._publicStartDate = Date.parse(publicStartDate);
    } else {
      throw Error("错误：申购日期为空或格式错误");
    }
    if (listingDate && listingDate.length > 0 && re.test(listingDate)) {
      this._listingDate = Date.parse(listingDate);
    }
  }

  /**
   * 转股价值
   * @returns `float` or `null`
   */
  get swapValue() {
    if (this._swapPrice && this._price) {
      if (this._swapPrice > 0 && this._price > 0) {
        let val = this._price / this._swapPrice * 100;
        return val.toFixed(2);
      }
    }
    return null;
  }

  /**
   * 正股价
   * @returns `float` or `null`
   */
  get price() {
    if (this._price && this._price > 0) {
      return this._price;
    }
    return null;
  }

  /**
   * 转股价
   * @returns `float` or `null`
   */
  get swapPrice() {
    if (this._swapPrice && this._swapPrice > 0) {
      return this._swapPrice;
    }
    return null;
  }

  /**
   * 债券代码
   * @returns `str`
   */
  get code() {
    return this._code;
  }

  /**
   * 债券简称
   * @returns `str`
   */
  get name() {
    return this._name;
  }

  /**
   * 申购日期
   * @returns `Date` object
   */
  get publicStartDate() {
    return this._publicStartDate;
  }

  /**
   * 上市日期
   * @returns `Date` object
   */
  get listingDate() {
    return this._listingDate;
  }
}

//===================================================
/**
 * 从 API 中获取 JSON 数据并返回 data 部分
 * @returns `dictionary`
 */
async function getData() {
  let j = await new Request(apiUrl).loadJSON();
  return j["result"]["data"];
}

/**
 * 以不同的尺寸（由 presentMode 参数控制）创建一个 WidgetKit 桌面小组件。
 * @param {Array} recentlyListing [gap, Bond]
 * @param {Array} recentlyPublic [gap, Bond]
 * @param {String} presentMode One of "small", "medium", "large" or "extraLarge"
 * @returns `ListWidget`
 */
function createWidget(recentlyListing, recentlyPublic, presentMode) {
  let dayRelationship = ["今天", "明天", "后天"];
  const list = new ListWidget();
  list.url = pageUrl;
  let bgColor = new LinearGradient();
  bgColor.colors = [new Color("#29323c"), new Color("#1c1c1c")];
  bgColor.locations = [0.0, 0.7];
  list.backgroundGradient = bgColor;
  let textColor = Color.white();
  switch (presentMode) {
    case "small":
      var stack = list.addStack();
      stack.layoutVertically();
      stack.size = new Size(130, 130);

      var title = stack.addText("近日发行");
      title.textColor = Color.orange();
      title.font = Font.mediumSystemFont(11);

      stack.addSpacer(5);

      if (recentlyPublic.length > 0) {
        for (var i = recentlyPublic.length - 1; i >= 0; i--) {
          bond = recentlyPublic[i];
          var text = `${dayRelationship[bond[0]]}: ${bond[1].name} (${bond[1].code}) `
          if (bond[1].swapValue > 97) {
            text += `✅`
          } else if (bond[1].swapValue < 90) {
            text += `❌`
          } else {
            text += `⚠️`
          }
          let label = stack.addText(text);
          label.font = Font.mediumSystemFont(14);
          label.textColor = textColor;
        }
      } else {
        let label = stack.addText("无");
        label.font = Font.mediumSystemFont(14);
        label.textColor = textColor;
      }
      stack.addSpacer();
      break;


    case "medium":
      var hstack = list.addStack();
      hstack.spacing = 15;

      var pubStack = hstack.addStack();
      pubStack.size = new Size(130, 130);
      pubStack.layoutVertically();
      var pubTitle = pubStack.addText("近日发行");
      pubTitle.font = Font.mediumSystemFont(11);
      pubTitle.textColor = Color.orange();

      pubStack.addSpacer(5);

      if (recentlyPublic.length > 0) {
        for (var i = recentlyPublic.length - 1; i >= 0; i--) {
          bond = recentlyPublic[i];
          var text = `${dayRelationship[bond[0]]}: ${bond[1].name} (${bond[1].code}) `
          if (bond[1].swapValue > 97) {
            text += `✅`
          } else if (bond[1].swapValue < 90) {
            text += `❌`
          } else {
            text += `⚠️`
          }
          let label = pubStack.addText(text);
          label.font = Font.mediumSystemFont(14);
          label.textColor = textColor;
        }
      } else {
        let label = pubStack.addText("无");
        label.font = Font.mediumSystemFont(14);
        label.textColor = textColor;
      }
      pubStack.addSpacer();

      var listStack = hstack.addStack();
      listStack.size = new Size(130, 130);
      listStack.layoutVertically();
      var listTitle = listStack.addText("近日上市");
      listTitle.textColor = Color.blue();
      listTitle.font = Font.mediumSystemFont(11);

      listStack.addSpacer(5);

      if (recentlyListing.length > 0) {
        for (var i = recentlyListing.length - 1; i >= 0; i--) {
          bond = recentlyListing[i];
          let label = listStack.addText(`${dayRelationship[bond[0]]}: ${bond[1].name}(${bond[1].code})`);
          label.font = Font.mediumSystemFont(14);
          label.textColor = textColor;
        }
      } else {
        let label = listStack.addText("无");
        label.font = Font.mediumSystemFont(14);
        label.textColor = textColor;
      }
      listStack.addSpacer();
      break;


    case "large":
      var stack = list.addStack();
      stack.layoutVertically();

      var title = stack.addText("近日发行");
      title.textColor = Color.orange();
      title.font = Font.mediumSystemFont(11);

      stack.addSpacer(5);

      if (recentlyPublic.length > 0) {
        for (var i = recentlyPublic.length - 1; i >= 0; i--) {
          bond = recentlyPublic[i];
          var text = `${dayRelationship[bond[0]]}: ${bond[1].name} (${bond[1].code}) 价值：${bond[1].swapValue}`;
          if (bond[1].swapValue > 97) {
            text += `✅`;
          } else if (bond[1].swapValue < 90) {
            text += `❌`
          } else {
            text += `⚠️`
          }
          let label = stack.addText(text);
          label.font = Font.mediumSystemFont(14);
          label.textColor = textColor;
        }
      } else {
        let label = stack.addText("无");
        label.font = Font.mediumSystemFont(14);
        label.textColor = textColor;
      }
      stack.addSpacer(15);

      var title = stack.addText("近日上市");
      title.textColor = Color.blue();
      title.font = Font.mediumSystemFont(11);

      stack.addSpacer(5);

      if (recentlyListing.length > 0) {
        for (var i = recentlyListing.length - 1; i >= 0; i--) {
          bond = recentlyListing[i];
          let label = stack.addText(`${dayRelationship[bond[0]]}: ${bond[1].name}(${bond[1].code})`);
          label.font = Font.mediumSystemFont(14);
          label.textColor = textColor;
        }
      } else {
        let label = stack.addText("无");
        label.font = Font.mediumSystemFont(14);
        label.textColor = textColor;
      }
      stack.addSpacer();
      break;


    case "extraLarge":
      var hstack = list.addStack();
      hstack.spacing = 15

      var pubStack = hstack.addStack();
      pubStack.size = new Size(250, 250);
      pubStack.layoutVertically();
      pubStack.topAlignContent();

      var pubTitle = pubStack.addText("近日发行");
      pubTitle.font = Font.mediumSystemFont(11);
      pubTitle.textColor = Color.orange();

      pubStack.addSpacer(5);

      if (recentlyPublic.length > 0) {
        for (var i = recentlyPublic.length - 1; i >= 0; i--) {
          bond = recentlyPublic[i];
          var text = `${dayRelationship[bond[0]]}: ${bond[1].name} (${bond[1].code}) `
          if (bond[1].swapValue > 97) {
            text += `✅`
          } else if (bond[1].swapValue < 90) {
            text += `❌`
          } else {
            text += `⚠️`
          }
          let label = pubStack.addText(text);
          label.font = Font.mediumSystemFont(14);
          label.textColor = textColor;
        }
      } else {
        let label = pubStack.addText("无");
        label.font = Font.mediumSystemFont(14);
        label.textColor = textColor;
      }
      pubStack.addSpacer();

      var listStack = hstack.addStack();
      listStack.size = new Size(250, 250);
      listStack.layoutVertically();
      listStack.topAlignContent();

      var listTitle = listStack.addText("近日上市");
      listTitle.textColor = Color.blue();
      listTitle.font = Font.mediumSystemFont(11);

      listStack.addSpacer(5);

      if (recentlyListing.length > 0) {
        for (var i = recentlyListing.length - 1; i >= 0; i--) {
          bond = recentlyListing[i];
          let label = listStack.addText(`${dayRelationship[bond[0]]}: ${bond[1].name}(${bond[1].code})`);
          label.font = Font.mediumSystemFont(14);
          label.textColor = textColor;
        }
      } else {
        let label = listStack.addText("无");
        label.font = Font.mediumSystemFont(14);
        label.textColor = textColor;
      }
      listStack.addSpacer();
      break;
    default:
      list.addText(`${config.widgetFamily} case`);
  }
  return list;
}

// Open pageUrl in in-app Safari
// if (config.runsInApp) {
//   Safari.openInApp(pageUrl, false);

// }

var data = await getData();
// data = data["result"]["data"];
// console.log(data)
recentlyPublicBonds = [];
recentlyListingBonds = [];
today = +new Date();
for (let item of data) {
  if (item['PUBLIC_START_DATE']) {
    let re = /(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})/g;
    let matches = re.exec(item['PUBLIC_START_DATE']);
    var startDate = Date.parse(matches[1] + "T" + matches[2]);
    let gap = Math.floor((startDate - today) / 86400000 + 1);  // Gap in days
    if (gap >= 0 && gap < 3) {
      recentlyPublicBonds.push([gap, new Bond(item["SECURITY_NAME_ABBR"], item["SECURITY_CODE"], item["CONVERT_STOCK_PRICE"], item["TRANSFER_PRICE"], item['PUBLIC_START_DATE'], item['LISTING_DATE'])]);
    }
  }
  if (item['LISTING_DATE']) {
    let re = /(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})/g;
    let matches = re.exec(item['LISTING_DATE']);
    var listDate = Date.parse(matches[1] + "T" + matches[2]);
    let gap = Math.floor((listDate - today) / 86400000 + 1);  // Gap in days
    if (gap >= 0 && gap < 3) {
      recentlyListingBonds.push([gap, new Bond(item["SECURITY_NAME_ABBR"], item["SECURITY_CODE"], item["CONVERT_STOCK_PRICE"], item["TRANSFER_PRICE"], item['PUBLIC_START_DATE'], item['LISTING_DATE'])])
    }
  }
}
console.log(recentlyListingBonds);
console.log(recentlyPublicBonds);

var widget;
if (config.runsInWidget) {
  widget = await createWidget(recentlyListingBonds, recentlyPublicBonds, config.widgetFamily);
} else {
  widget = await createWidget(recentlyListingBonds, recentlyPublicBonds, "medium");
  widget.presentMedium();
}
Script.setWidget(widget);
Script.complete();
