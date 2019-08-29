import React, { Component } from 'react';
import { keyBy } from 'lodash';
import InputDate from '@volenday/input-date';
import { Button, Form, Popover, Select } from 'antd';

const { Option } = Select;

import './styles.css';

export default class InputSelect extends Component {
	state = { hasChange: false, isPopoverVisible: false };

	renderOptions() {
		const { list } = this.props;
		let options = [...list];

		if (options.includes('N/A')) {
			options.splice(options.indexOf('N/A'), 1);
		}

		return options.map(d => ({ value: d, label: d }));
	}

	renderSelect() {
		const { disabled = false, action, id, label = '', multiple, onChange, placeholder = '', value } = this.props;
		const list = keyBy(this.renderOptions(), 'value');
		const options = this.renderOptions();
		return (
			<Select
				allowClear
				showSearch
				disabled={disabled}
				mode={multiple ? 'multiple' : 'default'}
				onChange={e => {
					this.setState({
						hasChange: action === 'add' ? false : list[e].value != e ? true : false
					});

					onChange(id, e);
				}}
				placeholder={placeholder || label || id}
				style={{ width: '100%' }}
				value={value ? value : ''}>
				{options.map(e => {
					return (
						<Option key={e.value} value={e.value}>
							{e.label}
						</Option>
					);
				})}
			</Select>
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
		const { action, label = '', historyTrack = false, required = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			label: withLabel ? label : false,
			required
		};

		return (
			<Form.Item {...formItemCommonProps}>
				{historyTrack && hasChange && action !== 'add' && this.renderPopover()}
				{this.renderSelect()}
			</Form.Item>
		);
	}
}
