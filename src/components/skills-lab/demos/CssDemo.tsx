"use client";

import { useState, type CSSProperties } from "react";
import { CodeView, ControlGroup, DemoLayout, Segmented, Slider, Stage, Toggle } from "../primitives";

type Layout = "row" | "column" | "grid";
type Viewport = "mobile" | "desktop";

const ITEMS = ["Leads", "Revenue", "Tickets"];

export default function CssDemo() {
  const [layout, setLayout] = useState<Layout>("grid");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [gap, setGap] = useState(12);
  const [padding, setPadding] = useState(16);
  const [radius, setRadius] = useState(12);
  const [fontSize, setFontSize] = useState(15);
  const [hover, setHover] = useState(true);

  const container: CSSProperties =
    layout === "grid"
      ? { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap }
      : { display: "flex", flexDirection: layout, gap };

  const card: CSSProperties = { padding, borderRadius: radius, fontSize };

  const css = [
    ".cards {",
    ...(layout === "grid"
      ? ["  display: grid;", "  grid-template-columns:", "    repeat(auto-fit, minmax(110px, 1fr));"]
      : ["  display: flex;", `  flex-direction: ${layout};`]),
    `  gap: ${gap}px;`,
    "}",
    ".card {",
    `  padding: ${padding}px;`,
    `  border-radius: ${radius}px;`,
    `  font-size: ${fontSize}px;`,
    ...(hover ? ["  transition: transform .2s ease;", "}", ".card:hover {", "  transform: translateY(-4px);"] : []),
    "}",
  ];

  return (
    <DemoLayout
      simulated={false}
      visual={
        <div className="flex flex-col gap-3">
          <Stage label={`Live preview — ${viewport === "mobile" ? "320px" : "fluid"}`} className="overflow-hidden">
            <div
              className="mx-auto transition-[max-width] duration-300 ease-[var(--ease-out)]"
              style={{ maxWidth: viewport === "mobile" ? 240 : 640 }}
            >
              <div style={container}>
                {ITEMS.map((label, i) => (
                  <div
                    key={label}
                    style={card}
                    className={`min-w-0 border border-border bg-background transition-[transform,border-color,padding,border-radius,font-size] duration-200 ${
                      hover ? "hover:-translate-y-1 hover:border-accent/60" : ""
                    }`}
                  >
                    <div className="font-mono text-[0.7em] text-muted">{label}</div>
                    <div className="font-display font-semibold text-foreground">{[1284, "$42k", 37][i]}</div>
                    <div className="mt-1.5 h-1 rounded-full bg-accent/60" style={{ width: `${[72, 48, 30][i]}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </Stage>
          <CodeView lines={css} label="Generated CSS" />
        </div>
      }
      controls={
        <>
          <ControlGroup label="Layout">
            <Segmented
              label="Layout"
              value={layout}
              onChange={setLayout}
              options={[
                { value: "row", label: "flex row" },
                { value: "column", label: "flex col" },
                { value: "grid", label: "grid" },
              ]}
            />
            <Segmented
              label="Viewport"
              value={viewport}
              onChange={setViewport}
              options={[
                { value: "mobile", label: "mobile" },
                { value: "desktop", label: "desktop" },
              ]}
            />
          </ControlGroup>
          <ControlGroup label="Tokens">
            <Slider label="Gap" value={gap} min={0} max={32} unit="px" onChange={setGap} />
            <Slider label="Padding" value={padding} min={4} max={32} unit="px" onChange={setPadding} />
            <Slider label="Radius" value={radius} min={0} max={28} unit="px" onChange={setRadius} />
            <Slider label="Font size" value={fontSize} min={12} max={22} unit="px" onChange={setFontSize} />
          </ControlGroup>
          <Toggle label="Hover state" hint="lift + accent border" checked={hover} onChange={setHover} />
        </>
      }
    />
  );
}
