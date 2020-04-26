import React from 'react';

import '../../assets/css/rectCanvas.scss';
import swal from 'sweetalert';

class DrawRect extends React.Component {
	// Fabric.js Canvas object
	canvas = null;
	// current unsaved state
	stateC = null;
	// past states
	undo = [];
	// reverted states
	redo = [];
	testvar = 'testdata';
	constructor(props) {
		super(props);
		this.state = { redoBtn: true, undoBtn: false };
	}

	/**
	 * Push the current state into the undo stack and then capture the current state
	 */
	save() {
		// clear the redo stack
		this.redo = [];
		this.setState({ redoBtn: true });
		// initial call won't have a state
		if (this.stateC) {
			this.undo.push(this.stateC);

			this.setState({ undoBtn: false });
		}

		this.stateC = JSON.stringify(this.canvas);
	}

	replay(playStack, saveStack) {
		// if (playStack.length === 0) {
		// 	//console.log('pppp');
		// }

		// if (saveStack.length === 0) {
		// 	//console.log('sssssss');
		// }
		saveStack.push(this.stateC);
		this.stateC = playStack.pop();

		this.setState({ redoBtn: true });

		this.setState({ undoBtn: true });

		this.canvas.clear();
		const self = this;
		this.canvas.loadFromJSON(this.stateC, function () {
			self.canvas.renderAll();
			// now turn the buttons back on if applicable
			self.setState({ redoBtn: false });
			if (playStack.length) {
				self.setState({ undoBtn: false });
			}
		});
	}

	undoEvent = () => {
		this.replay(this.undo, this.redo);
	};

	redoEvent = () => {
		this.replay(this.redo, this.undo);
	};

	removeEvent = () => {
		const self = this;
		var activeObject = self.canvas.getActiveObject();
		if (activeObject) {
			self.canvas.discardActiveObject();
			self.canvas.remove(activeObject);
		} else {
			swal('info!', 'Please Select Object!', 'info');
		}
	};

	drawcircal = () => {
		var imgObj = new fabric.Rect({
			left: 50,
			top: 50,
			width: 80,
			height: 50,
			fill: 'rgba(0,0,0,0)',
			stroke: 'rgba(34,177,76,1)',
			strokeWidth: 1,
		});

		this.canvas.add(imgObj);
		this.canvas.renderAll();
		this.save();
	};

	componentDidMount() {
		// Set up the canvas
		this.canvas = new fabric.Canvas('canvas');
		this.canvas.setWidth(800);
		this.canvas.setHeight(450);
		// save initial state
		const self = this;
		self.save();
		// register event listener for user's actions

		this.canvas.on('object:modified', function () {
			self.save();
		});
	}

	checkMimeType = (event) => {
		// gettting file object
		let files = event.target.files;

		// define message container

		let err = '';

		//list allow mime type

		const types = ['image/png', 'image/jpeg', 'image/gif'];

		// loop access array
		for (let x = 0; x < files.length; x++) {
			// compare file type doesn't match

			if (types.every((type) => files[x].type !== type))
				// create err msg and assign to container
				err += files[x].type + ' is not supported formate \n\n  ';
			// Assign msg to error
		}

		if (err !== '') {
			event.target.value = null;

			return false;
		}

		return true;
	};

	getFileTypecheck = async (event) => {
		if (this.checkMimeType(event)) {
			//let image = event.target.files[0];

			const self = this;
			var imgURL = URL.createObjectURL(event.target.files[0]);

			//var pugImg = new Image();
			const canvasH = self.canvas.height;
			const canvasW = self.canvas.width;

			fabric.Image.fromURL(imgURL, function (img) {
				var canvasAspect = canvasW / canvasH;
				var imgAspect = img.width / img.height;
				var left, top, scaleFactor;

				if (canvasAspect >= imgAspect) {
					scaleFactor = canvasW / img.width;
					left = 0;
					top = -(img.height * scaleFactor - canvasH) / 2;
				} else {
					scaleFactor = canvasH / img.height;
					top = 0;
					left = -(img.width * scaleFactor - canvasW) / 2;
				}

				self.canvas.setBackgroundImage(
					img,
					self.canvas.renderAll.bind(self.canvas),
					{
						top: top,
						left: left,
						originX: 'left',
						originY: 'top',
						scaleX: scaleFactor,
						scaleY: scaleFactor,
					}
				);
				self.canvas.renderAll();

				self.canvas.renderAll();
				self.save();
			});
		}
	};

	render() {
		return (
			<div>
				<div className='container'>
					<div className='row flexobx'>
						<div className='btn-Row center-align'>
							<button
								id='draw'
								className='waves-effect waves-light btn'
								onClick={this.drawcircal}>
								Add rectangle
							</button>
						</div>
						<div className='btn-Row'>
							<button
								className='waves-effect waves-light btn'
								id='undo'
								onClick={this.undoEvent}
								disabled={this.state.undoBtn}
								ref={(i) => (this._undo = i)}>
								undo
								<i className='material-icons left'>undo</i>
							</button>
						</div>
						<div className='btn-Row'>
							<button
								className='waves-effect waves-light btn'
								id='redo'
								onClick={this.redoEvent}
								disabled={this.state.redoBtn}>
								redo <i className='material-icons right'>redo</i>
							</button>
						</div>
						<div className='btn-Row'>
							<button
								id='remove'
								onClick={this.removeEvent}
								className='waves-effect waves-light btn'>
								remove
							</button>
						</div>
						<div>
							<div className='file-field input-field img-div'>
								<div className='btn'>
									<span>Choose Image</span>
									<input
										type='file'
										name='image'
										onChange={this.getFileTypecheck}
									/>
								</div>
								<div className='file-path-wrapper'>
									<input className='file-path validate' type='text' />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='container'>
					<div className='row flexobx'>
						<div>
							<canvas
								id='canvas'
								style={{ border: 'solid 1px black' }}></canvas>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DrawRect;
