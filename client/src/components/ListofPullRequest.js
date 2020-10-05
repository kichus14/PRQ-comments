import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseUrl} from '../Constant';

function ListofPullRequest(props) {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = React.useState('');
    const [pullRequestList, setPullRequestState] = useState([]);
    const [currentStatus, setCurrentStatus] = React.useState('');
    const [filterPullRequest, setFilterPullRequest] = useState([]);
    const selectData = (e)=>{
        console.log(e);
        setCurrentStatus(e)
    }

    useEffect(() => {
        setLoading(true);
        let data = {
                key: props.match.params.projectKey,
                name: props.match.params.projectName,
                status: currentStatus   
        }
       axios.post(baseUrl+'/browse', data)
        .then(res => {
            setPullRequestState(res.data.values);
            
            setLoading(false);
        })
        .catch(err => console.log(err));
    },[currentStatus]);

    useEffect(()=>{
        setFilterPullRequest(
            pullRequestList.filter( data  => {
                return ((data.title).toLowerCase()).includes(search.toLowerCase())
            })
        )
    },[search, pullRequestList])
    
    return (
        <div className="row">
            <div className="col-md-12 nopadding">
                <div className="row padding-15">
                    <div className="col-md-4 text-color">
                    <h3>Pull Requests</h3>
                    </div>
                    <div className="col-md-2">
                        <select className="form-control" onChange={e => selectData(e.currentTarget.value)}>
                            <option value="OPEN">Open</option>
                            <option value="MERGED">Merged</option>
                            <option value="DECLINED">Declined</option>
                            <option value="ALL">All</option>
                        </select>
                        
                    </div>
                    <div className="col-md-6">
                    <input type="text" placeholder="Enter pull request name to be searched" className="float-right" onChange={e=>setSearch(e.target.value)}/>
                    </div>
                </div>
                <div className="h-100 row align-items-center mrg-200" style={{ display: loading  ? 'block': 'none'}}>
                    <div className="col-sm-12 offset-6">
                        <div className="spinner-border my-auto" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                <div className="col-md-12" style={{ display: loading  ? 'none': 'block'}}> 
                    { (filterPullRequest.length > 0) ? <ul className="list-group list-group-flush">{filterPullRequest.map((data, i)=>  <li id={i} key={i} className="list-group-item" ><a href={`/comments/${props.match.params.projectKey}/${props.match.params.projectName}/${data.id}`}>{data.title}</a></li>)}</ul>: <div className="text-color w-50 mx-auto"><h5>No Data</h5></div> }
                </div>
            </div>
            </div>
        </div>
    )
}

export default ListofPullRequest
