import React from "react";
import dynamic from "next/dynamic";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

const PillCanvas = () => {
  let labels = [
    "Community", "UNN Chapter", "Make Impact", "Connect", 
    "The Network", "Cyber Security", "Build", "Google Tech", 
    "Open Source", "Design", "Code", "Write"
  ];

  let pills = [];
  let gravity = 0.2;
  let friction = 0.98;
  let airResistance = 0.99;
  let p5Instance = null;
  let isMousePressed = false;

  // Calculate responsive scale factor based on screen width
  function getScaleFactor(width) {
    if (width <= 640) {
      // Mobile: scale down to 0.7
      return 0.7;
    } else if (width <= 768) {
      // Small tablets: scale to 0.85
      return 0.85;
    } else if (width <= 1024) {
      // Tablets: scale to 0.9
      return 0.9;
    }
    // Desktop: full size
    return 1.0;
  }

  // Get labels to display based on screen width (fewer pills on smaller screens)
  function getLabelsForScreen(width) {
    if (width <= 640) {
      // Mobile: show 6 pills
      return labels.slice(0, 6);
    } else if (width <= 768) {
      // Small tablets: show 8 pills
      return labels.slice(0, 8);
    } else if (width <= 1024) {
      // Tablets: show 10 pills
      return labels.slice(0, 10);
    }
    // Desktop: show all pills
    return labels;
  }

  function setup(p5, canvasParentRef) {
    pills = [];
    p5Instance = null;
    p5Instance = p5;
    const parentWidth = canvasParentRef.offsetWidth || p5.windowWidth;
    const parentHeight = canvasParentRef.offsetHeight || p5.windowHeight;
    const canvas = p5.createCanvas(parentWidth, parentHeight);
    canvas.parent(canvasParentRef);
    canvas.elt.style.backgroundColor = 'transparent';
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.angleMode(p5.DEGREES);

    const scale = getScaleFactor(parentWidth);
    const labelsToShow = getLabelsForScreen(parentWidth);
    for (let i = 0; i < labelsToShow.length; i++) {
      pills.push(new Pill(labelsToShow[i], p5, i, labelsToShow.length, scale));
    }
  }

  function draw(p5) {
    p5.clear();

    // Handle pill-to-pill collisions
    for (let i = 0; i < pills.length; i++) {
      for (let j = i + 1; j < pills.length; j++) {
        checkPillCollision(pills[i], pills[j], p5);
      }
    }

    for (let p of pills) {
      let mousePos = p5.createVector(p5.mouseX, p5.mouseY);
      let distToMouse = p5.dist(p.pos.x + p.w / 2, p.pos.y + p.h / 2, mousePos.x, mousePos.y);
      let underMouse =
        distToMouse < p.mouseSensitivity &&
        p5.mouseX >= 0 && p5.mouseX <= p5.width &&
        p5.mouseY >= 0 && p5.mouseY <= p5.height;

      p.update(p5, underMouse, mousePos, distToMouse, isMousePressed);
      p.display(p5);
    }
  }

  function checkPillCollision(pill1, pill2, p5) {
    // Center positions
    let center1 = p5.createVector(pill1.pos.x + pill1.w / 2, pill1.pos.y + pill1.h / 2);
    let center2 = p5.createVector(pill2.pos.x + pill2.w / 2, pill2.pos.y + pill2.h / 2);

    // Minimum collision distance
    let minDist = (pill1.w + pill2.w) / 3.7;
    let diff = p5.createVector(center2.x - center1.x, center2.y - center1.y);
    let dist = diff.mag();

    if (dist < minDist) {
      // Push apart on overlap
      let overlap = minDist - dist;
      if (dist !== 0) diff.normalize();
      let push = diff.copy().mult(overlap * 0.5);

      pill1.acc.sub(push);
      pill2.acc.add(push);
      // For extra effect, you may add random rotation here
    }
  }

  function mousePressed(p5) {
    isMousePressed = true;
  }

  function mouseReleased(p5) {
    isMousePressed = false;
  }

  class Pill {
    constructor(txt, p5, index = 0, total = 1, scale = 1.0) {
      this.txt = txt;
      this.scale = scale;
      
      // Set text size first to calculate proper width
      const baseTextSize = 16;
      p5.textSize(baseTextSize * scale);
      const textPadding = 100 * scale;
      this.w = p5.textWidth(txt) + textPadding;
      this.h = 45 * scale;

      const spacing = p5.width / (total + 1);
      const baseX = spacing * (index + 1);
      const randomOffset = p5.random(-spacing * 0.3, spacing * 0.3);
      const startX = p5.constrain(
        baseX + randomOffset,
        this.w / 2,
        p5.width - this.w / 2
      );

      this.pos = p5.createVector(startX, p5.random(-800, -200));
      this.vel = p5.createVector(p5.random(-0.5, 0.5), 0);
      this.acc = p5.createVector(0, 0);
      this.rot = p5.random(-15, 15);
      this.rotVel = p5.random(-0.5, 0.5);
      this.isResting = false;

      this.mouseSensitivity = p5.random(100, 200) * scale;
      this.mouseForceMultiplier = p5.random(1, 3);
      this.mouseResponseAngle = p5.random(-15, 15);
    }

    update(p5, underMouse = false, mousePos = null, distToMouse = null, mousePressed = false) {
      // No update if resting and not under mouse
      if (this.isResting && !underMouse) {
        this.vel.mult(0);
        this.rotVel = 0;
        this.acc.mult(0);
        return;
      }

      if (underMouse && mousePos && distToMouse !== null) {
        this.isResting = false;
        
        let pillCenterX = this.pos.x + this.w / 2;
        let pillCenterY = this.pos.y + this.h / 2;
        
        if (mousePressed || distToMouse < 50) {
          let pushForce = p5.createVector(pillCenterX - mousePos.x, pillCenterY - mousePos.y);
          let forceStrength = p5.map(
            distToMouse,
            0,
            Math.min(50, this.mouseSensitivity),
            0.15 * this.mouseForceMultiplier,
            0
          );
          
          if (pushForce.mag() > 0) {
            pushForce.normalize();
            pushForce.mult(forceStrength);
            
            let angle = p5.atan2(pushForce.y, pushForce.x) + p5.radians(this.mouseResponseAngle);
            pushForce.x = p5.cos(angle) * forceStrength;
            pushForce.y = p5.sin(angle) * forceStrength;
            
            this.acc.add(pushForce);
          }
          
          this.rotVel += p5.random(-0.5, 0.5) * this.mouseForceMultiplier;
        } else {
          let pushForce = p5.createVector(pillCenterX - mousePos.x, pillCenterY - mousePos.y);
          let forceStrength = p5.map(
            distToMouse,
            0,
            this.mouseSensitivity,
            3 * this.mouseForceMultiplier,
            0
          );
          pushForce.normalize();
          pushForce.mult(forceStrength);
          this.acc.add(pushForce);
          this.rotVel += p5.random(-1, 1) * this.mouseForceMultiplier;
        }
      }

      if (!this.isResting) {
        this.acc.y += gravity;
      }

      this.vel.add(this.acc);
      this.vel.mult(friction * airResistance);
      this.pos.add(this.vel);
      this.rot += this.rotVel;
      this.rotVel *= 0.98;
      this.acc.mult(0);

      // Floor collision
      let floorY = p5.height - (this.h + 25);
      if (this.pos.y >= floorY) {
        this.pos.y = floorY;
        this.vel.y *= -0.3;
        
        if (p5.abs(this.vel.y) < 0.2 && p5.abs(this.vel.x) < 0.5 && !underMouse) {
          this.vel.y = 0;
          this.vel.x *= 0.95;
          this.isResting = true;
          this.rotVel *= 0.95;
        } else {
          this.isResting = false;
        }
      }

      // Wall collisions
      if (this.pos.x < 0) {
        this.pos.x = 0;
        this.vel.x *= -0.6;
      } else if (this.pos.x > p5.width - this.w) {
        this.pos.x = p5.width - this.w;
        this.vel.x *= -0.6;
      }

      // Damp motion if resting
      if (this.isResting) {
        this.rotVel *= 0.9;
        this.vel.x *= 0.9;
        if (p5.abs(this.rotVel) < 0.1) this.rotVel = 0;
        if (p5.abs(this.vel.x) < 0.1) this.vel.x = 0;
      }
    }

    display(p5) {
      p5.push();
      p5.rectMode(p5.CENTER);
      p5.angleMode(p5.DEGREES);
      p5.translate(this.pos.x + this.w / 2, this.pos.y + this.h / 2);
      p5.rotate(this.rot);

      // Drop shadow
      const borderRadius = 25 * this.scale;
      const shadowOffset = 2 * this.scale;
      p5.noStroke();
      p5.fill(0, 0, 0, 20);
      p5.rect(shadowOffset, shadowOffset, this.w, this.h, borderRadius);

      // Pill shape
      p5.stroke(200);
      p5.strokeWeight(1 * this.scale);
      p5.fill(240);
      p5.rect(0, 0, this.w, this.h, borderRadius);

      // Left icon (circle with 'X')
      const iconSize = 16 * this.scale;
      const iconOffset = 20 * this.scale;
      const iconLineOffset = 4 * this.scale;
      p5.stroke(150);
      p5.strokeWeight(1.5 * this.scale);
      p5.noFill();
      p5.ellipse(-this.w / 2 + iconOffset, 0, iconSize, iconSize);
      p5.line(-this.w / 2 + iconOffset - iconLineOffset, -iconLineOffset, -this.w / 2 + iconOffset + iconLineOffset, iconLineOffset);
      p5.line(-this.w / 2 + iconOffset - iconLineOffset, iconLineOffset, -this.w / 2 + iconOffset + iconLineOffset, -iconLineOffset);

      // Label text
      p5.noStroke();
      p5.fill(80);
      p5.textSize(16 * this.scale);
      p5.textAlign(p5.LEFT, p5.CENTER);
      p5.text(this.txt, -this.w / 2 + 45 * this.scale, 0);
      
      p5.pop();
    }
  }

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mousePressed={mousePressed}
      mouseReleased={mouseReleased}
      windowResized={(p5) => {
        const parent = p5.canvas?.parentElement;
        if (parent) {
          const newWidth = parent.offsetWidth;
          const newHeight = parent.offsetHeight;
          p5.resizeCanvas(newWidth, newHeight);
          
          // Get new scale and labels for current screen size
          const newScale = getScaleFactor(newWidth);
          const newLabels = getLabelsForScreen(newWidth);
          const currentScale = pills.length > 0 ? pills[0].scale : 1.0;
          const currentCount = pills.length;
          
          // Recreate pills if scale changed significantly OR number of pills should change
          const scaleChanged = Math.abs(newScale - currentScale) > 0.1;
          const countChanged = newLabels.length !== currentCount;
          
          if (scaleChanged || countChanged) {
            pills = [];
            for (let i = 0; i < newLabels.length; i++) {
              pills.push(new Pill(newLabels[i], p5, i, newLabels.length, newScale));
            }
          }
        }
      }}
    />
  );
};

export default PillCanvas;