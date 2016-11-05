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

    this.state = {
      value: props.value || '',
      selected: props.selected || false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      selected: nextProps.selected,
    });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.value);
    }
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
          label={this.state.selected ? 'Edit Text' : 'Add Text'}
          onClick={this.handleSubmit}
          className="add-text"
        />
      </div>
    );
  }
}

export default AddTextForm;
