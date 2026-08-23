/**
 * The two pure-CSS cube pieces the client selected from freefrontend.com's
 * css-cubes collection. Both are markup and CSS only — the geometry and the
 * motion live in globals.css under "css cubes". Neither takes a prop, because
 * neither has anything to configure: they are ornament, and they are marked
 * `aria-hidden` so a screen reader never has to walk a bag of empty divs.
 */

/** "Cube Grid (Pure CSS)" — a 4x4 isometric field rising in a diagonal wave. */
export function CubeGrid({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`grid place-items-center ${className}`}>
      <div className="cube-grid">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="cube" />
        ))}
      </div>
    </div>
  );
}

/**
 * "CSS Only Cubes Hover Effects" — three offset columns of isometric cubes
 * that light coral under the pointer and cool back down slowly behind it.
 *
 * The nested loop mirrors the original pen: three groups, each of three
 * columns placed at x = -1, 0, 1, each holding three stacked faces whose
 * `--i` sets their stacking order so a lit cube reads in front of its
 * neighbours rather than behind them.
 */
export function CubeStack({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`grid place-items-center ${className}`}>
      <div className="cube-stack-frame">
        <div className="cube-stack">
          {[0, 1, 2].map((group) => (
            <div key={group} className="cube-col">
              {[-1, 0, 1].map((x) => (
                <div key={x} style={{ "--x": x, "--y": 0 } as React.CSSProperties}>
                  {[3, 2, 1].map((i) => (
                    <span
                      key={i}
                      className="cube-face"
                      style={{ "--i": i } as React.CSSProperties}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
