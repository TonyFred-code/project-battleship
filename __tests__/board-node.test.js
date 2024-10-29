// import {describe, expect, test} from '@jest/globals';
import Node from '../src/board-node.js';
import Ship from '../src/ship.js';

describe('Node class', () => {
  let node;
  const nodeDefaultAddressX = 2;
  const nodeDefaultAddressY = 2;

  beforeEach(() => {
    node = new Node(nodeDefaultAddressX, nodeDefaultAddressY);
  });

  test('creates a node with correct coordinates', () => {
    expect(node.address).toEqual([nodeDefaultAddressX, nodeDefaultAddressY]);
  });

  test('initializes with correct default properties', () => {
    expect(node.neighbors).toHaveLength(0);
    expect(node.isHit).toBe(false);
    expect(node.isOccupied).toBe(false);
    expect(node.isNeighboringOccupied).toBe(false);
  });

  describe('addNeighbor', () => {
    test('should return false if neighbor is not Node type', () => {
      expect(node.addNeighbor({})).toBe(false);
    });

    test('should return true if neighbor is Node type', () => {
      const neighbor = new Node(1, 1);

      expect(node.addNeighbor(neighbor)).toBe(true);
    });

    test('should add neighbor to neighbors list', () => {
      const neighbor = new Node(1, 1);

      node.addNeighbor(neighbor);
      expect(node.neighbors).toEqual([neighbor]);
    });
  });

  describe('neighbors', () => {
    test('should return empty array if no neighbors added', () => {
      const { neighbors } = node;

      expect(neighbors).toEqual([]);
    });

    test('should return array of neighbors added', () => {
      const neighbor = new Node(1, 1);
      node.addNeighbor(neighbor);
      const { neighbors } = node;

      expect(neighbors).toEqual([neighbor]);
    });
  });

  describe('hit', () => {
    test('should return 0 if hitting an unoccupied Node', () => {
      expect(node.hit()).toBe(0);
    });

    test('should return 3 if hitting a node nearing a node with sunk occupant', () => {
      const ship = new Ship(1, 'test');
      const neighbor = new Node(1, 1);
      neighbor.occupy(ship);
      node.addNeighbor(neighbor);
      neighbor.addNeighbor(node);
      neighbor.hit();

      expect(node.hit()).toBe(3);
    });

    test('should return -1 if hitting a node that has been hit', () => {
      node.hit();

      expect(node.hit()).toBe(-1);
    });
  });

  describe('occupy', () => {
    test('should return true if ship is allowed to occupy node', () => {
      const ship = new Ship(1, 'test');

      expect(node.occupy(ship)).toBe(true);
    });

    test('should return false if ship is not Ship type', () => {
      expect(node.occupy({})).toBe(false);
    });

    test('should add ship as occupant', () => {
      const ship = new Ship(1, 'test');

      node.occupy(ship);

      expect(node.occupant).toEqual(ship);
    });

    test('should return false if node is already occupied', () => {
      const ship1 = new Ship(1, 'test');
      const ship2 = new Ship(1, 'test2');

      node.occupy(ship1);

      expect(node.occupy(ship2)).toBe(false);
    });
  });

  describe('occupant', () => {
    test('should return null if node is not occupied', () => {
      expect(node.occupant).toBe(null);
    });

    test('should return occupant', () => {
      const ship = new Ship(1, 'test');
      node.occupy(ship);

      const { occupant } = node;

      expect(occupant).toEqual(ship);
    });
  });

  describe('isOccupied', () => {
    test('should true if node is occupied', () => {
      const ship = new Ship(1, 'test');

      node.occupy(ship);

      expect(node.isOccupied).toBe(true);
    });

    test('should return false if node is not occupied', () => {
      expect(node.isOccupied).toBe(false);
    });
  });

  describe('isNeighboringOccupied', () => {
    test('should return false if node has no neighbors', () => {
      expect(node.isNeighboringOccupied).toBe(false);
    });

    test('should return true if a neighbor is occupied', () => {
      const neighbor = new Node(1, 1);
      const nextNeighbor = new Node(3, 3);
      const ship = new Ship(1, 'test');
      neighbor.occupy(ship);
      node.addNeighbor(neighbor);
      neighbor.addNeighbor(node);
      node.addNeighbor(nextNeighbor);

      expect(node.isNeighboringOccupied).toBe(true);
    });

    test('should return false if a neighbor is not occupied', () => {
      const neighbor = new Node(1, 1);

      node.addNeighbor(neighbor);

      expect(node.isNeighboringOccupied).toBe(false);
    });
  });

  describe('isNeighboringSunk', () => {
    test('should return false if node has no neighbor', () => {
      expect(node.isNeighboringSunk).toBe(false);
    });

    test('should return false if node has no neighbor with sunk occupant', () => {
      const neighbor = new Node(1, 1);
      const ship = new Ship(1, 'test');
      neighbor.occupy(ship);

      expect(node.isNeighboringSunk).toBe(false);
    });

    test('should return true if node has a neighbor with sunk occupant', () => {
      const neighbor = new Node(1, 1);
      const ship = new Ship(1, 'test');
      neighbor.addNeighbor(node);
      node.addNeighbor(neighbor);

      neighbor.occupy(ship);
      neighbor.hit();

      expect(node.isNeighboringSunk).toBe(true);
    });
  });

  describe('isHit', () => {
    test('should return true if node has been hit', () => {
      node.hit();

      expect(node.isHit).toBe(true);
    });

    test('should return false if node has not been hit', () => {
      expect(node.isHit).toBe(false);
    });
  });

  describe('occupantShipSunk', () => {
    test('should return true if occupant is sunk', () => {
      const ship = new Ship(1, 'test');

      node.occupy(ship);
      node.hit();

      expect(node.occupantShipSunk).toBe(true);
    });

    test('should return false if node is not occupied', () => {
      expect(node.occupantShipSunk).toBe(false);
    });

    test('should return false if node occupant is not sunk', () => {
      const ship = new Ship(1, 'test');

      node.occupy(ship);

      expect(node.occupantShipSunk).toBe(false);
    });
  });

  describe('removeOccupant', () => {
    test('should remove occupant', () => {
      const ship = new Ship(1, 'test');

      node.occupy(ship);

      node.removeOccupant();

      expect(node.occupant).toEqual(null);
    });
  });
});
