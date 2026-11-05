const inputs = window.motionInputs ?? {};
const stage = document.querySelector("main");
const one = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const clamp = value => Math.max(0, Math.min(1, value));
const phase = (time, start, duration) => clamp((time - start) / duration);
const ease = value => 1 - (1 - value) ** 3;
const flow = value => value ** 2 * (3 - 2 * value);
const beat = (time, start, duration) => ease(phase(time, start, duration));
const mix = (from, to, value) => from + (to - from) * value;
const set = (element, styles) => Object.assign(element.style, styles);
const copy = (selector, name, fallback) => one(selector).textContent = inputs[name] ?? fallback;
function photos(selector, count) {
  if (inputs.sheet) {
    const image = new URL(inputs.sheet, document.baseURI);
    stage.style.setProperty("--atlas", 'url("' + image.href + '")');
  }
  one(selector).replaceChildren(...Array.from({ length: count }, (_, index) => {
    const tile = document.createElement("div");
    tile.className = "photo";
    tile.style.setProperty("--px", (index % 3) * 50 + "%");
    tile.style.setProperty("--py", Math.floor(index / 3) * 100 + "%");
    return tile;
  }));
}
