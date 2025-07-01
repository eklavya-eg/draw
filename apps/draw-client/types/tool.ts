export type Tool = "select" | "draw" | "line" | "arrow" | "box" | "ellipse" | "eraser";

export type Shape = {
    type: "box",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "ellipse",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "line",
    startx: number,
    starty: number,
    endx: number,
    endy: number,
} | {
    type: "draw",
    x: number,
    y: number,
    status: DrawStatus
} | {
    type: "eraser",
    x: number,
    y: number,
    status: DrawStatus
}

export type DrawStatus = "N" | "E";