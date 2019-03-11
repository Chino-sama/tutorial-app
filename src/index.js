import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
//Tic-tac-toe

//Componente del cuadrado
//Componente más simple del juego, indica que tiró el jugador ya sea X o O
class Square extends React.Component {
	render() {
		//Regresa el botón, el evento es manejado por el padre (Game) al igual que el valor
		return (
			<button className="square" onClick={this.props.onClick}>
				{this.props.value}
			</button>
		);
	}
}


//Componente Board renderiza los cuandrados del tablero
class Board extends React.Component {

	//Función que renderiza un componente de cuadrado, pasando el valor y la función que vienen de Game
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		//Se renderizan los 9 cuadrados junto con el índice que le corresponde a cada uno para conocer su estado
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}


//Componente de Game tiene el estado general del juego así como a sus componentes hijos que reciben propiedades de este componente
//consiguiendo la inmutabilidad de las propiedades
class Game extends React.Component {
	constructor(props) {
		super(props);
		//Estado inicial 
		//history es un registro de todos los movimientos que se hacen y que va a permitir regresar a un movimiento en específico
		//stepNumber representa el número de movimiento
		//xIsNext funciona para saber de qué jugador es el turno
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	//Función que maneja cuando se da un click en un cuadrado
	handleClick(i) {
		//Lugar donde se va a guardar el movimiento que se realiza
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		//Movimiento actual
		const current = history[history.length - 1];
		//Estado actual de los cuadrados del tablero
		const squares = current.squares.slice();
		//Si hay un ganador el juego termina aquí
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		//Se guarda el movimiento del jugador en el índice de arreglo de los cuadrados
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		//Se acualiza el estado
		//Se agrega el nuevo movimiento a history, se incrementa el número de movimiento y el turno es del siguiente jugador
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	//Función para saltar a un movimiento pasado en específico
	jumpTo(step) {
		//El número de movimiento se regresa al que corresponda
		//xIsNext se calcula para saber de quién era el turno en ese momento
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	render() {
		//Historial de movimientos
		const history = this.state.history;
		//Movimiento actual
		const current = history[this.state.stepNumber];
		//Ganador cuando lo haya
		const winner = calculateWinner(current.squares);
		//Lista de movimientos del historial
		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		//Status para cuando haya un ganador o para indicar de quién es el turno
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		//Se renderiza el juego
		//Board contiene los cuadrados
		//El estatus representa de quien es el turno o si hay un ganador
		//Moves es el historial de moviemientos y sirve para poder regresar a algún movimiento anterior
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>

				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}


// Función para calcular el ganador
function calculateWinner(squares) {
	//Combinaciones ganadoras
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	//Ciclo para revisar si en el arreglo de cuadrados se encuentra una combinación ganadora
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

//Renderiza el componente Game
ReactDOM.render(<Game />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
