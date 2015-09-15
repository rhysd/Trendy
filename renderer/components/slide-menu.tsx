import * as React from 'react';
import Store from '../store';

const shell: ElectronRenderer.Shell = global.require('shell');
const remote: ElectronRenderer.Remote = global.require('remote');
const ipc: ElectronRenderer.InProcess = global.require('ipc');

export interface SlideMenuProps {
    onLangSelect: (selected: string) => void;
    onClose: () => void;
    selected_lang: string;
    repos: {[lang: string]: any[] | Object};
}

export default class SlideMenu extends React.Component<SlideMenuProps, {}> {
    constructor(props: SlideMenuProps) {
        super(props);
    }

    getFileterItemClass(lang: string) {
        if (this.props.selected_lang === lang) {
            return "filter-item selected";
        } else {
            return "filter-item";
        }
    }

    calcRepoCounts() {
        let counts: {[lang: string]: number} = {};
        for (const lang in this.props.repos) {
            const repo = this.props.repos[lang];
            if (repo instanceof Array) {
                counts[lang] = repo.length;
            } else {
                counts[lang] = Object.keys(repo).length;
            }
        }
        return counts;
    }

    calcAllCount(lang_counts) {
        let c = 0;
        for (const lang in lang_counts) {
            c += lang_counts[lang];
        }
        return c;
    }

    renderLangFilters() {
        const lang_counts = this.calcRepoCounts();

        let filters = [
            <a href="#" className={this.getFileterItemClass(null)} onClick={this.props.onLangSelect.bind(this, null)}>
                <span className="count">{this.calcAllCount(lang_counts)}</span>
                any
            </a>
        ];

        let key = 0;
        for (const lang in lang_counts) {
            filters.push(
                <a href="#" className={this.getFileterItemClass(lang)} key={key++} onClick={this.props.onLangSelect.bind(this, lang)}>
                    <span className="count">{lang_counts[lang]}</span>
                    {lang}
                </a>
            );
        }

        return (
            <ul className="filter-list">
                {filters}
            </ul>
        );
    }

    openConfigFile() {
        shell.openItem(remote.getGlobal('config').path);
    }

    forceUpdateRepos() {
        console.log('force update');
        ipc.send('force-update-repos');
    }

    exitApp() {
        remote.require('app').quit();
    }

    render() {
        return (
            <div className="slide-menu">
                <h2>
                    <span className="mega-octicon octicon-octoface"/>
                    <span className="mega-octicon octicon-arrow-right" onClick={this.props.onClose}/>
                </h2>
                <div className="langs-filter">
                    {this.renderLangFilters()}
                </div>
                <nav className="menu settings">
                    <a className="menu-item" href="#" onClick={this.openConfigFile}>
                        <span className="octicon octicon-gear"/>Settings
                    </a>
                    <a className="menu-item" href="#" onClick={this.forceUpdateRepos}>
                        <span className="octicon octicon-sync"/>Force Update
                    </a>
                    <a className="menu-item" href="#" onClick={this.exitApp}>
                        <span className="octicon octicon-sign-out"/>Exit
                    </a>
                </nav>
                <span className="last-update">{Store.getLastUpdateTime()}</span>
            </div>
        );
    }
}
