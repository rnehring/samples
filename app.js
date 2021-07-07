gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(ScrollTrigger);
const master = gsap.timeline();
const ball = gsap.timeline();
const ballcheck = gsap.timeline();
const plug = gsap.timeline();
const bullseye = gsap.timeline();
const butterfly = gsap.timeline();
const sightglass = gsap.timeline();
const check = gsap.timeline();
const strainer = gsap.timeline();
const valvebg = gsap.timeline();
const chemtitelogo = gsap.timeline();
const hillslogo = gsap.timeline();
const hoverState = gsap.timeline();
const container = document.getElementById("animation");
const width = container.offsetWidth;
const height = container.offsetHeight;
let left = width / 2;
let middle = height / 2;
const valves = document.getElementsByClassName("valve");
const valveheadings = document.getElementsByClassName("valveheadings");
const masterState = [];
let animating = 0;

let cards = document.querySelectorAll(".valve-card");
let newsItems = document.querySelectorAll(".news-item");
let about = document.querySelectorAll(".about-us-inside")
let bottomLogo = document.querySelectorAll(".footer-logo");

cards.forEach((element) => {
  let tl = gsap.timeline().from(element, { left: -1000, opacity: 0, duration: 1 });
  ScrollTrigger.create({
    trigger: element,
    start: "top 90%",
    toggleActions: "play none none reverse",
    animation: tl,
  });
});

newsItems.forEach((element) => {
  let tl = gsap.timeline().from(element, { left: 1000, opacity: 0, duration: 1 });
  ScrollTrigger.create({
    trigger: element,
    start: "top 90%",
    toggleActions: "play none none reverse",
    animation: tl,
  });
});

let tl2 = gsap.timeline().from(about, { left: 1000, duration: 1 });
ScrollTrigger.create({
  trigger: about,
  start: "top 90%",
  toggleActions: "play none none reverse",
  animation: tl2,
});

let tl3 = gsap.timeline().from(bottomLogo, { top: -150, opacity: 0, duration: .5 });
ScrollTrigger.create({
  trigger: bottomLogo,
  start: "bottom 100%",
  toggleActions: "play none none reverse",
  animation: tl3,
});



function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top,
    right: box.right,
    bottom: box.bottom,
    left: box.left,
  };
}


function getMasterState(){
  elements = gsap.utils.toArray(".master-state");
  elements.forEach(function (value, i) {
    let state = {
      animatedItem: value,
      y: gsap.getProperty(value, "y"),
      width: Math.ceil(gsap.getProperty(value, "width")),
      height: gsap.getProperty(value, "height"),
      x: gsap.getProperty(value, "x"),
      opacity: gsap.getProperty(value, "opacity"),
      scale: gsap.getProperty(value, "scale"),
      top: gsap.getProperty(value, "top"),
      left: gsap.getProperty(value, "left"),
    };
    masterState.push(state);
  });
  console.log(masterState);
}


function loadMasterState(){
  gsap.to(".right-window",{opacity:0});
  gsap.to(".chemtite-title",{opacity:0});
  gsap.to("#back", { opacity: 0 });
  gsap.to("#back", { x: "-100%" });

  let elem = document.getElementById("right-window");
  elem.parentNode.removeChild(elem);
  let elem2 = document.getElementById("chemtite-title");
  elem2.parentNode.removeChild(elem2);
  let targets = gsap.utils.toArray(".valve");
  gsap.set(targets, { pointerEvents: "auto" });
  masterState.forEach(function (value,i){
    gsap.to(value.animatedItem, {
      x:value.x,
      y:value.y,
      opacity:value.opacity,
      scale:value.scale,
      width:value.width,
      height:value.height,
      top:value.top,
      left:value.left
    })
  })
}


function getPosition(target) {
  let targetWidth = target.offsetWidth;
  let targetHeight = target.offsetHeight;
  let leftOffset = (width - targetWidth) / 2;
  let topOffset = (height - targetHeight) / 2;
  return {
    x: leftOffset,
    y: topOffset,
  };
}


function fadeValves(event) {
  var targets = gsap.utils.toArray(".valve");
  const index = targets.indexOf(event.target);
  if (index > -1) {
    targets.splice(index, 1);
  }
  gsap.to(targets, {
    opacity: 0,
  });
  gsap.set(targets, { pointerEvents: "none" });
  gsap.to(".valveheadings", {
    opacity: 0,
  });
  gsap.to(".hillslogo", {
    scale: 0.29,
    top: -76,
    left: 1945,
  });
  return true;
}


function detailView(event) {
  fadeValves(event);
  // let backButton = document.querySelector("#back");
  gsap.to("#back",{x:0})
  gsap.to("#back",{opacity: 1})
  let backgroundBox = gsap.to("#svgWrapper", {
    duration: 0.5,
    x: -1900,
    y: -300,
    width: 600,
    height: 550,
    ease: "none",
  });

  backgroundBox.progress(1);

  let bg = document.getElementById("svgWrapper");

  delta = MotionPathPlugin.getRelativePosition(
    bg,
    event.target,
    [0.5, 0.5],
    [0.5, 0.5]
  );
  backgroundBox.progress(0);

  gsap.to(".chemtitelogo", {
    x: "-=560",
    y: "-=50",
    scale: 0.5,
  });

  gsap.to(event.target, {
    scale: 1,
    x: "-=" + delta.x,
    y: "-=" + delta.y,
    duration: 0.5,
    ease: "power1",
  });

  let rightWindow = document.createElement("div");
  rightWindow.className = "right-window";
  rightWindow.id = "right-window";
  animation.appendChild(rightWindow);

  let title = document.createElement("h2");
  title.innerText = event.target.dataset.title;
  title.className = "chemtite-title";
  title.id = "chemtite-title";
  title.classList.add("valveheadings-sm");
  animation.appendChild(title);

  let data = event.target.dataset.content;
  let content = document.createRange().createContextualFragment(data);
  rightWindow.appendChild(content);

  $("#chartcontainer").highcharts({
    title: {
      text: "Pressure Temperature Curve",
      x: -20, //center
    },
    subtitle: {
      text: "",
      x: -20,
    },
    xAxis: {
      title: {
        text: "Temperature (Degrees F)",
      },
    },
    yAxis: {
      title: {
        text: "Pressure (PSIG)",
      },
      plotLines: [
        {
          value: 0,
          width: 1,
          color: "#808080",
        },
      ],
    },
    tooltip: {
      valueSuffix: " PSIG",
    },
    legend: {
      layout: "vertical",
      align: "center",
      verticalAlign: "bottom",
      borderWidth: 0,
    },
    plotOptions: {
      series: {
        color: "#FF0000",
      },
    },
    series: [
      {
        name: "Pressure / Temperature Curve",
        data: [
          [-20.0, 250.0],
          [-10.0, 250.0],
          [0.0, 250.0],
          [50.0, 250.0],
          [100.0, 250.0],
          [150.0, 230.0],
          [200.0, 210.0],
          [250.0, 185.0],
          [300.0, 160.0],
          [350.0, 140.0],
          [400.0, 120.0],
        ],
      },
    ],
  });

  gsap.from(".right-window", {
    left: 0,
    opacity: 0,
    autoAlpha: 1
  }); 

  gsap.to(".chemtite-title",{
    opacity: 1,
    left: 790,
    top: 21,
    autoAlpha:1
  })
}

function animationFlag(){
  animating = 0;
  console.log(animating);
}

function playHoverState(event) {
    if (event.type == "mouseenter") {
      toScale = "+=.1";
    } 
    if (event.type == "mouseleave") {
      toScale = "-=.1";
    }

    gsap.to(event.target, {
      scale: toScale,
      duration: 0.2,
      overwrite: "auto",
      onComplete: animationFlag
    });
  
}

function setEventHandlers(){
  let targets = gsap.utils.toArray(".valve");
  gsap.set(targets, { pointerEvents: "auto" });
  document.querySelectorAll(".valve").forEach((item) => {
    item.addEventListener("mouseenter", (event) => {
        playHoverState(event);
    });
  });

  document.querySelectorAll(".valve").forEach((item) => {
    item.addEventListener("mouseleave", (event) => {
        playHoverState(event);
    });
  });

  document.querySelectorAll(".valve").forEach((item) => {
    item.addEventListener("click", (event) => {
      detailView(event);
    });
  });
}

function init() {
  let targets = gsap.utils.toArray(".valve");
  gsap.set(targets, { pointerEvents: "none" });
  gsap.set("#back", { x: "-100%" });



  for (var i = 0; i < valveheadings.length; i++) {
    let coords = getPosition(valveheadings.item(i));
    gsap.set(valveheadings.item(i), {
      left: coords.x,
      top: 800,
    });
  }

  for (var i = 0; i < valves.length; i++) {
    let coords = getPosition(valves.item(i));
    gsap.set(valves.item(i), {
      opacity: 0,
      left: coords.x,
      top: -800,
    });
  }

  gsap.set(".hillslogo", { left: 2000 });

  let posParam = "<-.5";
  let posParam2 = "<.5";

  ball
    .to(".ball", {
      y: 900,
      opacity: 1,
      duration: 0.5,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".ballheading",
      {
        y: -400,
        opacity: 1,
        ease: "back",
        autoAlpha: 1,
        duration: 0.5,
      },
      posParam
    )
    .to(
      ".ballheading",
      {
        x: -1000,
        opacity: 0,
        duration: 0.2,
        delay: 1,
      },
      posParam2
    )
    .to(".ball", {
      x: -800,
      y: 1100,
      scale: 0.5,
      duration: 0.3,
    });

  butterfly
    .to(".butterfly", {
      y: 900,
      opacity: 1,
      duration: 0.5,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".butterflyheading",
      {
        y: -400,
        opacity: 1,
        ease: "back",
        autoAlpha: 1,
        duration: 0.5,
      },
      posParam
    )
    .to(
      ".butterflyheading",
      {
        x: 2000,
        opacity: 0,
        duration: 0.2,
        delay: 1,
      },
      posParam2
    )
    .to(".butterfly", {
      x: 820,
      y: 1100,
      scale: 0.5,
      duration: 0.3,
    });

  check
    .to(".check", {
      y: 900,
      opacity: 1,
      duration: 0.5,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".checkheading",
      {
        y: -400,
        opacity: 1,
        ease: "back",
        autoAlpha: 1,
        duration: 0.5,
      },
      posParam
    )
    .to(
      ".checkheading",
      {
        x: -1000,
        opacity: 0,
        duration: 0.2,
        delay: 1,
      },
      posParam2
    )
    .to(".check", {
      x: -580,
      y: 1100,
      scale: 0.48,
      duration: 0.3,
    });

  plug
    .to(".plug", {
      y: 900,
      opacity: 1,
      duration: 0.5,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".plugheading",
      {
        y: -400,
        opacity: 1,
        ease: "back",
        autoAlpha: 1,
        duration: 0.5,
      },
      posParam
    )
    .to(".plugheading", {
      x: 2000,
      opacity: 0,
      duration: 0.2,
      delay: 1
    },
    posParam2
    )
    .to(".plug", {
      x: 590,
      y: 1100,
      scale: 0.5,
      duration: 0.3,
    });

  bullseye
    .to(".bullseye", {
      y: 900,
      opacity: 1,
      duration: 0.5,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".bullseyeheading",
      {
        y: -400,
        opacity: 1,
        ease: "back",
        autoAlpha: 1,
        duration: .5,
      },
      posParam
    )
    .to(".bullseyeheading", {
      x: -1000,
      opacity: 0,
      duration: 0.2,
      delay: 1
    },
    posParam2)
    .to(".bullseye", {
      x: -380,
      y: 1100,
      scale: 0.45,
      duration: 0.3,
    });

  strainer
    .to(".strainer", {
      y: 900,
      opacity: 1,
      duration: 0.5,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".strainerheading",
      {
        y: -400,
        opacity: 1,
        ease: "back",
        autoAlpha: 1,
        duration: .5,
      },
      posParam
    )
    .to(".strainerheading", {
      x: 2000,
      opacity: 0,
      duration: 0.2,
      delay: 1
    },
    posParam2)
    .to(".strainer", {
      x: 340,
      y: 1110,
      scale: 0.42,
      duration: 0.3,
    });

  ballcheck
    .to(".ballcheck", {
      y: 900,
      opacity: 1,
      duration: 0.5,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".ballcheckheading",
      {
        y: -400,
        opacity: 1,
        ease: "back",
        autoAlpha: 1,
        duration: .5
      },
      posParam
    )
    .to(".ballcheckheading", {
      x: -1000,
      opacity: 0,
      duration: 0.2,
      delay: 1
    }, posParam2)
    .to(".ballcheck", {
      x: -150,
      y: 1100,
      scale: 0.42,
      duration: 0.3,
    });

  sightglass
    .to(".sightglass", {
      y: 900,
      opacity: 1,
      duration: 0.5,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".sightglassheading",
      {
        y: -400,
        opacity: 1,
        ease: "back",
        autoAlpha: 1,
        duration: .5,
      },
      posParam
    )
    .to(".sightglassheading", {
      x: 2000,
      opacity: 0,
      duration: 0.2,
      delay: 1
    },
    posParam2)
    .to(".sightglass", {
      x: 110,
      y: 1100,
      scale: 0.45,
      duration: 0.3,
    });

  valvebg.to("#svgWrapper", {
    x: -1980,
    ease: "back",
    autoAlpha: 1,
    duration: 0.7,
  });

  let coords = getPosition(document.getElementsByClassName("chemtitelogo")[0]);

  gsap.set(".chemtitelogo", {
    opacity: 0,
    left: coords.x,
    top: -800,
  });

  chemtitelogo
    .to(".chemtitelogo", {
      y: 850,
      opacity: 1,
      duration: 1,
      ease: "back",
      autoAlpha: 1,
    })
    .to(
      ".finestheading",
      {
        y: -620,
        autoAlpha: 1,
        ease: "back",
      },
      "-=.25"
    )
    .to(
      ".bubbleheading",
      {
        y: -540,
        ease: "back",
        autoAlpha: 1,
      },
      "-=.25"
    )
    .to(".hillslogo", {
      x: -700,
      ease: "back",
      autoAlpha: 1,
      scale: 0.4,
      opacity: 1,
    });

  master
    .add(ball)
    .add(butterfly)
    .add(check)
    .add(plug)
    .add(bullseye)
    .add(strainer)
    .add(ballcheck)
    .add(sightglass)
    .add(valvebg)
    .add(chemtitelogo)
    .addLabel("mainState","+=.5")
    .call(setEventHandlers)
    .call(getMasterState)
    .timeScale(2);

  document.getElementById("back").addEventListener("click", function () {
    loadMasterState()
  });
 }


window.addEventListener("load", (event) => {

    let navItems = gsap.utils.toArray(".nav li");
    let currentItem = navItems[0];

    function initNav() {
      gsap.set(".line", {
        x: currentItem.offsetLeft,
        width: currentItem.clientWidth,
      });
    }

    navItems.forEach((element, index) => {
      element.addEventListener("mouseenter", function () {
        gsap.to(".line", {
          duration: 0.3,
          overwrite: true,
          x: element.offsetLeft,
          width: element.clientWidth,
        });
        currentItem = element;
      });
    });

    window.addEventListener("resize", initNav);

    initNav();

    gsap.to(".line", { autoAlpha: 1, duration: 0.2 });



  init();
});




