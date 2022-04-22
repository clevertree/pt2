import * as React from "react";
import PropTypes from "prop-types";
import MarkdownAsset from "./asset-types/markdown/MarkdownAsset.js";
import AssetIterator from "../util/AssetIterator.js";
import AssetLoader from "./loader/AssetLoader.js";
import AssetBrowserContext from "./context/AssetBrowserContext.js";
import AssetRefresher from "./loader/AssetRefresher.js";
import AssetRenderer from "./asset-types/asset-renderer/AssetRenderer.js";
import {setUnusedAssets} from "./asset-types/markdown/markdownOptions.js";

export default class AssetBrowser extends React.Component {
    /** Property validation **/
    static propTypes = {
        defaultTemplate: PropTypes.string.isRequired,
        pathname: PropTypes.string.isRequired
    };

    static defaultProps = {
        pathname: ""
    }

    constructor(props) {
        super(props);
        // console.log('AssetBrowser', props);
        this.state = {
            assets: null,
            loaded: false,
            refreshHash: null,
        }
        this.overrides = {
            templateContent: (props) => this.renderChildren(props),
        }
    }

    componentDidMount() {
        // console.log("Loading content: ", this.props.file);
        this.loadContent().then();
    }

    async loadContent(force = false) {
        const assets = await new AssetLoader().loadAssets(force)
        this.setState({assets, loaded: true});
        // console.log("Assets loaded: ", assets);
    }

    updateRefreshHash(refreshHash) {
        if (refreshHash !== this.state.refreshHash) {
            this.setState({refreshHash})
            this.loadContent(true).then();
        }
    }

    render() {
        const {defaultTemplate} = this.props;
        return <AssetBrowserContext.Provider value={{
            browser: this,
            ...this.props,
            ...this.state,
            iterator: new AssetIterator(this.state.assets)
        }}>
            <>
                <AssetRefresher/>
                <MarkdownAsset
                    wrapper={React.Fragment}
                    overrides={this.overrides}
                    file={defaultTemplate}/>
            </>
        </AssetBrowserContext.Provider>;
    }

    renderChildren() {
        const {assets, loaded} = this.state;
        if (!loaded)
            return "Loading...";
        const iterator = new AssetIterator(assets);
        const fileList = iterator.listFiles(this.props.pathname);

        const indexMDPath = fileList.find(filePath => filePath.endsWith('index.md'))
        if (indexMDPath)
            return this.renderIndexPage(indexMDPath, fileList)
        return this.renderAssetPage(fileList)
    }

    renderIndexPage(indexMDPath, fileList) {
        const filteredFileList = fileList.filter(file => !file.endsWith('.md'))
        setUnusedAssets(filteredFileList);
        return <article className={"index"}>
            <MarkdownAsset file={indexMDPath}/>
        </article>;
    }

    renderAssetPage(fileList) {
        return <AssetRenderer>{fileList}</AssetRenderer>;
    }
}

