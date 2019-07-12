import React, { Component } from 'react';
import InputDate from '@volenday/input-date';
import Select from 'react-select';
import { diff } from 'deep-object-diff';
import { size, keyBy } from 'lodash';

// ant design
import { Button, Popover } from 'antd';

export default class InputSelect extends Component {
	state = { hasChange: false, isPopoverVisible: false };

	renderOptions() {
		const { list } = this.props;
		let options = [...list];

		if (options.includes('N/A')) {
			options.splice(options.indexOf('N/A'), 1);
		}

		return options.map(d => {
			return { value: d, label: d };
		});
	}

	getValue() {
		const { value } = this.props;
		let list = keyBy(this.renderOptions(), 'value');
		return value ? list[value] : null;
	}

	renderSelect() {
		const { disabled = false, id, label = '', multiple, onChange, placeholder = '', value = '' } = this.props;
		const list = keyBy(this.renderOptions(), 'value');

		return (
			<Select
				isDisabled={disabled}
				isMulti={multiple}
				onChange={e => {
					if (size(diff(list[value], e))) {
						this.setState({ hasChange: true });
					} else {
						this.setState({ hasChange: false });
					}

					onChange(id, e ? e.value : null);
				}}
				options={this.renderOptions()}
				placeholder={placeholder || label || id}
				value={this.getValue()}
				styles={{ menu: provided => ({ ...provided, zIndex: 999 }) }}
			/>
		);
	}

	handlePopoverVisible = visible => {
		this.setState({ isPopoverVisible: visible });
	};

	renderPopover = () => {
		const { isPopoverVisible } = this.state;
		const { id, label = '', historyTrackValue = '', onHistoryTrackChange } = this.props;

		return (
			<Popover
				content={
					<InputDate
						id={id}
						label={label}
						required={true}
						withTime={true}
						withLabel={true}
						value={historyTrackValue}
						onChange={onHistoryTrackChange}
					/>
				}
				trigger="click"
				title="History Track"
				visible={isPopoverVisible}
				onVisibleChange={this.handlePopoverVisible}>
				<span class="float-right">
					<Button
						type="link"
						shape="circle-outline"
						icon="warning"
						size="small"
						style={{ color: '#ffc107' }}
					/>
				</span>
			</Popover>
		);
	};

	render() {
		const { hasChange } = this.state;
		const { id, label = '', required = false, withLabel = false, historyTrack = false } = this.props;

		if (withLabel) {
			if (historyTrack) {
				return (
					<div className="form-group">
						<label for={id}>{required ? `*${label}` : label}</label>
						{hasChange && this.renderPopover()}
						{this.renderSelect()}
					</div>
				);
			}

			return (
				<div className="form-group">
					<label for={id}>{required ? `*${label}` : label}</label>
					{this.renderSelect()}
				</div>
			);
		} else {
			if (historyTrack) {
				return (
					<div class="form-group">
						{hasChange && this.renderPopover()}
						{this.renderInput()}
					</div>
				);
			}

			return this.renderSelect();
		}

		return null;
	}
}
