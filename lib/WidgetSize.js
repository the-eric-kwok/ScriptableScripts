// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
/**
 * Get widget size from screen size and widget present mode.
 * @param {Size} screenSize Size instance of screenSize
 * @param {String} presentMode one of "small", "medium", "large" or "extraLarge"
 * @returns {Dictionary<String, number>} `{"width": number, "height": number}` as widget size
 */
function getWidgetSize(screenSize, presentMode) {
  if (!screenSize instanceof Size) {
    throw TypeError("TypeError: Argument screenSize of getWidgetSize() is not String!");
  }
  if (presentMode instanceof String) {
    throw TypeError("TypeError: Argument presentMode of getWidgetSize() is not String!");
  }
  if (!screenSize || screenSize.length <= 0) {
    throw Error("Error: Argument screenSize of getWidgetSize() is empty!");
  }
  if (!presentMode || presentMode.length <= 0) {
    throw Error("Error: Argument presentMode of getWidgetSize() is empty!")
  }
  var size1 = screenSize.width + "x" + screenSize.height;
  var size2 = screenSize.height + "x" + screenSize.width;
  let sizeDict = {
    "428x926": {
      "small": { "width": 170, "height": 170 },
      "medium": { "width": 364, "height": 170 },
      "large": { "width": 364, "height": 382 },
    },
    "414x896": {
      "small": { "width": 169, "height": 169 },
      "medium": { "width": 360, "height": 169 },
      "large": { "width": 360, "height": 379 },
    },
    "414x736": {
      "small": { "width": 159, "height": 159 },
      "medium": { "width": 348, "height": 157 },
      "large": { "width": 348, "height": 357 },
    },
    "390x844": {
      "small": { "width": 158, "height": 158 },
      "medium": { "width": 338, "height": 158 },
      "large": { "width": 338, "height": 354 },
    },
    "375x812": {
      "small": { "width": 155, "height": 155 },
      "medium": { "width": 329, "height": 155 },
      "large": { "width": 329, "height": 345 },
    },
    "375x667": {
      "small": { "width": 148, "height": 148 },
      "medium": { "width": 321, "height": 148 },
      "large": { "width": 321, "height": 324 },
    },
    "360x780": {
      "small": { "width": 155, "height": 155 },
      "medium": { "width": 329, "height": 155 },
      "large": { "width": 329, "height": 345 },
    },
    "320x568": {
      "small": { "width": 141, "height": 141 },
      "medium": { "width": 292, "height": 141 },
      "large": { "width": 292, "height": 311 },
    },
    "768x1024": {
      "small": { "width": 120, "height": 120 },
      "medium": { "width": 260, "height": 120 },
      "large": { "width": 260, "height": 260 },
      "extraLarge": { "width": 540, "height": 260 },
    },
    "810x1080": {
      "small": { "width": 124, "height": 124 },
      "medium": { "width": 272, "height": 124 },
      "large": { "width": 272, "height": 272 },
      "extraLarge": { "width": 568, "height": 272 },
    },
    "834x1112": {
      "small": { "width": 132, "height": 132 },
      "medium": { "width": 288, "height": 132 },
      "large": { "width": 288, "height": 288 },
      "extraLarge": { "width": 600, "height": 288 },
    },
    "820x1180": {
      "small": { "width": 136, "height": 136 },
      "medium": { "width": 300, "height": 136 },
      "large": { "width": 300, "height": 300 },
      "extraLarge": { "width": 628, "height": 300 },
    },
    "834x1194": {
      "small": { "width": 136, "height": 136 },
      "medium": { "width": 300, "height": 136 },
      "large": { "width": 300, "height": 300 },
      "extraLarge": { "width": 628, "height": 300 },
    },
    "1024x1366": {
      "small": { "width": 160, "height": 160 },
      "medium": { "width": 356, "height": 160 },
      "large": { "width": 356, "height": 356 },
      "extraLarge": { "width": 748, "height": 356 },
    }
  };
  if (sizeDict[size1]) {
    return sizeDict[size1][presentMode];
  } else {
    return sizeDict[size2][presentMode];
  }
}