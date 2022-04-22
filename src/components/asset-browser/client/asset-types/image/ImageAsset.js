import React from "react";
import PropTypes from "prop-types";

import "./ImageAsset.scss";
import Markdown from "markdown-to-jsx";
import {getMarkdownOptions} from "../markdown/markdownOptions.js";

export default class ImageAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        src: PropTypes.string.isRequired,
        i: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.state = {
            fullscreen: false,
        }
        const markdownOptions = getMarkdownOptions();
        this.options = {
            ...markdownOptions,
            wrapper: 'div',
            forceWrapper: true,
            overrides: props.overrides,
        }
        this.cb = {
            onClick: e => this.onClick(e),
            closeFullscreen: e => this.closeFullscreen(e),
            stopPropagation: e => e.stopPropagation()
        }
    }

    render() {
        // let i = this.props.i || 0;
        let className = 'asset image';
        if (this.props.className)
            className += ' ' + this.props.className;
        if (this.props['data-no-fullscreen'])
            className += ' no-fullscreen';
        // if(this.state.fullscreen)
        //     className += ' fullscreen';
        // className += [' even', ' odd'][i % 2];
        // if(i % 4 === 0)
        //     className += ' clear';
        const {src, alt, title} = this.props;
        const altText = alt || src.split('/').pop();

        return [
            <img
                key="image"
                className={className}
                src={src}
                alt={altText}
                title={title || altText}
                onClick={this.cb.onClick}
            />,
            this.state.fullscreen ? <div
                key="asset-image-fullscreen"
                className="asset-image-fullscreen"
                onClick={this.cb.onClick}
            >
                <img
                    src={src}
                    alt={altText}
                />
                {altText ? <div className={'alt-text'}>
                    <Markdown onClick={this.cb.stopPropagation}
                              options={this.options}>{altText.replace(/\\n/g, "\n")}</Markdown>
                    <a onClick={this.cb.stopPropagation} href={src} className="source" target="_blank" rel="noreferrer">Source
                        File</a>
                </div> : null}
                <div className="close">&#10006;</div>
            </div> : null
        ];
    }


    onClick(e) {
        if (this.props['data-no-fullscreen'])
            return;
        // if (e.target.nodeName.toLowerCase() === 'a')
        //     return;
        // if (this.props.href) {
        //     let url = new URL(this.props.href);
        //     console.log(url, document.location.origin);
        //     if (url.origin === document.location.origin) {
        //         document.location.href = url+'';
        //     } else {
        //         window.open(url, "_blank");
        //     }
        // } else {
        const fullscreen = !this.state.fullscreen;
        activeImages.forEach(activeImage => activeImage.closeFullscreen());
        if (fullscreen) {
            activeImages = [this];
            this.setState({fullscreen});
        }
        // console.log('activeImages', activeImages, fullscreen);
        // }
    }

    closeFullscreen() {
        this.setState({fullscreen: false})
    }
}


let activeImages = [];