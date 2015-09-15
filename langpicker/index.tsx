import * as React from 'react';

const ipc = global.require('ipc');
const remote = global.require('remote');

interface LangColors {
    [lang: string]: string;
}

interface LanguageProps {
    name: string;
    color: string;
    checked: boolean;
    onChange: (lang: string, val: boolean) => void;
    key?: number;
}

class Language extends React.Component<LanguageProps, {}> {
    constructor(props: LanguageProps) {
        super(props);
    }

    checked(e: Event, checked: boolean) {
        this.props.onChange(this.props.name, (e.target as HTMLInputElement).checked);
        return true;
    }

    render() {
        return (
            <div className="language">
                <div className="color-bar" style={{backgroundColor: this.props.color}}/>
                <label className="lang-label">
                    <input className="check-lang" type="Checkbox" checked={this.props.checked} onChange={this.checked.bind(this)}/>
                    <span className="lang-name">{this.props.name}</span>
                </label>
            </div>
        );
    }
}

interface LangPickerProps {
    langs: LangColors;
}

interface LangPickerState {
    checked: {[lang: string]: boolean};
    search_word: string;
}

class LangPicker extends React.Component<LangPickerProps, LangPickerState> {
    lang_names: string[];

    constructor(props: LangPickerProps) {
        super(props);

        this.state = {
            checked: {},
            search_word: '',
        };

        this.lang_names = Object.keys(this.props.langs);
    }

    onSearch(event: Event) {
        this.setState({
            checked: this.state.checked,
            search_word: (event.target as HTMLInputElement).value,
        });
    }

    onGo() {
        let picked: string[] = [];

        for (const lang in this.state.checked) {
            if (this.state.checked[lang]) {
                picked.push(lang);
            }
        }

        ipc.send('picked-langs', picked);
        remote.getCurrentWindow().close();
    }

    onChecked(lang: string, new_value: boolean) {
        let new_state: {[lang: string]: boolean} = {};
        for (const l in this.state.checked) {
            new_state[l] = this.state.checked[l];
        }
        new_state[lang] = new_value;
        this.setState({
            checked: new_state,
            search_word: this.state.search_word,
        });
    }

    getChildren() {
        return this.lang_names
                .filter(l => l.indexOf(this.state.search_word) >= 0)
                .map((l, i) => {
                    const props = {
                       name: l,
                       color: this.props.langs[l],
                       checked: this.state.checked[l],
                       onChange: this.onChecked.bind(this),
                       key: i,
                    }

                    return <Language {...props}/>;
                });
    }

    render() {
        return (
            <div className="root">
                <h2 className="message">
                    Choose languages you want to watch.
                </h2>
                <div className="search">
                    <span className="octicon octicon-search"/>
                    <form className="search-form">
                        <input className="input-large" type="text" placeholder="Search..." onChange={this.onSearch.bind(this)}/>
                    </form>
                    <button className="btn btn-primary go" type="button" onClick={this.onGo.bind(this)}>Go!</button>
                </div>
                <div className="candidates">
                    {this.getChildren()}
                </div>
            </div>
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

