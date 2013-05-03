// Utils
//
var extend = function(what, withWhat) { return _.extend(_.clone(what), withWhat); };

/*
 * Bind all mappings.
 *
 * prefixMap - an optional object of key prefix mappings.
 * bindMap   - an object of key -> operation mappings.
 *
 * In Slate config (non-JS), you can just "bind a:${someprefix} relaunch".
 * In JS version of config, however, you cannot, because you can't use
 * expressions in the key part of object literal in JS, it becomes rather
 * cumbersome to repeat same prefix in every mapping. To address these
 * issues, you can pass an object of prefix mappings to `bindAll` along
 * with the bind mappings. In bind mappings then, you can use hash symbol
 * and name of your prefix as a placeholder.
 */
var bindAll= function(prefixMap, _bindMap) {
  bindMap = {};

  for(key in _bindMap) {
    var match, newKey = key;

    if (match = key.match(/.*:\s*#(.*)/)) {
      var val = prefixMap[match[1]];
      newKey = key.replace("#" + match[1], val).replace(/\s+/, '');
    }

    bindMap[newKey] = _bindMap[key];
  };

  // Bind it, finally.
  S.bnda(bindMap);
};

var screenDimension = function(screen) {
  var rect = screen.rect();

  return "" + rect.width + "x" + rect.height;
};

/*
 * Return the command appropriate for the current display.
 *
 * lapCmd   - the function to run when the laptop display is active.
 * tboltCmd - the function to run when TD is active.
 * bothCMD  - (optional) the function to run when both laptop & TD are active.
 */
var lapAndTbolt = function(lapCmd, tboltCmd, bothCmd) {
  return function() {
    var screenCount = S.screenCount(),
        screen = S.screen(),
        dimension = screenDimension(screen);

    if (screenCount == 1) {
      switch (dimension) {
        case monLaptop: return lapCmd.run();
        case monTbolt: return tboltCmd.run();
      }
    } else if (screenCount == 2 && bothCmd !== undefined) {
      bothCmd.run();
    }
  };
};

// Configs
S.cfga({
  defaultToCurrentScreen: true,
  secondsBetweenRepeat: 0.1,
  checkDefaultsOnLoad: true,
  windowHintsIgnoreHiddenWindows: false,
  windowHintsShowIcons: true,
  windowHintsSpread: true
});

// Monitors
var monLaptop = "1440x900",
    monTbolt =  "2560x1440";

// Operations
var lapFull = S.op("corner", {
  screen: monLaptop,
  direction: "top-left",
  width: "screenSizeX",
  height: "screenSizeY"
});

var lapChat = lapFull.dup({ width: "screenSizeX/2" }),
    lapSocial = lapChat.dup({ direction: "top-right", width: "screenSizeX/3" });

var tboltFull = lapFull.dup({ screen: monTbolt }),
    tboltLeft = tboltFull.dup({ width: "screenSizeX/2" }),
    tboltRight = tboltLeft.dup({ direction: "top-right" }),
    tboltKindaFull = tboltFull.dup({ width: "5*screenSizeX/6" }),
    tboltKindaLeft = tboltFull.dup({ width: "5*screenSizeX/12" }),
    tboltChat = tboltFull.dup({ width: "screenSizeX/6" })
    tboltSocialTop = tboltChat.dup({ direction: "top-right", height: "screenSizeY/2" }),
    tboltSocialBot = tboltSocialTop.dup({ direction: "bottom-right" });

var tboltKindaRight = S.op("move", {
  x: "screenOriginX+5*screenSizeX/12",
  y: "screenOriginY",
  width: "5*screenSizeX/12",
  height: "screenSizeY"
});

var lapFullHash = {
  operations: [lapFull],
  "ignore-fail": true,
  repeat: true
};

var lapChatHash = extend(lapFullHash, { operations: [lapChat] }),
    lapSocialHash = extend(lapFullHash, { operations: [lapSocial] });

var tboltFullHash = extend(lapFullHash, { operations: [tboltFull] }),
    tboltLeftHash = extend(tboltFullHash, { operations: [tboltLeft] }),
    tboltRightHash = extend(tboltFullHash, { operations: [tboltRight] }),
    tboltKindaFullHash = extend(tboltFullHash, { operations: [tboltKindaFull] }),
    tboltKindaLeftHash = extend(tboltFullHash, { operations: [tboltKindaLeft] }),
    tboltKindaRightHash = extend(tboltFullHash, { operations: [tboltKindaRight] }),
    tboltSocialTopHash = extend(tboltFullHash, { operations: [tboltSocialTop] }),
    tboltSocialBotHash = extend(tboltFullHash, { operations: [tboltSocialBot] }),
    tboltChatHash = extend(tboltFullHash, { operations: [tboltChat] });

// 1 monitor layout (laptop only)
var laptopLayout = S.lay("laptop", {
  "Safari": lapFullHash,
  "iTerm": lapFullHash,
  "iTunes": lapFullHash,
  "Cheddar": lapChatHash,
  "Preview": lapFullHash,
  "Messages": lapChatHash,
  "Skype": lapChatHash,
  "Tweetbot": lapSocialHash,
  "Wedge": lapSocialHash,
  "Xcode": lapFullHash,
  "Sparrow": lapFullHash,
  "Google Chrome": lapFullHash
});

// 1 monitor layout (Thunderbolt Display only)
var thunderboltLayout = S.lay("thunderbolt", {
  "Safari": tboltKindaLeftHash,
  "iTerm": tboltKindaRightHash,
  "iTunes": tboltKindaLeftHash,
  "Cheddar": tboltChatHash,
  "Preview": tboltKindaLeftHash,
  "Messages": tboltChatHash,
  "Skype": tboltChatHash,
  "Tweetbot": tboltSocialTopHash,
  "Wedge": tboltSocialBotHash,
  "Xcode": tboltKindaFullHash,
  "Sparrow": tboltKindaRightHash,
  "Google Chrome": tboltKindaFullHash
});

// 2 monitor layout
// TODO
var twoMonitorLayout = S.lay("twoMonitor", {});

// Default layouts
S.def([monLaptop], laptopLayout);
S.def([monTbolt], thunderboltLayout);
S.def([monTbolt, monLaptop], twoMonitorLayout);

// Layout operations
var laptop = S.op("layout", { name: laptopLayout }),
    thunderbolt = S.op("layout", { name: thunderboltLayout }),
    twoMonitor = S.op("layout", { name: twoMonitorLayout }),
    universalLayout = lapAndTbolt(laptop, thunderbolt, twoMonitor);

// Bind everything
bindAll({
  // Binding prefixes
  layoutKeys: "ctrl;cmd",
  locationKeys: "ctrl;cmd",
  resizeKeys1: "cmd;alt",
  resizeKeys2: "ctrl;alt",
  pushKeys: "ctrl;cmd",
  throwKeys: "ctrl;alt",
  nudgeKeys: "ctrl;alt;cmd",
  focusKeys: "ctrl;shift;alt;cmd"
}, {
  // Layout bindings
  "l:#layoutKeys": laptop,
  "t:#layoutKeys": thunderbolt,
  "b:#layoutKeys": twoMonitor,
  "u:#layoutKeys": universalLayout,

  // Location bindings
  "0:#locationKeys": lapChat,
  "[:#locationKeys": lapSocial,
  ";:#locationKeys": lapFull,
  "1:#locationKeys": lapAndTbolt(lapFull, tboltFull),
  "2:#locationKeys": tboltKindaFull,
  "3:#locationKeys": tboltLeft,
  "4:#locationKeys": tboltKindaLeft,
  "5:#locationKeys": tboltRight,
  "6:#locationKeys": tboltKindaRight,
  "7:#locationKeys": lapAndTbolt(lapChat, tboltChat),
  "8:#locationKeys": lapAndTbolt(lapSocial, tboltSocialTop),
  "9:#locationKeys": lapAndTbolt(lapSocial, tboltSocialBot),

  // Resize bindings
  "right: #resizeKeys1": S.op("resize", { width: "+10%", height: "+0" }),
  "left:  #resizeKeys1": S.op("resize", { width: "-10%", height: "+0" }),
  "up:    #resizeKeys1": S.op("resize", { width: "+0", height: "-10%" }),
  "left:  #resizeKeys1": S.op("resize", { width: "+0", height: "+10%" }),
  "right: #resizeKeys2": S.op("resize", { width: "-10%", height: "+0", anchor: "bottom-right" }),
  "left:  #resizeKeys2": S.op("resize", { width: "+10%", height: "+0", anchor: "bottom-right" }),
  "up:    #resizeKeys2": S.op("resize", { width: "+0", height: "+10%", anchor: "bottom-right" }),
  "down:  #resizeKeys2": S.op("resize", { width: "+0", height: "-10%", anchor: "bottom-right" }),

  // Push bindings
  "/:     #pushKeys": S.op("move", { x: "screenSizeX/4", y: 0, width: "screenSizeX/2", height: "screenSizeY" }), // center
  "n:     #pushKeys": S.op("move", { x: "screenSizeX/8", y: 0, width: "3*screenSizeX/4", height: "screenSizeY" }), // normal
  "r:     #pushKeys": S.op("move", { x: 0, y: 0, width: "screenSizeX", height: "screenSizeY" }), // full-screen
  "right: #pushKeys": S.op("push", { direction: "right", style: "bar-resize:screenSizeX/3" }),
  "left:  #pushKeys": S.op("push", { direction: "left", style: "bar-resize:screenSizeX/3" }),
  "down:  #pushKeys": S.op("push", { direction: "down", style: "bar-resize:screenSizeX/2" }),
  "up:    #pushKeys": S.op("push", { direction: "up", style: "bar-resize:screenSizeX/2" }),

  // Nudge bindings
  "right: #nudgeKeys": S.op("nudge", { x: "+5%", y: "+0" }),
  "left:  #nudgeKeys": S.op("nudge", { x: "-5%", y: "+0" }),
  "down:  #nudgeKeys": S.op("nudge", { x: "+0", y: "+5%" }),
  "up:    #nudgeKeys": S.op("nudge", { x: "+0", y: "-5%" }),

  // Throw bindings
  "1:#throwKeys": S.op("throw", { screen: monLaptop, width: "screenSizeX", height: "screenSizeY" }), // throw to Air screen & make full-screen
  "2:#throwKeys": S.op("throw", { screen: monTbolt, width: "screenSizeX", height: "screenSizeY" }), // throw to TD & make full-screen
  "3:#throwKeys": S.op("throw", { screen: monLaptop }), // throw to Air screen but preserve window size
  "4:#throwKeys": S.op("throw", { screen: monTbolt }), // throw to TD but preserve window size

  // Focus bindings
  "s:#focusKeys": S.op("focus", { app: "Safari" }), // *S*afari
  "t:#focusKeys": S.op("focus", { app: "iTerm" }), // i*T*erm
  "i:#focusKeys": S.op("focus", { app: "iTunes" }), // *i*Tunes
  "x:#focusKeys": S.op("focus", { app: "Xcode" }), // *X*code
  "d:#focusKeys": S.op("focus", { app: "Cheddar" }), // Che*d*dar
  "v:#focusKeys": S.op("focus", { app: "Preview" }), // Pre*v*iew
  "l:#focusKeys": S.op("focus", { app: "VLC" }), // V*L*C
  "m:#focusKeys": S.op("focus", { app: "Messages" }), // *M*essages
  "k:#focusKeys": S.op("focus", { app: "Skype" }), // S*k*ype
  "b:#focusKeys": S.op("focus", { app: "Tweetbot" }), // Tweet*b*ot
  "w:#focusKeys": S.op("focus", { app: "Wedge" }), // *W*edge
  "p:#focusKeys": S.op("focus", { app: "Sparrow" }), // S*p*arrow
  "c:#focusKeys": S.op("focus", { app: "Google Chrome" }), // Google *C*hrome
  "f:#focusKeys": S.op("focus", { app: "Finder" }), // *F*inder

  // Etc
  "esc:cmd": S.op("hint"), // window hints
  "esc:ctrl": S.op("grid"),
  "esc:ctrl;alt": S.op("relaunch"),
  "1:ctrl": S.op("undo"),
  "2:ctrl": S.op("switch")
});
