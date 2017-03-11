// @flow weak
/* eslint-env mocha */

import React, { Component } from 'react';
import { jsdom } from 'jsdom';
import { assert } from 'chai';
import { render } from 'react-dom';
import transition from './transition';

const DURATION = 500;
const DELAY = 500;

class Test extends Component {
  componentDidMount() {
    transition.call(this, {
      line: {
        x1: [5, 200],
        y1: [5, 400],
      },
      rect: {
        x: [5, 1000],
        y: [5, 2000],
      },
      timing: { duration: DURATION },
    });

    transition.call(this, {
      path: {
        opacity: [1e-6, 0.8],
        fill: 'tomato',
      },
      timing: { duration: DURATION, delay: DELAY },
    });
  }

  render() {
    return (
      <g>
        <line
          ref={(d) => { this.line = d; }}
          id="my-line"
          x1={0} y1={0}
        />
        <rect
          ref={(d) => { this.rect = d; }}
          id="my-rect"
          x={0} y={0}
        />
        <path
          ref={(d) => { this.path = d; }}
          id="my-path"
          x={0} y={0}
        />
      </g>
    );
  }
}

describe('transition', () => {
  it('should change attributes on refs over time', (done) => {
    const root = jsdom('');
    const body = root.body;
    const container = root.createElement('div');
    body.appendChild(container);

    render(<Test />, container);
    const line = root.getElementById('my-line');

    setTimeout(() => {
      assert.strictEqual(+line.getAttribute('x1'), 200, 'should be equal');
      assert.strictEqual(+line.getAttribute('y1'), 400, 'should be equal');
      done();
    }, DURATION * 1.1);
  });

  it('should transition multiple refs', (done) => {
    const root = jsdom('');
    const body = root.body;
    const container = root.createElement('div');
    body.appendChild(container);

    render(<Test />, container);
    const rect = root.getElementById('my-rect');
    const line = root.getElementById('my-line');

    setTimeout(() => {
      assert.strictEqual(+rect.getAttribute('x'), 1000, 'should be equal');
      assert.strictEqual(+rect.getAttribute('y'), 2000, 'should be equal');

      assert.strictEqual(+line.getAttribute('x1'), 200, 'should be equal');
      assert.strictEqual(+line.getAttribute('y1'), 400, 'should be equal');

      done();
    }, DURATION * 1.1);
  });

  it('should set the initial value immediately at index 0 of array ', () => {
    const root = jsdom('');
    const body = root.body;
    const container = root.createElement('div');
    body.appendChild(container);

    render(<Test />, container);
    const path = root.getElementById('my-path');

    assert.strictEqual(+path.getAttribute('opacity'), 1e-6, 'should be equal');
  });

  it('should accept a delay in milliseconds', (done) => {
    const root = jsdom('');
    const body = root.body;
    const container = root.createElement('div');
    body.appendChild(container);

    render(<Test />, container);
    const path = root.getElementById('my-path');

    setTimeout(() => {
      assert.strictEqual(+path.getAttribute('opacity'), 0.8, 'should be equal');
      done();
    }, (DURATION * 1.1) + DELAY);
  });

  it('should set attributes not in an array immediately', (done) => {
    const root = jsdom('');
    const body = root.body;
    const container = root.createElement('div');
    body.appendChild(container);

    render(<Test />, container);
    const path = root.getElementById('my-path');

    setTimeout(() => {
      assert.strictEqual(path.getAttribute('fill'), 'tomato', 'should be equal');
      done();
    }, 0);
  });
});