// Default theme templates (20 curated presets with gradients and matching highlightBgColor)
const themeTemplates = {
    csTimer: {
        name: "csTimer",
        panelBackgroundColor: "#ffdcdc",
        backgroundColor:     "#f1ffd6",
        highlightBgColor:    "#ffecec",
        borderColor:         "#e5c0c0",
        timerColor:          "#000000",
        scrambleColor:       "#000000",
   rootFont:            "'Open Sans', sans‑serif",
        timerFont:           "'Digital7', monospace",
        scrambleFont:        "'Open Sans', sans‑serif",

        mainTextColor:       "#000000",
        panelShadowColor:    "#000000",
        panelShadowBlur:     10,
        panelShadowSpread:   0,
        gradientEnabled:     false,
        gradientStart:       "#f1ffd6",
        gradientEnd:         "#f1ffd6",
        gradientAngle:       0,
        inspectionColor: "#ff0000",
        timerReadyColor: "#000000",
        primaryColor: "#6e93ff", // blue, distinct from highlightBgColor
        buttonHoverColor: "#ffe0e0", // slightly lighter than highlightBgColor
        secondaryTextColor: "#8a8a8a"
      },
      blockKeeper: {
        name:               "Block Keeper",
        panelBackgroundColor: "#303030",
        backgroundColor:     "#181818",
        highlightBgColor:    "#383838",
        borderColor:         "#212121",
        timerColor:          "#ffffff",
        scrambleColor:       "#ffffff",
        rootFont:            "'Open Sans', sans‑serif",
        timerFont:           "'Digital7', monospace",
        scrambleFont:        "'Open Sans', sans‑serif",
        mainTextColor:       "#ffffff",
        panelShadowColor:    "#606060",
        panelShadowBlur:     0,
        panelShadowSpread:   2,
        gradientEnabled:     false,
        gradientStart:       "#f1ffd6",
        gradientEnd:         "#f1ffd6",
        gradientAngle:       0,
        inspectionColor:     "#ff0000",
        timerReadyColor:     "#ffffff",
        primaryColor:        "#949494",
        buttonHoverColor:    "#a1a1a1",
        secondaryTextColor:  "#8a8a8a"
      },
      
      
    white:              {name:"White",              panelBackgroundColor:"#f8f9fc",backgroundColor:"#F5F5F5",highlightBgColor:"#E0E0E0",borderColor:"#E8E8E8",timerColor:"#2d3748",scrambleColor:"#2d3748",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#2d3748",panelShadowColor:"#E0E0E0",panelShadowBlur:40,panelShadowSpread:2,gradientEnabled:false,gradientStart:"#F5F5F5",gradientEnd:"#E0E0E0",gradientAngle:180,primaryColor: "#6e93ff", // blue, distinct from highlightBgColor
        buttonHoverColor: "#ededed", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
dark:               {name:"Dark",               panelBackgroundColor:"#121212",backgroundColor:"#121212",highlightBgColor:"#1E1E1E",borderColor:"#181818",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#1E1E1E",panelShadowBlur:0,panelShadowSpread:0,gradientEnabled:false,gradientStart:"#121212",gradientEnd:"#1E1E1E",gradientAngle:180,primaryColor: "#6e93ff", // teal, distinct from highlightBgColor
        buttonHoverColor: "#6e93ff", // slightly lighter than highlightBgColor
        secondaryTextColor: "#bdbdbd"},
blue:               {name:"Blue",               panelBackgroundColor:"#1976D2",backgroundColor:"#1976D2",highlightBgColor:"#2196F3",borderColor:"#1A6EC7",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#2196F3",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled:false,gradientStart:"#1976D2",gradientEnd:"#2196F3",gradientAngle:180,primaryColor: "#00bcd4", // cyan, distinct from highlightBgColor
        buttonHoverColor: "#1e88e5", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
purple:             {name:"Purple",             panelBackgroundColor:"#7B1FA2",backgroundColor:"#7B1FA2",highlightBgColor:"#9C27B0",borderColor:"#751D9A",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#9C27B0",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled:false,gradientStart:"#7B1FA2",gradientEnd:"#9C27B0",gradientAngle:180,primaryColor: "#512da8", // deep purple, distinct from highlightBgColor
        buttonHoverColor: "#8e24aa", // slightly lighter than highlightBgColor
        secondaryTextColor: "#bdbdbd"},
pink:               {name:"Pink",               panelBackgroundColor:"#C2185B",backgroundColor:"#C2185B",highlightBgColor:"#E91E63",borderColor:"#BA1655",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#E91E63",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled:false,gradientStart:"#C2185B",gradientEnd:"#E91E63",gradientAngle:180,primaryColor: "#ad1457", // dark pink, distinct from highlightBgColor
        buttonHoverColor: "#ec407a", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
red:                {name:"Red",                panelBackgroundColor:"#D32F2F",backgroundColor:"#D32F2F",highlightBgColor:"#F44336",borderColor:"#CB2B2B",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#F44336",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled:false,gradientStart:"#D32F2F",gradientEnd:"#F44336",gradientAngle:180,primaryColor: "#b71c1c", // dark red, distinct from highlightBgColor
        buttonHoverColor: "#e57373", // slightly lighter than highlightBgColor
        secondaryTextColor: "#bdbdbd"},
green:              {name:"Green",              panelBackgroundColor:"#388E3C",backgroundColor:"#388E3C",highlightBgColor:"#4CAF50",borderColor:"#348638",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#4CAF50",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled:false,gradientStart:"#388E3C",gradientEnd:"#4CAF50",gradientAngle:180,primaryColor: "#009688", // teal, distinct from highlightBgColor
        buttonHoverColor: "#43a047", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
orange:             {name:"Orange",             panelBackgroundColor:"#F57C00",backgroundColor:"#F57C00",highlightBgColor:"#FF9800",borderColor:"#E57400",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#FF9800",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled:false,gradientStart:"#F57C00",gradientEnd:"#FF9800",gradientAngle:180,primaryColor: "#ff7043", // orange, distinct from highlightBgColor
        buttonHoverColor: "#ffb74d", // slightly lighter than highlightBgColor
        secondaryTextColor: "#bdbdbd"},
gray:               {name:"Gray",               panelBackgroundColor:"#616161",backgroundColor:"#616161",highlightBgColor:"#757575",borderColor:"#5C5C5C",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#757575",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled:false,gradientStart:"#616161",gradientEnd:"#757575",gradientAngle:180,primaryColor: "#37474f", // blue gray, distinct from highlightBgColor
        buttonHoverColor: "#868686", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
teal:               {name:"Teal", 
                panelBackgroundColor:"#00796B",backgroundColor:"#00796B",highlightBgColor:"#009688",borderColor:"#006D60",timerColor:"#FFFFFF",scrambleColor:"#FFFFFF",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#FFFFFF",panelShadowColor:"#009688",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled:false,gradientStart:"#00796B",gradientEnd:"#009688",gradientAngle:180,primaryColor: "#00bfae", // teal, distinct from highlightBgColor

        buttonHoverColor: "#26a69a", // slightly lighter than highlightBgColor
        secondaryTextColor: "#bdbdbd"},
            // --- Next level premium themes (minimal, premium, subtle shadow/glow) ---
    diamondNight: {
        name: "Diamond Night",
        panelBackgroundColor: "#f7fafd", // platinum/diamond white
        backgroundColor: "#e0eafc",
        highlightBgColor: "#dbeafe",
        borderColor: "#bfc9d1",
        timerColor: "#3a506b",
        scrambleColor: "#3a506b",
        timerGlowColor: "#b5c9e2",
        timerGlowSize: 3,
        scrambleGlowColor: "#b5c9e2",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#3a506b",
        panelShadowColor: "#b5c9e2",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#f7fafd",
        gradientEnd: "#e0eafc",
        gradientAngle: 120,
        inspectionColor: "#bfc9d1",
        timerReadyColor: "#3a506b", // strong contrast
        primaryColor: "#3a506b",
        buttonHoverColor: "#b6c7e0", // darker than highlightBgColor
        secondaryTextColor: "#bfc9d1"
    },
    royalEmerald: {
        name: "Royal Emerald",
        panelBackgroundColor: "#eafaf1",
        backgroundColor: "#f3f9f4",
        highlightBgColor: "#d2f5e3",
        borderColor: "#8fd19e",
        timerColor: "#23613d",
        scrambleColor: "#23613d",
        timerGlowColor: "#8fd19e",
        timerGlowSize: 3,
        scrambleGlowColor: "#8fd19e",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#23613d",
        panelShadowColor: "#8fd19e",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#eafaf1",
        gradientEnd: "#f3f9f4",
        gradientAngle: 100,
        inspectionColor: "#8fd19e",
        timerReadyColor: "#23613d", // strong contrast
        primaryColor: "#23613d",
        buttonHoverColor: "#7fcf9e", // darker than highlightBgColor
        secondaryTextColor: "#8fd19e"
    },
    sapphireDream: {
        name: "Sapphire Dream",
        panelBackgroundColor: "#e0eafc",
        backgroundColor: "#f4f8fd",
        highlightBgColor: "#c7d7f5",
        borderColor: "#7fa6e6",
        timerColor: "#27408b",
        scrambleColor: "#27408b",
        timerGlowColor: "#7fa6e6",
        timerGlowSize: 3,
        scrambleGlowColor: "#7fa6e6",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#27408b",
        panelShadowColor: "#7fa6e6",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#e0eafc",
        gradientEnd: "#f4f8fd",
        gradientAngle: 120,
        inspectionColor: "#7fa6e6",
        timerReadyColor: "#27408b", // strong contrast
        primaryColor: "#27408b",
        buttonHoverColor: "#a0bfe6", // darker than highlightBgColor
        secondaryTextColor: "#7fa6e6"
    },
    platinumMist: {
        name: "Platinum Mist",
        panelBackgroundColor: "#e5e5e5",
        backgroundColor: "#f8f8fa",
        highlightBgColor: "#d1d5db",
        borderColor: "#b0b0b0",
        timerColor: "#222831",
        scrambleColor: "#222831",
        timerGlowColor: "#b0b0b0",
        timerGlowSize: 2,
        scrambleGlowColor: "#b0b0b0",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#222831",
        panelShadowColor: "#b0b0b0",
        panelShadowBlur: 8,
        panelShadowSpread: 1,
        gradientEnabled: false,
        gradientStart: "#e5e5e5",
        gradientEnd: "#f8f8fa",
        gradientAngle: 90,
        inspectionColor: "#b0b0b0",
        timerReadyColor: "#222831",
        primaryColor: "#b0b0b0",
        buttonHoverColor: "#bdbdbd",
        secondaryTextColor: "#b0b0b0"
    },
    roseQuartz: {
        name: "Rose Quartz",
        panelBackgroundColor: "#ffe4ec",
        backgroundColor: "#fff0f5",
        highlightBgColor: "#f8bbd0",
        borderColor: "#e57399",
        timerColor: "#ad1457",
        scrambleColor: "#ad1457",
        timerGlowColor: "#f8bbd0",
        timerGlowSize: 3,
        scrambleGlowColor: "#f8bbd0",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#ad1457",
        panelShadowColor: "#e57399",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#ffe4ec",
        gradientEnd: "#fff0f5",
        gradientAngle: 90,
        inspectionColor: "#ad1457",
        timerReadyColor: "#ad1457",
        primaryColor: "#e57399",
        buttonHoverColor: "#e57399",
        secondaryTextColor: "#ad1457"
    },
    obsidianShadow: {
        name: "Obsidian Shadow",
        panelBackgroundColor: "#23272f",
        backgroundColor: "#2d323e",
        highlightBgColor: "#393e46",
        borderColor: "#181a20",
        timerColor: "#f8f8f2",
        scrambleColor: "#f8f8f2",
        timerGlowColor: "#393e46",
        timerGlowSize: 3,
        scrambleGlowColor: "#393e46",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#f8f8f2",
        panelShadowColor: "#393e46",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#23272f",
        gradientEnd: "#2d323e",
        gradientAngle: 90,
        inspectionColor: "#b0b0b0",
        timerReadyColor: "#f8f8f2",
        primaryColor: "#393e46",
        buttonHoverColor: "#181a20",
        secondaryTextColor: "#b0b0b0"
    },
    arcticBlue: {
        name: "Arctic Blue",
        panelBackgroundColor: "#e3f2fd",
        backgroundColor: "#f0f7fa",
        highlightBgColor: "#b3e5fc",
        borderColor: "#81d4fa",
        timerColor: "#01579b",
        scrambleColor: "#01579b",
        timerGlowColor: "#81d4fa",
        timerGlowSize: 3,
        scrambleGlowColor: "#81d4fa",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#01579b",
        panelShadowColor: "#81d4fa",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#e3f2fd",
        gradientEnd: "#f0f7fa",
        gradientAngle: 90,
        inspectionColor: "#01579b",
        timerReadyColor: "#01579b",
        primaryColor: "#81d4fa",
        buttonHoverColor: "#81d4fa",
        secondaryTextColor: "#01579b"
    },
    jadeForest: {
        name: "Jade Forest",
        panelBackgroundColor: "#183c3a", // deep jade
        backgroundColor: "#22524f",      // dark teal
        highlightBgColor: "#2e6d6a",     // jade highlight
        borderColor: "#0d2321",
        timerColor: "#a8ffdf",           // pale jade for contrast
        scrambleColor: "#a8ffdf",
        timerGlowColor: "#4fd1b8",
        timerGlowSize: 3,
        scrambleGlowColor: "#4fd1b8",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#a8ffdf",
        panelShadowColor: "#2e6d6a",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#183c3a",
        gradientEnd: "#22524f",
        gradientAngle: 90,
        inspectionColor: "#4fd1b8",
        timerReadyColor: "#a8ffdf",
        primaryColor: "#4fd1b8",
        buttonHoverColor: "#1b4d47", // deep, muted jade
        secondaryTextColor: "#4fd1b8"
    },

    midnightIndigo: {
        name: "Midnight Indigo",
        panelBackgroundColor: "#23243a", // deep indigo
        backgroundColor: "#2e3057",      // dark blue
        highlightBgColor: "#3a3e6d",     // indigo highlight
        borderColor: "#181a2f",
        timerColor: "#b3c7ff",           // pale blue for contrast
        scrambleColor: "#b3c7ff",
        timerGlowColor: "#5a6dff",
        timerGlowSize: 3,
        scrambleGlowColor: "#5a6dff",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#b3c7ff",
        panelShadowColor: "#3a3e6d",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#23243a",
        gradientEnd: "#2e3057",
        gradientAngle: 90,
        inspectionColor: "#5a6dff",
        timerReadyColor: "#b3c7ff",
        primaryColor: "#5a6dff",
        buttonHoverColor: "#232a4d",
        secondaryTextColor: "#5a6dff"
    },

    crimsonNight: {
        name: "Crimson Night",
        panelBackgroundColor: "#2d1b1b", // deep crimson
        backgroundColor: "#3a2323",      // dark red
        highlightBgColor: "#6d3a3a",     // crimson highlight
        borderColor: "#1a1010",
        timerColor: "#ffb3b3",           // pale crimson for contrast
        scrambleColor: "#ffb3b3",
        timerGlowColor: "#ff5a5a",
        timerGlowSize: 3,
        scrambleGlowColor: "#ff5a5a",
        scrambleGlowSize: 2,
        rootFont: "'Inconsolata', monospace",
        timerFont: "'Inconsolata', monospace",
        scrambleFont: "'Inconsolata', monospace",
        mainTextColor: "#ffb3b3",
        panelShadowColor: "#6d3a3a",
        panelShadowBlur: 10,
        panelShadowSpread: 2,
        gradientEnabled: false,
        gradientStart: "#2d1b1b",
        gradientEnd: "#3a2323",
        gradientAngle: 90,
        inspectionColor: "#ff5a5a",
        timerReadyColor: "#ffb3b3",
        primaryColor: "#ff5a5a",
        buttonHoverColor: "#4d2323",
        secondaryTextColor: "#ff5a5a"
    },
    sunsetBeach:       {name:"Sunset Beach",       panelBackgroundColor:"#ff7e5f",backgroundColor:"#ff7e5f",highlightBgColor:"#ff926e",borderColor:"#e67358",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Poppins',sans-serif",timerFont:"'Poppins',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#feb47b",panelShadowBlur:30,panelShadowSpread:0,gradientEnabled: true,gradientStart:"#ff7e5f",gradientEnd:"#feb47b",gradientAngle:45,primaryColor: "#f857a6", // pink, distinct from highlightBgColor
        buttonHoverColor: "#ffb199", // slightly lighter than highlightBgColor
        secondaryTextColor: "#ffecec"},
    forestHike:        {name:"Forest Hike",        panelBackgroundColor:"#2c7744",backgroundColor:"#2c7744",highlightBgColor:"#317a4a",borderColor:"#236433",timerColor:"#e4f9e1",scrambleColor:"#e4f9e1",rootFont:"'Roboto',sans-serif",timerFont:"'Roboto Slab',serif",scrambleFont:"'Lato',sans-serif",mainTextColor:"#e4f9e1",panelShadowColor:"#5a3f37",panelShadowBlur:40,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#2c7744",gradientEnd:"#5a3f37",gradientAngle:135,primaryColor: "#5a3f37", // brown, distinct from highlightBgColor
        buttonHoverColor: "#3e8e41", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
          oceanDepths:       {name:"Ocean Depths",       panelBackgroundColor:"#2b5876",backgroundColor:"#2b5876",highlightBgColor:"#336084",borderColor:"#1f4260",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Montserrat',sans-serif",timerFont:"'Montserrat',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#1f4260",panelShadowBlur:35,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#2b5876",gradientEnd:"#4e4376",gradientAngle:200,primaryColor: "#009fff", // blue, distinct from highlightBgColor
        buttonHoverColor: "#3c6ca6", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    mistyMountain:     {name:"Misty Mountain",     panelBackgroundColor:"#334d50",backgroundColor:"#334d50",highlightBgColor:"#3e6064",borderColor:"#223739",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Tektur',sans-serif",timerFont:"'Tektur',sans-serif",scrambleFont:"'Sansation',sans-serif",mainTextColor:"#ffffff",panelShadowColor:"#cbcaa5",panelShadowBlur:25,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#334d50",gradientEnd:"#cbcaa5",gradientAngle:160,primaryColor: "#cbcaa5", // light, distinct from highlightBgColor
        buttonHoverColor: "#4a6a6a", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0",
        panelShadowBlur: 0},
    desertDusk:        {name:"Desert Dusk",        panelBackgroundColor:"#edc988",backgroundColor:"#edc988",highlightBgColor:"#e0b86f",borderColor:"#c9a158",timerColor:"#5a381e",scrambleColor:"#5a381e",rootFont:"'Barriecito',cursive",timerFont:"'Barriecito',cursive",scrambleFont:"'Parkinsans',sans-serif",mainTextColor:"#5a381e",panelShadowColor:"#d79522",panelShadowBlur:30,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#edc988",gradientEnd:"#d79522",gradientAngle:90,primaryColor: "#d79522", // gold, distinct from highlightBgColor
        buttonHoverColor: "#f2d16b", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    coralReef:         {name:"Coral Reef",         panelBackgroundColor:"#ee7752",backgroundColor:"#ee7752",highlightBgColor:"#f09a77",borderColor:"#d96645",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Inconsolata',cursive",timerFont:"'Inconsolata',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#e73c7e",panelShadowBlur:20,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#ee7752",gradientEnd:"#e73c7e",gradientAngle:120,primaryColor: "#e73c7e", // magenta, distinct from highlightBgColor
        buttonHoverColor: "#f5a077", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    electricViolet:    {name:"Electric Violet",    panelBackgroundColor:"#4776e6",backgroundColor:"#4776e6",highlightBgColor:"#5b82e8",borderColor:"#3a63d1",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Kablammo',cursive",timerFont:"'Kablammo',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#8e54e9",panelShadowBlur:50,panelShadowSpread:10,gradientEnabled: true,gradientStart:"#4776e6",gradientEnd:"#8e54e9",gradientAngle:75,primaryColor: "#8e54e9", // violet, distinct from highlightBgColor
        buttonHoverColor: "#6c8cfb", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    mintFresh:         {name:"Mint Fresh",         panelBackgroundColor:"#76b852",backgroundColor:"#76b852",highlightBgColor:"#81c15e",borderColor:"#5c8e41",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Open Sans',sans-serif",timerFont:"'Open Sans',sans-serif",scrambleFont:"'Atkinson Hyperlegible',sans-serif",mainTextColor:"#ffffff",panelShadowColor:"#8DC26F",panelShadowBlur:20,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#76b852",gradientEnd:"#8DC26F",gradientAngle:45,primaryColor: "#8DC26F", // green, distinct from highlightBgColor
        buttonHoverColor: "#a3d977", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    lemonZest:         {name:"Lemon Zest",         panelBackgroundColor:"#f7971e",backgroundColor:"#f7971e",highlightBgColor:"#f9a43b",borderColor:"#d27a18",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Bytesized',sans-serif",timerFont:"'Bytesized',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#ffd200",panelShadowBlur:25,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#f7971e",gradientEnd:"#ffd200",gradientAngle:30,primaryColor: "#ffd200", // yellow, distinct from highlightBgColor
        buttonHoverColor: "#fbc02d", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    strawberrySmooth:  {name:"Strawberry Smooth",  panelBackgroundColor:"#ec2f4b",backgroundColor:"#ec2f4b",highlightBgColor:"#f04a64",borderColor:"#c72840",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Birthstone',cursive",timerFont:"'Birthstone',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#009fff",panelShadowBlur:35,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#ec2f4b",gradientEnd:"#009fff",gradientAngle:150,primaryColor: "#009fff", // blue, distinct from highlightBgColor
        buttonHoverColor: "#f36a7b", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    espresso:          {name:"Espresso",           panelBackgroundColor:"#4b3832",backgroundColor:"#4b3832",highlightBgColor:"#5a4a45",borderColor:"#3c2e29",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#854442",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled: false,gradientStart:"#4b3832",gradientEnd:"#854442",gradientAngle:210,primaryColor: "#854442", // brown, distinct from highlightBgColor
        buttonHoverColor: "#6d4c41", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0",
        panelShadowBlur: 0},
    icyWinter:         {name:"Icy Winter",         panelBackgroundColor:"#90e0ef",backgroundColor:"#90e0ef",highlightBgColor:"#9ae6ef",borderColor:"#7fbcd9",timerColor:"#1b262c",scrambleColor:"#1b262c",rootFont:"'Sansation',sans-serif",timerFont:"'Sansation',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#1b262c",panelShadowColor:"#caf0f8",panelShadowBlur:15,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#90e0ef",gradientEnd:"#caf0f8",gradientAngle:60,primaryColor: "#caf0f8", // blue, distinct from highlightBgColor
        buttonHoverColor: "#b2ebf2", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    cherryBlossom:     {name:"Cherry Blossom",     panelBackgroundColor:"#ff9a9e",backgroundColor:"#ff9a9e",highlightBgColor:"#ffb1b5",borderColor:"#e68387",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Barriecito',cursive",timerFont:"'Barriecito',cursive",scrambleFont:"'Lato',sans-serif",mainTextColor:"#ffffff",panelShadowColor:"#fad0c4",panelShadowBlur:20,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#ff9a9e",gradientEnd:"#fad0c4",gradientAngle:25,primaryColor: "#fad0c4", // peach, distinct from highlightBgColor
        buttonHoverColor: "#ffbfc9", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    autumnLeaves:      {name:"Autumn Leaves",      panelBackgroundColor:"#d38312",backgroundColor:"#d38312",highlightBgColor:"#d7973c",borderColor:"#ac6e0f",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Roboto',sans-serif",timerFont:"'Roboto Slab',serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#a83279",panelShadowBlur:30,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#d38312",gradientEnd:"#a83279",gradientAngle:120,primaryColor: "#a83279", // purple, distinct from highlightBgColor
        buttonHoverColor: "#e0a243", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    goldenHour:        {name:"Golden Hour",        panelBackgroundColor:"#fbc2eb",backgroundColor:"#fbc2eb",highlightBgColor:"#fcccec",borderColor:"#e6afe1",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Inconsolata',cursive",timerFont:"'Inconsolata',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#a6c1ee",panelShadowBlur:25,panelShadowSpread:0,gradientEnabled: true,gradientStart:"#fbc2eb",gradientEnd:"#a6c1ee",gradientAngle:200,primaryColor: "#a6c1ee", // blue, distinct from highlightBgColor
        buttonHoverColor: "#fcd6f6", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    nightSky:          {name:"Night Sky",          panelBackgroundColor:"#0f2027",backgroundColor:"#0f2027",highlightBgColor:"#162933",borderColor:"#0a1114",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#203a43",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled: false,gradientStart:"#0f2027",gradientEnd:"#203a43",gradientAngle:180,primaryColor: "#203a43", // blue, distinct from highlightBgColor
        buttonHoverColor: "#223344", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    solarFlare:        {name:"Solar Flare",        panelBackgroundColor:"#ff512f",backgroundColor:"#ff512f",highlightBgColor:"#ff6a47",borderColor:"#e04126",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Atkinson Hyperlegible',sans-serif",timerFont:"'Atkinson Hyperlegible',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#dd2476",panelShadowBlur:35,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#ff512f",gradientEnd:"#dd2476",gradientAngle:75,primaryColor: "#dd2476", // magenta, distinct from highlightBgColor
        buttonHoverColor: "#ff7a5a", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    tropicalDawn:      {name:"Tropical Dawn",      panelBackgroundColor:"#ffe000",backgroundColor:"#ffe000",highlightBgColor:"#ffee3b",borderColor:"#dccd00",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Parkinsans',sans-serif",timerFont:"'Parkinsans',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#799f0c",panelShadowBlur:30,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#ffe000",gradientEnd:"#799f0c",gradientAngle:90,primaryColor: "#799f0c", // green, distinct from highlightBgColor
        buttonHoverColor: "#fff34d", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    rainyDay:          {name:"Rainy Day",          panelBackgroundColor:"#89f7fe",backgroundColor:"#89f7fe",highlightBgColor:"#94f2fe",borderColor:"#6dc0df",timerColor:"#1b262c",scrambleColor:"#1b262c",rootFont:"'Inconsolata',cursive",timerFont:"'Inconsolata',cursive",scrambleFont:"'Lato',sans-serif",mainTextColor:"#1b262c",panelShadowColor:"#66a6ff",panelShadowBlur:20,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#89f7fe",gradientEnd:"#66a6ff",gradientAngle:140,primaryColor: "#66a6ff", // blue, distinct from highlightBgColor
        buttonHoverColor: "#a3f7ff", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    lavenderFields:    {name:"Lavender Fields",    panelBackgroundColor:"#cbb4d4",backgroundColor:"#cbb4d4",highlightBgColor:"#d4bfd8",borderColor:"#b49bb1",timerColor:"#1b1b2f",scrambleColor:"#1b1b2f",rootFont:"'Birthstone',cursive",timerFont:"'Birthstone',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#1b1b2f",panelShadowColor:"#feecd2",panelShadowBlur:30,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#cbb4d4",gradientEnd:"#feecd2",gradientAngle:60,primaryColor: "#feecd2", // cream, distinct from highlightBgColor
        buttonHoverColor: "#d9c6e0", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    cityLights:        {name:"City Lights",        panelBackgroundColor:"#1f1f1f",backgroundColor:"#1f1f1f",highlightBgColor:"#292929",borderColor:"#141414",timerColor:"#f5f5f5",scrambleColor:"#f5f5f5",rootFont:"'Montserrat',sans-serif",timerFont:"'Montserrat',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#f5f5f5",panelShadowColor:"#333333",panelShadowBlur:40,panelShadowSpread:10,gradientEnabled: false,gradientStart:"#1f1f1f",gradientEnd:"#333333",gradientAngle:180,primaryColor: "#333333", // dark gray, distinct from highlightBgColor
        buttonHoverColor: "#353535", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    candyFloss:        {name:"Candy Floss",        panelBackgroundColor:"#ffbad2",backgroundColor:"#ffbad2",highlightBgColor:"#ffc2d9",borderColor:"#e6a0b8",timerColor:"#3a1d2a",scrambleColor:"#3a1d2a",rootFont:"'Inconsolata',cursive",timerFont:"'Inconsolata',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#3a1d2a",panelShadowColor:"#ff8fab",panelShadowBlur:20,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#ffbad2",gradientEnd:"#ffc2d9",gradientAngle:50,primaryColor: "#ff8fab", // pink, distinct from highlightBgColor
        buttonHoverColor: "#ffd6e0", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    retroArcade:       {name:"Retro Arcade",       panelBackgroundColor:"#2b2d42",backgroundColor:"#2b2d42",highlightBgColor:"#32365b",borderColor:"#23253d",timerColor:"#edf2f4",scrambleColor:"#edf2f4",rootFont:"'Press Start 2P',cursive",timerFont:"'Press Start 2P',cursive",scrambleFont:"'Press Start 2P',cursive",mainTextColor:"#edf2f4",panelShadowColor:"#2b2d42",panelShadowBlur:50,panelShadowSpread:20,gradientEnabled: false,gradientStart:"#2b2d42",gradientEnd:"#8d99ae",gradientAngle:270,primaryColor: "#8d99ae", // blue gray, distinct from highlightBgColor
        buttonHoverColor: "#3a3f5a", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    monokai:           {name:"Monokai",             panelBackgroundColor:"#272822",backgroundColor:"#272822",highlightBgColor:"#2f2f2a",borderColor:"#1f1f1b",timerColor:"#f8f8f2",scrambleColor:"#66d9ef",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#f8f8f2",panelShadowColor:"#1e1f1c",panelShadowBlur:40,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#272822",gradientEnd:"#3e3d32",gradientAngle:180,primaryColor: "#66d9ef", // cyan, distinct from highlightBgColor
        buttonHoverColor: "#3e3d32", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    solarizedDark:     {name:"Solarized Dark",     panelBackgroundColor:"#002b36",backgroundColor:"#002b36",highlightBgColor:"#013449",borderColor:"#001f26",timerColor:"#839496",scrambleColor:"#93a1a1",rootFont:"'Source Sans Pro',sans-serif",timerFont:"'Source Code Pro',monospace",scrambleFont:"'Source Sans Pro',sans-serif",mainTextColor:"#839496",panelShadowColor:"#073642",panelShadowBlur:25,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#002b36",gradientEnd:"#073642",gradientAngle:180,primaryColor: "#657b83", // blue gray, distinct from highlightBgColor
        buttonHoverColor: "#01405a", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    solarizedLight:    {name:"Solarized Light",    panelBackgroundColor:"#eee8d5",backgroundColor:"#eee8d5",highlightBgColor:"#f4f1e6",borderColor:"#d5cbb8",timerColor:"#586e75",scrambleColor:"#073642",rootFont:"'Source Sans Pro',sans-serif",timerFont:"'Source Code Pro',monospace",scrambleFont:"'Source Sans Pro',sans-serif",mainTextColor:"#586e75",panelShadowColor:"#657b83",panelShadowBlur:20,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#eee8d5",gradientEnd:"#fdf6e3",gradientAngle:200,primaryColor: "#bdbdbd", // gray, distinct from highlightBgColor
        buttonHoverColor: "#f7f3e6", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    highContrast:      {name:"High Contrast",      panelBackgroundColor:"#000000",backgroundColor:"#000000",highlightBgColor:"#111111",borderColor:"#040404",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Helvetica Neue',sans-serif",timerFont:"'Helvetica Neue',sans-serif",scrambleFont:"'Helvetica Neue',sans-serif",mainTextColor:"#ffffff",panelShadowColor:"#000000",panelShadowBlur:0,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#000000",gradientEnd:"#000000",gradientAngle:0,primaryColor: "#ffffff", // white, distinct from highlightBgColor
        buttonHoverColor: "#222222", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0",
        panelShadowBlur: 0},
    minimal:           {name:"Minimal",             panelBackgroundColor:"#ffffff",backgroundColor:"#ffffff",highlightBgColor:"#fafafa",borderColor:"#e6e6e6",timerColor:"#333333",scrambleColor:"#555555",rootFont:"'Helvetica',sans-serif",timerFont:"'Helvetica',sans-serif",scrambleFont:"'Helvetica',sans-serif",mainTextColor:"#333333",panelShadowColor:"#dddddd",panelShadowBlur:10,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#ffffff",gradientEnd:"#ffffff",gradientAngle:0,primaryColor: "#e6e6e6", // gray, distinct from highlightBgColor
        buttonHoverColor: "#f5f5f5", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    roseGarden:        {name:"Rose Garden",        panelBackgroundColor:"#c06c84",backgroundColor:"#c06c84",highlightBgColor:"#cf7b90",borderColor:"#ac5b70",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Barriecito',cursive",timerFont:"'Barriecito',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#cf7b90",panelShadowBlur:25,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#c06c84",gradientEnd:"#cf7b90",gradientAngle:30,primaryColor: "#cf7b90", // pink, distinct from highlightBgColor
        buttonHoverColor: "#dca1b3", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    midnightBlue:      {name:"Midnight Blue",      panelBackgroundColor:"#191970",backgroundColor:"#191970",highlightBgColor:"#22308c",borderColor:"#12155a",timerColor:"#ffffff",scrambleColor:"#e0e0e0",rootFont:"'Montserrat',sans-serif",timerFont:"'Montserrat',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#12155a",panelShadowBlur:40,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#191970",gradientEnd:"#12155a",gradientAngle:200,primaryColor: "#799f0c", // green, distinct from highlightBgColor
        buttonHoverColor: "#2a3a8c", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    limeTwist:         {name:"Lime Twist",         panelBackgroundColor:"#a8e063",backgroundColor:"#a8e063",highlightBgColor:"#b4e876",borderColor:"#8fc252",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Atkinson Hyperlegible',sans-serif",timerFont:"'Atkinson Hyperlegible',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#8fc252",panelShadowBlur:25,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#a8e063",gradientEnd:"#b4e876",gradientAngle:45,primaryColor: "#b4e876", // green, distinct from highlightBgColor
        buttonHoverColor: "#c6f7a3", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    berryBlitz:        {name:"Berry Blitz",        panelBackgroundColor:"#8e44ad",backgroundColor:"#8e44ad",highlightBgColor:"#9e5dc1",borderColor:"#782c91",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Inconsolata',cursive",timerFont:"'Inconsolata',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#782c91",panelShadowBlur:30,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#8e44ad",gradientEnd:"#9e5dc1",gradientAngle:60,primaryColor: "#9e5dc1", // purple, distinct from highlightBgColor
        buttonHoverColor: "#a77edb", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    peachBellini:      {name:"Peach Bellini",      panelBackgroundColor:"#ffaf7b",backgroundColor:"#ffaf7b",highlightBgColor:"#ffba99",borderColor:"#e59568",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Barriecito',cursive",timerFont:"'Barriecito',cursive",scrambleFont:"'Lato',sans-serif",mainTextColor:"#ffffff",panelShadowColor:"#e59568",panelShadowBlur:25,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#ffaf7b",gradientEnd:"#ffba99",gradientAngle:35,primaryColor: "#e59568", // orange, distinct from highlightBgColor
        buttonHoverColor: "#ffd1b3", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    goldRush:          {name:"Gold Rush",          panelBackgroundColor:"#d4af37",backgroundColor:"#d4af37",highlightBgColor:"#dbbd4b",borderColor:"#b8952f",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Bytesized',sans-serif",timerFont:"'Bytesized',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#b8952f",panelShadowBlur:30,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#d4af37",gradientEnd:"#dbbd4b",gradientAngle:45,primaryColor: "#b8952f", // gold, distinct from highlightBgColor
        buttonHoverColor: "#e6c86e", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    cobaltDream:       {name:"Cobalt Dream",       panelBackgroundColor:"#004e92",backgroundColor:"#004e92",highlightBgColor:"#275ca9",borderColor:"#003f75",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Montserrat',sans-serif",timerFont:"'Montserrat',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#003f75",panelShadowBlur:35,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#004e92",gradientEnd:"#275ca9",gradientAngle:200,primaryColor: "#8d99ae", // blue gray, distinct from highlightBgColor
        buttonHoverColor: "#3a6ca6", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    emeraldCity:       {name:"Emerald City",       panelBackgroundColor:"#028a0f",backgroundColor:"#028a0f",highlightBgColor:"#1e9f20",borderColor:"#026e0c",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Roboto',sans-serif",timerFont:"'Roboto Slab',serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#026e0c",panelShadowBlur:30,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#028a0f",gradientEnd:"#1e9f20",gradientAngle:45,primaryColor: "#1e9f20", // green, distinct from highlightBgColor
        buttonHoverColor: "#3ad13a", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    plumTwilight:      {name:"Plum Twilight",      panelBackgroundColor:"#5d3a9b",backgroundColor:"#5d3a9b",highlightBgColor:"#6e4db1",borderColor:"#4a307b",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Kablammo',cursive",timerFont:"'Kablammo',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#4a307b",panelShadowBlur:30,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#5d3a9b",gradientEnd:"#6e4db1",gradientAngle:60,primaryColor: "#6e4db1", // purple, distinct from highlightBgColor
        buttonHoverColor: "#7e5dc1", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    turquoiseTide:     {name:"Turquoise Tide",     panelBackgroundColor:"#40e0d0",backgroundColor:"#40e0d0",highlightBgColor:"#51e5d9",borderColor:"#32c4b3",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Open Sans',sans-serif",timerFont:"'Open Sans',sans-serif",scrambleFont:"'Atkinson Hyperlegible',sans-serif",mainTextColor:"#ffffff",panelShadowColor:"#32c4b3",panelShadowBlur:20,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#40e0d0",gradientEnd:"#51e5d9",gradientAngle:45,primaryColor: "#51e5d9", // turquoise, distinct from highlightBgColor
        buttonHoverColor: "#6ff7e6", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    emberGlow:         {name:"Ember Glow",         panelBackgroundColor:"#ff4500",backgroundColor:"#ff4500",highlightBgColor:"#ff5e1a",borderColor:"#cc3900",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Poppins',sans-serif",timerFont:"'Poppins',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#cc3900",panelShadowBlur:40,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#ff4500",gradientEnd:"#ff5e1a",gradientAngle:60,primaryColor: "#ff5e1a", // orange, distinct from highlightBgColor
        buttonHoverColor: "#ff7043", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    graphite:          {name:"Graphite",           panelBackgroundColor:"#4a4a4a",backgroundColor:"#4a4a4a",highlightBgColor:"#555555",borderColor:"#3e3e3e",timerColor:"#ffffff",scrambleColor:"#dddddd",rootFont:"'Inconsolata',monospace",timerFont:"'Inconsolata',monospace",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#3e3e3e",panelShadowBlur:20,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#4a4a4a",gradientEnd:"#555555",gradientAngle:180,primaryColor: "#555555", // gray, distinct from highlightBgColor
        buttonHoverColor: "#6e6e6e", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    ivoryCream:        {name:"Ivory Cream",        panelBackgroundColor:"#fffff0",backgroundColor:"#fffff0",highlightBgColor:"#fefef2",borderColor:"#e6e6d8",timerColor:"#333333",scrambleColor:"#555555",rootFont:"'Helvetica',sans-serif",timerFont:"'Helvetica',sans-serif",scrambleFont:"'Helvetica',sans-serif",mainTextColor:"#333333",panelShadowColor:"#dddddd",panelShadowBlur:10,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#fffff0",gradientEnd:"#fffff0",gradientAngle:0,primaryColor: "#e6e6d8", // cream, distinct from highlightBgColor
        buttonHoverColor: "#f7f7e6", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    raspberry:         {name:"Raspberry",          panelBackgroundColor:"#c72c48",backgroundColor:"#c72c48",highlightBgColor:"#d3445e",borderColor:"#a21f3a",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Birthstone',cursive",timerFont:"'Birthstone',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#a21f3a",panelShadowBlur:30,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#c72c48",gradientEnd:"#d3445e",gradientAngle:45,primaryColor: "#d3445e", // red, distinct from highlightBgColor
        buttonHoverColor: "#e57373", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    duneSand:          {name:"Dune Sand",          panelBackgroundColor:"#c2b280",backgroundColor:"#c2b280",highlightBgColor:"#cbc08f",borderColor:"#a8986b",timerColor:"#3a2f1d",scrambleColor:"#3a2f1d",rootFont:"'Parkinsans',sans-serif",timerFont:"'Parkinsans',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#3a2f1d",panelShadowColor:"#a8986b",panelShadowBlur:25,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#c2b280",gradientEnd:"#cbc08f",gradientAngle:30,primaryColor: "#a8986b", // brown, distinct from highlightBgColor
        buttonHoverColor: "#e6d8b0", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    lavaLava:          {name:"Lava Lava",          panelBackgroundColor:"#cf1020",backgroundColor:"#cf1020",highlightBgColor:"#d7232c",borderColor:"#af0e1c",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Bytesized',sans-serif",timerFont:"'Bytesized',sans-serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#af0e1c",panelShadowBlur:40,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#cf1020",gradientEnd:"#d7232c",gradientAngle:60,primaryColor: "#d7232c", // red, distinct from highlightBgColor
        buttonHoverColor: "#e57373", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    azureSky:          {name:"Azure Sky",          panelBackgroundColor:"#007fff",backgroundColor:"#007fff",highlightBgColor:"#338fff",borderColor:"#0066cc",timerColor:"#ffffff",scrambleColor:"#ffffff",rootFont:"'Roboto',sans-serif",timerFont:"'Roboto Slab',serif",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#ffffff",panelShadowColor:"#0066cc",panelShadowBlur:30,panelShadowSpread:5,gradientEnabled: false,gradientStart:"#007fff",gradientEnd:"#338fff",gradientAngle:200,primaryColor: "#338fff", // blue, distinct from highlightBgColor
        buttonHoverColor: "#66b3ff", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    periwinkle:       {name:"Periwinkle",         panelBackgroundColor:"#ccccff",backgroundColor:"#ccccff",highlightBgColor:"#d0d0ff",borderColor:"#a8a8e6",timerColor:"#333366",scrambleColor:"#333366",rootFont:"'Inconsolata',cursive",timerFont:"'Inconsolata',cursive",scrambleFont:"'Inconsolata',monospace",mainTextColor:"#333366",panelShadowColor:"#a8a8e6",panelShadowBlur:20,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#ccccff",gradientEnd:"#d0d0ff",gradientAngle:45,primaryColor: "#a8a8e6", // purple, distinct from highlightBgColor
        buttonHoverColor: "#e0e0ff", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},
    barleyFair:        {name:"Barley Fair",        panelBackgroundColor:"#f5deb3",backgroundColor:"#f5deb3",highlightBgColor:"#f6dfc2",borderColor:"#dcc7a1",timerColor:"#333333",scrambleColor:"#555555",rootFont:"'Helvetica Neue',sans-serif",timerFont:"'Helvetica Neue',sans-serif",scrambleFont:"'Helvetica Neue',sans-serif",mainTextColor:"#333333",panelShadowColor:"#dddddd",panelShadowBlur:10,panelShadowSpread:0,gradientEnabled: false,gradientStart:"#f5deb3",gradientEnd:"#f5deb3",gradientAngle:0,primaryColor: "#dcc7a1", // brown, distinct from highlightBgColor
        buttonHoverColor: "#f7e6c6", // slightly lighter than highlightBgColor
        secondaryTextColor: "#b0b0b0"},



  };