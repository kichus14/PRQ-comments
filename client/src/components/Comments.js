import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseUrl, category, subCategory, commonAction, actionItem, angularKBCPractice, mitigationApproach, commentStatus} from '../Constant';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

function Comments(props) {
    const [commentList, setCommentListState] = useState([]);
    const [loading, setLoading] = useState(false);
    const commentData = [];
    let allComment = [];

    const {ExportCSVButton} = CSVExport;

    const columns = [{
        dataField: 'id',
        text: 'Sl.No',
        editable: (false),
        style: {fontWeight: 'normal', width: '2%'}
    }, {
        dataField: 'screen',
        text: 'Screen',
        editable: (false)
    }, {
        dataField: 'comments',
        text: 'Feedbacks',
        editable: (false),
        csvFormatter: (cell, row, rowIndex) => `${
            cell.map((data, i) => {
                    return (data.props.children[1]).toString() + '\n\n';
                }
            )}`
    }, {
        dataField: 'developer',
        text: 'Developer',
        editable: (false)
    }, {
        dataField: 'effortMin',
        text: `Efforts Spent(in mins)`,
        editable: (true)
    }, {
        dataField: 'category',
        text: 'Category',
        editor: {type: Type.SELECT, options: category}
    }, {
        dataField: 'subCategory',
        text: `Sub Category`,
        editor: {type: Type.SELECT, options: subCategory}
    }, {
        dataField: 'canbecoveredinLinting',
        text: `Covered in Linting`,
        editor: {type: Type.SELECT, options: commonAction}
    }, {
        dataField: 'partofTrainingornot',
        text: `EPart of Training or not`,
        editor: {type: Type.SELECT, options: commonAction}
    }, {
        dataField: 'commonAngular',
        text: 'Common Angular/KBC Practice',
        editor: {type: Type.SELECT, options: angularKBCPractice}
    }, {
        dataField: 'actionItems',
        text: `Action Items`,
        editor: {type: Type.SELECT, options: actionItem}
    }, {
        dataField: 'mitigationApproach',
        text: 'Mitigation Approach',
        editor: {type: Type.SELECT, options: mitigationApproach}
    }, {
        dataField: 'wasthisfeedbackprovidedearlier',
        text: `Was this feedback provided earlier`,
        editor: {type: Type.SELECT, options: commonAction}
    }, {
        dataField: 'source',
        text: `Source`,
        editable: (false)
    }, {
        dataField: 'PRQcommentsgivenby',
        text: `Comments given by`,
        editable: (false)
    }, {
        dataField: 'commentDate',
        text: `Comment Date`,
        editable: (false)
    }, {
        dataField: 'status',
        text: `Status`,
        editor: {type: Type.SELECT, options: commentStatus}
    }];

    const showAllComments = (commentData) => {
        allComment.push(commentData.author.displayName+'('+new Date(commentData.createdDate).toLocaleDateString("en-IN")+')'+' - '+commentData.text);
        if(commentData.comments.length > 0) {
            commentData.comments.forEach(function (element){
                if(Array.isArray(element.comments)) {
                    showAllComments(element);
                }
            })
        };
        return allComment;
    }

    useEffect(() => {
        setLoading(true);
        let data = {
            key: props.match.params.projectKey,
            name: props.match.params.projectName,
            id: props.match.params.id
        }
        axios.post(baseUrl+'/comments', data)
            .then(res => {
                let prqDetail = (res.data.detail).filter((data)=>data.id == props.match.params.id);
                let count = 0;
                res.data.data.values.filter((data)=>{

                    if(data.action === 'COMMENTED'){
                        if(!(data.comment.text).includes("YAML validation success") && !(data.comment.text).includes("WARN - Nexus RAW repository not found")){
                            allComment = [];
                            showAllComments(data.comment);
                            count++;
                            commentData.push(
                                {
                                    id: count,
                                    screen : prqDetail[0].screenName,
                                    comments: allComment.map((data, i)=><p id={i} key={i}> {data.toString()} </p>),
                                    developer: prqDetail[0].name,
                                    effortMin : "",
                                    category: "",
                                    subCategory: "",
                                    canbecoveredinLinting: "",
                                    partofTrainingornot: "",
                                    commonAngular: "",
                                    actionItems: "",
                                    mitigationApproach: "",
                                    wasthisfeedbackprovidedearlier:"",
                                    source: (data.diff)? data.diff.destination.name : '',
                                    PRQcommentsgivenby: data.comment.author.displayName,
                                    commentDate: new Date(data.createdDate).toLocaleDateString("en-IN"),
                                    commentDateString: data.createdDate,
                                    status: ""
                                }
                            )
                        }
                    }
                });
                setLoading(false);
                setCommentListState(commentData);
            })
            .catch(err => console.log(err))
    }, []);
    return (
        <div className="row nopadding">
            <div className="col-md-12 nopadding">
                <div className="h-100 row align-items-center mrg-200" style={{ display: loading  ? 'block': 'none'}}>
                    <div className="col-sm-12 offset-6">
                            <div className="spinner-border my-auto" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
                <div id="comment-table" className ="comment-data" style={{ display: loading  ? 'none': 'block'}}>
                <ToolkitProvider
                    keyField="id"
                    data={ commentList }
                    columns={ columns }
                    exportCSV={ {
                        fileName: 'comments.csv',
                            blobType: 'text/plain;charset=utf-8'
                    }}>
                    {
                        props => (
                            <div>
                            <ExportCSVButton { ...props.csvProps }>Export CSV!!</ExportCSVButton>
                    <hr />
                    <BootstrapTable
                        { ...props.baseProps }
                        cellEdit={ cellEditFactory({ mode: 'dbclick', blurToSave: true  }) }
                        pagination={ paginationFactory() } />
                    </div>
                    )
                    }
                </ToolkitProvider>
                </div>
            </div>
        </div>
    )
}
export default Comments;
