import React, { Component } from 'react';
import FileDrop from 'react-file-drop';
import MediaQuery from 'react-responsive';
import Dropzone from 'react-dropzone';

class DropFiles extends Component {

  static propTypes = {
    onUpload: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.props.onUpload(files);
  }

  render() {
    return (
      <MediaQuery query='(min-device-width: 1024px)'>
        <Dropzone style={{display: 'none'}}/>
        <FileDrop frame={document} onDrop={this.onDrop} className="drop-zone">
          <div className="drop-zone__area"><p>Drop your file here</p></div>
        </FileDrop>
      </MediaQuery>
    );
  }
}

export default DropFiles;
