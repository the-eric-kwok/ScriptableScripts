// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
// TODO: 整理代码、将电影json缓存到本地？
let apiUrl = 'https://api.vvhan.com/api/douban';
let amapApiKey = 'd6893f08050671a5f6c56b79451efc83';
let amapApiUrl = 'https://restapi.amap.com/v3/geocode/regeo';
let doubanApiUrl = 'https://api.douban.com/v2/movie/in_theaters';
let doubanApiKeys = ['0df993c66c0c636e29ecbb5344252a4a', '0b2bdeda43b5688921839c8ecb20399b'];



/**
 * Get movies data from douban API.
 * @returns {Array} JSON data of movies
 */
async function getData() {
  let j = await new Request(apiUrl).loadJSON();
  return j["data"];
}

/**
 * Generate random number between `min` and `max`.
 * @param {number} min
 * @param {number} max 
 * @returns {number} Random number between `min` and `max`
 */
function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function retry(maxRetries, func) {
  try {
    return func();
  }
  catch (err) {
    if (maxRetries < 0) {
      throw err;
    }
    return retry(maxRetries - 1, func);
  }
}

/**
 * Get movies data from douban API and applies filter on it.
 * @param {float} minRate Minimun rate to filter movies
 * @returns {Array} JSON data of movies
 */
async function getMovies(minRate) {
  let movies = await getData();
  let movieList = [];
  for (movie of movies) {
    if (movie["info"]["pingfen"] >= minRate) {
      movieList.push(movie);
    }
  }
  return movieList;
}

/**
 * Load an image from web
 * @param {String} url Web image url
 * @returns {Image} `Image` instance
 */
async function webImage(url) {
  let imgRequest = new Request(url);
  imgRequest.timeoutInterval = 120;
  return await imgRequest.loadImage();
}

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
      "small": { "width": 141, "height": 141 },
      "medium": { "width": 305.5, "height": 141 },
      "large": { "width": 305.5, "height": 305.5 },
      "extraLarge": { "width": 634.5, "height": 305.5 },
    },
    "810x1080": {
      "small": { "width": 146, "height": 146 },
      "medium": { "width": 320.5, "height": 146 },
      "large": { "width": 320.5, "height": 320.5 },
      "extraLarge": { "width": 669, "height": 320.5 },
    },
    "834x1112": {
      "small": { "width": 150, "height": 150 },
      "medium": { "width": 327.5, "height": 150 },
      "large": { "width": 327.5, "height": 327.5 },
      "extraLarge": { "width": 682, "height": 327.5 },
    },
    "820x1180": {
      "small": { "width": 155, "height": 155 },
      "medium": { "width": 342, "height": 155 },
      "large": { "width": 342, "height": 342 },
      "extraLarge": { "width": 715.5, "height": 342 },
    },
    "834x1194": {
      "small": { "width": 155, "height": 155 },
      "medium": { "width": 342, "height": 155 },
      "large": { "width": 342, "height": 342 },
      "extraLarge": { "width": 715.5, "height": 342 },
    },
    "1024x1366": {
      "small": { "width": 170, "height": 170 },
      "medium": { "width": 378.5, "height": 170 },
      "large": { "width": 378.5, "height": 378.5 },
      "extraLarge": { "width": 795, "height": 378.5 },
    }
  };
  if (sizeDict[size1]) {
    return sizeDict[size1][presentMode];
  } else {
    return sizeDict[size2][presentMode];
  }
}

// Crop an image into the specified rect.
function cropImage(image) {
   
  let draw = new DrawContext()
  let rect = new Rect(crop.x,crop.y,crop.w,crop.h)
  draw.size = new Size(rect.width, rect.height)
  
  draw.drawImageAtPoint(image,new Point(-rect.x, -rect.y))  
  return draw.getImage()
}


/**
 * Get widget size from screen size and widget present mode.
 * @param {JPEG raw data} img 
 * @param {String} style one of "dark" or "light"
 * @returns {Image} blured image
 */
async function blurImage(img,style,blurRadius) {
  const js = `
  /*

  StackBlur - a fast almost Gaussian Blur For Canvas

  Version:   0.5
  Author:    Mario Klingemann
  Contact:   mario@quasimondo.com
  Website:  http://quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
  Twitter:  @quasimondo

  In case you find this class useful - especially in commercial projects -
  I am not totally unhappy for a small donation to my PayPal account
  mario@quasimondo.de

  Or support me on flattr: 
  https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

  Copyright (c) 2010 Mario Klingemann

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
  */

  var mul_table = [
          512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
          454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
          482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
          437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
          497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
          320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
          446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
          329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
          505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
          399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
          324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
          268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
          451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
          385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
          332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
          289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
  var shg_table = [
         9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
      17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
      20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
      21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
      21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
      22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
      22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
      23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

  function stackBlurCanvasRGB( id, top_x, top_y, width, height, radius )
  {
    if ( isNaN(radius) || radius < 1 ) return;
    radius |= 0;
  
    var canvas  = document.getElementById( id );
    var context = canvas.getContext("2d");
    var imageData;
  
    try {
      try {
      imageData = context.getImageData( top_x, top_y, width, height );
      } catch(e) {
    
      // NOTE: this part is supposedly only needed if you want to work with local files
      // so it might be okay to remove the whole try/catch block and just use
      // imageData = context.getImageData( top_x, top_y, width, height );
      try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        imageData = context.getImageData( top_x, top_y, width, height );
      } catch(e) {
        alert("Cannot access local image");
        throw new Error("unable to access local image data: " + e);
        return;
      }
      }
    } catch(e) {
      alert("Cannot access image");
      throw new Error("unable to access image data: " + e);
    }
      
    var pixels = imageData.data;
      
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
    r_out_sum, g_out_sum, b_out_sum,
    r_in_sum, g_in_sum, b_in_sum,
    pr, pg, pb, rbs;
      
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
  
    var stackStart = new BlurStack();
    var stack = stackStart;
    for ( i = 1; i < div; i++ )
    {
      stack = stack.next = new BlurStack();
      if ( i == radiusPlus1 ) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
  
    yw = yi = 0;
  
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
  
    for ( y = 0; y < height; y++ )
    {
      r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
    
      r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
      g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
      b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
    
      r_sum += sumFactor * pr;
      g_sum += sumFactor * pg;
      b_sum += sumFactor * pb;
    
      stack = stackStart;
    
      for( i = 0; i < radiusPlus1; i++ )
      {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack = stack.next;
      }
    
      for( i = 1; i < radiusPlus1; i++ )
      {
        p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
        r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
        g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
        b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
      
        r_in_sum += pr;
        g_in_sum += pg;
        b_in_sum += pb;
      
        stack = stack.next;
      }
    
    
      stackIn = stackStart;
      stackOut = stackEnd;
      for ( x = 0; x < width; x++ )
      {
        pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
        pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
        pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
      
        r_sum -= r_out_sum;
        g_sum -= g_out_sum;
        b_sum -= b_out_sum;
      
        r_out_sum -= stackIn.r;
        g_out_sum -= stackIn.g;
        b_out_sum -= stackIn.b;
      
        p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
      
        r_in_sum += ( stackIn.r = pixels[p]);
        g_in_sum += ( stackIn.g = pixels[p+1]);
        b_in_sum += ( stackIn.b = pixels[p+2]);
      
        r_sum += r_in_sum;
        g_sum += g_in_sum;
        b_sum += b_in_sum;
      
        stackIn = stackIn.next;
      
        r_out_sum += ( pr = stackOut.r );
        g_out_sum += ( pg = stackOut.g );
        b_out_sum += ( pb = stackOut.b );
      
        r_in_sum -= pr;
        g_in_sum -= pg;
        b_in_sum -= pb;
      
        stackOut = stackOut.next;

        yi += 4;
      }
      yw += width;
    }

  
    for ( x = 0; x < width; x++ )
    {
      g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
    
      yi = x << 2;
      r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
      g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
      b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
    
      r_sum += sumFactor * pr;
      g_sum += sumFactor * pg;
      b_sum += sumFactor * pb;
    
      stack = stackStart;
    
      for( i = 0; i < radiusPlus1; i++ )
      {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack = stack.next;
      }
    
      yp = width;
    
      for( i = 1; i <= radius; i++ )
      {
        yi = ( yp + x ) << 2;
      
        r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
        g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
        b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
      
        r_in_sum += pr;
        g_in_sum += pg;
        b_in_sum += pb;
      
        stack = stack.next;
    
        if( i < heightMinus1 )
        {
          yp += width;
        }
      }
    
      yi = x;
      stackIn = stackStart;
      stackOut = stackEnd;
      for ( y = 0; y < height; y++ )
      {
        p = yi << 2;
        pixels[p]   = (r_sum * mul_sum) >> shg_sum;
        pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
        pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
      
        r_sum -= r_out_sum;
        g_sum -= g_out_sum;
        b_sum -= b_out_sum;
      
        r_out_sum -= stackIn.r;
        g_out_sum -= stackIn.g;
        b_out_sum -= stackIn.b;
      
        p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
      
        r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
        g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
        b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
      
        stackIn = stackIn.next;
      
        r_out_sum += ( pr = stackOut.r );
        g_out_sum += ( pg = stackOut.g );
        b_out_sum += ( pb = stackOut.b );
      
        r_in_sum -= pr;
        g_in_sum -= pg;
        b_in_sum -= pb;
      
        stackOut = stackOut.next;
      
        yi += width;
      }
    }
  
    context.putImageData( imageData, top_x, top_y );
  
  }

  function BlurStack()
  {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  }
  
  // https://gist.github.com/mjackson/5311256

  function rgbToHsl(r, g, b){
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if(max == min){
          h = s = 0; // achromatic
      }else{
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }

      return [h, s, l];
  }

  function hslToRgb(h, s, l){
      var r, g, b;

      if(s == 0){
          r = g = b = l; // achromatic
      }else{
          var hue2rgb = function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  
  function lightBlur(hsl) {
  
    // Adjust the luminance.
    let lumCalc = 0.35 + (0.3 / hsl[2]);
    if (lumCalc < 1) { lumCalc = 1; }
    else if (lumCalc > 3.3) { lumCalc = 3.3; }
    const l = hsl[2] * lumCalc;
    
    // Adjust the saturation. 
    const colorful = 2 * hsl[1] * l;
    const s = hsl[1] * colorful * 1.5;
    
    return [hsl[0],s,l];
    
  }
  
  function darkBlur(hsl) {

    // Adjust the saturation. 
    const colorful = 2 * hsl[1] * hsl[2];
    const s = hsl[1] * (1 - hsl[2]) * 3;
    
    return [hsl[0],s,hsl[2]];
    
  }

  // Set up the canvas.
  const img = document.getElementById("blurImg");
  const canvas = document.getElementById("mainCanvas");

  const w = img.naturalWidth;
  const h = img.naturalHeight;

  canvas.style.width  = w + "px";
  canvas.style.height = h + "px";
  canvas.width = w;
  canvas.height = h;

  const context = canvas.getContext("2d");
  context.clearRect( 0, 0, w, h );
  context.drawImage( img, 0, 0 );
  
  // Get the image data from the context.
  var imageData = context.getImageData(0,0,w,h);
  var pix = imageData.data;
  
  // Set the image function, if any.
  var imageFunc;
  var style = "${style}";
  if (style == "dark") { imageFunc = darkBlur; }
  else if (style == "light") { imageFunc = lightBlur; }

  for (let i=0; i < pix.length; i+=4) {

    // Convert to HSL.
    let hsl = rgbToHsl(pix[i],pix[i+1],pix[i+2]);
    
    // Apply the image function if it exists.
    if (imageFunc) { hsl = imageFunc(hsl); }
  
    // Convert back to RGB.
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
  
    // Put the values back into the data.
    pix[i] = rgb[0];
    pix[i+1] = rgb[1];
    pix[i+2] = rgb[2];

  }

  // Draw over the old image.
  context.putImageData(imageData,0,0);

  // Blur the image.
  stackBlurCanvasRGB("mainCanvas", 0, 0, w, h, ${blurRadius});
  
  // Perform the additional processing for dark images.
  if (style == "dark") {
  
    // Draw the hard light box over it.
    context.globalCompositeOperation = "hard-light";
    context.fillStyle = "rgba(55,55,55,0.2)";
    context.fillRect(0, 0, w, h);

    // Draw the soft light box over it.
    context.globalCompositeOperation = "soft-light";
    context.fillStyle = "rgba(55,55,55,1)";
    context.fillRect(0, 0, w, h);

    // Draw the regular box over it.
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "rgba(55,55,55,0.4)";
    context.fillRect(0, 0, w, h);
  
  // Otherwise process light images.
  } else if (style == "light") {
    context.fillStyle = "rgba(255,255,255,0.4)";
    context.fillRect(0, 0, w, h);
  }

  // Return a base64 representation.
  canvas.toDataURL(); 
  `
  
  // Convert the images and create the HTML.
  let blurImgData = Data.fromJPEG(img).toBase64String()
  let html = `
  <img id="blurImg" src="data:image/png;base64,${blurImgData}" />
  <canvas id="mainCanvas" />
  `
  
  // Make the web view and get its return value.
  let view = new WebView()
  await view.loadHTML(html)
  let returnValue = await view.evaluateJavaScript(js)
  
  // Remove the data type from the string and convert to data.
  let imageDataString = returnValue.slice(22)
  let imageData = Data.fromBase64String(imageDataString)
  
  // Convert to image and crop before returning.
  let imageFromData = Image.fromData(imageData);
  return imageFromData;
}

/**
 * 
 * @param {Dictionary} movie JSON info of movie
 * @param {String} presentMode One of "small", "medium", "large" or "extraLarge"
 * @returns {ListWidget} The widget to be shown on home screen
 */
async function createWidget(movie, presentMode) {
  const screenSize = Device.screenSize();
  const widgetSize = getWidgetSize(screenSize, presentMode);
  const w = new ListWidget();
  w.setPadding(0, 0, 0, 0);
  hStack = w.addStack();
  hStack.setPadding(0, 0, 0, 0);
  hStack.size = new Size(widgetSize['width'], widgetSize['height']);
  var posterImg = await retry(3, async () => await webImage(movie.images.large));
  vStackLeft = hStack.addStack()
  vStackLeft.layoutVertically();
  vStackLeft.setPadding(10, 10, 10, 0);
  vStackLeft.borderWidth = 0;
  if (presentMode === "small" || presentMode === "large") {
    w.backgroundImage = posterImg;
  } else {
    w.backgroundImage = await blurImage(posterImg, "dark", 50);
    var img = vStackLeft.addImage(posterImg);
    img.cornerRadius = 15;
  }

  var vStackRight;
  if (presentMode === "medium" || presentMode === "extraLarge") {
    vStackRight = hStack.addStack();
    vStackRight.layoutVertically();
    vStackRight.setPadding(10, 10, 10, 10);
  }

  let rating = parseFloat(movie.rating.average);
  var star = SFSymbol.named("star.fill");
  var halfStar = SFSymbol.named("star");

  var title;  // 电影标题
  var stars;  // 电影评分
  var actors; // 主演
  var intro;  // 简介
  if (presentMode === "medium" || presentMode === "extraLarge") {
    vStackLeft.size = new Size(widgetSize["width"] / 2 - 50, widgetSize["height"]);
    vStackRight.size = new Size(widgetSize["width"] / 2 + 50, widgetSize["height"]);
    vStackRight.spacing = 2;
    vStackRight.bottomAlignContent();
//     vStackRight.addSpacer();
    title = vStackRight.addText(movie.title);
    stars = vStackRight.addStack()
    var actorsStr = "主演：";
    for (var i = 0; i < (movie.casts.length > 3 ? 3 : movie.casts.length); i++) {
      actorsStr += movie.casts[i].name + ' / ';
    }
    actorsStr = actorsStr.substring(0, actorsStr.length - 3) + "等";
    actors = vStackRight.addText(actorsStr);
    actors.textColor = Color.white();
    actors.font = Font.systemFont(12);
    let introStr = "简介：" + movie.summary;
    intro = vStackRight.addText(introStr);
    intro.textColor = Color.white();
    intro.font = Font.systemFont(12);
  } else {
    vStackLeft.size = new Size(widgetSize.width, widgetSize.height);
    let overlayImgUrl = "https://i.loli.net/2021/11/04/KzkhB5rUVHgsWPv.png";
    vStackLeft.backgroundImage = await retry(3, async () => await webImage(overlayImgUrl));
    vStackLeft.addSpacer();
    title = vStackLeft.addText(movie.title);
    stars = vStackLeft.addStack();
    title.shadowRadius = 5;
  }

  title.font = Font.boldSystemFont(16);
  title.textColor = Color.white();
  title.textOpacity = 1;


  stars.layoutHorizontally();
  for (var i = 0; i < Math.floor(Math.round(rating) / 2); i++) {
    var s = stars.addImage(star.image);
    s.tintColor = Color.yellow();
    s.imageSize = new Size(15, 15);
  }
  if (Math.round(rating) % 2 >= 1) {
    var s = stars.addImage(halfStar.image);
    s.tintColor = Color.yellow();
    s.imageSize = new Size(15, 15);
  }
  stars.addSpacer(5);
  var s = stars.addText(`${rating.toFixed(1)} 分`);
  s.textColor = Color.yellow();
  s.font = Font.boldSystemFont(14);

  return w;
}

let location = await Location.current();
let addressInfo = await retry(3, async () => await new Request(`${amapApiUrl}?key=${amapApiKey}&location=${location['longitude'].toFixed(5)},${location['latitude'].toFixed(5)}`).loadJSON());

var movies = await retry(3, async function () {
  let r = new Request(`${doubanApiUrl}?apikey=${doubanApiKeys[randBetween(0, doubanApiKeys.length)]}&city=${encodeURI(addressInfo['regeocode']['addressComponent']['city'])}`);
  r.headers = {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  }
  r.method = "POST";
  r.timeoutInterval = 90;
  return await r.loadJSON();
});
movies = movies.subjects.filter(movie => movie.rating.average >= 7);
let movie = movies[randBetween(0, movies.length)];
console.log(JSON.stringify(movie, null, 2));
let movieIntroUrl = `https://api.douban.com/v2/movie/subject/${movie.id}`
let movieInfo = await retry(3, async function () {
  let r = new Request(`${movieIntroUrl}?apikey=${doubanApiKeys[randBetween(0, doubanApiKeys.length)]}`);
  r.headers = {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  }
  r.method = "POST";
  r.timeoutInterval = 90;
  return await r.loadJSON();
});
console.log(JSON.stringify(movieInfo, null, 2));
if (config.runsInWidget) {
  let widget = await createWidget(movieInfo, config.widgetFamily);
  Script.setWidget(widget);
  Script.complete();
} else {
  let widget = await createWidget(movieInfo, "medium");
  widget.presentMedium();
}