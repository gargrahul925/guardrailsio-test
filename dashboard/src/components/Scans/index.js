import React, { Component } from 'react';
import { Link, useHistory } from 'react-router-dom'

import { Table, Container, Row, Col, Badge, Button } from 'react-bootstrap';

import { listResults, startScanning } from '../../api';

import './index.css';


class ScanResults extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            data: null,
        }
    }

    async componentWillMount() {
        console.log(this.props.match.params, this.params)
        const result = await listResults();
        if (result) {
            this.setState({ data: result, loading: false });
        } else {
            alert('Scan result with given id not found');
        }
    }

    async startScanning(id) {
        await startScanning(id);
        // TODO: redirect to home screen
        // const history = useHistory();
        // history.push('/')
    }

    render() {
        let template = <Row><Col md={12} className="text-center"> <h3> Loading...</h3> </Col></Row>;
        if (!this.state.loading) {
            let content = null
            content = <Row><Col md={12} className="text-center"> <h3>No Result Found</h3> </Col></Row>
            if (this.state.data.count) {
                const list = this.state.data.records.map((record, i) => {
                    const badge = record.status === 'scanned' ? <Badge variant="primary">Primary</Badge> : null;
                    let action = <span>No Action Required</span>;
                    if (record.status === 'queued') {
                        action = <Button onClick={() => { this.startScanning(record._id) }}> Start Scanning</Button>
                    }
                    if (record.status === 'in-progress') {
                        const url = `/${record._id}/finish`;
                        action = <Link to={url} className="btn btn-success" >
                            Finish Scanning
                            </Link >;
                    }
                    const detailPath = `/${record._id}`;
                    return <tr key={i}>
                        <td><Link to={detailPath} >{i + 1} </Link > </td>
                        <td>{record.repositoryName} {badge}</td>
                        <td>{record.status}</td>
                        <td>{(record.queuedAt) ? record.queuedAt : 'Not Started'}</td>
                        <td>{(record.scanningAt) ? record.scanningAt : 'Not Started'}</td>
                        <td>{(record.finishedAt) ? record.finishedAt : 'Not Started'}</td>
                        <td> {action}</td>
                    </tr>
                })
                content = (<Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>RepositoryName</th>
                            <th>Status</th>
                            <th>QueuedAt</th>
                            <th>ScanningAt</th>
                            <th>FinishedAt</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </Table>)
            }
            template = <Row>
                <Col md={12}>
                    {content}
                </Col>
            </Row>
        }
        return (
            <div id="scan-results">
                <Container>
                    <Row>
                        <Col md={12} className="action">
                            <Link to="/_add" className="btn btn-primary">
                                <span className="px-0">Add</span>
                            </Link>
                        </Col>
                    </Row>
                    {template}
                </Container>

            </div>
        );
    }
}

export default ScanResults;