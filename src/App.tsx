import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
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
		this.fetchMemes = this.fetchMemes.bind(this)
		this.fetchMemes("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadMeme = this.uploadMeme.bind(this)
		this.updateMeme = this.updateMeme.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper bg-primary ">
				<div className="container">
					<div className="row">
						<div className="col-6 mt-2">
							<div className="btn btn-primary btn-action" >Download</div>
							<div className="btn btn-primary btn-action" >Edit</div>
							<div className="btn btn-primary btn-action" >Delete</div>
						</div>
						<div className="col-3 mt-2">
							<img src={dollarsymbol} height='40'/>&nbsp; Spending Manager &nbsp;
						</div>
						<div  className="col-3 mt-2">
							<div className="btn btn-primary btn-action btn-add" onClick={this.openModal('add')}>Add Transaction</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container clearboth">
				<div className="row">
					
					<div className="col-12">
						<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes}/>
					</div>
				</div>
			</div>
			
			<Modal open={open} onClose={this.onCloseModal}>
				isOpen={this.state.activeModal === ''}
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
					<div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.uploadMeme}>Upload</button>
				</form>
			</Modal>

			<Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Meme Title</label>
                            <input type="text" className="form-control" id="meme-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any meme later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="meme-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateMeme}>Save</button>
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

	private fetchMemes(tag: any) {
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

	private uploadMeme() {
		const titleInput = document.getElementById("meme-title-input") as HTMLInputElement
		const tagInput = document.getElementById("meme-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]
	
		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}
	
		const title = titleInput.value
		const tag = tagInput.value
		const url = "http://phase2apitest.azurewebsites.net/api/meme/upload"
	
		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)
	
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
/*
	private downloadMeme(url: any) {
        window.open(url);
    }
*/
    private updateMeme(currentMeme: any){
        const titleInput = document.getElementById("meme-edit-title-input") as HTMLInputElement
        const tagInput = document.getElementById("meme-edit-tag-input") as HTMLInputElement
    
        if (titleInput === null || tagInput === null) {
            return;
        }
        
        const url = "http://phase2apitest.azurewebsites.net/api/meme/" + currentMeme.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value
        fetch(url, {
            body: JSON.stringify({
                "height": currentMeme.height,
                "id": currentMeme.id,
                "tags": updatedTag,
                "title": updatedTitle,
                "uploaded": currentMeme.uploaded,
                "url": currentMeme.url,
                "width": currentMeme.width
            }),
            headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
            method: 'PUT'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error State
                alert(response.statusText + " " + url)
            } else {
                location.reload()
            }
        })
    }
/*
    private deleteMeme(id: any) {
        const url = "http://phase2apitest.azurewebsites.net/api/meme/" + id
    
        fetch(url, {
            method: 'DELETE'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error Response
                alert(response.statusText)
            }
            else {
                location.reload()
            }
        })
    }
*/
}

export default App;