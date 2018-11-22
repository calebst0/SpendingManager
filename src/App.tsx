import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import MemeDetail from './components/MemeDetail';
import MemeList from './components/MemeList';
import dollarsymbol from './dollarsymbol.jpg';


interface IState {
	currentMeme: any,
	memes: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentMeme: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			memes: [],
			open: false,
			uploadFileList: null,
		}     	
		this.selectNewMeme = this.selectNewMeme.bind(this)
		this.fetchTransaction = this.fetchTransaction.bind(this)
		this.fetchTransaction("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadTransaction = this.uploadTransaction.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper bg-primary ">
				<div className="container">
					<div className="row">
						<div className="mt-2">
							<img src={dollarsymbol} height='40'/>&nbsp; Spending Manager &nbsp;
							<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Transaction</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container clearboth">
				<div className="row">
					<div className="col-7">
						<MemeDetail currentMeme={this.state.currentMeme} />
					</div>
					<div className="col-12">
						<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchTransaction}/>
					</div>
				</div>
			</div>
			
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Transaction Title</label>
						<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
						<small className="form-text text-muted">Transactions can be editted later</small>
					</div>
					<div className="form-group">
						<label>Tag</label>
						<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
						<small className="form-text text-muted">Tag is used for search</small>
					</div>
					
					{/* <div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
					</div> */}

					
					<button type="button" className="btn" onClick={this.uploadTransaction}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
		})
	}

	private fetchTransaction(tag: any) {
		let url = "http://phase2apitest.azurewebsites.net/api/meme"
		if (tag !== "") {
			url += "/tag?=" + tag
		}
		fetch(url, {
			method: 'GET'
		})
		.then(res => res.json())
		.then(json => {
			let currentMeme = json[0]
			if (currentMeme === undefined) {
				currentMeme = {"id":0, "title":"No memes (╯°□°）╯︵ ┻━┻","url":"","tags":"try a different tag","uploaded":"","width":"0","height":"0"}
			}
			this.setState({
				currentMeme,
				memes: json
			})
		});
	}

	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	private uploadTransaction() {
		const titleInput = document.getElementById("meme-title-input") as HTMLInputElement
		const tagInput = document.getElementById("meme-tag-input") as HTMLInputElement
		
	
		if (titleInput === null || tagInput === null) {
			return;
		}
	
		const title = titleInput.value
		const tag = tagInput.value
		const url = "http://phase2apitest.azurewebsites.net/api/meme/upload"
	
		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
	
		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
		.then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		})
	}
}

export default App;