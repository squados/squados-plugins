(() => {
  const width = 1920;
  const height = 1080;
  const background = [20, 17, 25];
  const header = 56;
  const defaultTiming = { enter: [.04, .84], exit: [4.31, 4.96] };

  function curve(time, start, end) {
    const u = Math.max(0, Math.min(1, (time - start) / (end - start)));
    return u ** 3 * (10 + u * (-15 + 6 * u));
  }

  function sample(time, config, source) {
    const { side = 'right', travel = 430, baseScale = 1, timing = defaultTiming, scroll } = config;
    const { enter, exit } = timing;
    const [enterFrom, enterTo] = enter;
    const [exitFrom, exitTo] = exit;
    const opposite = side === 'left';
    const cameraAmount = curve(time, enterFrom, enterTo - .07) * (1 - curve(time, exitFrom + .09, exitTo));
    const panelAmount = curve(time, enterFrom + .11, enterTo) * (1 - curve(time, exitFrom, exitTo - .08));
    const shift = travel * cameraAmount;
    const cameraX = width * (1 - baseScale) / 2 + (opposite ? shift : -shift);
    const cameraY = 395 * (1 - baseScale);
    const shadeStart = width - 1090 * cameraAmount;
    const shadeEnd = Math.max(shadeStart + 1, width * (1 + baseScale) / 2 - shift - 21 * cameraAmount);
    const viewportHeight = scroll?.height ?? source.height;
    const ratio = Math.min(928 / source.width, 758 / viewportHeight);
    const panelWidth = source.width * ratio;
    const panelHeight = viewportHeight * ratio;
    const rightX = width - 72 - panelWidth + (panelWidth + 103) * (1 - panelAmount);
    const scrollTop = scroll ? scroll.to * curve(time, ...scroll.at) : 0;
    const focus = scroll?.target;
    const highlight = focus ? {
      x: focus.x * ratio,
      y: (focus.y - scrollTop) * ratio,
      width: focus.width * ratio,
      height: focus.height * ratio,
      opacity: curve(time, scroll.highlightAt, scroll.highlightAt + .22),
    } : null;

    return {
      camera: { x: cameraX, y: cameraY, scale: baseScale, amount: cameraAmount },
      shade: { from: shadeStart, to: shadeEnd, opposite },
      panel: {
        x: opposite ? width - rightX - panelWidth : rightX,
        y: (height - header - panelHeight) / 2,
        width: panelWidth, height: panelHeight, ratio, amount: panelAmount,
        scroll: scrollTop * ratio, highlight,
      },
    };
  }

  const scene = { width, height, background, header, defaultTiming, sample };
  if (typeof module === 'object' && module.exports) module.exports = scene;
  else window.sideDetail = scene;
})();
