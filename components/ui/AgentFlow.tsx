import styles from "./AgentFlow.module.css";

/* ============================================================================
   AGENT FLOW, one diagram language for four agents.
   ============================================================================
   Inline SVG, server-rendered, no library and no client JavaScript. Four
   diagrams drawn by hand would drift apart by the second one; this is a tiny
   layout engine instead, so every agent on the page is drawn by the same
   code and the reader can learn the notation once.

   THE NOTATION IS THREE COLOURS AND IT IS THE WHOLE POINT OF THE PAGE:

     auto    ultramarine outline, paper fill   the automated path
     human   ochre fill, ink text              where a person enters
     flag    flare fill, paper text            an exception, held back

   THOSE ASSIGNMENTS ARE NOT ARBITRARY AND THEY ARE NOT INTERCHANGEABLE. They
   follow the contrast contract in tokens.css: ultramarine is 8.28:1 on paper
   and is a real text colour, so an automated node can be an outline with
   coloured type in it. Ochre is 2.00:1 and can never carry text, so a human
   node is a FILLED field with ink on it. Flare is 3.01:1, large-or-fill only,
   so an exception node is also a field. Reversing any of those would produce
   a label nobody can read.

   A NOTE ON THE BRIEF'S THIRD COLOUR. It asked for "signal" for the flagged
   state, but `--color-signal` in this system IS ultramarine — it is the name
   of the workhorse accent, not of a warning. Using it for exceptions would
   have drawn the flagged branch in the same colour as the automated path it
   is supposed to be diverging from. Flare is the token that actually means
   "one rationed semantic role", and this is it.

   LAYOUT. Nodes carry a column and a row; the engine turns those into a
   grid, measures the labels, and draws connectors between them. A row is used
   two different ways, and the connector tells them apart by direction:

     A BRANCH, when the next row is to the RIGHT. The billing fork: the clean
     path continues straight and the exception drops out of it. That fork is
     the one image on the page that explains the whole method.

     A WRAP, when the next row is to the LEFT. The line has run out of page
     and continues below, the way a line of type does. Competitive Intel is
     six steps and is drawn three wide and two deep for exactly this reason:
     the type on a six-wide diagram cannot be made bigger, because width is
     what is binding and the frame is fixed.

   RESPONSIVE BEHAVIOUR IS SCROLL, NOT SHRINK. A wide diagram scaled into a
   320px viewport produces 4px type. The SVG scales to its container on a
   desktop and the container scrolls below that, which the brief permits by
   name. See AgentFlow.module.css.
   ========================================================================= */

export type FlowKind = "auto" | "human" | "flag";

export type FlowNode = {
  id: string;
  label: string;
  kind: FlowKind;
  /** 0-based position along the line. */
  col: number;
  /** 0 is the main line. 1 hangs below it. */
  row?: number;
};

export type FlowEdge = {
  from: string;
  to: string;
  /** Rendered on the connector: the condition that takes this branch. */
  label?: string;
};

/* --- Geometry, in user units. ONE UNIT IS NO LONGER ONE CSS PIXEL. ------

   The SVG scales to its container now (see AgentFlow.module.css), so these
   are proportions and the rendered size of the type depends on how wide the
   diagram is drawn relative to the page.

   EVERYTHING HERE WENT UP BY ABOUT A SIXTH, AND SO DID THE TYPE, because the
   complaint was that the labels were unreadable and the cause was not the
   font size on its own. A diagram drawn at 932 user units inside a 1282px
   container used to render at 932px: `max-width: 100%` can only ever shrink
   a box, so the two four-node flows were sitting at 73% of the width they
   had available with 350px of the page unused beside them. Growing the type
   without growing the boxes would have overflowed the labels out of them, so
   both moved together and the wrap ratio (CHARS) came down to match.

   COL_W MINUS NODE_W IS THE CONNECTOR GAP, and it has to be wide enough to
   hold a branch label. At 208 the gap was 40 units, and "CLEAN" set
   uppercase and letterspaced is wider than that — so the label overhung the
   node it was pointing at and sat on top of the box. The gap is 84, which
   fits the longest label the notation uses with room either side of it, and
   it is unchanged: both numbers grew by the same amount. */
const COL_W = 280;
const ROW_H = 210;
const NODE_W = 196;
const LINE_H = 19;
const PAD_Y = 20;
const ORDINAL_H = 25;
const CHARS = 18;
/** Room for the wrap connector, which runs outside the boxes on both sides. */
const MARGIN = 28;
/** How far past the source node a branch turns. See the note at the elbow. */
const BEND = 20;

/** Greedy word wrap. SVG has no text wrapping, so the lines are computed. */
function wrap(text: string, max = CHARS): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function nodeHeight(lines: number): number {
  return ORDINAL_H + PAD_Y * 2 + lines * LINE_H;
}

export function AgentFlow({
  nodes,
  edges,
  label,
}: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  /** Describes the diagram for anyone who is not looking at it. */
  label: string;
}) {
  /* Measure first: the canvas is sized by the boxes and the boxes are sized
     by their labels. Nothing here is a hardcoded viewBox.

     EVERY BOX IN A ROW IS THE HEIGHT OF THE TALLEST BOX IN THAT ROW, and
     that is a correctness fix rather than a tidiness one. Sizing each box to
     its own label meant a two-line node and a one-line node beside it had
     different vertical centres, so the connector between them was not
     horizontal — which made the same-row test below fail and drew a stepped
     elbow between two nodes sitting on the same line. Equal heights per row
     make a row an actual row. */
  const wrapped = nodes.map((node, i) => {
    const lines = wrap(node.label);
    return {
      ...node,
      lines,
      ordinal: String(i + 1).padStart(2, "0"),
      row: node.row ?? 0,
      ownHeight: nodeHeight(lines.length),
    };
  });

  const rowHeight = new Map<number, number>();
  for (const node of wrapped) {
    rowHeight.set(
      node.row,
      Math.max(rowHeight.get(node.row) ?? 0, node.ownHeight),
    );
  }

  const measured = wrapped.map((node) => ({
    ...node,
    x: node.col * COL_W,
    y: node.row * ROW_H,
    w: NODE_W,
    h: rowHeight.get(node.row) ?? node.ownHeight,
  }));

  const byId = new Map(measured.map((n) => [n.id, n]));

  const cols = Math.max(...measured.map((n) => n.col)) + 1;
  const rows = Math.max(...measured.map((n) => n.row)) + 1;
  const width = cols * COL_W - (COL_W - NODE_W) + MARGIN * 2;
  const height =
    (rows - 1) * ROW_H + Math.max(...measured.map((n) => n.h)) + MARGIN * 2 + 18;

  return (
    <div className={styles.scroller} data-lenis-prevent>
      <svg
        className={styles.svg}
        viewBox={`${-MARGIN} ${-MARGIN} ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={label}
      >
        {/* One marker per colour: an arrowhead inherits nothing useful from
            its path, so the end of a branch has to be told what it is. */}
        <defs>
          {(["auto", "human", "flag"] as FlowKind[]).map((kind) => (
            <marker
              key={kind}
              id={`arrow-${kind}`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" className={styles[kind]} />
            </marker>
          ))}
        </defs>

        {edges.map((edge) => {
          const a = byId.get(edge.from);
          const b = byId.get(edge.to);
          if (!a || !b) return null;

          /* The connector takes the colour of the node it arrives at, so a
             branch is already the colour of its destination before the
             reader gets there. */
          const kind = b.kind;
          const x1 = a.x + a.w;
          const y1 = a.y + a.h / 2;
          const x2 = b.x;
          const y2 = b.y + b.h / 2;

          /* Straight along a row; a hard-cornered elbow between rows. No
             curves: nothing else on this site has a radius on it.

             THE TEST IS ON `row`, NOT ON THE COMPUTED Y. Comparing the two
             centre points is the same thing only as long as the boxes are
             the same height, which is a coincidence rather than a
             guarantee — and when it broke, a perfectly horizontal run drew
             itself as a step.

             THE BEND IS NEAR THE SOURCE, NOT IN THE MIDDLE OF THE GAP. A
             fork puts two connectors in the same gap, and a mid-gap bend
             put the descending branch's vertical segment through the middle
             of the other branch's label. */
          const sameRow = a.row === b.row;
          const bend = x1 + BEND;

          /* THREE SHAPES, AND THE THIRD ONE IS WHY THIS PAGE'S WIDEST DIAGRAM
             IS READABLE.

             Straight along a row. A hard-cornered elbow between rows when the
             target is to the right, which is the billing fork: the clean path
             continues and the exception drops out of it.

             A SERPENTINE WHEN THE TARGET IS TO THE LEFT, which is a line
             wrapping onto the next row the way a line of type does. Out the
             right of the last node, down to the midpoint, back across, down
             again, and into the left of the first node of the row below. It
             is what lets a six-step flow be drawn three wide and two deep
             rather than six wide: at six columns the diagram was 1604 units
             in a 1282px frame and scaled DOWN to fit, which is the one shape
             where making the type bigger achieves nothing at all. */
          const wraps = !sameRow && x2 < x1;
          const mid = (y1 + a.h / 2 + y2 - b.h / 2) / 2;

          const d = sameRow
            ? `M ${x1} ${y1} L ${x2} ${y2}`
            : wraps
              ? `M ${x1} ${y1} L ${bend} ${y1} L ${bend} ${mid} L ${x2 - BEND} ${mid} L ${x2 - BEND} ${y2} L ${x2} ${y2}`
              : `M ${x1} ${y1} L ${bend} ${y1} L ${bend} ${y2} L ${x2} ${y2}`;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path
                d={d}
                fill="none"
                className={`${styles.edge} ${styles[`stroke-${kind}`]}`}
                markerEnd={`url(#arrow-${kind})`}
              />
              {/* THE LABEL SITS OFF THE LINE, NOT ON IT, and where it goes
                  depends on the shape of the connector. Along a row it
                  centres in the gap and rides above the line. Down an elbow
                  it hangs to the RIGHT of the vertical segment, because
                  centred on it the text would be bisected by its own
                  connector. */}
              {edge.label &&
                (sameRow || wraps ? (
                  <text
                    x={wraps ? (bend + x2 - BEND) / 2 : x1 + (x2 - x1) * 0.64}
                    y={wraps ? mid - 11 : y1 - 11}
                    textAnchor="middle"
                    className={`${styles.edgeLabel} ${styles[`text-${kind}`]}`}
                  >
                    {edge.label}
                  </text>
                ) : (
                  <text
                    x={bend + 9}
                    y={(y1 + y2) / 2 + 4}
                    textAnchor="start"
                    className={`${styles.edgeLabel} ${styles[`text-${kind}`]}`}
                  >
                    {edge.label}
                  </text>
                ))}
            </g>
          );
        })}

        {measured.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              className={`${styles.box} ${styles[`box-${node.kind}`]}`}
            />
            <text
              x={node.x + 14}
              y={node.y + 24}
              className={`${styles.ordinal} ${styles[`on-${node.kind}`]}`}
            >
              {node.ordinal}
            </text>
            {node.lines.map((line, i) => (
              <text
                key={i}
                x={node.x + 14}
                y={node.y + ORDINAL_H + PAD_Y + 4 + i * LINE_H}
                className={`${styles.label} ${styles[`on-${node.kind}`]}`}
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
