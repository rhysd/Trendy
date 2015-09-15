import * as React from 'react';

const ipc = global.require('ipc');

interface LangColors {
    [lang: string]: string;
}

interface LangPickerProps {
    langs: LangColors;
}

interface LangPickerState {
    checked: {[idx: number]: boolean};
    search_word: string;
}

class LangPicker extends React.Component<LangPickerProps, LangPickerState> {
    constructor(props: LangPickerProps) {
        super(props);

        this.state = {
            checked: {},
            search_word: null,
        };
    }

    getChildren() {
        return Object.keys(this.props.langs)
                     .map((l, i) => <li key={i} style={{color: this.props.langs[l]}}>{l}</li>)
    }

    render() {
        return (
            <ul>
                {this.getChildren()}
            </ul>
        );
    }

}

ipc.on('lang-picker-data', (langs: LangColors) => {
    langs['any'] = 'black';

    React.render(
            <LangPicker langs={langs}/>,
            document.body
        );
});

