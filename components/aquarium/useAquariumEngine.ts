"use client";

import { type RefObject, useEffect, useRef } from "react";
import { FISH } from "@/lib/aquarium/scene-config";
import { contain, flee, stepFish, type FishBody, type Point, type World } from "@/lib/aquarium/simulation";

export function useAquariumEngine(worldRef: RefObject<HTMLDivElement | null>, running: boolean) {
  const simulation = useRef<{ fish: FishBody[]; time: number }>({ fish: [], time: 0 });
  useEffect(() => {
    const element = worldRef.current;
    const shell = element?.closest("main");
    if (!element || !shell) return;
    const nodes = Array.from(element.querySelectorAll<HTMLButtonElement>("[data-fish]"));
    const props = Array.from(element.querySelectorAll<HTMLButtonElement>("[data-prop]"));
    const solids = Array.from(shell.querySelectorAll<HTMLElement>("[data-aquarium-obstacle]"));
    const current = simulation.current;
    let world: World = { width: 1, height: 1, obstacles: [] };
    let bounds = element.getBoundingClientRect();
    let pointer: Point | null = null;
    let calm = false;
    let frame = 0, measureFrame = 0, last = 0;
    let samples = 0, slowFrames = 0;
    let active: number[] = [];
    let animatedProps: HTMLButtonElement[] = [];
    const reactions = new Map<HTMLElement, number>();
    const plantPositions = new Map<HTMLElement, Point>();
    const plantSways = new Map<HTMLElement, number>();
    function paint() {
      active.forEach(index => {
        const fish = current.fish[index], node = nodes[index];
        const angle = Math.max(-22, Math.min(22, fish.vy / Math.max(15, Math.abs(fish.vx)) * 22)) * fish.facing;
        node.style.transform = `translate3d(${fish.x.toFixed(2)}px,${fish.y.toFixed(2)}px,0) translate(-50%,-50%)`;
        node.dataset.positioned = "true";
        node.style.setProperty("--heading", `${angle.toFixed(1)}deg`);
        node.style.setProperty("--facing", `${fish.facing}`);
        const mode = fish.fleeTime > 0 ? "flee" : "cruise";
        if (node.dataset.state !== mode) node.dataset.state = mode;
      });
    }
    function measure() {
      if (!element) return;
      const nextBounds = element.getBoundingClientRect();
      // Hidden/layout-transition surfaces may briefly measure 0–1px. Do not
      // collapse persistent fish coordinates into those temporary dimensions.
      if (nextBounds.width <= 1 || nextBounds.height <= 1) return;
      const previous = world;
      bounds = nextBounds;
      const obstacles = solids.filter(solid => solid.offsetWidth > 0).map(solid => {
        const rect = solid.getBoundingClientRect();
        // The compact mobile form fills the tank width. Keep fish in the reef
        // below it instead of projecting them into the narrow caption gap.
        if (bounds.width <= 700 && solid.dataset.aquariumObstacle === "form") {
          return { x: 0, y: 0, width: bounds.width, height: rect.bottom - bounds.top + 8 };
        }
        return { x: rect.left - bounds.left - 8, y: rect.top - bounds.top - 8, width: rect.width + 16, height: rect.height + 16 };
      }).filter(box => box.y < bounds.height && box.y + box.height > 0);
      world = { width: bounds.width, height: bounds.height, obstacles };
      active = [];
      const sizes = nodes.map(node => node.offsetWidth);
      animatedProps = props.filter(prop => prop.offsetWidth > 0 && ["plant", "fan", "anemone"].includes(prop.dataset.prop ?? ""));
      props.forEach(prop => {
        const rect = prop.getBoundingClientRect();
        plantPositions.set(prop, { x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top });
      });
      FISH.forEach((config, index) => {
        if (!current.fish[index]) {
          const mobileX = [.28, .70, .16, .53, .80, .32, .62, .82];
          const mobileY = [.46, .61, .63, .39, .38, .52, .47, .74];
          const mobile = world.width <= 700 && config.mobile;
          const facing = config.school ? 1 : index % 2 ? -1 : 1;
          current.fish[index] = { x: (mobile ? mobileX[index] : config.x) * world.width, y: (mobile ? mobileY[index] : config.y) * world.height, vx: config.speed * facing, vy: 3, radius: sizes[index] / 2, speed: config.speed, phase: index * 2.3, fleeTime: 0, facing, school: config.school };
        } else if (previous.width > 1) {
          current.fish[index].x *= world.width / previous.width;
          current.fish[index].y *= world.height / previous.height;
        }
        if (!sizes[index]) return;
        current.fish[index].radius = sizes[index] / 2;
        contain(current.fish[index], world);
        active.push(index);
      });
      paint();
    }
    const scheduleMeasure = () => { cancelAnimationFrame(measureFrame); measureFrame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(element); observer.observe(shell);
    solids.forEach(solid => observer.observe(solid));
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "touch") pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    const onLeave = () => { pointer = null; };
    const onFocus = (event?: FocusEvent) => {
      const target = event?.type === "focusout" ? event.relatedTarget : document.activeElement;
      calm = target instanceof Element && Boolean(target.closest('[data-aquarium-obstacle="form"]'));
      element.dataset.calm = String(calm);
    };
    const onClick = (event: MouseEvent) => {
      if (!running || !(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLButtonElement>("[data-fish], [data-prop]");
      if (!target || !element.contains(target)) return;
      const index = nodes.indexOf(target);
      if (index >= 0 && event.detail > 0) flee(current.fish[index], { x: event.clientX - bounds.left, y: event.clientY - bounds.top });
      // Keyboard-focused targets stay still, with equivalent bubble feedback.
      target.dataset.reacting = "true";
      reactions.set(target, current.time + 1.3);
    };
    function tick(timestamp: number) {
      const elapsed = last ? timestamp - last : 0;
      const dt = Math.min(elapsed / 1000, .04);
      last = timestamp; current.time += dt;
      // Reduce actual scene work after sustained slow frames; never oscillate quality.
      if (elapsed > 0 && elapsed < 250 && element && element.dataset.quality !== "low") {
        samples++;
        if (elapsed > 42) slowFrames++;
        if (samples >= 120) {
          if (slowFrames > 72) { element.dataset.quality = "low"; scheduleMeasure(); }
          samples = 0; slowFrames = 0;
        }
      }
      const bodies = active.map(index => current.fish[index]);
      active.forEach(index => {
        if (!nodes[index].matches(":focus-visible")) stepFish(current.fish[index], dt, current.time, world, pointer, bodies, calm);
      });
      animatedProps.forEach(prop => {
        const position = plantPositions.get(prop);
        const distance = pointer && position ? Math.hypot(pointer.x - position.x, pointer.y - position.y) : Infinity;
        const target = pointer && position && distance < 180 && !calm ? (pointer.x - position.x) / 180 * 13 : 0;
        const old = plantSways.get(prop) ?? 0;
        const sway = old + (target - old) * (1 - Math.exp(-5 * dt));
        plantSways.set(prop, sway);
        prop.style.setProperty("--pointer-sway", `${sway.toFixed(2)}deg`);
      });
      reactions.forEach((until, node) => { if (current.time >= until) { delete node.dataset.reacting; reactions.delete(node); } });
      paint();
      frame = requestAnimationFrame(tick);
    }
    measure(); onFocus();
    shell.addEventListener("pointermove", onPointer, { passive: true });
    shell.addEventListener("pointerleave", onLeave);
    shell.addEventListener("focusin", onFocus); shell.addEventListener("focusout", onFocus);
    element.addEventListener("click", onClick);
    window.addEventListener("scroll", scheduleMeasure, { passive: true, capture: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    if (running) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(measureFrame); observer.disconnect();
      shell.removeEventListener("pointermove", onPointer); shell.removeEventListener("pointerleave", onLeave);
      shell.removeEventListener("focusin", onFocus); shell.removeEventListener("focusout", onFocus);
      element.removeEventListener("click", onClick);
      window.removeEventListener("scroll", scheduleMeasure, true); window.removeEventListener("resize", scheduleMeasure);
      reactions.forEach((_, node) => { delete node.dataset.reacting; });
    };
  }, [worldRef, running]);
}
