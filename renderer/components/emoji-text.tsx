import * as React from 'react';
import * as emoji from 'emojione';

const RE_EMOJI = /:\w+:/g;
const APP_PATH: string = global.require('remote').require('app').getAppPath();

interface Props {
    text: string;
}

export default class EmojiText extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    renderEmoji(short_name: string, key: string) {
        const e = emoji.emojioneList[short_name];

        if (!e) {
            console.log('not a emoji: ' + short_name);
            return <span key={key}>{short_name}</span>;
        }

        const p = 'file://' + APP_PATH + "/node_modules/emojione/assets/png/" + e[0].toUpperCase() + ".png"

        return (
            <img className="emoji" key={key} src={p}/>
        );
    }

    render() {
        const matched = this.props.text.match(RE_EMOJI);

        if (!matched) {
            return <span className="emoji-text">{this.props.text}</span>;
        }

        const split = this.props.text.split(RE_EMOJI);
        let children: React.ReactElement<any>[] = [];
        for (const idx in matched) {
            children.push(<span key={"s-" + idx}>{split[idx]}</span>);
            children.push(this.renderEmoji(matched[idx], "e-" + idx));
        }
        children.push(<span key={"s-" + split.length}>{split[split.length - 1]}</span>)

        return (
            <span className="emoji-text">
                {children}
            </span>
        );
    }
}
