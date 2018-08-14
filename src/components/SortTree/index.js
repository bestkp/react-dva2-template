/**
 * Create by zhangpengchuan on 2018/5/31
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import SortableTree from 'react-sortable-tree';
// In your own app, you would need to use import styles once in the app
import 'react-sortable-tree/style.css';

export default class SortTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedKey: '',
            searchString: '',
            searchFocusIndex: 0,
            searchFoundCount: null,
        };
    }

    render() {
        const {searchString, searchFocusIndex, searchFoundCount} = this.state;

        const {onSelect, clickLevel = 0, onChange, treeData = [], style = {}} = this.props;

        // Case insensitive search of `node.title`
        const customSearchMethod = ({node, searchQuery}) =>
            searchQuery &&
            node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

        const selectPrevMatch = () =>
            this.setState({
                searchFocusIndex:
                    searchFocusIndex !== null
                        ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
                        : searchFoundCount - 1,
            });

        const selectNextMatch = () =>
            this.setState({
                searchFocusIndex:
                    searchFocusIndex !== null
                        ? (searchFocusIndex + 1) % searchFoundCount
                        : 0,
            });

        return (
            <div style={Object.assign({height: '100%'}, style)}>
                <form
                    style={{display: 'inline-block', marginBottom: 10}}
                    onSubmit={event => {
                        event.preventDefault();
                    }}
                >
                    <input
                        id="find-box"
                        type="text"
                        placeholder="Search..."
                        style={{fontSize: '1rem'}}
                        value={searchString}
                        onChange={event =>
                            this.setState({searchString: event.target.value})
                        }
                    />

                    <button
                        type="button"
                        disabled={!searchFoundCount}
                        onClick={selectPrevMatch}
                    >
                        &lt;
                    </button>

                    <button
                        type="submit"
                        disabled={!searchFoundCount}
                        onClick={selectNextMatch}
                    >
                        &gt;
                    </button>

                    <span>
                        &nbsp;
                        {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
                        &nbsp;/&nbsp;
                        {searchFoundCount || 0}
                    </span>
                </form>

                <SortableTree
                    canDrag={false}
                    canDrop={() => false}
                    generateNodeProps={({node, path}) => {
                        return ({
                            title: (
                                <div onClick={() => {
                                    if (path.length >= clickLevel) {
                                        onSelect && onSelect(node)

                                        this.setState({selectedKey: JSON.stringify(path)})
                                    }
                                }}
                                     style={{cursor: 'pointer'}}>
                                    <span
                                        style={{color: JSON.stringify(path) == this.state.selectedKey ? '#FF0000' : "#000"}}>{node.title}</span>
                                </div>),
                        })
                    }}
                    rowHeight={48}
                    scaffoldBlockPxWidth={30}
                    // theme={FileExplorerTheme}
                    treeData={treeData}
                    // onChange={treeData => this.setState({treeData})}
                    onChange={treeData => onChange && onChange(treeData)}
                    //
                    // Custom comparison for matching during search.
                    // This is optional, and defaults to a case sensitive search of
                    // the title and subtitle values.
                    // see `defaultSearchMethod` in https://github.com/frontend-collective/react-sortable-tree/blob/master/src/utils/default-handlers.js
                    searchMethod={customSearchMethod}
                    //
                    // The query string used in the search. This is required for searching.
                    searchQuery={searchString}
                    //
                    // When matches are found, this property lets you highlight a specific
                    // match and scroll to it. This is optional.
                    searchFocusOffset={searchFocusIndex}
                    //
                    // This callback returns the matches from the search,
                    // including their `node`s, `treeIndex`es, and `path`s
                    // Here I just use it to note how many matches were found.
                    // This is optional, but without it, the only thing searches
                    // do natively is outline the matching nodes.
                    searchFinishCallback={matches =>
                        this.setState({
                            searchFoundCount: matches.length,
                            searchFocusIndex:
                                matches.length > 0 ? searchFocusIndex % matches.length : 0,
                        })
                    }
                />
            </div>
        );
    }
}

SortTree.propTypes = {
    clickLevel: PropTypes.number,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    treeData: PropTypes.array,
}
