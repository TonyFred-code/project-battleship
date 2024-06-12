import Node from '../src/board-node.js';
import Ship from '../src/ship.js';

describe('Node class', () => {
  test('creates a node with correct coordinates', () => {
    const node = new Node(3, 4);
    expect(node.address).toEqual([3, 4]);
  });

  test('initializes with correct default properties', () => {
    const node = new Node(3, 4);
    expect(node.neighbors).toHaveLength(0);
    expect(node.isHit).toBe(false);
    expect(node.isOccupied).toBe(false);
    expect(node.isNeighboringOccupied).toBe(false);
  });

  test('adds only nodes as neighbors', () => {
    const node = new Node(3, 5);

    expect(node.addNeighbor({})).toBeFalsy();
    const neighbor = new Node(2, 3);
    expect(node.addNeighbor(neighbor)).toBeTruthy();
  });

  test('allows only a ship class to occupy it', () => {
    const node = new Node(3, 5);
    expect(node.occupy).toBeDefined();

    const ship = new Ship(3);

    expect(node.occupy({})).toBeFalsy();
    expect(node.occupy(ship)).toBeTruthy();
  });

  test('knows when its neighboring a ship', () => {
    const node = new Node(0, 0);

    expect(node.isNeighboringOccupied).toBeDefined();

    const neighbor = new Node(1, 1);
    node.addNeighbor(neighbor);

    expect(node.isNeighboringOccupied).toBeFalsy();

    const ship = new Ship(3);
    neighbor.occupy(ship);

    expect(node.isNeighboringOccupied).toBeTruthy();
  });
});
