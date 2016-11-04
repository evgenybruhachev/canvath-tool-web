import React, { Component } from 'react';
import Button from '../button';

class AddTextForm extends Component {

  static propTypes = {
    onSubmit: React.PropTypes.func,
    value: React.PropTypes.string,
    selected: React.PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.value);
      this.setState({ value: '' });
    }
  }

  render() {
    const { selected, value } = this.props;

    return (
      <div>
        <input
          value={this.state.value || value}
          onChange={this.handleChange}
          className="add-text-input"
        />
        <Button
          label={selected ? 'Edit Text' : 'Add Text'}
          onClick={this.handleSubmit}
          className="add-text"
        />
      </div>
    );
  }
}

export default AddTextForm;
