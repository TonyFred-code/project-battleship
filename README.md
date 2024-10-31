# PROJECT BATTLESHIP GAME

This project is a JavaScript-based implementation of the classic game **Battleship**. It was created as a project for [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship) to practice Test Driven Development (TDD) principles. The game can be played against a computer opponent with basic AI that ensures random, legal moves.

![Project screenshot](./src/images/final-project-screenshot.png)

## Table of Contents

- [PROJECT BATTLESHIP GAME](#project-battleship-game)
  - [Table of Contents](#table-of-contents)
  - [About Game](#about-game)
  - [Features](#features)
  - [Project Highlights](#project-highlights)
  - [Demo](#demo)
  - [Built With](#built-with)
  - [Contributing](#contributing)
  - [License](#license)
  - [Development](#development)
  - [Acknowledgments](#acknowledgments)

## About Game

**Battleship Game** is a JavaScript-driven browser game that brings the classic game of Battleship to life. Built to showcase principles of Test-Driven Development (TDD), the game allows players to engage in strategic gameplay against a computer opponent. With features like turn-based attacks, visual feedback on hits and misses, and an intuitive interface for ship placement, this project offers both interactivity and functionality.

## Features

- **Dynamic Ship Placement**: Players can manually arrange their fleet on a grid or opt for automatic placement to start quickly.
- **Gameboard Logic**: Each player’s gameboard responds to hits, tracks missed attacks, and determines when a fleet is fully destroyed.
- **Computer AI**: The computer opponent selects random, valid coordinates to simulate realistic gameplay.
- **Event-Driven Design**: Actions such as attacks and turn transitions are managed through JavaScript’s event listeners, ensuring smooth and reactive gameplay.

## Project Highlights

This project’s code structure emphasizes modularity and includes automated unit tests for essential game logic, making it easy to expand with additional features, like enhanced AI or a two-player mode. Each part of the game has been designed to uphold best practices in TDD, ensuring a robust and maintainable codebase.

## Demo

You can demo it live at [Battleship Demo](https://tonyfred-code.github.io/project-battleship/).

## Built With

- JavaScript (ES6+)
- HTML5
- CSS3
- Jest (for unit testing)

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request.

## License

This project is licensed under the [MIT LICENSE](./LICENSE).

## Development

1. Add tests for ```GameController```, ```GameRound```, and ```HardComputer```
2. Polish ```HardComputer``` ```getAttack```  method
3. Add background sound and sound effects
4. Add settings page
5. Add game statics and achievements

## Acknowledgments

- **The Odin Project**: For the curriculum that guided the development of this project.
- **Material Design Icons**: For the icon library used in the application. Icons can be found at [Material Design Icons](https://pictogrammers.com/library/mdi/).
- Initial concept based on the classic **Battleship** board game.
