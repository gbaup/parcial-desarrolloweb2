import React, {useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {View, Text} from 'react-native';

const Dropdown = () => {
    const [selectedValue, setSelectedValue] = useState(null);
    const placeholder = {
        label: 'Select an option...',
        value: null,
    };
    const options = [
        {label: 'Easy', value: 'easy'},
        {label: 'Medium', value: 'medium'},
        {label: 'Hard', value: 'hard'},
    ];
    return (
        <View>
            <Text>Select an option:</Text>
            <RNPickerSelect
                placeholder={placeholder}
                items={options}
                onValueChange={(value) => setSelectedValue(value)}
                value={selectedValue}
            />
            {selectedValue && <Text>Selected: {selectedValue}</Text>}
        </View>
    );
};
export default Dropdown;