import React, { Component } from 'react';

import Button from '../button';

class AddTextForm extends Component {

  static propTypes = {
    onSubmit: React.PropTypes.func,
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
    selected: React.PropTypes.bool,
    loadedFonts: React.PropTypes.object,
    loadedFont: React.PropTypes.string,
    selectedFont: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
      selected: props.selected || false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.loadedFont = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loadedFont !== this.loadedFont) {
      this.loadedFont = this.props.loadedFont;
    } else {
      this.setState({
        value: nextProps.value,
        selected: nextProps.selected,
      });
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.value);
    }
  }

  handleBlur() {
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  render() {
    return (
      <div className="add-text-form">
        <input
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          className="add-text-input"
        />
        <Button
          label={this.state.selected ? 'テキストを編集' : 'テキストを追加'}
          onClick={this.handleSubmit}
          className="add-text"
          disabled={!this.props.loadedFonts[this.props.selectedFont]}
        />
      </div>
    );
  }
}

export default AddTextForm;
