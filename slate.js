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
var lapChat = S.op("corner", {
  screen: monLaptop,
  direction: "top-left",
  width: "screenSizeX/2",
  height: "screenSizeY"
});

var lapSocial = S.op("corner", {
  screen: monLaptop,
  direction: "top-right",
  width: "screenSizeX/3",
  height: "screenSizeY"
});

var lapFull = S.op("corner", {
  screen: monLaptop,
  direction: "top-left",
  width: "screenSizeX",
  height: "screenSizeY"
});

var tboltFull = lapFull.dup({ screen: monTbolt });

var tboltKindaFull = S.op("move", {
  screen: monTbolt,
  x: "screenOriginX",
  y: "screenOriginY",
  width: "5*screenSizeX/6",
  height: "screenSizeY"
});

var tboltLeft = S.op("corner", {
  screen: monTbolt,
  direction: "top-left",
  width: "5*screenSizeX/12",
  height: "screenSizeY"
});

var tboltRight = tboltKindaFull.dup({
  x: "screenOriginX+5*screenSizeX/12",
  width: "5*screenSizeX/12"
});

var tboltSocialTop = S.op("corner", {
  screen: monTbolt,
  direction: "top-right",
  width: "screenSizeX/6",
  height: "screenSizeY/2"
});

var tboltSocialBot = tboltSocialTop.dup({ direction: "bottom-right" });

var tboltChat = S.op("corner", {
  screen: monTbolt,
  direction: "top-left",
  width: "screenSizeX/6",
  height: "screenSizeY"
});

var extend = function(what, withWhat) { return _.extend(_.clone(what), withWhat); }

var lapFullHash = {
  operations: [lapFull],
  "ignore-fail": true,
  repeat: true
};

var lapChatHash = extend(lapFullHash, { operations: [lapChat] }),
    lapSocialHash = extend(lapFullHash, { operations: [lapSocial] });

var tboltFullHash = extend(lapFullHash, { operations: [tboltFull] }),
    tboltKindaFullHash = extend(tboltFullHash, { operations: [tboltKindaFull] }),
    tboltLeftHash = extend(tboltFullHash, { operations: [tboltLeft] }),
    tboltRightHash = extend(tboltFullHash, { operations: [tboltRight] }),
    tboltSocialTopHash = extend(tboltFullHash, { operations: [tboltSocialTop] }),
    tboltSocialBotHash = extend(tboltFullHash, { operations: [tboltSocialBot] }),
    tboltChatHash = extend(tboltFullHash, { operations: [tboltChat] });

// 1 monitor layout (laptop only)
var laptopLayout = S.lay("laptop", {
  "Safari": lapFullHash,
  "iTerm": lapFullHash,
  "iTunes": lapFullHash,
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
  "Safari": tboltLeftHash,
  "iTerm": tboltRightHash,
  "Tweetbot": tboltSocialTopHash,
  "Wedge": tboltSocialBotHash,
  "Messages": tboltChatHash,
  "Xcode": tboltKindaFullHash
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
    twoMonitor = S.op("layout", { name: twoMonitorLayout });

// Binding prefixes
var layoutKeys = "ctrl;cmd",
    locationKeys = "ctrl;cmd",
    resizeKeys1 = "cmd;alt",
    resizeKeys2 = "ctrl;alt",
    pushKeys = "ctrl;cmd",
    nudgeKeys = "ctrl;alt;cmd",
    focusKeys = "ctrl;shift;alt;cmd";

// Bind everything

/*
 * Note: Expressions are not allowed in the key part of object literal
 * (e.g. `{ "up:" + resizeKeys1 : ... }` would fail), so I'm using
 * "#somethingKeys" in the key, and later replace it with the value of
 * the variable 'somethingKeys'. Works with anything instead of "something".
 */
var rawBindings = {
  // Layout bindings
  "l:#layoutKeys": laptop,
  "t:#layoutKeys": thunderbolt,
  "b:#layoutKeys": twoMonitor,

  // Location bindings
  "0:#locationKeys": lapChat,
  "[:#locationKeys": lapSocial,
  ";:#locationKeys": lapFull,
  "1:#locationKeys": tboltFull,
  "2:#locationKeys": tboltKindaFull,
  "3:#locationKeys": tboltLeft,
  "4:#locationKeys": tboltRight,
  "5:#locationKeys": tboltChat,
  "6:#locationKeys": tboltSocialTop,
  "7:#locationKeys": tboltSocialBot,

  // Resize bindings
  "right: #resizeKeys1": S.op("resize", { width: "+10%", height: "+0" }),
  "left:  #resizeKeys1": S.op("resize", { width: "-10%", height: "+0" }),
  "up:    #resizeKeys1": S.op("resize", { width: "+0%", height: "-10%" }),
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

  // Focus bindings
  "s:#focusKeys": S.op("focus", { app: "Safari" }),
  "t:#focusKeys": S.op("focus", { app: "iTerm" }),
  "i:#focusKeys": S.op("focus", { app: "iTunes" }),
  "x:#focusKeys": S.op("focus", { app: "Xcode" }),
  "m:#focusKeys": S.op("focus", { app: "Messages" }),
  "b:#focusKeys": S.op("focus", { app: "Tweetbot" }),
  "w:#focusKeys": S.op("focus", { app: "Wedge" }),
  "p:#focusKeys": S.op("focus", { app: "Sparrow" }),
  "c:#focusKeys": S.op("focus", { app: "Google Chrome" }),
  "f:#focusKeys": S.op("focus", { app: "Finder" }),

  // Window hints
  "esc:cmd": S.op("hint"),

  // Grid
  "esc:ctrl": S.op("grid"),

  // Relaunch
  "esc:ctrl;alt": S.op("relaunch")
};

var bindings = {};

// Replace "#somethingKeys" in binding keys with the value of 'somethingKeys'.
_.each(rawBindings, function(value, key) {
  var match, val;

  if (match = key.match(/.*:\s*#(.*Keys.*)/)) {
    val = eval(match[1]);
    key = key.replace("#" + match[1], val).replace(/\s+/, '');
  }

  bindings[key] = value;
});

// Bind it, finally.
S.bnda(bindings);
