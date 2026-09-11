import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

// Load the actual catalog and pure geometry engine from the standalone app.
const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const source = html.slice(html.indexOf('const L ='), html.indexOf('const DAY_MS='));
const { Geometry, BUILDINGS } = new Script(source + '\n;({Geometry, BUILDINGS})').runInNewContext();
const strokes = (b, transform = p => p.slice()) => b.outlines.map(path => ({ layer: 'outline', points: path.map(transform) }));
const close = (a, b) => assert(Math.abs(a - b) < 1e-7, `${a} should equal ${b}`);

for (const building of BUILDINGS) {
  test(`${building.id}: translated/scaled exact outlines still score 100`, () => {
    for (const factor of [0.4, 1, 1.7]) {
      const result = Geometry.evaluate(building, strokes(building, ([x, y]) => [x * factor + 123, y * factor - 217]));
      assert.equal(result.score, 100);
      close(result.deviation, 0);
    }
  });
  test(`${building.id}: different proportions share a baseline without distortion`, () => {
    const reference = Geometry.bounds(building.outlines);
    for (const [sx, sy] of [[1.6, 1], [0.6, 1], [1, 1.5], [1, 0.7]]) {
      const input = strokes(building, ([x, y]) => [x * sx + 91, y * sy - 137]);
      const original = JSON.stringify(input);
      const result = Geometry.evaluate(building, input);
      const user = Geometry.bounds(input.map(s => s.points));
      const fitted = Geometry.bounds(result.fitted.map(s => s.points));
      close(fitted.y1, reference.y1);
      close(fitted.cx, reference.cx);
      close(fitted.w / fitted.h, user.w / user.h);
      // Keep the original uniform scale policy; only the vertical anchor changes.
      close(Math.hypot(fitted.w, fitted.h), Math.hypot(reference.w, reference.h));
      assert(result.score < 100, 'Different proportions must still affect the score');
      assert.equal(JSON.stringify(input), original, 'Scoring must not mutate saved strokes');
      result.fitted.forEach((stroke, i) => stroke.points.forEach(([x, y], j) => {
        close(x, (input[i].points[j][0] - result.fit.ux) * result.fit.scale + result.fit.rx);
        close(y, (input[i].points[j][1] - result.fit.uy) * result.fit.scale + result.fit.ry);
      }));
    }
  });
}

test('A separate lowest silhouette line anchors the whole drawing; details do not', () => {
  const building = { outlines: [[[0, 100], [0, 0], [100, 0], [100, 100], [0, 100]]] };
  const input = [
    { layer: 'outline', points: [[0, 0], [0, 40], [80, 40], [80, 0]] },
    { layer: 'outline', points: [[0, 80], [80, 80]] },
  ];
  const result = Geometry.evaluate(building, input);
  result.fitted[1].points.forEach(p => close(p[1], 100));
  const decorated = Geometry.evaluate(building, [...input, { layer: 'detail', points: [[-700, 900], [1200, 1100]] }]);
  assert.equal(decorated.score, result.score);
  close(decorated.deviation, result.deviation);
  assert.equal(JSON.stringify(decorated.fitted.slice(0, 2)), JSON.stringify(result.fitted));
});

test('A sloping lower edge retains its slope and uses its lowest point', () => {
  const building = { outlines: [[[0, 100], [0, 0], [100, 0], [100, 100], [0, 100]]] };
  const input = [{ layer: 'outline', points: [[0, 90], [0, 0], [80, 0], [80, 100], [0, 90]] }];
  const result = Geometry.evaluate(building, input);
  close(result.fitted[0].points[3][1], 100);
  assert(result.fitted[0].points[0][1] < 100, 'Do not rotate or flatten a sloping base');
});
