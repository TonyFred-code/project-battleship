import { reverseTransform } from './number-transform.js';
import gameSettings from '../GAME_SETTINGS/game-settings.js';

const { BOARD_SIZE } = gameSettings;

function isValidCoordinate(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function getToBeOccupied(size, x, y, orientation) {
  const toBeOccupied = [[x, y]];

  if (orientation === 'vertical') {
    for (let i = 0; i < size - 1; i += 1) {
      const occupied = y + i + 1;
      if (isValidCoordinate(x, occupied)) {
        toBeOccupied.push([x, occupied]);
      }
    }
  } else if (orientation === 'horizontal') {
    for (let i = 0; i < size - 1; i += 1) {
      const occupied = x + i + 1;
      if (isValidCoordinate(occupied, y)) {
        toBeOccupied.push([occupied, y]);
      }
    }
  }

  return toBeOccupied;
}

function shipFormattedPlacement(size) {
  const formattedPlacements = {
    vertical: [],
    horizontal: [],
  };
  const orientations = ['vertical', 'horizontal'];

  orientations.forEach((orientation) => {
    for (let i = 0; i < 100; i += 1) {
      const [x, y] = reverseTransform(i, BOARD_SIZE);

      const toBeOccupiedLength = getToBeOccupied(
        size,
        x,
        y,
        orientation,
      ).length;

      if (toBeOccupiedLength === size) {
        formattedPlacements[orientation].push(`${x}-${y}`);
      }
    }
  });

  return formattedPlacements;
}

export const CARRIER_SHIP_PLACEMENTS = shipFormattedPlacement(5);
export const BATTLESHIP_SHIP_PLACEMENTS = shipFormattedPlacement(4);
export const DESTROYER_SHIP_PLACEMENTS = shipFormattedPlacement(3);
export const SUB_MARINE_SHIP_PLACEMENTS = shipFormattedPlacement(3);
export const PATROL_BOAT_SHIP_PLACEMENTS = shipFormattedPlacement(2);
