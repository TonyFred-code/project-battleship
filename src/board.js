import transform, {
  reverseTransform,
} from './helper_module/number-transform.js';
import Node from './board-node.js';

export default class Board {
  /**
   * Creates an instance of Board.
   * Allows access to an array of Nodes
   * Creates board of dimension size by size ( dimension = size * size)
   * @param {number} size - The size of the board to be created
   * @throws {Error} will throw error if size is not greater that zero
   */

  #BOARD_SIZE;

  #NODES = [];

  constructor(size) {
    if (typeof size !== 'number' || size <= 1) {
      throw Error('Expect size to be at least 2');
    }

    this.#BOARD_SIZE = size * size;
    this.#InitializeNodes();
  }

  /**
   * Initializes array of node
   * node is a Node Class
   */
  #InitializeNodes() {
    for (let i = 0; i < this.#BOARD_SIZE; i += 1) {
      const [x, y] = reverseTransform(i, this.#BOARD_SIZE);
      const index = transform(x, y, this.#BOARD_SIZE);
      const node = new Node(x, y);

      this.#NODES[index] = node;
    }
  }

  /**
   * Return array of board node
   */
  get boardNodes() {
    return [...this.#NODES];
  }
}
