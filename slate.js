// Utils

var extend = function(what, withWhat) { return _.extend(_.clone(what), withWhat); };

var mapKeys = function(_map, mapper) {
  var map = {};

  for(key in _map) {
    var newKey = mapper(key);
    map[newKey] = _map[key];
  };

  return map;
};

var prefixKeysWith = function(_map, prefix) {
  return mapKeys(_map, function(key) {
    return '' + prefix + key;
  });
};

var suffixKeysWith = function(_map, suffix) {
  return mapKeys(_map, function(key) {
    return '' + key + suffix;
  });
};

var flattenMapping = function(mapping, mapper) {
  var flatMap = {};

  for(key in mapping) {
    var value = mapping[key];

    if (value && typeof(value) == 'object' && Object.keys(value).length > 0) {
      var newValue = mapper(value, key);

      flatMap = extend(flatMap, newValue);
    } else {
      flatMap[key] = value;
    }
  };

  return flatMap;
};

/*
 * Bind all mappings.
 *
 * aliases - an object of alias -> real mappings.
 * bindMap - an object of key -> operation/object mappings.
 *
 * Examples
 *
 * bindAll({
 *   hyper: 'h'
 * }, {
 *   a: 1,
 *   b: { c: 2 },
 *   hyper: { d: 3 }
 * });
 * => { a: 1, 'c:b': 2, 'd:h': 3 }
 */
var bindAll = function(aliases, _bindMap) {
  var aliasedMap = flattenMapping(_bindMap, function(map, key) {
    return suffixKeysWith(map, ':' + key);
  });

  var bindMap = mapKeys(aliasedMap, function(key) {
    return _.reduce(aliases, function(memo, map, alias) {
      return memo.replace(alias, map);
    }, key);
  });

  // Bind it, finally.
  S.bindAll(bindMap);
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
S.configAll({
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

var full = S.op("corner", {
  direction: "top-left",
  width: "screenSizeX",
  height: "screenSizeY"
});

var left = S.op("corner", {
  direction: "top-left",
  width: "screenSizeX/2",
  height: "screenSizeY"
});

var right = left.dup({ direction: "top-right" });

// Monitor-dependent operations

var lapFull = full.dup({ screen: monLaptop }),
    lapChat = lapLeft = left.dup({ screen: monLaptop }),
    lapSocial = lapRight = right.dup({ screen: monLaptop });

var tboltFull = full.dup({ screen: monTbolt }),
    tboltLeft = left.dup({ screen: monTbolt }),
    tboltRight = right.dup({ screen: monTbolt }),
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
  "Preview": lapFullHash,
  "Messages": lapChatHash,
  "Skype": lapChatHash,
  "Tweetbot": lapSocialHash,
  "Xcode": lapFullHash,
  "Google Chrome": lapFullHash
});

// 1 monitor layout (Thunderbolt Display only)
var thunderboltLayout = S.lay("thunderbolt", {
  "Safari": tboltFullHash,
  "iTerm": tboltFullHash,
  "iTunes": tboltKindaLeftHash,
  "Preview": tboltKindaLeftHash,
  "Messages": tboltChatHash,
  "Skype": tboltChatHash,
  "Tweetbot": tboltSocialTopHash,
  "Xcode": tboltFullHash,
  "Google Chrome": tboltFullHash
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
  layoutKeys: 'ctrl;cmd',
  layoutKeys: 'ctrl;cmd',
  locationKeys: 'ctrl;cmd',
  resizeKeys1: 'cmd;alt',
  resizeKeys2: 'ctrl;alt',
  pushKeys: 'ctrl;cmd',
  throwKeys: 'ctrl;alt',
  nudgeKeys: 'ctrl;alt;cmd',
  focusKeys: 'ctrl;shift;alt;cmd',
}, {
  layoutKeys: {
    // Layout bindings
    l: laptop,
    t: thunderbolt,
    b: twoMonitor,
    u: universalLayout,
  },

  locationKeys: {
    // Location bindings
    "0": lapChat,
    "[": lapSocial,
    ";": lapFull,
    "1": lapAndTbolt(lapFull, tboltFull, full),
    "2": tboltKindaFull,
    "3": lapAndTbolt(lapLeft, tboltLeft, left),
    "4": tboltKindaLeft,
    "5": lapAndTbolt(lapRight, tboltRight, right),
    "6": tboltKindaRight,
    "7": lapAndTbolt(lapChat, tboltChat),
    "8": lapAndTbolt(lapSocial, tboltSocialTop),
    "9": lapAndTbolt(lapSocial, tboltSocialBot),
  },

  resizeKeys1: {
    // Resize bindings
    right: S.op("resize", { width: "+10%", height: "+0" }),
    left:  S.op("resize", { width: "-10%", height: "+0" }),
    up:    S.op("resize", { width: "+0", height: "-10%" }),
    left:  S.op("resize", { width: "+0", height: "+10%" }),
  },

  resizeKeys2: {
    right: S.op("resize", { width: "-10%", height: "+0", anchor: "bottom-right" }),
    left:  S.op("resize", { width: "+10%", height: "+0", anchor: "bottom-right" }),
    up:    S.op("resize", { width: "+0", height: "+10%", anchor: "bottom-right" }),
    down:  S.op("resize", { width: "+0", height: "-10%", anchor: "bottom-right" }),
  },

  pushKeys: {
    // Push bindings
    "/":   S.op("move", { x: "screenSizeX/4", y: 0, width: "screenSizeX/2", height: "screenSizeY" }), // center
    n:     S.op("move", { x: "screenSizeX/8", y: 0, width: "3*screenSizeX/4", height: "screenSizeY" }), // normal
    r:     S.op("move", { x: 0, y: 0, width: "screenSizeX", height: "screenSizeY" }), // full-screen
    right: S.op("push", { direction: "right", style: "bar-resize:screenSizeX/3" }),
    left:  S.op("push", { direction: "left", style: "bar-resize:screenSizeX/3" }),
    down:  S.op("push", { direction: "down", style: "bar-resize:screenSizeX/2" }),
    up:    S.op("push", { direction: "up", style: "bar-resize:screenSizeX/2" }),
  },

  nudgeKeys: {
    // Nudge bindings
    right: S.op("nudge", { x: "+5%", y: "+0" }),
    left:  S.op("nudge", { x: "-5%", y: "+0" }),
    down:  S.op("nudge", { x: "+0", y: "+5%" }),
    up:    S.op("nudge", { x: "+0", y: "-5%" }),
  },

  throwKeys: {
    // Throw bindings
    "1": S.op("throw", { screen: monLaptop, width: "screenSizeX", height: "screenSizeY" }), // throw to Air screen & make full-screen
    "2": S.op("throw", { screen: monTbolt, width: "screenSizeX", height: "screenSizeY" }), // throw to TD & make full-screen
    "3": S.op("throw", { screen: monLaptop }), // throw to Air screen but preserve window size
    "4": S.op("throw", { screen: monTbolt }), // throw to TD but preserve window size
  },

  focusKeys: {
    // Focus bindings
    s: S.op("focus", { app: "Safari" }), // *S*afari
    t: S.op("focus", { app: "iTerm" }), // i*T*erm
    i: S.op("focus", { app: "iTunes" }), // *i*Tunes
    x: S.op("focus", { app: "Xcode" }), // *X*code
    v: S.op("focus", { app: "Preview" }), // Pre*v*iew
    l: S.op("focus", { app: "VLC" }), // V*L*C
    m: S.op("focus", { app: "Messages" }), // *M*essages
    k: S.op("focus", { app: "Skype" }), // S*k*ype
    b: S.op("focus", { app: "Tweetbot" }), // Tweet*b*ot
    p: S.op("focus", { app: "Sparrow" }), // S*p*arrow
    c: S.op("focus", { app: "Google Chrome" }), // Google *C*hrome
    f: S.op("focus", { app: "Finder" }), // *F*inder
  },

  // Etc
  "esc:cmd": S.op("hint"), // window hints
  "esc:ctrl": S.op("grid"),
  "esc:ctrl;alt": S.op("relaunch"),
  "1:ctrl": S.op("undo"),
  "2:ctrl": S.op("switch")
});
