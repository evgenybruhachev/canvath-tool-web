import React, { Component } from 'react';
import Button from '../button';

class AddTextForm extends Component {

  static propTypes = {
    onSubmit: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit() {
    if (this.props.onSubmit) this.props.onSubmit(this.state.value);
    this.setState({ value: '' });
  }

  render() {
    return (
      <div>
        <input
          value={this.state.value}
          onChange={this.handleChange}
          className="add-text-input"
        />
        <Button
          label={'Add Text'}
          onClick={this.handleSubmit}
          className="add-text"
        />
      </div>
    );
  }
}

export default AddTextForm;
