import { Plugin } from "chart.js";

export const barShadowPlugin: Plugin<"bar"> = {
  id: "customBarShadow",
  beforeDraw: (chart) => {
    const { ctx, chartArea, scales } = chart;
    const meta = chart.getDatasetMeta(0); // Assuming one dataset

    // Set shadow properties
    ctx.save();
    ctx.shadowColor = "rgba(32, 41, 58, 0.9)"; // Adjust color and opacity
    ctx.shadowBlur = 0; // Adjust blur amount
    ctx.shadowOffsetX = 8; // Adjust horizontal shadow offset
    ctx.shadowOffsetY = 5; // Adjust vertical shadow offset

    // Iterate through each bar and apply the shadow
    // biome-ignore lint/complexity/noForEach: <explanation>
    meta.data.forEach((bar) => {
      if (bar?.width && bar?.height) {
        const { x, y, base } = bar;
        const barWidth = bar?.width;
        const barHeight = Math.abs(base - y);

        // Draw a rectangle as shadow behind the actual bar
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
      }
    });

    ctx.restore();
  },
};
